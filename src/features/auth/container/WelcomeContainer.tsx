'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { WelcomeMessage } from '../components/WelcomeMessage';

/**
 * 회원가입 완료 화면의 데이터 흐름과 이벤트 흐름을 담당하는 Container입니다.
 *
 * @returns 회원가입 완료 화면
 */
export function WelcomeContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 회원가입 단계에서 전달된 닉네임을 쿼리 파라미터에서 조회한다.
  const nickname = searchParams.get('nickname') ?? '';

  /**
   * 로그인 화면으로 이동합니다.
   */
  const handleMoveToLogin = () => {
    router.push('/login');
  };

  return <WelcomeMessage nickname={nickname} onMoveToLogin={handleMoveToLogin} />;
}
