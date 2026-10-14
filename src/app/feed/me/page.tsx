import { FeedMenuContainer } from '@/features/feed/container/FeedMenuContainer';
import { getMockAuthStatus, type PageSearchParams } from '@/shared/model/mockAuth';

/**
 * 내 feed 화면 Props입니다.
 */
type FeedMePageProps = {
  searchParams: Promise<PageSearchParams>; // URL query
};

/**
 * 내 feed 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns 내 feed 화면
 */
export default async function FeedMePage({ searchParams }: FeedMePageProps) {
  const authStatus = getMockAuthStatus(await searchParams);

  return <FeedMenuContainer authStatus={authStatus} menuKind="me" />;
}
