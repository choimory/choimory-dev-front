import { FeedMenuContainer } from '@/features/feed/container/FeedMenuContainer';
import { getMockAuthStatus, type PageSearchParams } from '@/shared/model/mockAuth';

/**
 * feed 인기 화면 Props입니다.
 */
type FeedPopularPageProps = {
  searchParams: Promise<PageSearchParams>; // URL query
};

/**
 * feed 인기 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns feed 인기 화면
 */
export default async function FeedPopularPage({ searchParams }: FeedPopularPageProps) {
  const authStatus = getMockAuthStatus(await searchParams);

  return <FeedMenuContainer authStatus={authStatus} menuKind="popular" />;
}
