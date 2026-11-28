import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginLink } from '@/features/auth/components/LoginLink';

let currentPathname = '/';

vi.mock('next/navigation', () => ({
  usePathname: () => currentPathname,
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

/**
 * LoginLink 테스트
 * 현재 경로에 따라 로그인 화면 주소에 next가 붙는지 확인합니다.
 */
describe('LoginLink', () => {
  beforeEach(() => {
    currentPathname = '/';
  });

  it('홈에서는 next 없이 /login으로 이동한다', () => {
    render(<LoginLink>로그인</LoginLink>);

    expect(screen.getByRole('link', { name: '로그인' })).toHaveAttribute('href', '/login');
  });

  it('다른 페이지에서는 현재 경로를 next로 붙인다', () => {
    currentPathname = '/blog/popular';
    render(<LoginLink className="cta">로그인</LoginLink>);

    const link = screen.getByRole('link', { name: '로그인' });

    expect(link).toHaveAttribute('href', '/login?next=%2Fblog%2Fpopular');
    expect(link).toHaveClass('cta');
  });
});
