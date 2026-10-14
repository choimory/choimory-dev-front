import { FeedTargetSettingsContainer } from '@/features/feed/container/FeedTargetSettingsContainer';
import { getMockAuthStatus, type PageSearchParams } from '@/shared/model/mockAuth';

/**
 * feed target 설정 화면 Props입니다.
 */
type FeedTargetSettingsPageProps = {
  params: Promise<{ targetId: string }>;   // URL path params
  searchParams: Promise<PageSearchParams>; // URL query
};

/**
 * feed target 설정 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns feed target 설정 화면
 */
export default async function FeedTargetSettingsPage({ params, searchParams }: FeedTargetSettingsPageProps) {
  const { targetId } = await params;
  const authStatus = getMockAuthStatus(await searchParams);

  return <FeedTargetSettingsContainer authStatus={authStatus} targetId={targetId} />;
}
