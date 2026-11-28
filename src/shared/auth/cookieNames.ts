/** Access Token 쿠키 이름. 프록시의 페이지 접근 판단에만 쓰고 API 인증에는 쓰지 않습니다. */
export const ACCESS_COOKIE_NAME = 'access_token';

/**
 * 로그인 세션이 있음을 알리는 표시 쿠키 이름. 값은 토큰이 아니며 Refresh Token과 같은 수명입니다.
 * Access Token이 만료돼도 Refresh Token이 남아 있다는 신호로 프록시가 통과시킵니다.
 */
export const SESSION_HINT_COOKIE_NAME = 'session_hint';
