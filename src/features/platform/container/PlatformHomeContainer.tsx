import { PlatformHomeView } from '../components/PlatformHomeView';
import { platformHomeViewModel, type PlatformAuthStatus } from '../model/platformHomeTypes';

/**
 * 플랫폼 홈 Container Props입니다.
 */
type PlatformHomeContainerProps = {
  authStatus: PlatformAuthStatus; // 화면 확인용 인증 상태
};

/**
 * 플랫폼 홈 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @param props Container Props
 * @returns 플랫폼 홈 화면
 */
export function PlatformHomeContainer({ authStatus }: PlatformHomeContainerProps) {
  return (
    <PlatformHomeView
      viewModel={{
        ...platformHomeViewModel,
        authStatus,
      }}
    />
  );
}
