import { PlatformNoticeContainer } from '@/features/platform/container/PlatformNoticeContainer';
import { getMockAuthStatus, type PageSearchParams } from '@/shared/model/mockAuth';

/**
 * 플랫폼 공지사항 화면 Props입니다.
 */
type NoticePageProps = {
  searchParams: Promise<PageSearchParams>; // URL query
};

/**
 * 플랫폼 공지사항 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns 플랫폼 공지사항 화면
 */
export default async function NoticePage({ searchParams }: NoticePageProps) {
  const authStatus = getMockAuthStatus(await searchParams);

  return <PlatformNoticeContainer authStatus={authStatus} />;
}
