import { describe, expect, it } from 'vitest';

import { getMockAuthStatus } from '@/shared/model/mockAuth';

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
