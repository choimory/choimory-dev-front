'use client';

import Link from 'next/link';
import { useRef } from 'react';

import { Icon } from '@/shared/ui/Icon';

import type { PlatformService } from '../model/platformHomeTypes';

/**
 * 서비스 런처 카드 컴포넌트의 Props
 */
type ServiceLauncherCardProps = {
  services: PlatformService[]; // 런처에 표시할 서비스 목록
};

/** 서비스 강조 색상별 클래스 */
const SERVICE_TONE_CLASS_NAME: Record<PlatformService['tone'], string> = {
  blue: 'text-primary bg-primary-soft',
  green: 'text-accent-green bg-accent-green-soft',
  orange: 'text-accent-orange bg-accent-orange-soft',
  purple: 'text-accent-purple bg-accent-purple-soft',
};

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
      behavior: 'smooth',
    });
  };

  return (
    <section className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-3xl border border-border bg-surface p-4 shadow-[0_18px_50px_rgba(0,0,0,0.16)]" aria-label="서비스 런처">
      <button
        className="grid size-10 place-items-center rounded-full bg-surface-strong text-foreground"
        type="button"
        aria-label="이전 서비스 보기"
        onClick={() => handleScroll('left')}
      >
        <Icon className="size-5" name="chevronLeft" />
      </button>

      <div ref={scrollContainerRef} className="flex gap-3 overflow-x-hidden scroll-smooth">
        {services.map((service) => {
          const serviceContent = (
            <>
              <span className={`relative grid size-12 place-items-center rounded-2xl border border-border/60 shadow-sm ${SERVICE_TONE_CLASS_NAME[service.tone]}`}>
                <Icon name={service.iconName} />
                {service.status === 'planned' && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-surface px-1.5 py-0.5 text-[10px] font-bold text-muted shadow-sm">
                    예정
                  </span>
                )}
              </span>
              <span className={`max-w-full text-xs font-medium leading-4 ${service.status === 'planned' ? 'text-muted' : 'text-foreground group-hover:text-primary'}`}>
                {service.name}
              </span>
            </>
          );

          return service.status === 'active' ? (
            <Link key={service.id} className="group grid w-20 shrink-0 justify-items-center gap-2 rounded-2xl p-2 text-center transition hover:bg-surface-strong" href={service.href}>
              {serviceContent}
            </Link>
          ) : (
            <button key={service.id} className="grid w-20 shrink-0 cursor-not-allowed justify-items-center gap-2 rounded-2xl p-2 text-center opacity-75" type="button" aria-disabled="true">
              {serviceContent}
            </button>
          );
        })}
      </div>

      <button
        className="grid size-10 place-items-center rounded-full bg-surface-strong text-foreground"
        type="button"
        aria-label="다음 서비스 보기"
        onClick={() => handleScroll('right')}
      >
        <span className="rotate-180">
          <Icon className="size-5" name="chevronLeft" />
        </span>
      </button>
    </section>
  );
}
