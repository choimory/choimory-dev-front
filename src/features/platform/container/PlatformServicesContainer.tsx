import { PlatformServicesView } from '../components/PlatformServicesView';
import { platformHomeViewModel, type PlatformAuthStatus } from '../model/platformHomeTypes';

/**
 * 플랫폼 서비스 메뉴 Container Props입니다.
 */
type PlatformServicesContainerProps = {
  authStatus: PlatformAuthStatus; // 화면 확인용 인증 상태
};

/**
 * 플랫폼 서비스 메뉴 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @param props Container Props
 * @returns 플랫폼 서비스 메뉴 화면
 */
export function PlatformServicesContainer({ authStatus }: PlatformServicesContainerProps) {
  return (
    <PlatformServicesView
      isLoggedIn={authStatus === 'member'}
      services={platformHomeViewModel.services}
    />
  );
}
