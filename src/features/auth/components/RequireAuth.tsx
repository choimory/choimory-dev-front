'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { buildLoginHref } from '@/shared/auth/redirect';

import { useAuth } from '../context/AuthContext';

/**
 * 로그인 가드 컴포넌트의 Props
 */
type RequireAuthProps = {
  children: ReactNode; // 로그인한 사용자에게만 보여줄 화면
};

/**
 * 로그인한 사용자에게만 화면을 보여주는 가드입니다.
 * 로그인 상태를 복원하는 동안에는 이동하지 않고 아무것도 보여주지 않으며,
 * 비로그인으로 확정되면 로그인 후 현재 경로로 돌아오도록 로그인 화면으로 이동합니다.
 * 화면 접근을 막는 UX용 가드이므로 실제 데이터 보호는 API의 토큰 검증이 맡습니다.
 *
 * @param props 컴포넌트 Props
 * @returns 로그인한 사용자의 화면 또는 null
 */
export function RequireAuth({ children }: RequireAuthProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useAuth();

  useEffect(() => {
    if (state === 'guest') {
      router.replace(buildLoginHref(pathname ?? '/'));
    }
  }, [state, router, pathname]);

  if (state !== 'member') {
    return null;
  }

  return <>{children}</>;
}
