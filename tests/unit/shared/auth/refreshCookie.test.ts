import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clearRefreshCookie, getRefreshCookie, REFRESH_COOKIE_NAME, setRefreshCookie } from '@/shared/auth/refreshCookie';

const cookieStore = {
  get: vi.fn(),
  set: vi.fn(),
};

vi.mock('next/headers', () => ({
  cookies: async () => cookieStore,
}));

/**
 * refreshCookie 테스트
 * Refresh Token 쿠키의 보안 옵션(httpOnly, sameSite, path, maxAge) 저장, 조회, 삭제를 확인합니다.
 */
describe('refreshCookie', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('httpOnly, lax, 인증 경로로 한정한 쿠키로 저장한다', async () => {
    await setRefreshCookie('refresh-1', 1209599);

    expect(cookieStore.set).toHaveBeenCalledWith(
      REFRESH_COOKIE_NAME,
      'refresh-1',
      expect.objectContaining({ httpOnly: true, sameSite: 'lax', path: '/api/auth', maxAge: 1209599 }),
    );
  });

  it('쿠키가 있으면 값을, 없으면 null을 반환한다', async () => {
    cookieStore.get.mockReturnValueOnce({ name: REFRESH_COOKIE_NAME, value: 'refresh-1' }).mockReturnValueOnce(undefined);

    expect(await getRefreshCookie()).toBe('refresh-1');
    expect(await getRefreshCookie()).toBeNull();
  });

  it('삭제하면 같은 경로에 빈 값과 maxAge 0으로 덮어쓴다', async () => {
    await clearRefreshCookie();

    expect(cookieStore.set).toHaveBeenCalledWith(
      REFRESH_COOKIE_NAME,
      '',
      expect.objectContaining({ httpOnly: true, path: '/api/auth', maxAge: 0 }),
    );
  });
});
