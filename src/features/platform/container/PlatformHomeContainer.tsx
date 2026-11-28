'use client';

import { useAuth } from '@/features/auth/context/AuthContext';

import { PlatformHomeView } from '../components/PlatformHomeView';
import { platformHomeViewModel } from '../model/platformHomeTypes';

/**
 * 플랫폼 홈 화면의 데이터 흐름을 담당하는 Container입니다.
 * 실제 로그인 상태에 따라 비회원 랜딩과 내 서비스 피드를 구분합니다.
 *
 * @returns 플랫폼 홈 화면
 */
export function PlatformHomeContainer() {
  const { authStatus } = useAuth();

  return (
    <PlatformHomeView
      viewModel={{
        ...platformHomeViewModel,
        authStatus,
      }}
    />
  );
}
