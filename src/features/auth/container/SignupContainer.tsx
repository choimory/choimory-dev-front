import { SignupView } from '../components/SignupView';
import { signupViewModel } from '../model/authTypes';

/**
 * 회원가입 화면의 데이터 흐름을 담당하는 Container입니다.
 *
 * @returns 회원가입 화면
 */
export function SignupContainer() {
  return <SignupView viewModel={signupViewModel} />;
}
