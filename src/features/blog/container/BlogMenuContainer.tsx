'use client';

import { RequireAuth } from '@/features/auth/components/RequireAuth';
import { useAuth } from '@/features/auth/context/AuthContext';

import { BlogMenuView } from '../components/BlogMenuView';
import { blogViewModel, type BlogMenuKind } from '../model/blogTypes';

/**
 * blog 메뉴 Container Props입니다.
 */
type BlogMenuContainerProps = {
  menuKind: BlogMenuKind; // 표시할 blog 메뉴 종류
};

/**
 * blog 메뉴 화면의 데이터 흐름을 담당하는 Container입니다.
 * 팔로잉 메뉴는 로그인한 사용자에게만 보여주고, 비로그인이면 로그인 화면으로 이동합니다.
 *
 * @param props Container Props
 * @returns blog 메뉴 화면
 */
export function BlogMenuContainer({ menuKind }: BlogMenuContainerProps) {
  const { authStatus } = useAuth();

  const view = (
    <BlogMenuView
      menuKind={menuKind}
      viewModel={{
        ...blogViewModel,
        authStatus,
      }}
    />
  );

  return menuKind === 'following' ? <RequireAuth>{view}</RequireAuth> : view;
}
