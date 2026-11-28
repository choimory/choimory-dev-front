import { ApiError, type AccessTokenResponse } from '@/shared/api/apiTypes';
import { errorResponse, okResponse, toErrorResponse } from '@/shared/api/bffResponse';
import { httpRequest } from '@/shared/api/httpClient';
import { clearRefreshCookie, getRefreshCookie, setRefreshCookie } from '@/shared/auth/refreshCookie';
import { clearSessionCookies, setAccessCookie, setSessionHintCookie } from '@/shared/auth/sessionCookies';
import { getServerEnv } from '@/shared/config/env';

import type { LoginRequest, MemberTokenResponse } from '../model/authTypes';

/**
 * member-api 토큰 응답에서 브라우저로 내려줄 값만 꺼냅니다. Refresh Token은 제외합니다.
 *
 * @param token member-api 토큰 응답
 * @returns 브라우저용 토큰 응답
 */
export function toAccessTokenResponse(token: MemberTokenResponse): AccessTokenResponse {
  return {
    accessToken: token.accessToken,
    tokenType: token.tokenType,
    accessExpiresIn: token.accessExpiresIn,
  };
}

/**
 * 요청 본문을 JSON으로 읽습니다.
 *
 * @param request 요청
 * @returns 파싱된 본문 (JSON이 아니면 null)
 */
async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

/**
 * 로그인에 성공하면 Refresh Token, Access Token, 세션 표시 쿠키를 저장합니다.
 * Access Token은 응답 본문에도 담습니다.
 *
 * @param request 이메일과 비밀번호를 담은 요청
 * @returns Access Token 응답 또는 member-api 오류 응답
 */
export async function handleLogin(request: Request): Promise<Response> {
  const body = (await readJson(request)) as LoginRequest | null;

  if (!body || typeof body.email !== 'string' || typeof body.password !== 'string') {
    return errorResponse(400, 'BAD_REQUEST', '이메일과 비밀번호를 입력해 주세요.');
  }

  try {
    // member-api에 로그인을 요청한다.
    const token = await httpRequest<MemberTokenResponse>({
      baseUrl: getServerEnv().memberApiBaseUrl,
      path: '/v1/login',
      method: 'POST',
      body: { email: body.email, password: body.password },
    });

    // 토큰 수명에 맞춰 인증 쿠키 세 개를 설정한다.
    await setRefreshCookie(token.refreshToken, token.refreshExpiresIn);
    await setAccessCookie(token.accessToken, token.accessExpiresIn);
    await setSessionHintCookie(token.refreshExpiresIn);

    return okResponse(toAccessTokenResponse(token));
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * 쿠키의 Refresh Token으로 토큰을 재발급하고 성공하면 인증 쿠키 세 개를 갱신합니다.
 * member-api가 400 또는 401을 응답하면 세 쿠키를 삭제하고, 일시적인 오류에서는 유지합니다.
 *
 * @returns 새 Access Token 응답 또는 오류 응답
 */
export async function handleReissue(): Promise<Response> {
  const refreshToken = await getRefreshCookie();

  if (!refreshToken) {
    return errorResponse(401, 'UNAUTHORIZED', '로그인이 필요해요.');
  }

  try {
    const token = await httpRequest<MemberTokenResponse>({
      baseUrl: getServerEnv().memberApiBaseUrl,
      path: '/v1/member/reissue',
      method: 'POST',
      body: { refreshToken },
    });

    await setRefreshCookie(token.refreshToken, token.refreshExpiresIn);
    await setAccessCookie(token.accessToken, token.accessExpiresIn);
    await setSessionHintCookie(token.refreshExpiresIn);

    return okResponse(toAccessTokenResponse(token));
  } catch (error) {
    // 토큰이 거부된 경우에만 쿠키를 지운다. 일시적인 서버 오류면 다시 시도할 수 있게 남긴다.
    if (error instanceof ApiError && (error.status === 400 || error.status === 401)) {
      await clearRefreshCookie();
      await clearSessionCookies();
    }

    return toErrorResponse(error);
  }
}

/**
 * 로그아웃을 처리합니다. member-api 결과와 상관없이 인증 쿠키 세 개를 삭제합니다.
 *
 * @param request Authorization 헤더(선택)를 담은 요청
 * @returns 성공 응답 또는 member-api 오류 응답
 */
export async function handleLogout(request: Request): Promise<Response> {
  const refreshToken = await getRefreshCookie();

  try {
    // Refresh Token이 있으면 member-api에서 폐기한다. Access Token이 있으면 함께 블랙리스트에 올린다.
    if (refreshToken) {
      const authorization = request.headers.get('Authorization');

      await httpRequest<null>({
        baseUrl: getServerEnv().memberApiBaseUrl,
        path: '/v1/logout',
        method: 'POST',
        body: { refreshToken },
        headers: authorization ? { Authorization: authorization } : undefined,
      });
    }

    return okResponse(null);
  } catch (error) {
    return toErrorResponse(error);
  } finally {
    await clearRefreshCookie();
    await clearSessionCookies();
  }
}
