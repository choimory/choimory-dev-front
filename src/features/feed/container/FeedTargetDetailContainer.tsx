import { FeedTargetDetailView } from '../components/FeedTargetDetailView';
import { feedViewModel, type FeedAuthStatus } from '../model/feedTypes';

/**
 * feed target 상세 Container Props입니다.
 */
type FeedTargetDetailContainerProps = {
  authStatus: FeedAuthStatus; // 화면 확인용 인증 상태
  targetId: string;           // target 고유 ID
};

/**
 * feed target 상세 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @param props Container Props
 * @returns feed target 상세 화면
 */
export function FeedTargetDetailContainer({ authStatus, targetId }: FeedTargetDetailContainerProps) {
  const target = feedViewModel.targets.find((item) => item.id === targetId) ?? feedViewModel.targets[0];

  return (
    <FeedTargetDetailView
      isLoggedIn={authStatus === 'member'}
      target={target}
    />
  );
}
