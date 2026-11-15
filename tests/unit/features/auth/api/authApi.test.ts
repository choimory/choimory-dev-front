import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { jsonResponse } from '../../../../fixtures/api';
import { authApi } from '@/features/auth/api/authApi';
import { clearAccessToken, getAccessToken, saveAccessToken } from '@/shared/api/tokenStore';

/**
 * authApi 테스트
 * 로그인(BFF 호출, 토큰 저장, 실패), 로그아웃(Authorization 전달, 실패해도 토큰 삭제), 세션 복원, 회원가입(직접 호출, 토큰 미사용)을 확인합니다.
 */
describe('authApi', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    clearAccessToken();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('login은 BFF에 로그인하고 받은 Access Token을 메모리에 저장한다', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, 'OK', { accessToken: 'a1', tokenType: 'Bearer', accessExpiresIn: 1799 }));

    const token = await authApi.login({ email: 'a@b.com', password: 'Password1!' });

    expect(fetchMock.mock.calls[0][0]).toBe('/api/auth/login');
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ email: 'a@b.com', password: 'Password1!' });
    expect(token.accessToken).toBe('a1');
    expect(getAccessToken()).toBe('a1');
  });

  it('login이 실패하면 토큰을 저장하지 않고 오류를 던진다', async () => {
    fetchMock.mockResolvedValue(jsonResponse(401, 'UNAUTHORIZED'));

    await expect(authApi.login({ email: 'a@b.com', password: 'x' })).rejects.toMatchObject({ status: 401 });
    expect(getAccessToken()).toBeNull();
  });

  it('logout은 Access Token을 헤더로 보내고 메모리의 토큰을 지운다', async () => {
    saveAccessToken('a1', 1800);
    fetchMock.mockResolvedValue(jsonResponse(200, 'OK'));

    await authApi.logout();

    expect(fetchMock.mock.calls[0][0]).toBe('/api/auth/logout');
    expect(fetchMock.mock.calls[0][1].headers).toMatchObject({ Authorization: 'Bearer a1' });
    expect(getAccessToken()).toBeNull();
  });

  it('logout은 토큰이 없으면 헤더 없이 요청한다', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, 'OK'));

    await authApi.logout();

    expect(fetchMock.mock.calls[0][1].headers).not.toHaveProperty('Authorization');
  });

  it('logout 요청이 실패해도 메모리의 토큰은 지운다', async () => {
    saveAccessToken('a1', 1800);
    fetchMock.mockResolvedValue(jsonResponse(500, 'INTERNAL_SERVER_ERROR'));

    await expect(authApi.logout()).rejects.toMatchObject({ status: 500 });
    expect(getAccessToken()).toBeNull();
  });

  it('restoreSession은 재발급으로 Access Token을 복원한다', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, 'OK', { accessToken: 'a2', tokenType: 'Bearer', accessExpiresIn: 1799 }));

    await expect(authApi.restoreSession()).resolves.toBe('a2');
    expect(getAccessToken()).toBe('a2');
  });

  it('join은 member-api 회원가입을 토큰 없이 호출한다', async () => {
    saveAccessToken('a1', 1800);
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ code: 201, name: 'CREATED', message: 'Created', data: { id: 'id', email: 'a@b.com', nickname: 'choimory', status: 'ACTIVATE' } }), { status: 201 }),
    );

    const member = await authApi.join({ email: 'a@b.com', password: 'Password1!', nickname: 'choimory' });

    expect(fetchMock.mock.calls[0][0]).toContain('/v1/member/join');
    expect(fetchMock.mock.calls[0][1].headers).not.toHaveProperty('Authorization');
    expect(member.status).toBe('ACTIVATE');
  });
});
