import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';

/**
 * 회원가입 폼 컴포넌트의 Props
 */
type SignUpFormProps = {
  email: string;                                 // 입력된 이메일
  nickname: string;                              // 입력된 닉네임
  password: string;                              // 입력된 비밀번호
  confirmPassword: string;                       // 입력된 비밀번호 확인 값
  error: string;                                 // 검증 오류 메시지
  onChangeEmail: (email: string) => void;        // 이메일 변경 시 실행할 동작
  onChangeNickname: (nickname: string) => void;  // 닉네임 변경 시 실행할 동작
  onChangePassword: (password: string) => void;  // 비밀번호 변경 시 실행할 동작
  onChangeConfirmPassword: (confirmPassword: string) => void; // 비밀번호 확인 변경 시 실행할 동작
  onCheckEmail: () => void;                      // 이메일 중복확인 시 실행할 동작
  onCheckNickname: () => void;                   // 닉네임 중복확인 시 실행할 동작
  onSubmit: () => void;                          // 회원가입 제출 시 실행할 동작
};

/**
 * 이메일, 닉네임, 비밀번호를 입력받아 회원가입을 요청하는 폼 컴포넌트입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 회원가입 폼
 */
export function SignUpForm({
  email,
  nickname,
  password,
  confirmPassword,
  error,
  onChangeEmail,
  onChangeNickname,
  onChangePassword,
  onChangeConfirmPassword,
  onCheckEmail,
  onCheckNickname,
  onSubmit,
}: SignUpFormProps) {
  return (
    <div className="w-full max-w-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">회원가입</h2>
        <p className="text-gray-600 dark:text-gray-300">새 계정을 만드세요</p>
      </div>

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <TextField
          id="email"
          label="이메일"
          type="email"
          value={email}
          placeholder="이메일을 입력하세요"
          isRequired
          actionLabel="중복체크"
          onChange={onChangeEmail}
          onAction={onCheckEmail}
        />

        <TextField
          id="nickname"
          label="닉네임"
          value={nickname}
          placeholder="닉네임을 입력하세요"
          isRequired
          actionLabel="중복체크"
          onChange={onChangeNickname}
          onAction={onCheckNickname}
        />

        <TextField
          id="password"
          label="비밀번호"
          type="password"
          value={password}
          placeholder="비밀번호를 입력하세요"
          isRequired
          onChange={onChangePassword}
        />

        <TextField
          id="confirmPassword"
          label="비밀번호 확인"
          type="password"
          value={confirmPassword}
          placeholder="비밀번호를 다시 입력하세요"
          isRequired
          onChange={onChangeConfirmPassword}
        />

        {error && <p className="text-sm text-center text-red-500">{error}</p>}

        <div>
          <Button type="submit" isFullWidth>
            가입하기
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          계정이 이미 있으신가요?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
            로그인
          </a>
        </p>
      </div>
    </div>
  );
}
