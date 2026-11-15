'use client';

import { useRouter } from 'next/navigation';

import { SignupView } from '../components/SignupView';
import { useSignup } from '../hooks/useSignup';
import { signupViewModel } from '../model/authTypes';

/**
 * 회원가입 화면의 데이터 흐름을 담당하는 Container입니다.
 * 회원가입에 성공하면 로그인 화면으로 이동합니다.
 *
 * @returns 회원가입 화면
 */
export function SignupContainer() {
  const router = useRouter();
  const { values, fieldErrors, formError, isSubmitting, handleChange, handleSubmit } = useSignup(() => {
    router.push('/login');
  });

  return (
    <SignupView
      viewModel={signupViewModel}
      values={values}
      fieldErrors={fieldErrors}
      formError={formError}
      isSubmitting={isSubmitting}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
