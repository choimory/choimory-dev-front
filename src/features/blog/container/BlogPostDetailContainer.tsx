import { BlogPostDetailView } from '../components/BlogPostDetailView';
import { blogViewModel, type BlogAuthStatus } from '../model/blogTypes';

/**
 * blog 게시글 상세 Container Props입니다.
 */
type BlogPostDetailContainerProps = {
  authStatus: BlogAuthStatus; // 화면 확인용 인증 상태
  postId: string;             // 게시글 고유 ID
};

/**
 * blog 게시글 상세 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @param props Container Props
 * @returns blog 게시글 상세 화면
 */
export function BlogPostDetailContainer({ authStatus, postId }: BlogPostDetailContainerProps) {
  const post = blogViewModel.posts.find((item) => item.id === postId) ?? blogViewModel.posts[0];

  return (
    <BlogPostDetailView
      isLoggedIn={authStatus === 'member'}
      post={post}
    />
  );
}
