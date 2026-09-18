import Link from 'next/link';

import { Icon } from '@/shared/ui/Icon';

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
    <section className="grid gap-4 rounded-3xl border border-border bg-surface p-5" aria-labelledby="guest-landing-title">
      <div className="grid gap-3">
        <p className="text-sm font-bold text-primary">choimory.dev 시작하기</p>
        <h2 id="guest-landing-title" className="text-2xl font-black leading-tight">
          블로그와 피드부터 둘러보고, 로그인하면 내 서비스 허브가 열립니다
        </h2>
        <p className="text-sm leading-6 text-muted">
          비회원은 공개 글과 서비스 구성을 확인할 수 있고, 로그인하면 개인 피드와 알림 요약을 이어서 사용할 수 있습니다.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link className="grid h-10 place-items-center rounded-[10px] bg-primary px-4 text-sm font-bold text-primary-foreground" href="/login">
            로그인
          </Link>
          <Link className="grid h-10 place-items-center rounded-[10px] bg-surface-strong px-4 text-sm font-bold text-foreground" href="/signup">
            회원가입
          </Link>
        </div>
      </div>

      <div className="grid gap-2 border-y border-border py-3">
        {GUEST_FEATURES.map((feature) => (
          <div key={feature} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 text-sm text-foreground">
            <span className="grid size-6 place-items-center rounded-full bg-primary-soft text-primary">
              <Icon className="size-4" name="star" />
            </span>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-2" aria-label="비회원 서비스 안내">
        {services.map((service) => {
          const serviceContent = (
            <>
              <span className="grid size-9 place-items-center rounded-[10px] bg-surface-strong text-primary">
                <Icon className="size-4" name={service.iconName} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-foreground">{service.name}</span>
                <span className="block truncate text-xs text-muted">{service.description}</span>
              </span>
              <span className={`text-xs font-bold ${service.status === 'active' ? 'text-primary' : 'text-muted'}`}>
                {service.meta}
              </span>
            </>
          );

          return service.status === 'active' ? (
            <Link key={service.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[10px] py-2" href={service.href}>
              {serviceContent}
            </Link>
          ) : (
            <div key={service.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[10px] py-2 opacity-75" aria-disabled="true">
              {serviceContent}
            </div>
          );
        })}
      </div>
    </section>
  );
}
