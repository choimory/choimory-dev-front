import { FeedObservationDetailContainer } from '@/features/feed/container/FeedObservationDetailContainer';
import { getMockAuthStatus, type PageSearchParams } from '@/shared/model/mockAuth';

/**
 * feed 관찰 상세 화면 Props입니다.
 */
type FeedObservationDetailPageProps = {
  params: Promise<{ observationId: string }>; // URL path params
  searchParams: Promise<PageSearchParams>;  // URL query
};

/**
 * feed 관찰 상세 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns feed 관찰 상세 화면
 */
export default async function FeedObservationDetailPage({ params, searchParams }: FeedObservationDetailPageProps) {
  const { observationId } = await params;
  const authStatus = getMockAuthStatus(await searchParams);

  return <FeedObservationDetailContainer authStatus={authStatus} observationId={observationId} />;
}
