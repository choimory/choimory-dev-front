import Link from 'next/link';

import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';

import { SocialLoginButtons } from './SocialLoginButtons';

/**
 * 로그인 폼 컴포넌트의 Props
 */
type LoginFormProps = {
  id: string;                        // 입력된 아이디
  password: string;                  // 입력된 비밀번호
  isSubmitting: boolean;             // 로그인 요청 진행 여부
  onChangeId: (id: string) => void;  // 아이디 변경 시 실행할 동작
  onChangePassword: (password: string) => void; // 비밀번호 변경 시 실행할 동작
  onSubmit: () => void;              // 로그인 제출 시 실행할 동작
};

/**
 * 아이디와 비밀번호를 입력받아 로그인을 요청하는 폼 컴포넌트입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 로그인 폼
 */
export function LoginForm({
  id,
  password,
  isSubmitting,
  onChangeId,
  onChangePassword,
  onSubmit,
}: LoginFormProps) {
  return (
    <div className="w-full max-w-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">로그인</h2>
        <p className="text-gray-600 dark:text-gray-300">계정에 로그인하세요</p>
      </div>

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <TextField
          id="id"
          label="아이디"
          value={id}
          placeholder="아이디를 입력하세요"
          isRequired
          onChange={onChangeId}
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

        <Button type="submit" isFullWidth isDisabled={isSubmitting}>
          로그인
        </Button>
      </form>

      <div className="mt-6 space-y-3 text-center">
        <Link href="/signup" className="block text-sm text-blue-500 hover:text-blue-600">
          아이디가 없으신가요? 회원가입
        </Link>
        <a href="#" className="block text-sm text-gray-500 hover:text-gray-600">
          비밀번호를 잊으셨나요? 비밀번호 찾기
        </a>
      </div>

      <SocialLoginButtons />
    </div>
  );
}
