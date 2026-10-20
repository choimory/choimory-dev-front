import { describe, expect, it, vi } from 'vitest';

import { jsonResponse } from '../../../fixtures/api';
import { ApiError } from '@/shared/api/apiTypes';
import { httpRequest } from '@/shared/api/httpClient';

/**
 * httpRequest 테스트
 * 요청 주소·헤더·본문 구성, 공통 응답의 data 반환, 실패 응답과 비정상 응답의 ApiError 변환을 확인합니다.
 */
describe('httpRequest', () => {
  it('성공하면 공통 응답의 data를 반환한다', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(200, 'OK', { id: 1 }));

    const data = await httpRequest<{ id: number }>({ baseUrl: 'http://api', path: '/v1/x', fetchImpl });

    expect(data).toEqual({ id: 1 });
  });

  it('baseUrl과 path를 합친 주소로 요청한다', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(200, 'OK'));

    await httpRequest({ baseUrl: 'http://api', path: '/v1/x', fetchImpl });

    expect(fetchImpl.mock.calls[0][0]).toBe('http://api/v1/x');
    expect(fetchImpl.mock.calls[0][1].method).toBe('GET');
  });

  it('본문이 있으면 JSON으로 보내고 Content-Type을 붙인다', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(200, 'OK'));

    await httpRequest({ baseUrl: '', path: '/x', method: 'POST', body: { a: 1 }, headers: { Authorization: 'Bearer t' }, fetchImpl });

    const init = fetchImpl.mock.calls[0][1];

    expect(init.body).toBe('{"a":1}');
    expect(init.headers).toMatchObject({ 'Content-Type': 'application/json', Authorization: 'Bearer t' });
  });

  it('본문이 없으면 Content-Type을 붙이지 않는다', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(200, 'OK'));

    await httpRequest({ baseUrl: '', path: '/x', method: 'POST', fetchImpl });

    expect(fetchImpl.mock.calls[0][1].headers).not.toHaveProperty('Content-Type');
  });

  it('실패 응답은 공통 응답의 오류 정보를 담은 ApiError로 던진다', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(401, 'TOKEN_EXPIRED', null, '토큰 만료'));

    await expect(httpRequest({ baseUrl: '', path: '/x', fetchImpl })).rejects.toMatchObject({
      name: 'ApiError',
      status: 401,
      errorName: 'TOKEN_EXPIRED',
      message: '토큰 만료',
    });
  });

  it('검증 실패 응답의 data를 ApiError에 담는다', async () => {
    const results = [{ field: 'email', rejectValue: 'a', message: '오류' }];
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(400, 'BAD_REQUEST', results));

    const error = (await httpRequest({ baseUrl: '', path: '/x', fetchImpl }).catch((e: unknown) => e)) as ApiError;

    expect(error).toBeInstanceOf(ApiError);
    expect(error.data).toEqual(results);
  });

  it('JSON이 아닌 실패 응답은 UNKNOWN ApiError로 던진다', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('<html>', { status: 502, statusText: 'Bad Gateway' }));

    await expect(httpRequest({ baseUrl: '', path: '/x', fetchImpl })).rejects.toMatchObject({
      status: 502,
      errorName: 'UNKNOWN',
    });
  });

  it('성공했지만 공통 응답 형태가 아니면 INVALID_RESPONSE ApiError로 던진다', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('{"a":1}', { status: 200 }));

    await expect(httpRequest({ baseUrl: '', path: '/x', fetchImpl })).rejects.toMatchObject({
      errorName: 'INVALID_RESPONSE',
    });
  });
});
