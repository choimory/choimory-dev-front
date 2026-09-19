import { BlogMenuContainer } from '@/features/blog/container/BlogMenuContainer';
import { getMockAuthStatus, type PageSearchParams } from '@/shared/model/mockAuth';

/**
 * blog 인기 글 화면 Props입니다.
 */
type BlogPopularPageProps = {
  searchParams: Promise<PageSearchParams>; // URL query
};

/**
 * blog 인기 글 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns blog 인기 글 화면
 */
export default async function BlogPopularPage({ searchParams }: BlogPopularPageProps) {
  const authStatus = getMockAuthStatus(await searchParams);

  return <BlogMenuContainer authStatus={authStatus} menuKind="popular" />;
}
