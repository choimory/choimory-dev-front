
import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Icon } from '@/shared/ui/Icon';
import { IconBadge } from '@/shared/ui/IconBadge';
import { ListRow } from '@/shared/ui/ListRow';
import { PageIntroCard } from '@/shared/ui/PageIntroCard';

import type { PlatformService } from '../model/platformHomeTypes';

/**
 * 플랫폼 서비스 메뉴 화면 컴포넌트의 Props
 */
type PlatformServicesViewProps = {
  isLoggedIn: boolean;       // 로그인 여부
  services: PlatformService[]; // 플랫폼 서비스 목록
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
        <PageIntroCard
          domainPath="services"
          title="서비스"
          description="현재 열린 서비스와 준비 중인 서비스를 한 화면에서 확인해보세요."
        />

        <section className="grid border-t border-border" aria-label="서비스 목록">
          {services.map((service) => {
            const leading = (
              <IconBadge as="span" size="md" tone="strong">
                <Icon className="text-ink-2" name={service.iconName} />
              </IconBadge>
            );
            const body = (
              <span className="min-w-0">
                <span className="block text-base font-semibold text-foreground">{service.name}</span>
                <span className="mt-1 block text-sm leading-5 text-ink-2">{service.description}</span>
              </span>
            );
            const trailing = (
              <span className="whitespace-nowrap text-xs font-medium text-ink-2">
                {service.status === 'active' ? '이동' : '준비 중'}
              </span>
            );

            if (service.status === 'planned') {
              return (
                <ListRow key={service.id} as="article" padding="md" isDimmed leading={leading} trailing={trailing}>
                  {body}
                </ListRow>
              );
            }

            return (
              <ListRow key={service.id} href={service.href} padding="md" className="transition-none active:bg-surface" leading={leading} trailing={trailing}>
                {body}
              </ListRow>
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
