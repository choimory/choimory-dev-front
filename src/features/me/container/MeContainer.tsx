import { MeView } from '../components/MeView';
import { meViewModel } from '../model/meTypes';

/**
 * 마이페이지 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @returns 마이페이지 화면
 */
export function MeContainer() {
  return <MeView viewModel={meViewModel} />;
}
