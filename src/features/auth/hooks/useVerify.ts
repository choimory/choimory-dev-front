'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { authApi } from '../api/authApi';

/** 인증 코드 유효 시간(초) */
const VERIFY_TIMEOUT_SECONDS = 180;

/** 인증 시간이 만료되었을 때 노출할 메시지 */
const EXPIRED_MESSAGE = '인증 시간이 만료되었습니다. 코드를 다시 요청해주세요.';

/**
 * 이메일 인증 화면의 입력 상태, 유효 시간 타이머, 제출 처리를 담당하는 Custom Hook입니다.
 *
 * @returns 이메일 인증 관련 상태와 이벤트 함수
 */
export function useVerify() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email') ?? '';       // 인증 코드를 발송한 이메일
  const nickname = searchParams.get('nickname') ?? ''; // 회원가입 시 입력한 닉네임

  const [code, setCode] = useState('');                                     // 입력된 인증 코드
  const [error, setError] = useState('');                                   // 검증 오류 메시지
  const [timeLeft, setTimeLeft] = useState(VERIFY_TIMEOUT_SECONDS);         // 인증 코드 잔여 유효 시간(초)

  // 타이머 동작 여부와 만료 메시지는 별도 상태로 두지 않고 잔여 시간에서 파생시킨다.
  const isTimerRunning = timeLeft > 0;
  const displayError = isTimerRunning ? error : EXPIRED_MESSAGE;

  useEffect(() => {
    // 잔여 시간이 모두 소진된 경우 다음 타이머를 예약하지 않는다.
    if (timeLeft === 0) {
      return;
    }

    // 1초 뒤 잔여 시간을 1 감소시킨다.
    const timer = setTimeout(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  /**
   * 인증 코드를 확인하고 회원가입 완료 화면으로 이동합니다.
   *
   * @returns 인증 코드 확인 완료 Promise
   */
  const handleSubmit = async (): Promise<void> => {
    // 인증 시간이 만료된 경우 제출을 막는다. (만료 메시지는 잔여 시간에서 파생된다)
    if (!isTimerRunning) {
      return;
    }

    if (!code) {
      setError('인증 코드를 입력해주세요.');
      return;
    }

    await authApi.verifyCode({ email, code });

    setError('');
    router.push(`/signup/welcome?nickname=${encodeURIComponent(nickname)}`);
  };

  /**
   * 인증 코드를 재발송하고 유효 시간을 초기화합니다.
   *
   * @returns 인증 코드 재발송 완료 Promise
   */
  const handleResend = async (): Promise<void> => {
    await authApi.resendCode({ email });

    setTimeLeft(VERIFY_TIMEOUT_SECONDS);
    setError('');
    setCode('');
    alert('인증 코드를 다시 발송했습니다.');
  };

  return {
    email,
    code,
    displayError,
    timeLeft,
    isTimerRunning,
    setCode,
    handleSubmit,
    handleResend,
  };
}
