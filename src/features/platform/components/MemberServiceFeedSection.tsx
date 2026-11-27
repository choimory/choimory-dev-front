import Link from 'next/link';

import { Card } from '@/shared/ui/Card';
import { Icon } from '@/shared/ui/Icon';
import { IconBadge } from '@/shared/ui/IconBadge';
import { ListRow } from '@/shared/ui/ListRow';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { StatCard } from '@/shared/ui/StatCard';

import type { PlatformService } from '../model/platformHomeTypes';

/**
 * 로그인 사용자용 서비스 피드 섹션 컴포넌트의 Props
 */
type MemberServiceFeedSectionProps = {
  services: PlatformService[]; // 서비스별 피드 카드 목록
};

/**
 * 회원용 서비스 피드 카드 지표
 */
type MemberServiceFeedMetric = {
  label: string; // 지표 이름
  value: string; // 지표 값
  href: string;  // 지표 상세 경로
};

/**
 * 회원용 서비스 피드 알림
 */
type MemberServiceFeedNotification = {
  id: string;       // 알림 고유 ID
  title: string;    // 알림 제목
  timeText: string; // 알림 시간
  href: string;     // 알림 상세 경로
};

/**
 * 회원용 서비스 피드 카드 데이터
 */
type MemberServiceFeedCard = {
  id: string;                                  // 서비스 피드 카드 고유 ID
  serviceId: PlatformService['id'];           // 연결할 플랫폼 서비스 ID
  metrics: MemberServiceFeedMetric[];         // 서비스별 지표 목록
  notifications: MemberServiceFeedNotification[]; // 서비스별 알림 목록
};

/** 회원용 서비스 피드 카드 임시 데이터 */
const MEMBER_SERVICE_FEED_CARDS: MemberServiceFeedCard[] = [
  {
    id: 'blog-feed',
    serviceId: 'blog',
    metrics: [
      { label: '내가 쓴 글', value: '12', href: '/blog/me' },
      { label: '내가 쓴 댓글', value: '48', href: '/blog/me' },
      { label: '팔로워 수', value: '128', href: '/blog/me' },
      { label: '팔로잉 수', value: '36', href: '/blog/following' },
    ],
    notifications: [
      { id: 'blog-notice-1', title: '새 댓글이 달렸어요', timeText: '방금', href: '/blog/posts/post-1' },
      { id: 'blog-notice-2', title: '팔로잉한 사용자가 글을 올렸어요', timeText: '14분 전', href: '/blog/following' },
      { id: 'blog-notice-3', title: '내 글이 인기 목록에 올랐어요', timeText: '38분 전', href: '/blog/popular' },
      { id: 'blog-notice-4', title: '새 팔로워가 생겼어요', timeText: '1시간 전', href: '/blog/me' },
    ],
  },
  {
    id: 'feed-feed',
    serviceId: 'feed',
    metrics: [
      { label: '관찰 중인 아이템', value: '18', href: '/feed/observations' },
      { label: '관찰 중인 스트리머', value: '7', href: '/feed/observations' },
    ],
    notifications: [
      { id: 'feed-notice-1', title: '관심 스트리머 방송이 시작됐어요', timeText: '12분 전', href: '/feed/activities/activity-1' },
      { id: 'feed-notice-2', title: '관심 상품이 목표가 아래로 내려갔어요', timeText: '22분 전', href: '/feed/activities/activity-2' },
      { id: 'feed-notice-3', title: '새 가격 변동이 감지됐어요', timeText: '46분 전', href: '/feed/activities/activity-3' },
      { id: 'feed-notice-4', title: '관찰 목록에 새 업데이트가 있어요', timeText: '2시간 전', href: '/feed/observations' },
    ],
  },
];

/** 준비 중 서비스 알림 안내 */
const PLANNED_SERVICE_NOTIFICATIONS: MemberServiceFeedNotification[] = [
  { id: 'planned-1', title: '서비스 데이터 구조를 준비하고 있어요', timeText: '예정', href: '/services' },
  { id: 'planned-2', title: '활성화 후 개인 피드가 표시돼요', timeText: '예정', href: '/services' },
];

/** 플랫폼 홈 프로필 임시 데이터 */
const MEMBER_PROFILE = {
  nickname: 'mory.dev',
  email: 'mory@example.com',
  description: 'choimory.dev의 서비스를 조용히 다듬는 계정이에요.',
};

/**
 * 로그인 사용자에게 서비스별 요약 피드를 표시합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 로그인 사용자용 서비스 피드 섹션
 */
