import Link from 'next/link';
import type { ReactNode } from 'react';

import { BrandLogo } from './BrandLogo';
import { Icon } from './Icon';

/**
 * 상단 앱 바 컴포넌트의 Props
 */
type AppTopBarProps = {
  serviceName?: string;  // 현재 진입한 하위 서비스 이름
  leading?: ReactNode;   // 브랜드 앞에 표시할 좌측 액션
  size?: 'narrow' | 'wide'; // 상단 바 내부 콘텐츠 폭
  isLoggedIn?: boolean;  // 로그인 사용자 여부
};

/** 상단 앱 바 크기별 콘텐츠 폭 클래스 */
const TOP_BAR_WIDTH_CLASS_NAME: Record<NonNullable<AppTopBarProps['size']>, string> = {
  narrow: 'max-w-[560px]',
  wide: 'max-w-[768px]',
};

/**
 * 플랫폼과 하위 서비스에서 공통으로 사용하는 상단 앱 바입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 상단 앱 바
 */
export function AppTopBar({ serviceName, leading, size = 'narrow', isLoggedIn = false }: AppTopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-shell/95 backdrop-blur">
      <div className={`mx-auto flex h-16 w-full ${TOP_BAR_WIDTH_CLASS_NAME[size]} items-center gap-3 px-4 md:px-0`}>
        {leading}
        <Link className="shrink-0" href="/" aria-label="choimory.dev 홈">
          <BrandLogo size="sm" />
        </Link>
        {serviceName && <span className="text-sm text-muted">/ {serviceName}</span>}

        <div className="ml-auto flex items-center gap-2">
          <button className="grid size-10 place-items-center rounded-[10px] text-foreground" type="button" aria-label="검색">
            <Icon name="search" />
          </button>
          <button className="grid size-10 place-items-center rounded-[10px] text-foreground" type="button" aria-label="알림">
            <Icon name="bell" />
          </button>
          <Link className="grid h-9 place-items-center rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground" href={isLoggedIn ? '/me' : '/login'}>
            {isLoggedIn ? '내 공간' : '로그인'}
          </Link>
        </div>
      </div>
    </header>
  );
}
