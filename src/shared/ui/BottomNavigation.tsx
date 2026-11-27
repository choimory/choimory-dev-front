import Link from 'next/link';

import { Icon, type IconName } from './Icon';

/**
 * 하단 네비게이션 항목
 */
export type BottomNavigationItem = {
  label: string;     // 화면에 표시할 이름
  href: string;      // 이동할 경로
  iconName: IconName; // 표시할 아이콘 이름
  isActive?: boolean; // 현재 선택된 항목 여부
};

/**
 * 하단 네비게이션 컴포넌트의 Props
 */
type BottomNavigationProps = {
  items: BottomNavigationItem[]; // 하단에 표시할 네비게이션 항목 목록
  size?: 'narrow' | 'wide';      // 하단 네비게이션 폭
};

/** 하단 네비게이션 크기별 폭 클래스 */
const BOTTOM_NAVIGATION_WIDTH_CLASS_NAME: Record<NonNullable<BottomNavigationProps['size']>, string> = {
  narrow: 'max-w-[560px]',
  wide: 'max-w-[768px]',
};

/**
 * 모바일 앱 같은 중앙 폭의 하단 네비게이션입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 하단 네비게이션
 */
export function BottomNavigation({ items, size = 'wide' }: BottomNavigationProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 pointer-events-none">
      <nav className={`pointer-events-auto mx-auto grid h-16 w-full ${BOTTOM_NAVIGATION_WIDTH_CLASS_NAME[size]} grid-cols-4 border-t border-border bg-shell px-2 sm:w-[calc(100%-2rem)] sm:border-x`}>
        {items.map((item) => (
          <Link
            key={item.label}
            aria-current={item.isActive ? 'page' : undefined}
            className={`relative grid content-center justify-items-center gap-1 text-[11px] transition-colors ${
              item.isActive
                ? 'font-semibold text-primary before:absolute before:inset-x-5 before:top-0 before:h-0.5 before:bg-primary'
                : 'font-medium text-muted hover:text-foreground'
            }`}
            href={item.href}
          >
            <Icon className="size-5" name={item.iconName} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
