import { BlogUserBlogContainer } from '@/features/blog/container/BlogUserBlogContainer';
import { getMockAuthStatus, type PageSearchParams } from '@/shared/model/mockAuth';

/**
 * 유저 blog 화면 Props입니다.
 */
type BlogUserPageProps = {
  params: Promise<{ nickname: string }>;    // URL path params
  searchParams: Promise<PageSearchParams>; // URL query
};

/**
 * 유저 blog 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns 유저 blog 화면
 */
export default async function BlogUserPage({ params, searchParams }: BlogUserPageProps) {
  const { nickname } = await params;
  const authStatus = getMockAuthStatus(await searchParams);

  return <BlogUserBlogContainer authStatus={authStatus} nickname={decodeURIComponent(nickname)} />;
}
