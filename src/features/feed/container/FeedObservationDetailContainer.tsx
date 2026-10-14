import { FeedObservationDetailView } from '../components/FeedObservationDetailView';
import { feedViewModel, type FeedAuthStatus } from '../model/feedTypes';

/**
 * feed 관찰 상세 Container Props입니다.
 */
type FeedObservationDetailContainerProps = {
  authStatus: FeedAuthStatus; // 화면 확인용 인증 상태
  observationId: string;      // 관찰 항목 고유 ID
};

/**
 * feed 관찰 상세 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @param props Container Props
 * @returns feed 관찰 상세 화면
 */
export function FeedObservationDetailContainer({ authStatus, observationId }: FeedObservationDetailContainerProps) {
  const observation = feedViewModel.observations.find((item) => item.id === observationId) ?? feedViewModel.observations[0];

  return (
    <FeedObservationDetailView
      isLoggedIn={authStatus === 'member'}
      observation={observation}
    />
  );
}
