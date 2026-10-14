import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BottomNavigation, type BottomNavigationItem } from '@/shared/ui/BottomNavigation';

/** 테스트용 하단 네비게이션 항목 4개 (공지사항이 활성 상태) */
const ITEMS: BottomNavigationItem[] = [
  { label: '홈', href: '/', iconName: 'home' },
  { label: '공지사항', href: '/notice', iconName: 'megaphone', isActive: true },
  { label: '서비스', href: '/services', iconName: 'grid' },
  { label: '내 정보', href: '/me', iconName: 'user' },
];

/**
 * BottomNavigation 테스트
 * 하단 네비게이션의 링크 목록, 활성 항목(aria-current), 기본 폭과 narrow 폭을 확인합니다.
 */
describe('BottomNavigation', () => {
  it('항목마다 라벨과 경로를 가진 링크를 렌더링한다', () => {
    render(<BottomNavigation items={ITEMS} />);

    expect(screen.getAllByRole('link')).toHaveLength(4);
    expect(screen.getByRole('link', { name: '홈' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: '내 정보' })).toHaveAttribute('href', '/me');
  });

  it('활성 항목만 aria-current=page를 가진다', () => {
    render(<BottomNavigation items={ITEMS} />);

    expect(screen.getByRole('link', { name: '공지사항' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: '홈' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: '공지사항' })).toHaveClass('bg-primary-soft', 'text-primary');
  });

  it('기본 폭은 wide이고 size=narrow를 반영한다', () => {
    const { rerender } = render(<BottomNavigation items={ITEMS} />);

    expect(screen.getByRole('navigation')).toHaveClass('max-w-[768px]');

    // size를 narrow로 바꿔 다시 렌더링한다
    rerender(<BottomNavigation items={ITEMS} size="narrow" />);

    expect(screen.getByRole('navigation')).toHaveClass('max-w-[560px]');
  });
});
