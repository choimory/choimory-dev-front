/** 개발 확인용 인증 상태 */
export type MockAuthStatus = 'guest' | 'member';

/** Next.js page searchParams 형태 */
export type PageSearchParams = Record<string, string | string[] | undefined>;

/**
 * 개발 확인용 query에서 인증 상태를 읽습니다.
 *
 * 실제 인증 연동 전까지 `?auth=member` 화면 확인에만 사용합니다.
 *
 * @param searchParams page에서 받은 searchParams
 * @returns 화면 확인용 인증 상태
 */
export function getMockAuthStatus(searchParams: PageSearchParams): MockAuthStatus {
  const auth = searchParams.auth;
  const authValue = Array.isArray(auth) ? auth[0] : auth;

  return authValue === 'member' ? 'member' : 'guest';
}
