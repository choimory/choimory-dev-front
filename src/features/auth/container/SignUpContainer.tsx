'use client';

import { AppHeader } from '@/shared/ui/AppHeader';
import { ScreenLayout } from '@/shared/ui/ScreenLayout';

import { SignUpForm } from '../components/SignUpForm';
import { useSignUp } from '../hooks/useSignUp';

/**
 * 회원가입 화면의 데이터 흐름과 이벤트 흐름을 담당하는 Container입니다.
 *
 * @returns 회원가입 화면
 */
export function SignUpContainer() {
  const {
    email,
    nickname,
    password,
    confirmPassword,
    error,
    setPassword,
    setConfirmPassword,
    handleChangeEmail,
    handleChangeNickname,
    handleCheckEmail,
    handleCheckNickname,
    handleSubmit,
  } = useSignUp();

  return (
    <ScreenLayout>
      <AppHeader isCentered isLinked={false} />

      <main className="flex-1 flex items-center justify-center px-6">
        <SignUpForm
          email={email}
          nickname={nickname}
          password={password}
          confirmPassword={confirmPassword}
          error={error}
          onChangeEmail={handleChangeEmail}
          onChangeNickname={handleChangeNickname}
          onChangePassword={setPassword}
          onChangeConfirmPassword={setConfirmPassword}
          onCheckEmail={handleCheckEmail}
          onCheckNickname={handleCheckNickname}
          onSubmit={handleSubmit}
        />
      </main>
    </ScreenLayout>
  );
}
