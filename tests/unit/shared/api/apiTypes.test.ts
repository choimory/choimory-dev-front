import { describe, expect, it } from 'vitest';

import { ApiError, getValidateResults } from '@/shared/api/apiTypes';

/**
 * getValidateResults 테스트
 * 검증 실패 오류에서 필드 목록을 꺼내고, 그 외 오류나 잘못된 data는 빈 배열로 처리하는지 확인합니다.
 */
describe('getValidateResults', () => {
  it('검증 실패 오류의 필드 목록을 반환한다', () => {
    const results = [{ field: 'email', rejectValue: 'a@b', message: '올바른 이메일 형식이 아닙니다.' }];

    expect(getValidateResults(new ApiError(400, 'BAD_REQUEST', 'Bad Request', results))).toEqual(results);
  });

  it('필드 목록 형태가 아닌 항목은 걸러낸다', () => {
    const error = new ApiError(400, 'BAD_REQUEST', 'Bad Request', [{ field: 'email', message: '오류' }, 'x', null, { field: 1 }]);

    expect(getValidateResults(error)).toEqual([{ field: 'email', message: '오류' }]);
  });

  it('data가 배열이 아니거나 ApiError가 아니면 빈 배열을 반환한다', () => {
    expect(getValidateResults(new ApiError(409, 'DUPLICATE_EMAIL', '중복'))).toEqual([]);
    expect(getValidateResults(new Error('x'))).toEqual([]);
    expect(getValidateResults(undefined)).toEqual([]);
  });
});
