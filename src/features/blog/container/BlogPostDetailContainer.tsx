'use client';

import { useAuth } from '@/features/auth/context/AuthContext';

import { BlogPostDetailView } from '../components/BlogPostDetailView';
import { blogViewModel } from '../model/blogTypes';

/**
 * blog 게시글 상세 Container Props입니다.
 */
type BlogPostDetailContainerProps = {
  postId: string; // 게시글 고유 ID
};

/**
 * blog 게시글 상세 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @param props Container Props
 * @returns blog 게시글 상세 화면
 */
export function BlogPostDetailContainer({ postId }: BlogPostDetailContainerProps) {
  const { authStatus } = useAuth();

  const post = blogViewModel.posts.find((item) => item.id === postId) ?? blogViewModel.posts[0];

  return (
    <BlogPostDetailView
      isLoggedIn={authStatus === 'member'}
      post={post}
    />
  );
}
