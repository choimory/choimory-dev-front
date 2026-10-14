import { BlogMenuContainer } from '@/features/blog/container/BlogMenuContainer';
import { getMockAuthStatus, type PageSearchParams } from '@/shared/model/mockAuth';

/**
 * blog 팔로잉 피드 화면 Props입니다.
 */
type BlogFollowingPageProps = {
  searchParams: Promise<PageSearchParams>; // URL query
};

/**
 * blog 팔로잉 피드 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns blog 팔로잉 피드 화면
 */
export default async function BlogFollowingPage({ searchParams }: BlogFollowingPageProps) {
  const authStatus = getMockAuthStatus(await searchParams);

  return <BlogMenuContainer authStatus={authStatus} menuKind="following" />;
}
