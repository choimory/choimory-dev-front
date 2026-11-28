// 보호 경로를 공개로 바꾸려면 아래 matcher에서 해당 항목을 빼고 해당 Container의 RequireAuth를 제거합니다.
import { NextResponse, type NextRequest, type ProxyConfig } from 'next/server';

import { ACCESS_COOKIE_NAME, SESSION_HINT_COOKIE_NAME } from '@/shared/auth/cookieNames';
import { buildLoginHref } from '@/shared/auth/redirect';
import { getServerEnv } from '@/shared/config/env';

/**
 * 현재 경로를 로그인 후 돌아갈 경로로 전달합니다.
 *
 * @param request 보호 경로 요청
 * @returns 로그인 화면으로 이동하는 응답
 */
function redirectToLogin(request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL(buildLoginHref(request.nextUrl.pathname), request.url));
}

/**
 * 보호 경로 요청의 액세스 토큰을 회원 API에서 검증합니다.
 * 토큰이 없거나 만료됐으면 세션 표시 쿠키를 기준으로 자동 갱신을 허용합니다.
 *
 * @param request 보호 경로 요청
 * @returns 요청 통과 또는 로그인 리다이렉트 응답
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  const accessToken = request.cookies.get(ACCESS_COOKIE_NAME)?.value;

  if (accessToken !== undefined) {
    try {
      const { memberApiBaseUrl } = getServerEnv();
      const verification = await fetch(`${memberApiBaseUrl}/v1/member/token/verify`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(2000),
      });

      if (verification.status !== 200 && verification.status !== 401) {
        return redirectToLogin(request);
      }

      // 검증 응답을 읽을 수 없으면 로그인으로 이동하고 쿠키는 유지합니다.
      const result: unknown = await verification.json();

      if (verification.status === 200) {
        return NextResponse.next();
      }

      // 만료 이외의 인증 실패에서는 액세스 토큰 쿠키만 삭제합니다.
      const isExpired =
        typeof result === 'object' && result !== null && 'name' in result && result.name === 'TOKEN_EXPIRED';

      if (!isExpired) {
        const response = redirectToLogin(request);
        response.cookies.delete(ACCESS_COOKIE_NAME);
        return response;
      }
    } catch {
      return redirectToLogin(request);
    }
  }

  // 세션 표시 쿠키가 있으면 클라이언트가 토큰을 자동 갱신하도록 통과시킵니다.
  return request.cookies.has(SESSION_HINT_COOKIE_NAME) ? NextResponse.next() : redirectToLogin(request);
}

export const config: ProxyConfig = {
  matcher: [
    {
      source: '/me',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
    {
      source: '/blog/me',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
    {
      source: '/blog/following',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
    {
      source: '/feed/me',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
    {
      source: '/feed/me/targets/:targetId',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
    {
      source: '/feed/observations',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
    {
      source: '/feed/observations/:observationId',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
    {
      source: '/feed/activities/:activityId',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
