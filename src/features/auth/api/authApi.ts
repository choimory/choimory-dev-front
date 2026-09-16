import type {
  DuplicateCheckResponse,
  LoginRequest,
  ResendCodeRequest,
  SignUpRequest,
  VerifyCodeRequest,
} from '../model/authTypes';

/**
 * 인증 관련 API 모음입니다.
 *
 * 백엔드가 연동되기 전이므로 현재는 모두 mock 응답을 반환합니다.
 * 실제 연동 시 각 함수 내부 구현만 교체하면 되며, 호출부는 수정하지 않습니다.
 */
export const authApi = {
  /**
   * 로그인을 요청합니다.
   *
   * @param request 로그인 요청 정보
   * @returns 로그인 처리 완료 Promise
   */
  login: async (request: LoginRequest): Promise<void> => {
    // TODO: 실제 로그인 API 호출로 교체한다.
    console.log('[mock] login', request.id);
  },

  /**
   * 이메일 사용 가능 여부를 확인합니다.
   *
   * @param email 확인할 이메일
   * @returns 이메일 중복 확인 결과
   */
  checkEmail: async (email: string): Promise<DuplicateCheckResponse> => {
    // TODO: 실제 이메일 중복 확인 API 호출로 교체한다.
    console.log('[mock] checkEmail', email);
    return { isAvailable: true };
  },

  /**
   * 닉네임 사용 가능 여부를 확인합니다.
   *
   * @param nickname 확인할 닉네임
   * @returns 닉네임 중복 확인 결과
   */
  checkNickname: async (nickname: string): Promise<DuplicateCheckResponse> => {
    // TODO: 실제 닉네임 중복 확인 API 호출로 교체한다.
    console.log('[mock] checkNickname', nickname);
    return { isAvailable: true };
  },

  /**
   * 회원가입을 요청합니다.
   * 요청이 처리되면 인증 코드가 이메일로 발송됩니다.
   *
   * @param request 회원가입 요청 정보
   * @returns 회원가입 처리 완료 Promise
   */
  signUp: async (request: SignUpRequest): Promise<void> => {
    // TODO: 실제 회원가입 API 호출로 교체한다.
    console.log('[mock] signUp', request.email, request.nickname);
  },

  /**
   * 이메일 인증 코드를 확인합니다.
   *
   * @param request 인증 코드 확인 요청 정보
   * @returns 인증 코드 확인 완료 Promise
   */
  verifyCode: async (request: VerifyCodeRequest): Promise<void> => {
    // TODO: 실제 인증 코드 확인 API 호출로 교체한다.
    console.log('[mock] verifyCode', request.email, request.code);
  },

  /**
   * 이메일 인증 코드를 재발송합니다.
   *
   * @param request 인증 코드 재발송 요청 정보
   * @returns 인증 코드 재발송 완료 Promise
   */
  resendCode: async (request: ResendCodeRequest): Promise<void> => {
    // TODO: 실제 인증 코드 재발송 API 호출로 교체한다.
    console.log('[mock] resendCode', request.email);
  },
};
