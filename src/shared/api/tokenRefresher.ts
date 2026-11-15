import type { AccessTokenResponse } from './apiTypes';
import { httpRequest } from './httpClient';
import { clearAccessToken, saveAccessToken } from './tokenStore';

/** 진행 중인 갱신 요청. Refresh Token이 1회용이라 동시에 하나만 보냅니다. */
let inFlight: Promise<string> | null = null;

/**
 * BFF 재발급 엔드포인트를 호출해 Access Token을 갱신합니다.
 *
 * @returns 새 Access Token
 * @throws ApiError 재발급에 실패했을 때 (메모리 토큰은 지워진다)
 */
async function requestReissue(): Promise<string> {
  try {
    const token = await httpRequest<AccessTokenResponse>({
      baseUrl: '',
      path: '/api/auth/reissue',
      method: 'POST',
    });

    saveAccessToken(token.accessToken, token.accessExpiresIn);

    return token.accessToken;
  } catch (error) {
    clearAccessToken();
    throw error;
  }
}

/**
 * Access Token을 갱신합니다. 이미 갱신 중이면 그 결과를 함께 기다립니다.
 *
 * @returns 새 Access Token
 * @throws ApiError 재발급에 실패했을 때
 */
export function refreshAccessToken(): Promise<string> {
  if (!inFlight) {
    inFlight = requestReissue().finally(() => {
      inFlight = null;
    });
  }

  return inFlight;
}
