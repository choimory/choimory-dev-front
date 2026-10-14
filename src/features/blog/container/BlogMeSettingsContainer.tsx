import { BlogMeSettingsView } from '../components/BlogMeSettingsView';
import { type BlogAuthStatus } from '../model/blogTypes';

/**
 * 내 blog 설정/관리 Container Props입니다.
 */
type BlogMeSettingsContainerProps = {
  authStatus: BlogAuthStatus; // 화면 확인용 인증 상태
};

/**
 * 내 blog 설정/관리 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @param props Container Props
 * @returns 내 blog 설정/관리 화면
 */
export function BlogMeSettingsContainer({ authStatus }: BlogMeSettingsContainerProps) {
  return <BlogMeSettingsView isLoggedIn={authStatus === 'member'} />;
}
