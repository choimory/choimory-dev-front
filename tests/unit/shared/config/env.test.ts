import { afterEach, describe, expect, it, vi } from 'vitest';

import { getServerEnv } from '@/shared/config/env';

/**
 * getServerEnv 테스트
 * 서버 환경변수를 읽고 끝의 슬래시를 제거하며, 값이 없으면 오류를 던지는지 확인합니다.
 */
describe('getServerEnv', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('member-api 주소를 반환한다', () => {
    vi.stubEnv('MEMBER_API_BASE_URL', 'http://localhost:8080');

    expect(getServerEnv().memberApiBaseUrl).toBe('http://localhost:8080');
  });

  it('주소 끝의 슬래시를 제거한다', () => {
    vi.stubEnv('MEMBER_API_BASE_URL', 'http://localhost:8080//');

    expect(getServerEnv().memberApiBaseUrl).toBe('http://localhost:8080');
  });

  it('주소가 없으면 오류를 던진다', () => {
    vi.stubEnv('MEMBER_API_BASE_URL', '');

    expect(() => getServerEnv()).toThrow('MEMBER_API_BASE_URL');
  });
});
