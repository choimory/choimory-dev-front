import { Suspense } from 'react';

import { WelcomeContainer } from '@/features/auth/container/WelcomeContainer';

/**
 * 회원가입 완료 화면의 라우팅 진입점입니다.
 *
 * Container가 쿼리 파라미터를 사용하므로 Suspense 경계로 감쌉니다.
 *
 * @returns 회원가입 완료 화면
 */
export default function WelcomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WelcomeContainer />
    </Suspense>
  );
}
