import Link from 'next/link';

import { LoginLink } from '@/features/auth/components/LoginLink';

import { Card } from '@/shared/ui/Card';
import { Icon } from '@/shared/ui/Icon';
import { IconBadge } from '@/shared/ui/IconBadge';
import { ListRow } from '@/shared/ui/ListRow';

import type { PlatformService } from '../model/platformHomeTypes';

/**
 * 비회원 랜딩 섹션 Props입니다.
 */
type GuestLandingSectionProps = {
  services: PlatformService[]; // 소개할 서비스 목록
};

/** 비회원에게 안내할 서비스 특징 */
const GUEST_FEATURES = [
  '공개 블로그 피드는 바로 둘러보기',
  '피드에서 방송과 가격 알림 흐름 확인',
  '서비스별 알림과 활동 요약 확인',
];

/**
 * 비로그인 사용자에게 플랫폼의 주요 서비스를 소개하는 섹션입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 비회원 랜딩 섹션
 */
export function GuestLandingSection({ services }: GuestLandingSectionProps) {
  return (
    <Card as="section" className="grid gap-6" aria-labelledby="guest-landing-title">
      <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div>
          <h2 id="guest-landing-title" className="text-display-s leading-tight">
            블로그와 피드부터 둘러보고, 로그인하면 내 서비스 허브가 열려요
          </h2>
          <p className="mt-2 max-w-[52ch] text-sm leading-6 text-ink-2">
            비회원은 공개 글과 서비스 구성을 확인할 수 있고, 로그인하면 개인 피드와 알림 요약을 이어서 사용할 수 있어요.
          </p>
          <div className="mt-3 flex min-h-11 flex-wrap items-center gap-3">
            <LoginLink className="key relative inline-grid h-10 place-items-center px-4 text-sm font-semibold after:absolute after:inset-x-0 after:-inset-y-0.5">
              로그인
            </LoginLink>
            <Link className="key relative inline-grid h-10 place-items-center px-4 text-sm font-semibold after:absolute after:inset-x-0 after:-inset-y-0.5" href="/signup">
              회원가입
            </Link>
          </div>
        </div>

        <div className="grid border-t border-border">
          {GUEST_FEATURES.map((feature) => (
            <ListRow key={feature} className="px-0" leading={<Icon className="size-4 text-muted" name="star" />}>
              <span className="text-sm text-ink-2">{feature}</span>
            </ListRow>
          ))}
        </div>
      </div>

      <div className="grid border-t border-border" aria-label="비회원 서비스 안내">
        {services.map((service) => {
          const isPlanned = service.status === 'planned';

          return (
            <div key={service.id} className="aria-disabled:cursor-not-allowed" aria-disabled={isPlanned ? true : undefined}>
              <ListRow
                href={isPlanned ? undefined : service.href}
                isDimmed={isPlanned}
                className={isPlanned ? 'px-0' : 'px-0 transition-none active:bg-background'}
                leading={(
                  <IconBadge as="span" size="sm" tone="strong">
                    <Icon className="size-4 text-ink-2" name={service.iconName} />
                  </IconBadge>
                )}
                trailing={<span className="whitespace-nowrap text-xs font-medium text-ink-2">{isPlanned ? '준비 중' : '이동'}</span>}
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground">{service.name}</span>
                  <span className="block text-xs text-ink-2">{service.description}</span>
                </span>
              </ListRow>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
