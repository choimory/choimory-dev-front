/**
 * 인증 화면 종류
 */
export type AuthMode = 'login' | 'signup';

/**
 * 인증 화면 보조 링크
 */
export type AuthLink = {
  label: string; // 링크에 표시할 텍스트
  href: string;  // 이동할 경로
};

/**
 * 소셜 로그인 제공자
 */
export type SocialLoginProvider = {
  id: 'naver' | 'kakao' | 'google'; // 소셜 로그인 제공자 ID
  label: string;                    // 버튼에 표시할 텍스트
};

/**
 * 로그인 화면 데이터
 */
export type LoginViewModel = {
  title: string;       // 화면 제목
  description: string; // 화면 설명
  signupLink: AuthLink; // 회원가입 화면 링크
  socialProviders: SocialLoginProvider[]; // 소셜 로그인 제공자 목록
};

/**
 * 회원가입 화면 데이터
 */
export type SignupViewModel = {
  title: string;      // 화면 제목
  description: string; // 화면 설명
  loginLink: AuthLink; // 로그인 화면 링크
};

/**
 * 로그인 요청
 */
export type LoginRequest = {
  email: string;    // 가입한 이메일
  password: string; // 비밀번호
};

/**
 * 회원가입 요청
 */
export type MemberJoinRequest = {
  email: string;             // 이메일
  password: string;          // 비밀번호 (영문, 숫자, 특수문자 포함 8~64자)
  nickname: string;          // 닉네임 (한글, 영문, 숫자 3~15자)
  introduce?: string | null; // 자기소개 (선택, 500자 이하)
};

/**
 * 회원 상태
 */
export type MemberStatus = 'REGISTER' | 'ACTIVATE' | 'INACTIVATE' | 'SUSPENDED';

/**
 * 회원가입 응답
 */
export type MemberJoinResponse = {
  id: string;            // 회원 ID (UUID v7)
  email: string;         // 이메일
  nickname: string;      // 닉네임
  status: MemberStatus;  // 회원 상태
};

/**
 * member-api 토큰 발급 응답. BFF 서버에서만 다룹니다.
 */
export type MemberTokenResponse = {
  accessToken: string;      // Access Token
  refreshToken: string;     // Refresh Token
  tokenType: string;        // 토큰 종류 (Authorization 헤더 접두어)
  accessExpiresIn: number;  // Access Token 만료까지 남은 시간(초)
  refreshExpiresIn: number; // Refresh Token 만료까지 남은 시간(초)
};

/**
 * 회원가입 폼 입력 값
 */
export type SignupFormValues = {
  nickname: string;        // 닉네임
  email: string;           // 이메일
  password: string;        // 비밀번호
  passwordConfirm: string; // 비밀번호 확인
};

/**
 * 폼 필드별 오류 메시지
 */
export type FieldErrors = Partial<Record<keyof SignupFormValues, string>>;

/** 로그인 화면 임시 데이터 */
export const loginViewModel: LoginViewModel = {
  title: '로그인',
  description: 'choimory.dev의 서비스들을 내 계정으로 이어서 사용해요.',
  signupLink: {
    label: '회원가입',
    href: '/signup',
  },
  socialProviders: [
    {
      id: 'naver',
      label: '네이버로 로그인',
    },
    {
      id: 'kakao',
      label: '카카오로 로그인',
    },
    {
      id: 'google',
      label: '구글로 로그인',
    },
  ],
};

/** 회원가입 화면 임시 데이터 */
export const signupViewModel: SignupViewModel = {
  title: '회원가입',
  description: '블로그, 메모, 피드를 하나의 계정으로 사용할 준비를 해요.',
  loginLink: {
    label: '로그인',
    href: '/login',
  },
};
