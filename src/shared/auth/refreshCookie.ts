import { cookies } from 'next/headers';

/** Refresh Token 쿠키 이름 */
export const REFRESH_COOKIE_NAME = 'refresh_token';

/** Refresh Token 쿠키를 보내는 경로. 인증 BFF 엔드포인트로만 한정한다. */
const REFRESH_COOKIE_PATH = '/api/auth';

/**
 * Refresh Token을 httpOnly 쿠키에 저장합니다.
 *
 * @param refreshToken Refresh Token
 * @param maxAgeSeconds 쿠키 수명(초). Refresh Token 만료까지 남은 시간
 */
export async function setRefreshCookie(refreshToken: string, maxAgeSeconds: number): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: REFRESH_COOKIE_PATH,
    maxAge: maxAgeSeconds,
  });
}

/**
 * 쿠키에서 Refresh Token을 읽습니다.
 *
 * @returns Refresh Token (없으면 null)
 */
export async function getRefreshCookie(): Promise<string | null> {
  const cookieStore = await cookies();

  return cookieStore.get(REFRESH_COOKIE_NAME)?.value ?? null;
}

/**
 * Refresh Token 쿠키를 삭제합니다.
 */
export async function clearRefreshCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(REFRESH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: REFRESH_COOKIE_PATH,
    maxAge: 0,
  });
}
