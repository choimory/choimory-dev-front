import { FeedMenuContainer } from '@/features/feed/container/FeedMenuContainer';
import { getMockAuthStatus, type PageSearchParams } from '@/shared/model/mockAuth';

/**
 * feed 관찰 목록 화면 Props입니다.
 */
type FeedObservationsPageProps = {
  searchParams: Promise<PageSearchParams>; // URL query
};

/**
 * feed 관찰 목록 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns feed 관찰 목록 화면
 */
export default async function FeedObservationsPage({ searchParams }: FeedObservationsPageProps) {
  const authStatus = getMockAuthStatus(await searchParams);

  return <FeedMenuContainer authStatus={authStatus} menuKind="observations" />;
}
