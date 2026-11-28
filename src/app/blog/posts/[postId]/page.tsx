import { BlogPostDetailContainer } from '@/features/blog/container/BlogPostDetailContainer';

/**
 * blog 게시글 상세 화면 Props입니다.
 */
type BlogPostDetailPageProps = {
  params: Promise<{ postId: string }>; // URL path params
};

/**
 * blog 게시글 상세 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns blog 게시글 상세 화면
 */
export default async function BlogPostDetailPage({ params }: BlogPostDetailPageProps) {
  const { postId } = await params;

  return <BlogPostDetailContainer postId={postId} />;
}
