'use client';

import { useAuth } from '@/features/auth/context/AuthContext';

import { BlogUserBlogView } from '../components/BlogUserBlogView';
import { blogViewModel } from '../model/blogTypes';

/**
 * 유저 blog 화면 Container Props입니다.
 */
type BlogUserBlogContainerProps = {
  nickname: string; // 표시할 유저 닉네임
};

/**
 * 유저 blog 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @param props Container Props
 * @returns 유저 blog 화면
 */
export function BlogUserBlogContainer({ nickname }: BlogUserBlogContainerProps) {
  const { authStatus } = useAuth();

  return (
    <BlogUserBlogView
      isLoggedIn={authStatus === 'member'}
      nickname={nickname}
      posts={blogViewModel.posts}
    />
  );
}
