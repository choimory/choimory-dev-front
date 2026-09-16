import { RootGateContainer } from '@/features/auth/container/RootGateContainer';

/**
 * 서비스 진입점입니다.
 *
 * 로그인 여부에 따라 홈 화면 또는 로그인 화면으로 이동시킵니다.
 *
 * @returns 진입 화면
 */
export default function RootPage() {
  return <RootGateContainer />;
}
