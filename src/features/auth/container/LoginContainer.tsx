'use client';

import { useRouter } from 'next/navigation';

import { LoginView } from '../components/LoginView';
import { useLogin } from '../hooks/useLogin';
import { loginViewModel } from '../model/authTypes';

/**
 * 로그인 화면의 데이터 흐름을 담당하는 Container입니다.
 * 로그인에 성공하면 홈으로 이동합니다.
 *
 * @returns 로그인 화면
 */
export function LoginContainer() {
  const router = useRouter();
  const { email, password, isSubmitting, errorMessage, setEmail, setPassword, handleSubmit } = useLogin(() => {
    router.push('/');
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
