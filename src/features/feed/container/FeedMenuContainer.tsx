import { FeedMenuView } from '../components/FeedMenuView';
import { feedViewModel, type FeedAuthStatus, type FeedMenuKind } from '../model/feedTypes';

/**
 * feed 메뉴 Container Props입니다.
 */
type FeedMenuContainerProps = {
  authStatus: FeedAuthStatus; // 화면 확인용 인증 상태
  menuKind: FeedMenuKind;     // 표시할 feed 메뉴 종류
};

/**
 * feed 메뉴 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @param props Container Props
 * @returns feed 메뉴 화면
 */
export function FeedMenuContainer({ authStatus, menuKind }: FeedMenuContainerProps) {
  return (
    <FeedMenuView
      menuKind={menuKind}
      viewModel={{
        ...feedViewModel,
        authStatus,
      }}
    />
  );
}
