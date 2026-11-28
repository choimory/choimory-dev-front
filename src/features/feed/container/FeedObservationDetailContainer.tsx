'use client';

import { RequireAuth } from '@/features/auth/components/RequireAuth';
import { useAuth } from '@/features/auth/context/AuthContext';

import { FeedObservationDetailView } from '../components/FeedObservationDetailView';
import { feedViewModel } from '../model/feedTypes';

/**
 * feed 관찰 상세 Container Props입니다.
 */
type FeedObservationDetailContainerProps = {
  observationId: string;      // 관찰 항목 고유 ID
};

/**
 * feed 관찰 상세 화면의 데이터 흐름을 담당하는 Container입니다.
 * 로그인한 사용자에게만 보여주고, 비로그인이면 로그인 화면으로 이동합니다.
 *
 * @param props Container Props
 * @returns feed 관찰 상세 화면
 */
export function FeedObservationDetailContainer({ observationId }: FeedObservationDetailContainerProps) {
  const { authStatus } = useAuth();
  const observation = feedViewModel.observations.find((item) => item.id === observationId) ?? feedViewModel.observations[0];

  return (
    <RequireAuth>
      <FeedObservationDetailView
        isLoggedIn={authStatus === 'member'}
        observation={observation}
      />
    </RequireAuth>
  );
}
