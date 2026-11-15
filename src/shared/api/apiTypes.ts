/**
 * member-api 공통 응답
 */
export type CommonResponse<T> = {
  code: number;    // 응답 코드
  name: string;    // 응답 코드명
  message: string; // 응답 메시지
  data: T;         // 응답 데이터 (오류 시 null)
};

/**
 * 요청 값 검증 실패 정보
 */
export type ValidateResult = {
  field: string;         // 검증에 실패한 필드명
  rejectValue: unknown;  // 거부된 값
  message: string;       // 검증 실패 메시지
};

/**
 * 브라우저에 내려주는 토큰 응답. Refresh Token은 쿠키로만 전달하므로 포함하지 않습니다.
 */
export type AccessTokenResponse = {
  accessToken: string;      // Access Token
  tokenType: string;        // 토큰 종류 (Authorization 헤더 접두어)
  accessExpiresIn: number;  // Access Token 만료까지 남은 시간(초)
};

/**
 * API 호출 실패를 나타내는 오류입니다.
 */
export class ApiError extends Error {
  readonly status: number;    // HTTP 상태 코드
  readonly errorName: string; // 오류 코드명 (예: TOKEN_EXPIRED)
  readonly data: unknown;     // 오류 응답의 data (검증 실패 시 필드 목록)

  /**
   * @param status HTTP 상태 코드
   * @param errorName 오류 코드명
   * @param message 오류 메시지
   * @param data 오류 응답의 data
   */
  constructor(status: number, errorName: string, message: string, data: unknown = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorName = errorName;
    this.data = data;
  }
}

/**
 * 오류에서 필드별 검증 실패 목록을 꺼냅니다.
 *
 * @param error 확인할 오류
 * @returns 검증 실패 목록 (검증 실패 오류가 아니면 빈 배열)
 */
export function getValidateResults(error: unknown): ValidateResult[] {
  if (!(error instanceof ApiError) || !Array.isArray(error.data)) {
    return [];
  }

  return error.data.filter(
    (item): item is ValidateResult =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as ValidateResult).field === 'string' &&
      typeof (item as ValidateResult).message === 'string',
  );
}
