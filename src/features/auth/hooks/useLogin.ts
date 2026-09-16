'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAuthSession } from './useAuthSession';

/**
 * 로그인 화면의 입력 상태와 제출 처리를 담당하는 Custom Hook입니다.
 *
 * @returns 로그인 입력 상태와 이벤트 함수
 */
export function useLogin() {
  const router = useRouter();
  const { login } = useAuthSession();

  const [id, setId] = useState('');                     // 입력된 아이디
  const [password, setPassword] = useState('');         // 입력된 비밀번호
  const [isSubmitting, setIsSubmitting] = useState(false); // 로그인 요청 진행 여부

  /**
   * 로그인을 수행하고 홈 화면으로 이동합니다.
   *
   * @returns 로그인 처리 완료 Promise
   */
  const handleSubmit = async (): Promise<void> => {
    // 로그인 요청을 시작한다.
    setIsSubmitting(true);

    try {
      await login({ id, password });
      router.push('/home');
    } finally {
      // 요청 상태를 종료한다.
      setIsSubmitting(false);
    }
  };

  return {
    id,
    password,
    isSubmitting,
    setId,
    setPassword,
    handleSubmit,
  };
}
