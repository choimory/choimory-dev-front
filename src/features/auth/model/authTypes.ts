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

/** 로그인 화면 임시 데이터 */
export const loginViewModel: LoginViewModel = {
  title: '로그인',
  description: 'choimory.dev의 서비스들을 내 계정으로 이어서 사용합니다.',
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
  description: '블로그, 메모, 피드를 하나의 계정으로 사용할 준비를 합니다.',
  loginLink: {
    label: '로그인',
    href: '/login',
  },
};
