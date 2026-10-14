import { BlogUserBlogView } from '../components/BlogUserBlogView';
import { blogViewModel, type BlogAuthStatus } from '../model/blogTypes';

/**
 * 유저 blog 화면 Container Props입니다.
 */
type BlogUserBlogContainerProps = {
  authStatus: BlogAuthStatus; // 화면 확인용 인증 상태
  nickname: string;           // 표시할 유저 닉네임
};

/**
 * 유저 blog 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @param props Container Props
 * @returns 유저 blog 화면
 */
export function BlogUserBlogContainer({ authStatus, nickname }: BlogUserBlogContainerProps) {
  return (
    <BlogUserBlogView
      isLoggedIn={authStatus === 'member'}
      nickname={nickname}
      posts={blogViewModel.posts}
    />
  );
}
