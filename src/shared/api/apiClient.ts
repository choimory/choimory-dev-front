import { buildLoginHref } from '@/shared/auth/redirect';

import { ApiError } from './apiTypes';
import { httpRequest, type HttpMethod } from './httpClient';
import { refreshAccessToken } from './tokenRefresher';
import { getAccessToken, isAccessTokenExpiring } from './tokenStore';

/**
 * API 클라이언트 설정
 */
export type ApiClientConfig = {
  baseUrl: string;            // member-api 주소
  onAuthExpired?: () => void; // 토큰 갱신까지 실패했을 때 실행할 동작 (예: 로그인 화면 이동)
  fetchImpl?: typeof fetch;   // 테스트용 fetch 대체
};

/**
 * 요청별 옵션
 */
export type ApiRequestOptions = {
  auth?: boolean; // Access Token 사용 여부 (기본 true)
};

/**
 * API 클라이언트
 */
export type ApiClient = {
  get: <T>(path: string, options?: ApiRequestOptions) => Promise<T>;
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) => Promise<T>;
  put: <T>(path: string, body?: unknown, options?: ApiRequestOptions) => Promise<T>;
  patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) => Promise<T>;
  delete: <T>(path: string, options?: ApiRequestOptions) => Promise<T>;
};

/**
 * Access Token 갱신 로직이 포함된 member-api 클라이언트를 만듭니다.
 * 호출 전 만료 임박이면 먼저 갱신하고, TOKEN_EXPIRED 401이면 갱신 후 1회만 재시도합니다.
 *
 * @param config 클라이언트 설정
 * @returns API 클라이언트
 */
export function createApiClient(config: ApiClientConfig): ApiClient {
  const { baseUrl, onAuthExpired, fetchImpl } = config;

  /**
   * 요청을 한 번 보냅니다.
   */
  const execute = <T>(method: HttpMethod, path: string, body: unknown, auth: boolean): Promise<T> => {
    const token = auth ? getAccessToken() : null;

    return httpRequest<T>({
      baseUrl,
      path,
      method,
      body,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      fetchImpl,
    });
  };

  /**
   * 토큰 갱신을 포함해 요청을 보냅니다.
   */
  const send = async <T>(method: HttpMethod, path: string, body?: unknown, options?: ApiRequestOptions): Promise<T> => {
    const auth = options?.auth ?? true;

    // 만료가 임박했으면 요청 전에 먼저 갱신한다. 실패해도 요청은 보내서 서버가 판단하게 한다.
    if (auth && isAccessTokenExpiring()) {
      try {
        await refreshAccessToken();
      } catch {
        // 갱신 실패는 아래 요청의 401로 처리한다.
      }
    }

    try {
      return await execute<T>(method, path, body, auth);
    } catch (error) {
      const isTokenExpired = error instanceof ApiError && error.status === 401 && error.errorName === 'TOKEN_EXPIRED';

      if (!auth || !isTokenExpired) {
        throw error;
      }

      // 토큰이 만료됐으면 갱신 후 원 요청을 1회만 재시도한다.
      try {
        await refreshAccessToken();
      } catch {
        onAuthExpired?.();
        throw error;
      }

      return execute<T>(method, path, body, auth);
    }
  };

  return {
    get: (path, options) => send('GET', path, undefined, options),
    post: (path, body, options) => send('POST', path, body, options),
    put: (path, body, options) => send('PUT', path, body, options),
    patch: (path, body, options) => send('PATCH', path, body, options),
    delete: (path, options) => send('DELETE', path, undefined, options),
  };
}

/**
 * 로그인 화면으로 이동합니다. 로그인한 뒤 지금 보던 페이지로 돌아오도록 현재 경로를 함께 넘깁니다.
 */
function redirectToLogin(): void {
  if (typeof window !== 'undefined') {
    // 메모리의 인증 상태를 함께 비우려고 라우터 이동이 아닌 전체 이동을 쓴다.
    window.location.assign(buildLoginHref(window.location.pathname));
  }
}

/** 브라우저에서 member-api를 직접 호출하는 공용 클라이언트 */
export const apiClient: ApiClient = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_MEMBER_API_BASE_URL ?? '',
  onAuthExpired: redirectToLogin,
});
