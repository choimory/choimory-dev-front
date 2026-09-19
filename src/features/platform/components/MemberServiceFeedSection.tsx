import Link from 'next/link';

import { Icon } from '@/shared/ui/Icon';

import type { PlatformService } from '../model/platformHomeTypes';

/**
 * 로그인 사용자용 서비스 피드 섹션 컴포넌트의 Props
 */
type MemberServiceFeedSectionProps = {
  services: PlatformService[]; // 서비스별 피드 카드 목록
};

/** 서비스 강조 색상별 클래스 */
const SERVICE_TONE_CLASS_NAME: Record<PlatformService['tone'], string> = {
  blue: 'text-primary bg-primary-soft',
  green: 'text-accent-green bg-accent-green-soft',
  orange: 'text-accent-orange bg-accent-orange-soft',
  purple: 'text-accent-purple bg-accent-purple-soft',
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
      { id: 'blog-notice-1', title: '새 댓글이 달렸습니다', timeText: '방금', href: '/blog/posts/post-1' },
      { id: 'blog-notice-2', title: '팔로잉한 사용자가 글을 올렸습니다', timeText: '14분 전', href: '/blog/following' },
      { id: 'blog-notice-3', title: '내 글이 인기 목록에 올랐습니다', timeText: '38분 전', href: '/blog/popular' },
      { id: 'blog-notice-4', title: '새 팔로워가 생겼습니다', timeText: '1시간 전', href: '/blog/me' },
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
      { id: 'feed-notice-1', title: '관심 스트리머 방송이 시작되었습니다', timeText: '12분 전', href: '/feed/activities/activity-1' },
      { id: 'feed-notice-2', title: '관심 상품이 목표가 아래로 내려갔습니다', timeText: '22분 전', href: '/feed/activities/activity-2' },
      { id: 'feed-notice-3', title: '새 가격 변동이 감지되었습니다', timeText: '46분 전', href: '/feed/activities/activity-3' },
      { id: 'feed-notice-4', title: '관찰 목록에 새 업데이트가 있습니다', timeText: '2시간 전', href: '/feed/observations' },
    ],
  },
];

/** 준비 중 서비스 알림 안내 */
const PLANNED_SERVICE_NOTIFICATIONS: MemberServiceFeedNotification[] = [
  { id: 'planned-1', title: '서비스 데이터 구조를 준비 중입니다', timeText: '예정', href: '/services' },
  { id: 'planned-2', title: '활성화 후 개인 피드가 표시됩니다', timeText: '예정', href: '/services' },
];

/** 플랫폼 홈 프로필 임시 데이터 */
const MEMBER_PROFILE = {
  nickname: 'mory.dev',
  email: 'mory@example.com',
  description: 'choimory.dev의 서비스를 조용히 다듬는 계정입니다.',
};

/**
 * 로그인 사용자에게 서비스별 요약 피드를 표시합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 로그인 사용자용 서비스 피드 섹션
 */
export function MemberServiceFeedSection({ services }: MemberServiceFeedSectionProps) {
  return (
    <section className="grid gap-4" aria-label="내 서비스 피드">
      <section className="grid gap-3" aria-labelledby="member-profile-section-title">
        <div className="px-1">
          <p className="text-sm font-bold text-primary">/me</p>
          <h2 id="member-profile-section-title" className="mt-1 text-xl font-bold leading-tight text-foreground">
            나를 소개하세요
          </h2>
        </div>

        <article className="rounded-3xl border border-border bg-surface p-5" aria-labelledby="member-profile-title">
          <div className="flex items-center justify-between gap-3">
            <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
              <div className="grid size-16 place-items-center rounded-3xl bg-primary text-xl font-black text-primary-foreground">
                C
              </div>
              <div className="min-w-0">
                <h3 id="member-profile-title" className="mt-1 text-2xl font-bold tracking-normal text-foreground">{MEMBER_PROFILE.nickname}</h3>
                <p className="mt-1 text-sm text-muted">{MEMBER_PROFILE.email}</p>
                <p className="mt-2 text-sm leading-5 text-muted">{MEMBER_PROFILE.description}</p>
              </div>
            </div>
            <Link className="hidden h-10 shrink-0 place-items-center rounded-[10px] bg-primary px-4 text-sm font-bold text-primary-foreground sm:grid" href="/me">
              내 정보 관리
            </Link>
          </div>
        </article>
      </section>

      <section className="grid gap-3" aria-labelledby="service-feed-card-title">
        <div className="px-1">
          <p className="text-sm font-bold text-primary">/services</p>
          <h2 id="service-feed-card-title" className="mt-1 text-xl font-bold leading-tight text-foreground">
            나의 현황을 서비스별로 확인하세요
          </h2>
        </div>

        <div className="grid gap-4">
          {services.map((service) => {
            const serviceFeed = MEMBER_SERVICE_FEED_CARDS.find((feedCard) => feedCard.serviceId === service.id);
            const metrics = serviceFeed?.metrics ?? [];
            const notifications = serviceFeed?.notifications ?? PLANNED_SERVICE_NOTIFICATIONS;
            return (
              <article key={service.id} className={`grid gap-4 rounded-3xl border border-border bg-surface p-5 ${service.status === 'planned' ? 'opacity-75' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`grid size-12 shrink-0 place-items-center rounded-2xl border border-border/60 ${SERVICE_TONE_CLASS_NAME[service.tone]}`}>
                      <Icon name={service.iconName} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-primary">{service.name}</p>
                      <h3 className="mt-1 text-xl font-bold leading-tight text-foreground">{service.description}</h3>
                    </div>
                  </div>
                  {service.status === 'active' ? (
                    <Link className="shrink-0 rounded-full bg-surface-strong px-2.5 py-1 text-xs font-bold text-muted transition hover:bg-primary hover:text-primary-foreground" href={service.href}>
                      바로가기
                    </Link>
                  ) : (
                    <span className="shrink-0 rounded-full bg-surface-strong px-2.5 py-1 text-xs font-bold text-muted">
                      준비 중
                    </span>
                  )}
                </div>

                {metrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {metrics.map((metric) => (
                      <Link key={metric.label} className="rounded-2xl bg-surface-strong p-3 transition hover:bg-primary-soft" href={metric.href}>
                        <p className="text-2xl font-black text-foreground">{metric.value}</p>
                        <p className="mt-1 text-xs leading-4 text-muted">{metric.label}</p>
                      </Link>
                    ))}
                  </div>
                )}

                <div className="grid gap-2">
                  {notifications.map((notification) => (
                    <Link key={notification.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-surface-strong p-3 transition hover:bg-primary-soft" href={notification.href}>
                      <h4 className="truncate text-sm font-bold text-foreground">{notification.title}</h4>
                      <time className="text-xs text-muted">{notification.timeText}</time>
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
}
