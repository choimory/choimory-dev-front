'use client';

import { AppHeader } from '@/shared/ui/AppHeader';
import { ScreenLayout } from '@/shared/ui/ScreenLayout';

import { LoginForm } from '../components/LoginForm';
import { useLogin } from '../hooks/useLogin';

/**
 * 로그인 화면의 데이터 흐름과 이벤트 흐름을 담당하는 Container입니다.
 *
 * @returns 로그인 화면
 */
export function LoginContainer() {
  const { id, password, isSubmitting, setId, setPassword, handleSubmit } = useLogin();

  return (
    <ScreenLayout>
      <AppHeader />

      <main className="flex-1 flex items-center justify-center px-6">
        <LoginForm
          id={id}
          password={password}
          isSubmitting={isSubmitting}
          onChangeId={setId}
          onChangePassword={setPassword}
          onSubmit={handleSubmit}
        />
      </main>
    </ScreenLayout>
  );
}
