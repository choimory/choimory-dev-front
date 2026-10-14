import { FeedView } from '../components/FeedView';
import { feedViewModel, type FeedAuthStatus } from '../model/feedTypes';

/**
 * feed Container Props입니다.
 */
type FeedContainerProps = {
  authStatus: FeedAuthStatus; // 화면 확인용 인증 상태
};

/**
 * feed 서비스 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @param props Container Props
 * @returns feed 서비스 화면
 */
export function FeedContainer({ authStatus }: FeedContainerProps) {
  return (
    <FeedView
      viewModel={{
        ...feedViewModel,
        authStatus,
      }}
    />
  );
}