export function MemberServiceFeedSection({ services }: MemberServiceFeedSectionProps) {
  const activeServices = services.filter((service) => service.status === 'active');
  const plannedServices = services.filter((service) => service.status === 'planned');

  return (
    <section className="grid gap-4" aria-label="내 서비스 피드">
      <section className="grid gap-2" aria-labelledby="member-profile-section-title">
        <SectionHeader domainPath="platform / me" title="내 프로필" headingId="member-profile-section-title" />

        <Card as="article" aria-labelledby="member-profile-title">
          <div className="flex items-center justify-between gap-3">
            <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
              <IconBadge size="xl" tone="strong" className="text-lg font-semibold">
                <span className="text-ink-2">C</span>
              </IconBadge>
              <div className="min-w-0">
                <h3 id="member-profile-title" className="text-section text-foreground">{MEMBER_PROFILE.nickname}</h3>
                <p className="mt-0.5 text-sm text-muted">{MEMBER_PROFILE.email}</p>
                <p className="mt-2 text-sm leading-5 text-ink-2">{MEMBER_PROFILE.description}</p>
              </div>
            </div>
            <Link className="key relative hidden h-10 shrink-0 place-items-center px-4 text-sm font-semibold after:absolute after:inset-x-0 after:-inset-y-0.5 sm:grid" href="/me">
              내 정보 관리
            </Link>
          </div>
        </Card>
      </section>

      <section className="grid gap-2" aria-labelledby="service-feed-card-title">
        <SectionHeader domainPath="platform / services" title="서비스 현황" headingId="service-feed-card-title" />

        <div className="grid gap-4">
          {activeServices.map((service) => {
            const serviceFeed = MEMBER_SERVICE_FEED_CARDS.find((feedCard) => feedCard.serviceId === service.id);
            const metrics = serviceFeed?.metrics ?? [];
            const notifications = serviceFeed?.notifications ?? PLANNED_SERVICE_NOTIFICATIONS;
            return (
              <Card key={service.id} as="article" className="grid gap-4">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <div className="flex min-w-0 flex-[1_1_12rem] items-center gap-3">
                    <IconBadge as="span" tone="strong">
                      <Icon className="text-ink-2" name={service.iconName} />
                    </IconBadge>
                    <div className="min-w-0">
                      <h3 className="text-section leading-tight text-foreground">{service.description}</h3>
                      <p className="mt-1 text-sm font-medium text-ink-2">{service.name}</p>
                    </div>
                  </div>
                  <Link className="key relative ml-auto inline-grid h-9 shrink-0 place-items-center px-3 text-sm font-medium after:absolute after:inset-x-0 after:-inset-y-1" href={service.href}>
                    바로가기
                  </Link>
                </div>

                {metrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-[repeat(auto-fit,minmax(7rem,1fr))]">
                    {metrics.map((metric) => (
                      <Link key={metric.label} className="min-w-0 pb-2 hover:bg-surface-strong hover:underline active:bg-background" href={metric.href}>
                        <StatCard label={metric.label} value={metric.value} />
                      </Link>
                    ))}
                  </div>
                )}

                <div className="grid border-t border-border">
                  {notifications.map((notification) => (
                    <ListRow
                      key={notification.id}
                      href={notification.href}
                      className="min-h-11 px-0 transition-none last:border-b-0 active:bg-background"
                      trailing={<time className="whitespace-nowrap text-xs tabular-nums text-ink-2">{notification.timeText}</time>}
                    >
                      <h4 className="text-sm font-medium text-foreground">{notification.title}</h4>
                    </ListRow>
                  ))}
                </div>
              </Card>
            );
          })}

          {plannedServices.length > 0 && (
            <Card className="divide-y divide-border py-0">
              {plannedServices.map((service) => {
                const serviceFeed = MEMBER_SERVICE_FEED_CARDS.find((feedCard) => feedCard.serviceId === service.id);
                const metrics = serviceFeed?.metrics ?? [];
                const notifications = serviceFeed?.notifications ?? PLANNED_SERVICE_NOTIFICATIONS;

                return (
                  <article key={service.id} className="grid gap-x-4 gap-y-1 py-2 opacity-75 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] sm:items-center">
                    <div className="flex min-w-0 items-center gap-2">
                      <IconBadge as="span" size="sm" tone="strong">
                        <Icon className="size-4 text-ink-2" name={service.iconName} />
                      </IconBadge>
                      <div className="flex min-w-0 flex-col-reverse">
                        <h3 className="text-xs text-ink-2">{service.description}</h3>
                        <p className="text-sm font-semibold text-foreground">{service.name}</p>
                      </div>
                      <span className="ml-auto shrink-0 text-xs font-medium text-ink-2">준비 중</span>
                    </div>

                    {metrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 sm:col-span-2">
                        {metrics.map((metric) => (
                          <Link key={metric.label} className="min-w-0 pb-2 hover:bg-surface-strong hover:underline active:bg-background" href={metric.href}>
                            <StatCard label={metric.label} value={metric.value} />
                          </Link>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-x-2">
                      {notifications.map((notification) => (
                        <Link
                          key={notification.id}
                          href={notification.href}
                          className="grid min-h-11 content-center px-1 py-1 hover:bg-surface-strong hover:underline active:bg-background"
                        >
                          <h4 className="text-xs font-medium text-foreground">{notification.title}</h4>
                          <time className="text-xs tabular-nums text-ink-2">{notification.timeText}</time>
                        </Link>
                      ))}
                    </div>
                  </article>
                );
              })}
            </Card>
          )}
        </div>
      </section>
    </section>
  );
}
