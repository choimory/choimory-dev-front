import { LoginContainer } from '@/features/auth/container/LoginContainer';
import { sanitizeNextPath } from '@/shared/auth/redirect';

/**
 * 로그인 화면 Props입니다.
 */
type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>; // URL query (로그인 후 이동할 경로)
};

/**
 * 로그인 화면의 라우팅 진입점입니다.
 * 로그인 후 이동할 경로(`next`)는 오픈 리다이렉트를 막기 위해 서버에서 같은 사이트의 내부 경로만 허용해 넘깁니다.
 *
 * @param props 화면 Props
 * @returns 로그인 화면
 */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return <LoginContainer redirectTo={sanitizeNextPath(next)} />;
}
