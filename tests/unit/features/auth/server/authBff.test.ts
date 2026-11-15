// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { jsonResponse, memberTokenData } from '../../../../fixtures/api';
import { handleLogin, handleLogout, handleReissue, toAccessTokenResponse } from '@/features/auth/server/authBff';
import { clearRefreshCookie, getRefreshCookie, setRefreshCookie } from '@/shared/auth/refreshCookie';

vi.mock('@/shared/auth/refreshCookie', () => ({
  setRefreshCookie: vi.fn(),
  getRefreshCookie: vi.fn(),
  clearRefreshCookie: vi.fn(),
}));

/**
 * JSON 본문을 가진 요청을 만듭니다.
 *
 * @param body 요청 본문 문자열
 * @param headers 요청 헤더
 */
function jsonRequest(body: string, headers: Record<string, string> = {}): Request {
  return new Request('http://localhost/api/auth/x', { method: 'POST', body, headers });
}

/**
 * 인증 BFF 핸들러 테스트
 * 로그인(쿠키 저장, Refresh Token 비노출, 입력 검증, 오류 전달), 재발급(쿠키 교체, 쿠키 없음, 거부 시 쿠키 삭제, 서버 오류 시 쿠키 유지), 로그아웃(폐기 요청, 헤더 전달, 항상 쿠키 삭제)을 확인합니다.
 */
describe('authBff', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('MEMBER_API_BASE_URL', 'http://member-api');
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  describe('toAccessTokenResponse', () => {
    it('Refresh Token을 제외한 값만 반환한다', () => {
      expect(toAccessTokenResponse(memberTokenData)).toEqual({ accessToken: 'access-1', tokenType: 'Bearer', accessExpiresIn: 1799 });
    });
  });

  describe('handleLogin', () => {
    it('member-api에 로그인하고 Refresh Token은 쿠키에, Access Token은 본문에 담는다', async () => {
      fetchMock.mockResolvedValue(jsonResponse(200, 'OK', memberTokenData));

      const response = await handleLogin(jsonRequest('{"email":"a@b.com","password":"Password1!"}'));
      const body = await response.json();

      expect(fetchMock.mock.calls[0][0]).toBe('http://member-api/v1/login');
      expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ email: 'a@b.com', password: 'Password1!' });
      expect(setRefreshCookie).toHaveBeenCalledWith('refresh-1', 1209599);
      expect(response.status).toBe(200);
      expect(body.data).toEqual({ accessToken: 'access-1', tokenType: 'Bearer', accessExpiresIn: 1799 });
      expect(JSON.stringify(body)).not.toContain('refresh-1');
    });

    it('이메일이나 비밀번호가 없으면 member-api를 호출하지 않고 400을 응답한다', async () => {
      const response = await handleLogin(jsonRequest('{"email":"a@b.com"}'));

      expect(response.status).toBe(400);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('JSON이 아닌 본문이면 400을 응답한다', async () => {
      const response = await handleLogin(jsonRequest('not json'));

      expect(response.status).toBe(400);
    });

    it('member-api가 거부하면 같은 상태로 전달하고 쿠키를 저장하지 않는다', async () => {
      fetchMock.mockResolvedValue(jsonResponse(401, 'UNAUTHORIZED', null, 'Unauthorized'));

      const response = await handleLogin(jsonRequest('{"email":"a@b.com","password":"x"}'));

      expect(response.status).toBe(401);
      expect(await response.json()).toMatchObject({ name: 'UNAUTHORIZED' });
      expect(setRefreshCookie).not.toHaveBeenCalled();
    });

    it('member-api에 연결하지 못하면 502를 응답한다', async () => {
      fetchMock.mockRejectedValue(new TypeError('fetch failed'));

      const response = await handleLogin(jsonRequest('{"email":"a@b.com","password":"x"}'));

      expect(response.status).toBe(502);
    });
  });

  describe('handleReissue', () => {
    it('쿠키의 Refresh Token으로 재발급하고 쿠키를 새 값으로 교체한다', async () => {
      vi.mocked(getRefreshCookie).mockResolvedValue('old-refresh');
      fetchMock.mockResolvedValue(jsonResponse(200, 'OK', { ...memberTokenData, refreshToken: 'refresh-2' }));

      const response = await handleReissue();

      expect(fetchMock.mock.calls[0][0]).toBe('http://member-api/v1/member/reissue');
      expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ refreshToken: 'old-refresh' });
      expect(setRefreshCookie).toHaveBeenCalledWith('refresh-2', 1209599);
      expect((await response.json()).data.accessToken).toBe('access-1');
    });

    it('쿠키가 없으면 member-api를 호출하지 않고 401을 응답한다', async () => {
      vi.mocked(getRefreshCookie).mockResolvedValue(null);

      const response = await handleReissue();

      expect(response.status).toBe(401);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('Refresh Token이 거부되면 쿠키를 삭제하고 오류를 전달한다', async () => {
      vi.mocked(getRefreshCookie).mockResolvedValue('old-refresh');
      fetchMock.mockResolvedValue(jsonResponse(401, 'INVALID_TOKEN'));

      const response = await handleReissue();

      expect(response.status).toBe(401);
      expect(clearRefreshCookie).toHaveBeenCalledTimes(1);
    });

    it('서버 오류면 쿠키를 지우지 않아 다시 시도할 수 있다', async () => {
      vi.mocked(getRefreshCookie).mockResolvedValue('old-refresh');
      fetchMock.mockResolvedValue(jsonResponse(500, 'INTERNAL_SERVER_ERROR'));

      const response = await handleReissue();

      expect(response.status).toBe(500);
      expect(clearRefreshCookie).not.toHaveBeenCalled();
    });
  });

  describe('handleLogout', () => {
    it('Refresh Token을 폐기하고 Authorization 헤더를 함께 전달한 뒤 쿠키를 삭제한다', async () => {
      vi.mocked(getRefreshCookie).mockResolvedValue('refresh-1');
      fetchMock.mockResolvedValue(jsonResponse(200, 'OK'));

      const response = await handleLogout(jsonRequest('', { Authorization: 'Bearer access-1' }));

      expect(fetchMock.mock.calls[0][0]).toBe('http://member-api/v1/logout');
      expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ refreshToken: 'refresh-1' });
      expect(fetchMock.mock.calls[0][1].headers).toMatchObject({ Authorization: 'Bearer access-1' });
      expect(response.status).toBe(200);
      expect(clearRefreshCookie).toHaveBeenCalledTimes(1);
    });

    it('쿠키가 없으면 member-api를 호출하지 않고 성공 처리한다', async () => {
      vi.mocked(getRefreshCookie).mockResolvedValue(null);

      const response = await handleLogout(jsonRequest(''));

      expect(response.status).toBe(200);
      expect(fetchMock).not.toHaveBeenCalled();
      expect(clearRefreshCookie).toHaveBeenCalledTimes(1);
    });

    it('member-api가 실패해도 쿠키는 삭제하고 오류를 전달한다', async () => {
      vi.mocked(getRefreshCookie).mockResolvedValue('refresh-1');
      fetchMock.mockResolvedValue(jsonResponse(500, 'INTERNAL_SERVER_ERROR'));

      const response = await handleLogout(jsonRequest(''));

      expect(response.status).toBe(500);
      expect(clearRefreshCookie).toHaveBeenCalledTimes(1);
    });
  });
});
