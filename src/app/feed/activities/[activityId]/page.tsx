import { FeedActivityDetailContainer } from '@/features/feed/container/FeedActivityDetailContainer';

/**
 * feed 알림 상세 화면 Props입니다.
 */
type FeedActivityDetailPageProps = {
  params: Promise<{ activityId: string }>; // URL path params
};

/**
 * feed 알림 상세 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns feed 알림 상세 화면
 */
export default async function FeedActivityDetailPage({ params }: FeedActivityDetailPageProps) {
  const { activityId } = await params;

  return <FeedActivityDetailContainer activityId={activityId} />;
}
