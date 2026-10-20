import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { jsonResponse } from '../../../fixtures/api';
import { refreshAccessToken } from '@/shared/api/tokenRefresher';
import { clearAccessToken, getAccessToken, saveAccessToken } from '@/shared/api/tokenStore';

/**
 * refreshAccessToken 테스트
 * BFF 재발급 호출 후 토큰 저장, 동시 호출 직렬화, 실패 시 토큰 삭제와 재시도 가능 상태를 확인합니다.
 */
describe('refreshAccessToken', () => {
  beforeEach(() => {
    clearAccessToken();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('BFF 재발급 엔드포인트를 호출하고 새 토큰을 저장한다', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, 'OK', { accessToken: 'new', tokenType: 'Bearer', accessExpiresIn: 1799 }));
    vi.stubGlobal('fetch', fetchMock);

    const token = await refreshAccessToken();

    expect(token).toBe('new');
    expect(getAccessToken()).toBe('new');
    expect(fetchMock.mock.calls[0][0]).toBe('/api/auth/reissue');
    expect(fetchMock.mock.calls[0][1].method).toBe('POST');
  });

  it('동시에 여러 번 호출해도 재발급 요청은 한 번만 보낸다', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, 'OK', { accessToken: 'new', tokenType: 'Bearer', accessExpiresIn: 1799 }));
    vi.stubGlobal('fetch', fetchMock);

    // 세 번을 동시에 호출한다
    const results = await Promise.all([refreshAccessToken(), refreshAccessToken(), refreshAccessToken()]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(results).toEqual(['new', 'new', 'new']);
  });

  it('실패하면 메모리의 토큰을 지우고 오류를 던지며, 이후 다시 시도할 수 있다', async () => {
    saveAccessToken('old', 1800);
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(401, 'UNAUTHORIZED'))
      .mockResolvedValueOnce(jsonResponse(200, 'OK', { accessToken: 'again', tokenType: 'Bearer', accessExpiresIn: 1799 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(refreshAccessToken()).rejects.toMatchObject({ status: 401 });
    expect(getAccessToken()).toBeNull();

    // 진행 중 상태가 풀려서 다시 호출하면 새로 요청한다
    await expect(refreshAccessToken()).resolves.toBe('again');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
