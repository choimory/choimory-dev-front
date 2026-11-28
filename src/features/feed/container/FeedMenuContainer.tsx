'use client';

import { RequireAuth } from '@/features/auth/components/RequireAuth';
import { useAuth } from '@/features/auth/context/AuthContext';

import { FeedMenuView } from '../components/FeedMenuView';
import { feedViewModel, type FeedMenuKind } from '../model/feedTypes';

/**
 * feed 메뉴 Container Props입니다.
 */
type FeedMenuContainerProps = {
  menuKind: FeedMenuKind;     // 표시할 feed 메뉴 종류
};

/**
 * feed 메뉴 화면의 데이터 흐름을 담당하는 Container입니다.
 * 내 feed(`me`)와 관찰(`observations`) 메뉴는 로그인한 사용자에게만 보여주고, 비로그인이면 로그인 화면으로 이동합니다.
 *
 * @param props Container Props
 * @returns feed 메뉴 화면
 */
export function FeedMenuContainer({ menuKind }: FeedMenuContainerProps) {
  const { authStatus } = useAuth();

  const view = (
    <FeedMenuView
      menuKind={menuKind}
      viewModel={{
        ...feedViewModel,
        authStatus,
      }}
    />
  );

  return menuKind === 'me' || menuKind === 'observations' ? <RequireAuth>{view}</RequireAuth> : view;
}
