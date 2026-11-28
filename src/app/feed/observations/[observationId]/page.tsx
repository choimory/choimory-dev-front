import { FeedObservationDetailContainer } from '@/features/feed/container/FeedObservationDetailContainer';

/**
 * feed 관찰 상세 화면 Props입니다.
 */
type FeedObservationDetailPageProps = {
  params: Promise<{ observationId: string }>; // URL path params
};

/**
 * feed 관찰 상세 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns feed 관찰 상세 화면
 */
export default async function FeedObservationDetailPage({ params }: FeedObservationDetailPageProps) {
  const { observationId } = await params;

  return <FeedObservationDetailContainer observationId={observationId} />;
}
