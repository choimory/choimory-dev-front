import { describe, expect, it } from 'vitest';

import { getMockAuthStatus } from '@/shared/model/mockAuth';

/**
 * getMockAuthStatus 테스트
 * 개발 확인용 query(auth)에서 인증 상태를 읽는 함수가 member만 member로 판정하고 나머지는 모두 guest로 처리하는지 확인합니다.
 */
describe('getMockAuthStatus', () => {
  it('auth=member이면 member를 반환한다', () => {
    expect(getMockAuthStatus({ auth: 'member' })).toBe('member');
  });

  it('auth가 배열이면 첫 번째 값을 기준으로 한다', () => {
    expect(getMockAuthStatus({ auth: ['member', 'guest'] })).toBe('member');
    expect(getMockAuthStatus({ auth: ['guest', 'member'] })).toBe('guest');
  });

  it.each([
    [{}],
    [{ auth: undefined }],
    [{ auth: 'guest' }],
    [{ auth: 'admin' }],
    [{ auth: '' }],
    [{ other: 'member' }],
  ])('member가 아니면 guest를 반환한다 (%j)', (searchParams) => {
    expect(getMockAuthStatus(searchParams)).toBe('guest');
  });
});
