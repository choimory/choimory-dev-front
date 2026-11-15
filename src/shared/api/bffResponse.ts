import { ApiError, type CommonResponse } from './apiTypes';

/**
 * 공통 응답 형태의 성공 Response를 만듭니다.
 *
 * @param data 응답 data
 * @returns 200 Response
 */
export function okResponse<T>(data: T): Response {
  const body: CommonResponse<T> = { code: 200, name: 'OK', message: 'OK', data };

  return Response.json(body, { status: 200 });
}

/**
 * 공통 응답 형태의 오류 Response를 만듭니다.
 *
 * @param status HTTP 상태 코드
 * @param name 오류 코드명
 * @param message 오류 메시지
 * @param data 오류 data (기본 null)
 * @returns 오류 Response
 */
export function errorResponse(status: number, name: string, message: string, data: unknown = null): Response {
  const body: CommonResponse<unknown> = { code: status, name, message, data };

  return Response.json(body, { status });
}

/**
 * 던져진 오류를 오류 Response로 변환합니다.
 * member-api가 준 오류는 그대로 전달하고, 네트워크 오류 등은 502로 응답합니다.
 *
 * @param error 던져진 오류
 * @returns 오류 Response
 */
export function toErrorResponse(error: unknown): Response {
  if (error instanceof ApiError) {
    return errorResponse(error.status, error.errorName, error.message, error.data);
  }

  return errorResponse(502, 'BAD_GATEWAY', '서버와 통신하지 못했어요.');
}
