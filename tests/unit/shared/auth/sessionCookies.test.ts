import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ACCESS_COOKIE_NAME, SESSION_HINT_COOKIE_NAME } from '@/shared/auth/cookieNames';
import { clearSessionCookies, setAccessCookie, setSessionHintCookie } from '@/shared/auth/sessionCookies';

const cookieStore = {
  set: vi.fn(),
};

vi.mock('next/headers', () => ({
  cookies: async () => cookieStore,
}));

/**
 * 환경별 Access Token 쿠키와 세션 표시 쿠키의 저장 및 삭제 속성을 확인합니다.
 */
describe.each([
  { nodeEnv: 'production', secure: true },
  { nodeEnv: 'development', secure: false },
  { nodeEnv: 'test', secure: false },
])('sessionCookies ($nodeEnv)', ({ nodeEnv, secure }) => {
  const cookieOptions = { httpOnly: true, secure, sameSite: 'lax', path: '/' };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NODE_ENV', nodeEnv);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('Access Token을 전달받은 수명으로 저장한다', async () => {
    const accessToken = crypto.randomUUID();

    await setAccessCookie(accessToken, 1799);

    expect(cookieStore.set).toHaveBeenCalledExactlyOnceWith(ACCESS_COOKIE_NAME, accessToken, {
      ...cookieOptions,
      maxAge: 1799,
    });
  });

  it('세션 표시 값 1을 전달받은 수명으로 저장한다', async () => {
    await setSessionHintCookie(1209599);

    expect(cookieStore.set).toHaveBeenCalledExactlyOnceWith(SESSION_HINT_COOKIE_NAME, '1', {
      ...cookieOptions,
      maxAge: 1209599,
    });
  });

  it('두 쿠키를 같은 속성으로 만료시킨다', async () => {
    await clearSessionCookies();

    const expiredOptions = { ...cookieOptions, maxAge: 0 };

    expect(cookieStore.set).toHaveBeenCalledTimes(2);
    expect(cookieStore.set).toHaveBeenCalledWith(ACCESS_COOKIE_NAME, '', expiredOptions);
    expect(cookieStore.set).toHaveBeenCalledWith(SESSION_HINT_COOKIE_NAME, '', expiredOptions);
  });
});
