import { BlogView } from '../components/BlogView';
import { blogViewModel, type BlogAuthStatus } from '../model/blogTypes';

/**
 * blog Container Props입니다.
 */
type BlogContainerProps = {
  authStatus: BlogAuthStatus; // 화면 확인용 인증 상태
};

/**
 * blog 서비스 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @param props Container Props
 * @returns blog 서비스 화면
 */
export function BlogContainer({ authStatus }: BlogContainerProps) {
  return (
    <BlogView
      viewModel={{
        ...blogViewModel,
        authStatus,
      }}
    />
  );
}
