'use client';

import { hardNavigate } from '@/shared/navigation/hardNavigate';

import { LoginView } from '../components/LoginView';
import { useLogin } from '../hooks/useLogin';
import { loginViewModel } from '../model/authTypes';

/**
 * 로그인 화면 Container의 Props
 */
type LoginContainerProps = {
  redirectTo?: string; // 로그인 성공 후 이동할 경로 (서버에서 검증된 내부 경로, 기본 홈)
};

/**
 * 로그인 화면의 데이터 흐름을 담당하는 Container입니다.
 * 로그인에 성공하면 원래 가려던 페이지(없으면 홈)로 전체 이동합니다.
 * 클라이언트 라우터는 비로그인으로 방문했을 때의 리다이렉트 결과를 캐시해 두고 재사용하므로,
 * 클라이언트 이동을 쓰면 로그인 후에도 같은 경로로 이동하지 못하고 로그인 화면에 머뭅니다.
 * 전체 이동은 새 쿠키로 서버에 다시 요청해서 이 문제를 피합니다.
 *
 * @param props Container Props
 * @returns 로그인 화면
 */
export function LoginContainer({ redirectTo = '/' }: LoginContainerProps) {
  const { email, password, isSubmitting, errorMessage, setEmail, setPassword, handleSubmit } = useLogin(() => {
    hardNavigate(redirectTo);
  });

  return (
    <LoginView
      viewModel={loginViewModel}
      email={email}
      password={password}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      onChangeEmail={setEmail}
      onChangePassword={setPassword}
      onSubmit={handleSubmit}
    />
  );
}
