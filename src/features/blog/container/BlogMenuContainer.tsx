import { BlogMenuView } from '../components/BlogMenuView';
import { blogViewModel, type BlogAuthStatus, type BlogMenuKind } from '../model/blogTypes';

/**
 * blog 메뉴 Container Props입니다.
 */
type BlogMenuContainerProps = {
  authStatus: BlogAuthStatus; // 화면 확인용 인증 상태
  menuKind: BlogMenuKind;     // 표시할 blog 메뉴 종류
};

/**
 * blog 메뉴 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @param props Container Props
 * @returns blog 메뉴 화면
 */
export function BlogMenuContainer({ authStatus, menuKind }: BlogMenuContainerProps) {
  return (
    <BlogMenuView
      menuKind={menuKind}
      viewModel={{
        ...blogViewModel,
        authStatus,
      }}
    />
  );
}
