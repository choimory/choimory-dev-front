import { BlogMeSettingsContainer } from '@/features/blog/container/BlogMeSettingsContainer';
import { getMockAuthStatus, type PageSearchParams } from '@/shared/model/mockAuth';

/**
 * 내 blog 설정/관리 화면 Props입니다.
 */
type BlogMePageProps = {
  searchParams: Promise<PageSearchParams>; // URL query
};

/**
 * 내 blog 설정/관리 화면의 라우팅 진입점입니다.
 *
 * @param props 화면 Props
 * @returns 내 blog 설정/관리 화면
 */
export default async function BlogMePage({ searchParams }: BlogMePageProps) {
  const authStatus = getMockAuthStatus(await searchParams);

  return <BlogMeSettingsContainer authStatus={authStatus} />;
}
