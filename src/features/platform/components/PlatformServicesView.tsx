import Link from 'next/link';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Icon } from '@/shared/ui/Icon';

import type { PlatformService } from '../model/platformHomeTypes';

/**
 * 플랫폼 서비스 메뉴 화면 컴포넌트의 Props
 */
type PlatformServicesViewProps = {
  isLoggedIn: boolean;       // 로그인 여부
  services: PlatformService[]; // 플랫폼 서비스 목록
};

/** 서비스 강조 색상별 클래스 */
const SERVICE_TONE_CLASS_NAME: Record<PlatformService['tone'], string> = {
  blue: 'text-primary bg-primary-soft',
  green: 'text-accent-green bg-accent-green-soft',
  orange: 'text-accent-orange bg-accent-orange-soft',
  purple: 'text-accent-purple bg-accent-purple-soft',
};

/**
 * 플랫폼 전체 서비스 메뉴 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 전체 서비스 메뉴 화면
 */
export function PlatformServicesView({ isLoggedIn, services }: PlatformServicesViewProps) {
  return (
    <AppFrame>
      <AppTopBar isLoggedIn={isLoggedIn} />
      <AppContent className="grid gap-4">
        <section className="rounded-3xl border border-border bg-surface p-5" aria-labelledby="services-title">
          <p className="text-sm font-bold text-primary">choimory.dev / services</p>
          <h1 id="services-title" className="mt-1 text-2xl font-black leading-tight text-foreground">
            사용할 서비스를 선택하세요
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            현재 열린 서비스와 준비 중인 서비스를 한 화면에서 확인합니다.
          </p>
        </section>

        <section className="grid gap-3" aria-label="서비스 목록">
          {services.map((service) => {
            const cardContent = (
              <>
                <span className={`grid size-12 shrink-0 place-items-center rounded-2xl border border-border/60 ${SERVICE_TONE_CLASS_NAME[service.tone]}`}>
                  <Icon name={service.iconName} />
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-bold text-foreground">{service.name}</span>
                  <span className="mt-1 block text-sm leading-5 text-muted">{service.description}</span>
                </span>
                <span className="shrink-0 rounded-full bg-surface-strong px-2.5 py-1 text-xs font-bold text-muted">
                  {service.meta}
                </span>
              </>
            );

            if (service.status === 'planned') {
              return (
                <article key={service.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-surface p-4 opacity-75">
                  {cardContent}
                </article>
              );
            }

            return (
              <Link key={service.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-surface p-4 transition hover:bg-surface-strong" href={service.href}>
                {cardContent}
              </Link>
            );
          })}
        </section>
      </AppContent>

      <BottomNavigation
        items={[
          { label: '홈', href: '/', iconName: 'home' },
          { label: '공지사항', href: '/notice', iconName: 'megaphone' },
          { label: '서비스', href: '/services', iconName: 'grid', isActive: true },
          { label: '내 정보', href: '/me', iconName: 'user' },
        ]}
      />
    </AppFrame>
  );
}
