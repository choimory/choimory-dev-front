import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BlogMenuContainer } from '@/features/blog/container/BlogMenuContainer';

import { createAuthWrapper } from '../../../../fixtures/auth';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => '/blog/following',
  useRouter: () => ({ replace, push: vi.fn() }),
}));

/**
 * BlogMenuContainer 테스트
 * 실시간 순위의 공개 접근과 팔로잉 메뉴의 로그인 가드를 확인합니다.
 */
describe('BlogMenuContainer', () => {
  beforeEach(() => {
    replace.mockClear();
  });

  it('실시간 순위는 비로그인으로도 화면을 보여주고 이동하지 않는다', () => {
    render(<BlogMenuContainer menuKind="popular" />, { wrapper: createAuthWrapper('guest') });

    expect(screen.getByRole('heading', { level: 1, name: '실시간 순위' })).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('팔로잉은 로그인 상태이면 화면을 보여준다', () => {
    render(<BlogMenuContainer menuKind="following" />, { wrapper: createAuthWrapper('member') });

    expect(screen.getByRole('heading', { level: 1, name: '팔로잉' })).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('팔로잉은 비로그인이면 화면을 숨기고 로그인 화면으로 이동한다', () => {
    render(<BlogMenuContainer menuKind="following" />, { wrapper: createAuthWrapper('guest') });

    expect(screen.queryByRole('heading', { level: 1, name: '팔로잉' })).not.toBeInTheDocument();
    expect(replace).toHaveBeenCalledWith('/login?next=%2Fblog%2Ffollowing');
  });

  it('팔로잉에서 로그인 상태를 복원하는 중이면 화면을 숨기고 이동하지 않는다', () => {
    render(<BlogMenuContainer menuKind="following" />, { wrapper: createAuthWrapper('guest', { state: 'loading' }) });

    expect(screen.queryByRole('heading', { level: 1, name: '팔로잉' })).not.toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('인증 컨텍스트의 상태에 따라 상단바 링크가 달라진다', () => {
    const { unmount } = render(<BlogMenuContainer menuKind="popular" />, { wrapper: createAuthWrapper('guest') });

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    // 회원 인증 상태로 다시 마운트한다
    unmount();
    render(<BlogMenuContainer menuKind="popular" />, { wrapper: createAuthWrapper('member') });

    expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument();
  });
});
