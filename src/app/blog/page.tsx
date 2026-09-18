import { BlogContainer } from '@/features/blog/container/BlogContainer';
import { getMockAuthStatus, type PageSearchParams } from '@/shared/model/mockAuth';

/**
 * blog 서비스 화면 Props입니다.
 */
type BlogPageProps = {
  searchParams: Promise<PageSearchParams>; // URL query
};

/**
 * blog 서비스 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns blog 서비스 화면
 */
export default async function BlogPage({ searchParams }: BlogPageProps) {
  const authStatus = getMockAuthStatus(await searchParams);

  return <BlogContainer authStatus={authStatus} />;
}
