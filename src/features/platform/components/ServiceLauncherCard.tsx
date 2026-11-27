'use client';

import Link from 'next/link';
import { useRef } from 'react';

import { Card } from '@/shared/ui/Card';
import { Icon } from '@/shared/ui/Icon';
import { IconBadge } from '@/shared/ui/IconBadge';
import { IconButton } from '@/shared/ui/IconButton';

import type { PlatformService } from '../model/platformHomeTypes';

/**
 * 서비스 런처 카드 컴포넌트의 Props
 */
type ServiceLauncherCardProps = {
  services: PlatformService[]; // 런처에 표시할 서비스 목록
};

/** 런처 좌우 이동 버튼의 터치 영역 */
const LAUNCHER_ARROW_CLASS_NAME = 'relative after:absolute after:-inset-1';

/**
 * 플랫폼 하위 서비스를 하나의 카드 안에 아이콘 런처로 표시합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 서비스 런처 카드
 */
export function ServiceLauncherCard({ services }: ServiceLauncherCardProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  /**
   * 서비스 런처를 좌우로 이동합니다.
   *
   * @param direction 이동 방향
   */
  const handleScroll = (direction: 'left' | 'right') => {
    scrollContainerRef.current?.scrollBy({
      left: direction === 'left' ? -240 : 240,
      behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  };

  return (
    <Card as="section" padding="sm" className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2" aria-label="서비스 런처">
      <IconButton
        className={LAUNCHER_ARROW_CLASS_NAME}
        ariaLabel="이전 서비스 보기"
        onClick={() => handleScroll('left')}
      >
        <Icon className="size-5" name="chevronLeft" />
      </IconButton>

      <div ref={scrollContainerRef} className="flex items-center gap-1 overflow-x-auto p-1 [scrollbar-width:none]">
        {services.map((service) => {
          const serviceContent = (
            <>
              <IconBadge as="span" size="xs" tone="strong">
                <Icon className="size-4 text-ink-2" name={service.iconName} />
              </IconBadge>
              <span className="grid justify-items-start whitespace-nowrap">
                <span className="text-xs font-medium text-foreground">{service.name}</span>
                {service.status === 'planned' && (
                  <span className="text-xs text-ink-2">예정</span>
                )}
              </span>
            </>
          );

          return service.status === 'active' ? (
            <Link key={service.id} className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-input px-2 hover:bg-surface-strong active:bg-background" href={service.href}>
              {serviceContent}
            </Link>
          ) : (
            <button key={service.id} className="relative inline-flex h-10 shrink-0 cursor-not-allowed items-center gap-1.5 px-2 opacity-75 after:absolute after:inset-x-0 after:-inset-y-0.5" type="button" aria-disabled="true">
              {serviceContent}
            </button>
          );
        })}
      </div>

      <IconButton
        className={LAUNCHER_ARROW_CLASS_NAME}
        ariaLabel="다음 서비스 보기"
        onClick={() => handleScroll('right')}
      >
        <span className="rotate-180">
          <Icon className="size-5" name="chevronLeft" />
        </span>
      </IconButton>
    </Card>
  );
}
