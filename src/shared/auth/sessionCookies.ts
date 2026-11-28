import { cookies } from 'next/headers';

import { ACCESS_COOKIE_NAME, SESSION_HINT_COOKIE_NAME } from './cookieNames';

/**
 * Access Token 쿠키와 세션 표시 쿠키에 공통으로 적용할 속성을 반환합니다.
 *
 * @param maxAgeSeconds 쿠키 수명(초)
 * @returns 쿠키 저장 또는 만료에 사용할 속성
 */
function sessionCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  };
}

/**
 * 프록시의 페이지 접근 판단에 사용할 Access Token을 httpOnly 쿠키에 저장합니다.
 *
 * @param accessToken Access Token
 * @param maxAgeSeconds Access Token 만료까지 남은 시간(초)
 */
export async function setAccessCookie(accessToken: string, maxAgeSeconds: number): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_COOKIE_NAME, accessToken, sessionCookieOptions(maxAgeSeconds));
}

/**
 * 세션이 있음을 표시하는 값 1을 httpOnly 쿠키에 저장합니다.
 *
 * @param maxAgeSeconds Refresh Token 만료까지 남은 시간(초)
 */
export async function setSessionHintCookie(maxAgeSeconds: number): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_HINT_COOKIE_NAME, '1', sessionCookieOptions(maxAgeSeconds));
}

/**
 * Access Token 쿠키와 세션 표시 쿠키를 만료시킵니다.
 */
export async function clearSessionCookies(): Promise<void> {
  const cookieStore = await cookies();
  const expiredOptions = sessionCookieOptions(0);

  cookieStore.set(ACCESS_COOKIE_NAME, '', expiredOptions);
  cookieStore.set(SESSION_HINT_COOKIE_NAME, '', expiredOptions);
}
