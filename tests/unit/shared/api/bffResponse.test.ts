import { describe, expect, it } from 'vitest';

import { ApiError } from '@/shared/api/apiTypes';
import { errorResponse, okResponse, toErrorResponse } from '@/shared/api/bffResponse';

/**
 * bffResponse 테스트
 * 공통 응답 형태의 성공·오류 Response 생성과, ApiError 전달 및 그 외 오류의 502 변환을 확인합니다.
 */
describe('bffResponse', () => {
  it('okResponse는 200과 data를 담은 공통 응답을 만든다', async () => {
    const response = okResponse({ a: 1 });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ code: 200, name: 'OK', message: 'OK', data: { a: 1 } });
  });

  it('errorResponse는 상태 코드와 오류 정보를 담은 공통 응답을 만든다', async () => {
    const response = errorResponse(401, 'UNAUTHORIZED', '로그인이 필요해요.');

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ code: 401, name: 'UNAUTHORIZED', message: '로그인이 필요해요.', data: null });
  });

  it('toErrorResponse는 ApiError를 같은 상태와 내용으로 전달한다', async () => {
    const results = [{ field: 'email', rejectValue: 'a', message: '오류' }];
    const response = toErrorResponse(new ApiError(400, 'BAD_REQUEST', 'Bad Request', results));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ name: 'BAD_REQUEST', data: results });
  });

  it('toErrorResponse는 ApiError가 아닌 오류를 502로 응답한다', async () => {
    const response = toErrorResponse(new TypeError('fetch failed'));

    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({ name: 'BAD_GATEWAY' });
  });
});
