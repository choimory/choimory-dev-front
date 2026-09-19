import { FeedActivityDetailContainer } from '@/features/feed/container/FeedActivityDetailContainer';
import { getMockAuthStatus, type PageSearchParams } from '@/shared/model/mockAuth';

/**
 * feed 알림 상세 화면 Props입니다.
 */
type FeedActivityDetailPageProps = {
  params: Promise<{ activityId: string }>;    // URL path params
  searchParams: Promise<PageSearchParams>;  // URL query
};

/**
 * feed 알림 상세 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns feed 알림 상세 화면
 */
export default async function FeedActivityDetailPage({ params, searchParams }: FeedActivityDetailPageProps) {
  const { activityId } = await params;
  const authStatus = getMockAuthStatus(await searchParams);

  return <FeedActivityDetailContainer activityId={activityId} authStatus={authStatus} />;
}
