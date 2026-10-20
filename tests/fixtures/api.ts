/**
 * 공통 응답 형태의 JSON Response를 만듭니다.
 *
 * @param status HTTP 상태 코드
 * @param name 응답 코드명
 * @param data 응답 data
 * @param message 응답 메시지
 * @returns JSON Response
 */
export function jsonResponse(status: number, name: string, data: unknown = null, message = name): Response {
  return new Response(JSON.stringify({ code: status, name, message, data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** member-api 토큰 발급 응답 data */
export const memberTokenData = {
  accessToken: 'access-1',
  refreshToken: 'refresh-1',
  tokenType: 'Bearer',
  accessExpiresIn: 1799,
  refreshExpiresIn: 1209599,
};
