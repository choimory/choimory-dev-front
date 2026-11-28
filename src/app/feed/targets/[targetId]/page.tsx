import { FeedTargetDetailContainer } from '@/features/feed/container/FeedTargetDetailContainer';

/**
 * feed target 상세 화면 Props입니다.
 */
type FeedTargetDetailPageProps = {
  params: Promise<{ targetId: string }>; // URL path params
};

/**
 * feed target 상세 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns feed target 상세 화면
 */
export default async function FeedTargetDetailPage({ params }: FeedTargetDetailPageProps) {
  const { targetId } = await params;

  return <FeedTargetDetailContainer targetId={targetId} />;
}
