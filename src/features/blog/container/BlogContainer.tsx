import { BlogView } from '../components/BlogView';
import { blogViewModel } from '../model/blogTypes';

/**
 * blog 서비스 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @returns blog 서비스 화면
 */
export function BlogContainer() {
  return <BlogView viewModel={blogViewModel} />;
}
