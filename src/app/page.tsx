import { PlatformHomeContainer } from '@/features/platform/container/PlatformHomeContainer';

/**
 * 서비스 루트 화면입니다.
 *
 * 여러 하위 서비스로 진입하는 플랫폼 홈 화면을 표시합니다.
 *
 * @returns 진입 화면
 */
export default function RootPage() {
  return <PlatformHomeContainer />;
}
