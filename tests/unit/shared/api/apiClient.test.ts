import { beforeEach, describe, expect, it, vi } from 'vitest';

import { jsonResponse } from '../../../fixtures/api';
import { createApiClient } from '@/shared/api/apiClient';
import { ApiError } from '@/shared/api/apiTypes';
import { refreshAccessToken } from '@/shared/api/tokenRefresher';
import { clearAccessToken, saveAccessToken } from '@/shared/api/tokenStore';

vi.mock('@/shared/api/tokenRefresher', () => ({
  refreshAccessToken: vi.fn(),
}));

/**
 * 요청에 실린 Authorization 헤더를 꺼냅니다.
 *
 * @param fetchImpl fetch 목
 * @param callIndex 호출 순서
 * @returns Authorization 헤더 값
 */
function authorizationOf(fetchImpl: ReturnType<typeof vi.fn>, callIndex: number): string | undefined {
  return fetchImpl.mock.calls[callIndex][1].headers.Authorization;
}

/**
 * createApiClient 테스트
 * Authorization 헤더, 만료 임박 선갱신, TOKEN_EXPIRED 401 시 갱신 후 1회 재시도, 갱신 실패 시 콜백, auth:false 요청, 그 외 오류 전달을 확인합니다.
 */
describe('createApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearAccessToken();
  });

  it('Access Token이 있으면 Bearer 헤더를 붙여 요청한다', async () => {
    saveAccessToken('token-1', 1800);
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(200, 'OK', { ok: true }));
    const client = createApiClient({ baseUrl: 'http://api', fetchImpl });

    const data = await client.get('/v1/x');

    expect(data).toEqual({ ok: true });
    expect(fetchImpl.mock.calls[0][0]).toBe('http://api/v1/x');
    expect(authorizationOf(fetchImpl, 0)).toBe('Bearer token-1');
  });

  it('HTTP 메서드별 요청을 보낸다', async () => {
    const fetchImpl = vi.fn().mockImplementation(async () => jsonResponse(200, 'OK'));
    const client = createApiClient({ baseUrl: '', fetchImpl });

    await client.post('/a', { x: 1 });
    await client.put('/a', { x: 1 });
    await client.patch('/a', { x: 1 });
    await client.delete('/a');

    expect(fetchImpl.mock.calls.map((call) => call[1].method)).toEqual(['POST', 'PUT', 'PATCH', 'DELETE']);
  });

  it('auth가 false면 토큰을 붙이지 않고 갱신하지 않는다', async () => {
    saveAccessToken('token-1', 1, 0);
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(200, 'OK'));
    const client = createApiClient({ baseUrl: '', fetchImpl });

    await client.post('/v1/member/join', {}, { auth: false });

    expect(authorizationOf(fetchImpl, 0)).toBeUndefined();
    expect(refreshAccessToken).not.toHaveBeenCalled();
  });

  it('만료가 임박했으면 요청 전에 먼저 갱신한다', async () => {
    saveAccessToken('old', 10); // 만료까지 10초라 임박 상태
    vi.mocked(refreshAccessToken).mockImplementation(async () => {
      saveAccessToken('fresh', 1800);
      return 'fresh';
    });
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(200, 'OK'));
    const client = createApiClient({ baseUrl: '', fetchImpl });

    await client.get('/v1/x');

    expect(refreshAccessToken).toHaveBeenCalledTimes(1);
    expect(authorizationOf(fetchImpl, 0)).toBe('Bearer fresh');
  });

  it('TOKEN_EXPIRED 401이면 갱신하고 원 요청을 1회 재시도한다', async () => {
    saveAccessToken('old', 1800);
    vi.mocked(refreshAccessToken).mockImplementation(async () => {
      saveAccessToken('fresh', 1800);
      return 'fresh';
    });
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(401, 'TOKEN_EXPIRED'))
      .mockResolvedValueOnce(jsonResponse(200, 'OK', { done: true }));
    const client = createApiClient({ baseUrl: '', fetchImpl });

    const data = await client.get('/v1/x');

    expect(data).toEqual({ done: true });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(authorizationOf(fetchImpl, 1)).toBe('Bearer fresh');
  });

  it('재시도에서도 실패하면 더 재시도하지 않고 오류를 던진다', async () => {
    saveAccessToken('old', 1800);
    vi.mocked(refreshAccessToken).mockResolvedValue('fresh');
    const fetchImpl = vi.fn().mockImplementation(async () => jsonResponse(401, 'TOKEN_EXPIRED'));
    const client = createApiClient({ baseUrl: '', fetchImpl });

    await expect(client.get('/v1/x')).rejects.toMatchObject({ errorName: 'TOKEN_EXPIRED' });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(refreshAccessToken).toHaveBeenCalledTimes(1);
  });

  it('갱신에 실패하면 인증 만료 콜백을 실행하고 원래 오류를 던진다', async () => {
    saveAccessToken('old', 1800);
    vi.mocked(refreshAccessToken).mockRejectedValue(new ApiError(401, 'UNAUTHORIZED', '로그인이 필요해요.'));
    const onAuthExpired = vi.fn();
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(401, 'TOKEN_EXPIRED'));
    const client = createApiClient({ baseUrl: '', onAuthExpired, fetchImpl });

    await expect(client.get('/v1/x')).rejects.toMatchObject({ errorName: 'TOKEN_EXPIRED' });
    expect(onAuthExpired).toHaveBeenCalledTimes(1);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('TOKEN_EXPIRED가 아닌 오류는 갱신 없이 그대로 던진다', async () => {
    saveAccessToken('old', 1800);
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(401, 'INVALID_TOKEN'))
      .mockResolvedValueOnce(jsonResponse(500, 'INTERNAL_SERVER_ERROR'));
    const client = createApiClient({ baseUrl: '', fetchImpl });

    await expect(client.get('/a')).rejects.toMatchObject({ errorName: 'INVALID_TOKEN' });
    await expect(client.get('/b')).rejects.toMatchObject({ status: 500 });
    expect(refreshAccessToken).not.toHaveBeenCalled();
  });

  it('만료 임박 선갱신이 실패해도 요청은 보낸다', async () => {
    saveAccessToken('old', 10);
    vi.mocked(refreshAccessToken).mockRejectedValue(new ApiError(401, 'UNAUTHORIZED', '로그인이 필요해요.'));
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(401, 'INVALID_TOKEN'));
    const client = createApiClient({ baseUrl: '', fetchImpl });

    await expect(client.get('/v1/x')).rejects.toMatchObject({ errorName: 'INVALID_TOKEN' });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});
