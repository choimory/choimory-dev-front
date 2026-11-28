import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RequireAuth } from '@/features/auth/components/RequireAuth';

import { createAuthWrapper } from '../../../../fixtures/auth';

const replace = vi.fn();
let currentPathname: string | null = '/';

vi.mock('next/navigation', () => ({
  usePathname: () => currentPathname,
  useRouter: () => ({ replace }),
}));

/**
 * RequireAuth 테스트
 * 로그인(member)이면 화면을 보여주고, 복원 중(loading)이면 이동 없이 비워 두며,
 * 비로그인(guest)으로 확정되면 현재 경로에 맞는 로그인 주소로 이동하는지 확인합니다.
 */
describe('RequireAuth', () => {
  beforeEach(() => {
    replace.mockClear();
    currentPathname = '/';
  });

  it('member이면 화면을 보여주고 이동하지 않는다', () => {
    render(<RequireAuth><p>보호 화면</p></RequireAuth>, { wrapper: createAuthWrapper('member') });

    expect(screen.getByText('보호 화면')).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('복원 중(loading)이면 화면을 숨기고 이동하지 않는다', () => {
    render(<RequireAuth><p>보호 화면</p></RequireAuth>, {
      wrapper: createAuthWrapper('guest', { state: 'loading' }),
    });

    expect(screen.queryByText('보호 화면')).not.toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it.each([
    { pathname: '/', loginHref: '/login' },
    { pathname: '/me', loginHref: '/login?next=%2Fme' },
    { pathname: null, loginHref: '/login' },
  ])('guest이면 $pathname 경로에서 화면을 숨기고 $loginHref 로 이동한다', ({ pathname, loginHref }) => {
    currentPathname = pathname;
    render(<RequireAuth><p>보호 화면</p></RequireAuth>, { wrapper: createAuthWrapper('guest') });

    expect(screen.queryByText('보호 화면')).not.toBeInTheDocument();
    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith(loginHref);
  });

  it('AuthProvider 밖에서는 guest로 보고 로그인 화면으로 이동한다', () => {
    render(<RequireAuth><p>보호 화면</p></RequireAuth>);

    expect(screen.queryByText('보호 화면')).not.toBeInTheDocument();
    expect(replace).toHaveBeenCalledWith('/login');
  });

  it('복원이 끝나 member가 되면 이동 없이 화면을 보여준다', () => {
    const { rerender } = render(<RequireAuth><p>보호 화면</p></RequireAuth>, {
      wrapper: createAuthWrapper('guest', { state: 'loading' }),
    });

    expect(screen.queryByText('보호 화면')).not.toBeInTheDocument();

    // 같은 트리에서 Provider 값을 member로 바꿔 다시 렌더링한다
    const MemberWrapper = createAuthWrapper('member');
    rerender(<MemberWrapper><RequireAuth><p>보호 화면</p></RequireAuth></MemberWrapper>);

    expect(replace).not.toHaveBeenCalled();
  });
});
