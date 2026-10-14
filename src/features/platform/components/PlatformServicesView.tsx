
import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Chip } from '@/shared/ui/Chip';
import { Icon } from '@/shared/ui/Icon';
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
        <PageIntroCard
          domainPath="services"
          title="서비스"
          description="현재 열린 서비스와 준비 중인 서비스를 한 화면에서 확인해보세요."
        />

        <section className="grid gap-3" aria-label="서비스 목록">
          {services.map((service) => {
            const leading = (
              <span className={`grid size-12 shrink-0 place-items-center rounded-2xl border border-border/60 ${SERVICE_TONE_CLASS_NAME[service.tone]}`}>
                <Icon name={service.iconName} />
              </span>
            );
            const body = (
              <span className="min-w-0">
                <span className="block text-base font-bold text-foreground">{service.name}</span>
                <span className="mt-1 block text-sm leading-5 text-muted">{service.description}</span>
              </span>
            );
            const trailing = (
              <Chip className="shrink-0">
                {service.status === 'active' ? '이동' : '준비 중'}
              </Chip>
            );

            if (service.status === 'planned') {
              return (
                <ListRow key={service.id} as="article" padding="md" isDimmed leading={leading} trailing={trailing}>
                  {body}
                </ListRow>
              );
            }

            return (
              <ListRow key={service.id} href={service.href} padding="md" leading={leading} trailing={trailing}>
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
