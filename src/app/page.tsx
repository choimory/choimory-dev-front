import { PlatformHomeContainer } from '@/features/platform/container/PlatformHomeContainer';
import { getMockAuthStatus, type PageSearchParams } from '@/shared/model/mockAuth';

/**
 * 서비스 루트 화면 Props입니다.
 */
type RootPageProps = {
  searchParams: Promise<PageSearchParams>; // URL query
};

/**
 * 서비스 루트 화면입니다.
 *
 * 여러 하위 서비스로 진입하는 플랫폼 홈 화면을 표시합니다.
 *
 * @param props 화면 Props
 * @returns 진입 화면
 */
export default async function RootPage({ searchParams }: RootPageProps) {
  const authStatus = getMockAuthStatus(await searchParams);

  return <PlatformHomeContainer authStatus={authStatus} />;
}
