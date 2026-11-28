import { describe, expect, it } from 'vitest';

import { buildLoginHref, sanitizeNextPath } from '@/shared/auth/redirect';

/**
 * redirect 테스트
 * 로그인 후 이동 경로(next)가 같은 사이트의 내부 경로만 허용되는지(오픈 리다이렉트 방지),
 * 로그인 화면 주소가 현재 경로로 만들어지는지 확인합니다.
 */
describe('sanitizeNextPath', () => {
  it('내부 경로는 그대로 허용한다', () => {
    expect(sanitizeNextPath('/me')).toBe('/me');
    expect(sanitizeNextPath('/feed/me/targets/target-keyboard')).toBe('/feed/me/targets/target-keyboard');
    expect(sanitizeNextPath('/blog/following?tab=new')).toBe('/blog/following?tab=new');
  });

  it('값이 없거나 비어 있거나 문자열이 아니면 기본 경로를 돌려준다', () => {
    expect(sanitizeNextPath(undefined)).toBe('/');
    expect(sanitizeNextPath(null)).toBe('/');
    expect(sanitizeNextPath('')).toBe('/');
  });

  it('배열이면 첫 번째 값을 검증한다', () => {
    expect(sanitizeNextPath(['/me', '/feed'])).toBe('/me');
    expect(sanitizeNextPath(['https://evil.com', '/me'])).toBe('/');
  });

  it.each([
    ['https://evil.com', '절대 주소'],
    ['http://evil.com/me', '절대 주소(http)'],
    ['//evil.com', '프로토콜 상대 주소'],
    ['//evil.com/me', '프로토콜 상대 주소와 경로'],
    ['/\\evil.com', '역슬래시로 시작'],
    ['/%2Fevil.com', '인코딩된 슬래시로 시작'],
    ['/%5Cevil.com', '인코딩된 역슬래시로 시작'],
    ['javascript:alert(1)', '자바스크립트 스킴'],
    ['me', '슬래시로 시작하지 않음'],
    ['/me\nSet-Cookie: a=b', '줄바꿈 포함'],
    ['/me%0d%0aSet-Cookie:a=b', '인코딩된 줄바꿈 포함'],
    ['/\t/evil.com', '탭 포함'],
    ['/%E0%A4%A', '잘못된 인코딩'],
  ])('%s(%s)은 거부하고 기본 경로를 돌려준다', (raw) => {
    expect(sanitizeNextPath(raw)).toBe('/');
  });

  it('너무 긴 값은 거부한다', () => {
    expect(sanitizeNextPath(`/${'a'.repeat(600)}`)).toBe('/');
  });

  it('로그인과 회원가입 경로는 루프를 막으려고 거부한다', () => {
    expect(sanitizeNextPath('/login')).toBe('/');
    expect(sanitizeNextPath('/login?next=/me')).toBe('/');
    expect(sanitizeNextPath('/signup')).toBe('/');
    expect(sanitizeNextPath('/signup/done')).toBe('/');
    // 이름이 비슷한 다른 경로는 허용한다
    expect(sanitizeNextPath('/loginhelp')).toBe('/loginhelp');
  });

  it('경로를 정규화해서 돌려준다', () => {
    expect(sanitizeNextPath('/blog/../me')).toBe('/me');
  });
});

describe('buildLoginHref', () => {
  it('일반 경로는 next를 인코딩해서 붙인다', () => {
    expect(buildLoginHref('/me')).toBe('/login?next=%2Fme');
    expect(buildLoginHref('/feed/me/targets/target-keyboard')).toBe('/login?next=%2Ffeed%2Fme%2Ftargets%2Ftarget-keyboard');
  });

  it('홈, 로그인, 회원가입이면 next 없이 /login이다', () => {
    expect(buildLoginHref('/')).toBe('/login');
    expect(buildLoginHref('/login')).toBe('/login');
    expect(buildLoginHref('/signup')).toBe('/login');
  });

  it('위험한 경로는 next 없이 /login이다', () => {
    expect(buildLoginHref('//evil.com')).toBe('/login');
    expect(buildLoginHref('https://evil.com')).toBe('/login');
  });
});
