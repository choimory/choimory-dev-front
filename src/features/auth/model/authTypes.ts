/**
 * 로그인 요청
 */
export type LoginRequest = {
  id: string;       // 사용자 아이디
  password: string; // 비밀번호
};

/**
 * 회원가입 요청
 *
 * 비밀번호 확인 값은 클라이언트 검증에만 사용하므로 요청에 포함하지 않는다.
 */
export type SignUpRequest = {
  email: string;    // 사용자 이메일
  nickname: string; // 사용자 닉네임
  password: string; // 비밀번호
};

/**
 * 이메일 및 닉네임 중복 확인 응답
 */
export type DuplicateCheckResponse = {
  isAvailable: boolean; // 사용 가능 여부
};

/**
 * 이메일 인증 코드 확인 요청
 */
export type VerifyCodeRequest = {
  email: string; // 인증 코드를 발송한 이메일
  code: string;  // 사용자가 입력한 인증 코드
};

/**
 * 이메일 인증 코드 재발송 요청
 */
export type ResendCodeRequest = {
  email: string; // 인증 코드를 재발송할 이메일
};
