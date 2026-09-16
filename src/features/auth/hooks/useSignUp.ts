'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { authApi } from '../api/authApi';

/**
 * 회원가입 화면의 입력 상태와 검증, 제출 처리를 담당하는 Custom Hook입니다.
 *
 * @returns 회원가입 입력 상태와 이벤트 함수
 */
export function useSignUp() {
  const router = useRouter();

  const [email, setEmail] = useState('');                       // 입력된 이메일
  const [nickname, setNickname] = useState('');                 // 입력된 닉네임
  const [password, setPassword] = useState('');                 // 입력된 비밀번호
  const [confirmPassword, setConfirmPassword] = useState('');   // 입력된 비밀번호 확인 값
  const [error, setError] = useState('');                       // 검증 오류 메시지
  const [isEmailChecked, setIsEmailChecked] = useState(false);       // 이메일 중복확인 완료 여부
  const [isNicknameChecked, setIsNicknameChecked] = useState(false); // 닉네임 중복확인 완료 여부

  /**
   * 이메일을 변경하고 중복확인 상태를 초기화합니다.
   *
   * @param value 변경할 이메일
   */
  const handleChangeEmail = (value: string) => {
    setEmail(value);
    setIsEmailChecked(false);
  };

  /**
   * 닉네임을 변경하고 중복확인 상태를 초기화합니다.
   *
   * @param value 변경할 닉네임
   */
  const handleChangeNickname = (value: string) => {
    setNickname(value);
    setIsNicknameChecked(false);
  };

  /**
   * 이메일 사용 가능 여부를 확인합니다.
   *
   * @returns 이메일 중복확인 완료 Promise
   */
  const handleCheckEmail = async (): Promise<void> => {
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    // 이메일 사용 가능 여부를 조회한다.
    const response = await authApi.checkEmail(email);

    if (!response.isAvailable) {
      setError('이미 사용 중인 이메일입니다.');
      return;
    }

    alert('사용 가능한 이메일입니다.');
    setIsEmailChecked(true);
    setError('');
  };

  /**
   * 닉네임 사용 가능 여부를 확인합니다.
   *
   * @returns 닉네임 중복확인 완료 Promise
   */
  const handleCheckNickname = async (): Promise<void> => {
    if (!nickname) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    // 닉네임 사용 가능 여부를 조회한다.
    const response = await authApi.checkNickname(nickname);

    if (!response.isAvailable) {
      setError('이미 사용 중인 닉네임입니다.');
      return;
    }

    alert('사용 가능한 닉네임입니다.');
    setIsNicknameChecked(true);
    setError('');
  };

  /**
   * 입력 값을 검증한 뒤 회원가입을 요청하고 이메일 인증 화면으로 이동합니다.
   *
   * @returns 회원가입 처리 완료 Promise
   */
  const handleSubmit = async (): Promise<void> => {
    // 중복확인 수행 여부와 비밀번호 일치 여부를 검증한다.
    if (!isEmailChecked) {
      setError('이메일 중복체크를 해주세요.');
      return;
    }

    if (!isNicknameChecked) {
      setError('닉네임 중복체크를 해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 회원가입을 요청한다. 이 단계에서 인증 이메일이 발송된다.
    await authApi.signUp({ email, nickname, password });

    setError('');
    router.push(
      `/signup/verify?email=${encodeURIComponent(email)}&nickname=${encodeURIComponent(nickname)}`,
    );
  };

  return {
    email,
    nickname,
    password,
    confirmPassword,
    error,
    setPassword,
    setConfirmPassword,
    handleChangeEmail,
    handleChangeNickname,
    handleCheckEmail,
    handleCheckNickname,
    handleSubmit,
  };
}
