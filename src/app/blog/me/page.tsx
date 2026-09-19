import { BlogMenuContainer } from '@/features/blog/container/BlogMenuContainer';
import { getMockAuthStatus, type PageSearchParams } from '@/shared/model/mockAuth';

/**
 * 내 blog 화면 Props입니다.
 */
type BlogMePageProps = {
  searchParams: Promise<PageSearchParams>; // URL query
};

/**
 * 내 blog 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns 내 blog 화면
 */
export default async function BlogMePage({ searchParams }: BlogMePageProps) {
  const authStatus = getMockAuthStatus(await searchParams);

  return <BlogMenuContainer authStatus={authStatus} menuKind="me" />;
}
