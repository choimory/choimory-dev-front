import { useState, type FormEvent } from 'react';

import { ApiError } from '@/shared/api/apiTypes';

import { authApi } from '../api/authApi';

/**
 * 로그인 오류를 사용자에게 보여줄 메시지로 바꿉니다.
 *
 * @param error 로그인 중 발생한 오류
 * @returns 화면에 표시할 메시지
 */
export function toLoginErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 400 || error.status === 401) {
      return '이메일 또는 비밀번호가 올바르지 않아요.';
    }
  }

  return '로그인에 실패했어요. 잠시 후 다시 시도해 주세요.';
}

/**
 * 로그인 폼의 상태와 제출 흐름을 담당하는 Hook입니다.
 *
 * @param onSuccess 로그인 성공 후 실행할 동작 (예: 화면 이동)
 * @returns 입력 값, 제출 상태, 오류 메시지와 이벤트 함수
 */
export function useLogin(onSuccess: () => void) {
  const [email, setEmail] = useState('');                       // 이메일 입력 값
  const [password, setPassword] = useState('');                 // 비밀번호 입력 값
  const [isSubmitting, setIsSubmitting] = useState(false);      // 로그인 요청 진행 여부
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 로그인 오류 메시지

  /**
   * 로그인 요청을 보냅니다.
   *
   * @param event 폼 제출 이벤트
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await authApi.login({ email, password });
      onSuccess();
    } catch (error) {
      setErrorMessage(toLoginErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    password,
    isSubmitting,
    errorMessage,
    setEmail,
    setPassword,
    handleSubmit,
  };
}
