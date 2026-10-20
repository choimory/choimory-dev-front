/**
 * 서버에서 사용하는 환경 설정
 */
export type ServerEnv = {
  memberApiBaseUrl: string; // 서버가 member-api를 호출할 때 사용하는 주소 (끝의 / 제외)
};

/**
 * 서버 전용 환경변수를 읽고 검증합니다.
 * 브라우저 번들에서는 호출하지 않습니다.
 *
 * @returns 서버 환경 설정
 * @throws MEMBER_API_BASE_URL이 없을 때
 */
export function getServerEnv(): ServerEnv {
  const memberApiBaseUrl = process.env.MEMBER_API_BASE_URL;

  if (!memberApiBaseUrl) {
    throw new Error('MEMBER_API_BASE_URL 환경변수가 설정되어 있지 않습니다.');
  }

  return {
    memberApiBaseUrl: memberApiBaseUrl.replace(/\/+$/, ''),
  };
}
