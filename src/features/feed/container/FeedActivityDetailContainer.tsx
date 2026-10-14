import { FeedActivityDetailView } from '../components/FeedActivityDetailView';
import { feedViewModel, type FeedAuthStatus } from '../model/feedTypes';

/**
 * feed 알림 상세 Container Props입니다.
 */
type FeedActivityDetailContainerProps = {
  activityId: string;          // 알림 고유 ID
  authStatus: FeedAuthStatus; // 화면 확인용 인증 상태
};

/**
 * feed 알림 상세 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @param props Container Props
 * @returns feed 알림 상세 화면
 */
export function FeedActivityDetailContainer({ activityId, authStatus }: FeedActivityDetailContainerProps) {
  const activity = feedViewModel.activities.find((item) => item.id === activityId) ?? feedViewModel.activities[0];

  return (
    <FeedActivityDetailView
      activity={activity}
      isLoggedIn={authStatus === 'member'}
    />
  );
}
