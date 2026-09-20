import { FeedTargetDetailContainer } from '@/features/feed/container/FeedTargetDetailContainer';
import { getMockAuthStatus, type PageSearchParams } from '@/shared/model/mockAuth';

/**
 * feed target 상세 화면 Props입니다.
 */
type FeedTargetDetailPageProps = {
  params: Promise<{ targetId: string }>;   // URL path params
  searchParams: Promise<PageSearchParams>; // URL query
};

/**
 * feed target 상세 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns feed target 상세 화면
 */
export default async function FeedTargetDetailPage({ params, searchParams }: FeedTargetDetailPageProps) {
  const { targetId } = await params;
  const authStatus = getMockAuthStatus(await searchParams);

  return <FeedTargetDetailContainer authStatus={authStatus} targetId={targetId} />;
}
