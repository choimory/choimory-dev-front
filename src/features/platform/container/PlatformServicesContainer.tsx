'use client';

import { useAuth } from '@/features/auth/context/AuthContext';

import { PlatformServicesView } from '../components/PlatformServicesView';
import { platformHomeViewModel } from '../model/platformHomeTypes';

/**
 * 플랫폼 서비스 메뉴 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @returns 플랫폼 서비스 메뉴 화면
 */
export function PlatformServicesContainer() {
  const { isLoggedIn } = useAuth();

  return (
    <PlatformServicesView
      isLoggedIn={isLoggedIn}
      services={platformHomeViewModel.services}
    />
  );
}
