import { PlatformHomeView } from '../components/PlatformHomeView';
import { platformHomeViewModel } from '../model/platformHomeTypes';

/**
 * 플랫폼 홈 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @returns 플랫폼 홈 화면
 */
export function PlatformHomeContainer() {
  return <PlatformHomeView viewModel={platformHomeViewModel} />;
}
