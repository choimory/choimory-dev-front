'use client';

import { RequireAuth } from '@/features/auth/components/RequireAuth';
import { useAuth } from '@/features/auth/context/AuthContext';

import { FeedTargetSettingsView } from '../components/FeedTargetSettingsView';
import { feedViewModel } from '../model/feedTypes';

/**
 * feed target 설정 Container Props입니다.
 */
type FeedTargetSettingsContainerProps = {
  targetId: string;           // target 고유 ID
};

/**
 * feed target 설정 화면의 데이터 흐름을 담당하는 Container입니다.
 * 로그인한 사용자에게만 보여주고, 비로그인이면 로그인 화면으로 이동합니다.
 *
 * @param props Container Props
 * @returns feed target 설정 화면
 */
export function FeedTargetSettingsContainer({ targetId }: FeedTargetSettingsContainerProps) {
  const { authStatus } = useAuth();
  const target = feedViewModel.targets.find((item) => item.id === targetId) ?? feedViewModel.targets[0];

  return (
    <RequireAuth>
      <FeedTargetSettingsView
        isLoggedIn={authStatus === 'member'}
        target={target}
      />
    </RequireAuth>
  );
}
