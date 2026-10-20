import { describe, expect, it } from 'vitest';

import { toLoginErrorMessage } from '@/features/auth/hooks/useLogin';
import { toSignupErrors } from '@/features/auth/hooks/useSignup';
import { ApiError } from '@/shared/api/apiTypes';

/**
 * 인증 오류 메시지 변환 테스트
 * 로그인 오류(자격 증명 오류, 그 외)와 회원가입 오류(필드별 검증 실패, 중복 409, 그 외)의 변환을 확인합니다.
 */
describe('toLoginErrorMessage', () => {
  it('400, 401은 이메일/비밀번호 오류 문구로 바꾼다', () => {
    expect(toLoginErrorMessage(new ApiError(401, 'UNAUTHORIZED', 'Unauthorized'))).toBe('이메일 또는 비밀번호가 올바르지 않아요.');
    expect(toLoginErrorMessage(new ApiError(400, 'BAD_REQUEST', 'Bad Request'))).toBe('이메일 또는 비밀번호가 올바르지 않아요.');
  });

  it('그 외 오류는 일반 실패 문구로 바꾼다', () => {
    expect(toLoginErrorMessage(new ApiError(502, 'BAD_GATEWAY', 'x'))).toBe('로그인에 실패했어요. 잠시 후 다시 시도해 주세요.');
    expect(toLoginErrorMessage(new Error('x'))).toBe('로그인에 실패했어요. 잠시 후 다시 시도해 주세요.');
  });
});

describe('toSignupErrors', () => {
  it('검증 실패는 필드별 메시지로 나누고 같은 필드는 첫 메시지만 쓴다', () => {
    const error = new ApiError(400, 'BAD_REQUEST', 'Bad Request', [
      { field: 'email', rejectValue: 'a', message: '이메일 오류' },
      { field: 'email', rejectValue: 'a', message: '다른 이메일 오류' },
      { field: 'unknown', rejectValue: 'a', message: '무시' },
    ]);

    expect(toSignupErrors(error)).toEqual({ fieldErrors: { email: '이메일 오류' }, formError: null });
  });

  it('이메일 중복(409)은 서버 메시지를 폼 오류로 쓴다', () => {
    const errors = toSignupErrors(new ApiError(409, 'DUPLICATE_EMAIL', '이미 사용 중인 이메일입니다.'));

    expect(errors).toEqual({ fieldErrors: {}, formError: '이미 사용 중인 이메일입니다.' });
  });

  it('그 외 오류는 일반 실패 문구를 폼 오류로 쓴다', () => {
    expect(toSignupErrors(new Error('x')).formError).toBe('회원가입에 실패했어요. 잠시 후 다시 시도해 주세요.');
  });
});
