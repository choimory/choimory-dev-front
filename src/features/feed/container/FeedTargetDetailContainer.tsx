'use client';

import { useAuth } from '@/features/auth/context/AuthContext';

import { FeedTargetDetailView } from '../components/FeedTargetDetailView';
import { feedViewModel } from '../model/feedTypes';

/**
 * feed target 상세 Container Props입니다.
 */
type FeedTargetDetailContainerProps = {
  targetId: string;           // target 고유 ID
};

/**
 * feed target 상세 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @param props Container Props
 * @returns feed target 상세 화면
 */
export function FeedTargetDetailContainer({ targetId }: FeedTargetDetailContainerProps) {
  const { authStatus } = useAuth();
  const target = feedViewModel.targets.find((item) => item.id === targetId) ?? feedViewModel.targets[0];

  return (
    <FeedTargetDetailView
      isLoggedIn={authStatus === 'member'}
      target={target}
    />
  );
}
