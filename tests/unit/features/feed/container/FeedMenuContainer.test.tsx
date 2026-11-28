import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FeedMenuContainer } from '@/features/feed/container/FeedMenuContainer';

import { createAuthWrapper } from '../../../../fixtures/auth';

const replace = vi.fn();
let currentPathname = '/';

vi.mock('next/navigation', () => ({
  usePathname: () => currentPathname,
  useRouter: () => ({ replace, push: vi.fn() }),
}));

/**
 * FeedMenuContainer 테스트
 * 실시간 순위의 공개 접근과 관찰 및 내 feed 메뉴의 로그인 가드를 확인합니다.
 */
describe('FeedMenuContainer', () => {
  beforeEach(() => {
    replace.mockClear();
    currentPathname = '/';
  });

  it('실시간 순위는 비로그인으로도 화면을 보여주고 이동하지 않는다', () => {
    render(<FeedMenuContainer menuKind="popular" />, { wrapper: createAuthWrapper('guest') });

    expect(screen.getByRole('heading', { level: 1, name: '실시간 순위' })).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  describe.each([
    { menuKind: 'me', regionName: '내 알림 설정', loginHref: '/login?next=%2Ffeed%2Fme' },
    { menuKind: 'observations', regionName: '관찰 중인 대상', loginHref: '/login?next=%2Ffeed%2Fobservations' },
  ] as const)('$menuKind 메뉴', ({ menuKind, regionName, loginHref }) => {
    beforeEach(() => {
      currentPathname = `/feed/${menuKind}`;
    });

    it('로그인 상태이면 화면을 보여준다', () => {
      render(<FeedMenuContainer menuKind={menuKind} />, { wrapper: createAuthWrapper('member') });

      expect(screen.getByRole('region', { name: regionName })).toBeInTheDocument();
      expect(replace).not.toHaveBeenCalled();
    });

    it('비로그인이면 화면을 숨기고 로그인 화면으로 이동한다', () => {
      render(<FeedMenuContainer menuKind={menuKind} />, { wrapper: createAuthWrapper('guest') });

      expect(screen.queryByRole('region', { name: regionName })).not.toBeInTheDocument();
      expect(replace).toHaveBeenCalledWith(loginHref);
    });

    it('로그인 상태를 복원하는 중이면 화면을 숨기고 이동하지 않는다', () => {
      render(<FeedMenuContainer menuKind={menuKind} />, { wrapper: createAuthWrapper('guest', { state: 'loading' }) });

      expect(screen.queryByRole('region', { name: regionName })).not.toBeInTheDocument();
      expect(replace).not.toHaveBeenCalled();
    });
  });

  it('인증 상태에 따라 상단바 링크가 달라진다', () => {
    const { unmount } = render(<FeedMenuContainer menuKind="popular" />, { wrapper: createAuthWrapper('guest') });

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    // 비회원 화면을 제거하고 회원 상태로 렌더링한다
    unmount();
    render(<FeedMenuContainer menuKind="popular" />, { wrapper: createAuthWrapper('member') });

    expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument();
  });
});
