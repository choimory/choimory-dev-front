import { PlatformServicesContainer } from '@/features/platform/container/PlatformServicesContainer';
import { getMockAuthStatus, type PageSearchParams } from '@/shared/model/mockAuth';

/**
 * 플랫폼 서비스 메뉴 화면 Props입니다.
 */
type ServicesPageProps = {
  searchParams: Promise<PageSearchParams>; // URL query
};

/**
 * 플랫폼 서비스 메뉴 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns 플랫폼 서비스 메뉴 화면
 */
export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const authStatus = getMockAuthStatus(await searchParams);

  return <PlatformServicesContainer authStatus={authStatus} />;
}
