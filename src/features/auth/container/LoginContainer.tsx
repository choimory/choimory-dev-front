import { LoginView } from '../components/LoginView';
import { loginViewModel } from '../model/authTypes';

/**
 * 로그인 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @returns 로그인 화면
 */
export function LoginContainer() {
  return <LoginView viewModel={loginViewModel} />;
}
