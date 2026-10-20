import { beforeEach, describe, expect, it } from 'vitest';

import { clearAccessToken, getAccessToken, isAccessTokenExpiring, saveAccessToken } from '@/shared/api/tokenStore';

/**
 * tokenStore 테스트
 * Access Token 저장·조회·삭제와 만료 임박 판단(토큰 없음, 여유 있음, 임박, 만료)을 확인합니다.
 */
describe('tokenStore', () => {
  beforeEach(() => {
    clearAccessToken();
  });

  it('저장한 토큰을 조회하고 삭제하면 null이 된다', () => {
    saveAccessToken('token', 1800);

    expect(getAccessToken()).toBe('token');

    clearAccessToken();

    expect(getAccessToken()).toBeNull();
  });

  it('토큰이 없으면 만료 임박이 아니다', () => {
    expect(isAccessTokenExpiring()).toBe(false);
  });

  it('만료까지 여유가 있으면 만료 임박이 아니다', () => {
    saveAccessToken('token', 1800, 0);

    expect(isAccessTokenExpiring(60_000)).toBe(false);
  });

  it('만료 30초 전부터는 만료 임박이다', () => {
    saveAccessToken('token', 1800, 0);

    expect(isAccessTokenExpiring(1_770_000)).toBe(true);
    expect(isAccessTokenExpiring(1_769_999)).toBe(false);
  });

  it('이미 만료됐으면 만료 임박이다', () => {
    saveAccessToken('token', 1800, 0);

    expect(isAccessTokenExpiring(1_900_000)).toBe(true);
  });
});
