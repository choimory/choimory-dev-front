import Link from 'next/link';
import type { ReactNode } from 'react';

import { BrandLogo } from './BrandLogo';
import { TopBarActions } from './TopBarActions';

/**
 * 상단 앱 바 컴포넌트의 Props
 */
type AppTopBarProps = {
  serviceName?: string;  // 현재 진입한 하위 서비스 이름
  serviceHref?: string;  // 현재 하위 서비스 홈 경로
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
export function AppTopBar({ serviceName, serviceHref, leading, size = 'wide', isLoggedIn = false }: AppTopBarProps) {
  const serviceLabel = serviceName ? `/ ${serviceName}` : null;

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-shell/95 backdrop-blur">
      <div className={`mx-auto flex min-h-16 w-full ${TOP_BAR_WIDTH_CLASS_NAME[size]} items-center gap-2 px-4 py-2 lg:px-0`}>
        {leading && <div className="shrink-0">{leading}</div>}
        <div className="grid min-w-0 shrink gap-0.5 min-[380px]:flex min-[380px]:items-baseline min-[380px]:gap-2">
          <Link className="min-w-0 max-w-[160px] overflow-hidden" href="/" aria-label="choimory.dev 홈">
            <BrandLogo isAnimated={false} size="sm" />
          </Link>
          {serviceLabel && serviceHref && (
            <Link className="w-fit text-xs font-bold text-muted hover:text-primary min-[380px]:text-sm" href={serviceHref}>
              {serviceLabel}
            </Link>
          )}
          {serviceLabel && !serviceHref && (
            <span className="w-fit text-xs font-bold text-muted min-[380px]:text-sm">
              {serviceLabel}
            </span>
          )}
        </div>

        <TopBarActions isLoggedIn={isLoggedIn} />
      </div>
    </header>
  );
}
