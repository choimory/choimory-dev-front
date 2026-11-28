import { FeedTargetSettingsContainer } from '@/features/feed/container/FeedTargetSettingsContainer';

/**
 * feed target 설정 화면 Props입니다.
 */
type FeedTargetSettingsPageProps = {
  params: Promise<{ targetId: string }>; // URL path params
};

/**
 * feed target 설정 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns feed target 설정 화면
 */
export default async function FeedTargetSettingsPage({ params }: FeedTargetSettingsPageProps) {
  const { targetId } = await params;

  return <FeedTargetSettingsContainer targetId={targetId} />;
}
