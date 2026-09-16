import { Suspense } from 'react';

import { VerifyContainer } from '@/features/auth/container/VerifyContainer';

/**
 * 이메일 인증 화면의 라우팅 진입점입니다.
 *
 * Container가 쿼리 파라미터를 사용하므로 Suspense 경계로 감쌉니다.
 *
 * @returns 이메일 인증 화면
 */
export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContainer />
    </Suspense>
  );
}
