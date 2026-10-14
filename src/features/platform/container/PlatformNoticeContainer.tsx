import { PlatformNoticeView } from '../components/PlatformNoticeView';
import { type PlatformAuthStatus } from '../model/platformHomeTypes';

/**
 * 플랫폼 공지사항 Container Props입니다.
 */
type PlatformNoticeContainerProps = {
  authStatus: PlatformAuthStatus; // 화면 확인용 인증 상태
};

/**
 * 플랫폼 공지사항 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @param props Container Props
 * @returns 플랫폼 공지사항 화면
 */
export function PlatformNoticeContainer({ authStatus }: PlatformNoticeContainerProps) {
  return <PlatformNoticeView isLoggedIn={authStatus === 'member'} />;
}
