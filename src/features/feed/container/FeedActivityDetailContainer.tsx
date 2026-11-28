'use client';

import { RequireAuth } from '@/features/auth/components/RequireAuth';
import { useAuth } from '@/features/auth/context/AuthContext';

import { FeedActivityDetailView } from '../components/FeedActivityDetailView';
import { feedViewModel } from '../model/feedTypes';

/**
 * feed 알림 상세 Container Props입니다.
 */
type FeedActivityDetailContainerProps = {
  activityId: string;          // 알림 고유 ID
};

/**
 * feed 알림 상세 화면의 데이터 흐름을 담당하는 Container입니다.
 * 로그인한 사용자에게만 보여주고, 비로그인이면 로그인 화면으로 이동합니다.
 *
 * @param props Container Props
 * @returns feed 알림 상세 화면
 */
export function FeedActivityDetailContainer({ activityId }: FeedActivityDetailContainerProps) {
  const { authStatus } = useAuth();
  const activity = feedViewModel.activities.find((item) => item.id === activityId) ?? feedViewModel.activities[0];

  return (
    <RequireAuth>
      <FeedActivityDetailView
        activity={activity}
        isLoggedIn={authStatus === 'member'}
      />
    </RequireAuth>
  );
}
