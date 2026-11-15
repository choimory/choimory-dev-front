import { useState, type FormEvent } from 'react';

import { ApiError, getValidateResults } from '@/shared/api/apiTypes';

import { authApi } from '../api/authApi';
import type { FieldErrors, SignupFormValues } from '../model/authTypes';

/** 회원가입 폼 초기 값 */
const INITIAL_VALUES: SignupFormValues = {
  nickname: '',
  email: '',
  password: '',
  passwordConfirm: '',
};

/** member-api 필드명 중 폼에서 표시할 수 있는 것 */
const FORM_FIELDS: (keyof SignupFormValues)[] = ['nickname', 'email', 'password'];

/**
 * 회원가입 오류를 필드별 메시지와 전체 메시지로 나눕니다.
 *
 * @param error 회원가입 중 발생한 오류
 * @returns 필드별 오류와 폼 전체 오류 메시지
 */
export function toSignupErrors(error: unknown): { fieldErrors: FieldErrors; formError: string | null } {
  const fieldErrors: FieldErrors = {};

  // 검증 실패(400)는 필드별 메시지로 변환한다.
  for (const result of getValidateResults(error)) {
    const field = FORM_FIELDS.find((name) => name === result.field);

    if (field && !fieldErrors[field]) {
      fieldErrors[field] = result.message;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, formError: null };
  }

  // 이메일 중복 등 필드로 나눌 수 없는 오류는 서버 메시지를 그대로 보여준다.
  if (error instanceof ApiError && error.status === 409) {
    return { fieldErrors, formError: error.message };
  }

  return { fieldErrors, formError: '회원가입에 실패했어요. 잠시 후 다시 시도해 주세요.' };
}

/**
 * 회원가입 폼의 상태와 제출 흐름을 담당하는 Hook입니다.
 *
 * @param onSuccess 회원가입 성공 후 실행할 동작 (예: 로그인 화면 이동)
 * @returns 입력 값, 제출 상태, 오류 메시지와 이벤트 함수
 */
export function useSignup(onSuccess: () => void) {
  const [values, setValues] = useState<SignupFormValues>(INITIAL_VALUES);   // 폼 입력 값
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});          // 필드별 오류 메시지
  const [formError, setFormError] = useState<string | null>(null);          // 폼 전체 오류 메시지
  const [isSubmitting, setIsSubmitting] = useState(false);                  // 가입 요청 진행 여부

  /**
   * 입력 값 하나를 바꿉니다.
   *
   * @param field 바꿀 필드
   * @param value 새 값
   */
  const handleChange = (field: keyof SignupFormValues, value: string): void => {
    setValues((previous) => ({ ...previous, [field]: value }));
  };

  /**
   * 회원가입 요청을 보냅니다.
   *
   * @param event 폼 제출 이벤트
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setFieldErrors({});
    setFormError(null);

    // 비밀번호 확인은 서버가 모르는 값이라 프론트에서 먼저 확인한다.
    if (values.password !== values.passwordConfirm) {
      setFieldErrors({ passwordConfirm: '비밀번호가 일치하지 않아요.' });
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.join({
        email: values.email,
        password: values.password,
        nickname: values.nickname,
      });
      onSuccess();
    } catch (error) {
      const errors = toSignupErrors(error);

      setFieldErrors(errors.fieldErrors);
      setFormError(errors.formError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    fieldErrors,
    formError,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}
