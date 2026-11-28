'use client';

import { RequireAuth } from '@/features/auth/components/RequireAuth';
import { useAuth } from '@/features/auth/context/AuthContext';

import { BlogMeSettingsView } from '../components/BlogMeSettingsView';

/**
 * 내 blog 설정/관리 화면의 데이터 흐름을 담당하는 Container입니다.
 * 로그인한 사용자에게만 보여주고, 비로그인이면 로그인 화면으로 이동합니다.
 *
 * @returns 내 blog 설정/관리 화면
 */
export function BlogMeSettingsContainer() {
  const { isLoggedIn } = useAuth();

  return (
    <RequireAuth>
      <BlogMeSettingsView isLoggedIn={isLoggedIn} />
    </RequireAuth>
  );
}
