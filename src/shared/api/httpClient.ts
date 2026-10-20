import { ApiError, type CommonResponse } from './apiTypes';

/** 지원하는 HTTP 메서드 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * HTTP 요청 옵션
 */
export type HttpRequestOptions = {
  baseUrl: string;                  // 요청 주소의 앞부분 (같은 origin이면 빈 문자열)
  path: string;                     // 요청 경로
  method?: HttpMethod;              // HTTP 메서드 (기본 GET)
  body?: unknown;                   // JSON으로 보낼 요청 본문
  headers?: Record<string, string>; // 추가 요청 헤더
  fetchImpl?: typeof fetch;         // 테스트용 fetch 대체
};

/**
 * JSON 문자열을 파싱합니다.
 *
 * @param text 응답 본문 문자열
 * @returns 파싱 결과 (비었거나 JSON이 아니면 null)
 */
function parseJson(text: string): unknown {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * 값이 member-api 공통 응답 형태인지 확인합니다.
 *
 * @param value 확인할 값
 * @returns 공통 응답 여부
 */
function isCommonResponse(value: unknown): value is CommonResponse<unknown> {
  return typeof value === 'object' && value !== null && 'name' in value && 'message' in value;
}

/**
 * JSON API를 호출하고 공통 응답의 data를 반환합니다.
 *
 * @param options 요청 옵션
 * @returns 공통 응답의 data
 * @throws ApiError HTTP 상태가 실패이거나 응답이 공통 응답 형태가 아닐 때
 */
export async function httpRequest<T>(options: HttpRequestOptions): Promise<T> {
  const { baseUrl, path, method = 'GET', body, headers, fetchImpl = fetch } = options;

  // 본문이 있으면 JSON으로 직렬화해 보낸다.
  const response = await fetchImpl(`${baseUrl}${path}`, {
    method,
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const parsed = parseJson(await response.text());

  // 실패 응답은 공통 응답의 오류 정보를 담아 던진다.
  if (!response.ok) {
    if (isCommonResponse(parsed)) {
      throw new ApiError(response.status, parsed.name, parsed.message, parsed.data);
    }

    throw new ApiError(response.status, 'UNKNOWN', response.statusText || '요청에 실패했어요.');
  }

  if (!isCommonResponse(parsed)) {
    throw new ApiError(response.status, 'INVALID_RESPONSE', '응답 형식이 올바르지 않아요.');
  }

  return parsed.data as T;
}
