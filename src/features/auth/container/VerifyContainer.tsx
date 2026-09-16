'use client';

import { AppHeader } from '@/shared/ui/AppHeader';
import { ScreenLayout } from '@/shared/ui/ScreenLayout';

import { VerifyForm } from '../components/VerifyForm';
import { useVerify } from '../hooks/useVerify';

/**
 * 이메일 인증 화면의 데이터 흐름과 이벤트 흐름을 담당하는 Container입니다.
 *
 * @returns 이메일 인증 화면
 */
export function VerifyContainer() {
  const { email, code, displayError, timeLeft, isTimerRunning, setCode, handleSubmit, handleResend } =
    useVerify();

  return (
    <ScreenLayout>
      <AppHeader isCentered isLinked={false} />

      <main className="flex-1 flex items-center justify-center px-6">
        <VerifyForm
          email={email}
          code={code}
          error={displayError}
          timeLeft={timeLeft}
          isTimerRunning={isTimerRunning}
          onChangeCode={setCode}
          onSubmit={handleSubmit}
          onResend={handleResend}
        />
      </main>
    </ScreenLayout>
  );
}
