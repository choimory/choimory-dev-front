'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ScreenLayout } from '@/shared/ui/ScreenLayout';

import { useAuthSession } from '../hooks/useAuthSession';

/**
 * 진입 시 로그인 여부를 확인하여 화면을 분기하는 Container입니다.
 *
 * 로그인 상태이면 홈 화면으로, 아니면 로그인 화면으로 이동합니다.
 *
 * @returns 세션 확인 중 표시할 화면
 */
export function RootGateContainer() {
  const router = useRouter();
  const { status } = useAuthSession();

  useEffect(() => {
    // 세션 확인이 끝나기 전에는 이동하지 않는다.
    if (status === 'loading') {
      return;
    }

    router.push(status === 'authenticated' ? '/home' : '/login');
  }, [status, router]);

  return (
    <ScreenLayout>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">로딩 중...</p>
        </div>
      </div>
    </ScreenLayout>
  );
}
