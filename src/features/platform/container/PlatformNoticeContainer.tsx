'use client';

import { useAuth } from '@/features/auth/context/AuthContext';

import { PlatformNoticeView } from '../components/PlatformNoticeView';

/**
 * 플랫폼 공지사항 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @returns 플랫폼 공지사항 화면
 */
export function PlatformNoticeContainer() {
  const { isLoggedIn } = useAuth();

  return <PlatformNoticeView isLoggedIn={isLoggedIn} />;
}
