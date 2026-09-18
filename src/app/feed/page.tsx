import { FeedContainer } from '@/features/feed/container/FeedContainer';
import { getMockAuthStatus, type PageSearchParams } from '@/shared/model/mockAuth';

/**
 * feed 서비스 화면 Props입니다.
 */
type FeedPageProps = {
  searchParams: Promise<PageSearchParams>; // URL query
};

/**
 * feed 서비스 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns feed 서비스 화면
 */
export default async function FeedPage({ searchParams }: FeedPageProps) {
  const authStatus = getMockAuthStatus(await searchParams);

  return <FeedContainer authStatus={authStatus} />;
}
