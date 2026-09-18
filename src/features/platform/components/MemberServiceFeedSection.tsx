import Link from 'next/link';

import { Icon } from '@/shared/ui/Icon';

import type { PlatformService, RecentActivity, TodaySummary } from '../model/platformHomeTypes';

/**
 * 로그인 사용자용 서비스 피드 섹션 컴포넌트의 Props
 */
type MemberServiceFeedSectionProps = {
  todaySummaries: TodaySummary[];      // 오늘 요약 목록
  recentActivities: RecentActivity[];  // 최근 활동 목록
  services: PlatformService[];         // 서비스별 피드 카드 목록
};

/** 최근 활동 강조 색상 클래스 */
const ACTIVITY_TONE_CLASS_NAME: Record<RecentActivity['tone'], string> = {
  blue: 'bg-primary text-primary-foreground',
  green: 'bg-accent-green text-primary-foreground',
  orange: 'bg-accent-orange text-primary-foreground',
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
};

/**
 * 회원용 서비스 피드 알림
 */
type MemberServiceFeedNotification = {
  id: string;       // 알림 고유 ID
  title: string;    // 알림 제목
  timeText: string; // 알림 시간
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
      { label: '내가 쓴 글', value: '12' },
      { label: '내가 쓴 댓글', value: '48' },
      { label: '팔로워 수', value: '128' },
      { label: '팔로잉 수', value: '36' },
    ],
    notifications: [
      { id: 'blog-notice-1', title: '새 댓글이 달렸습니다', timeText: '방금' },
      { id: 'blog-notice-2', title: '팔로잉한 사용자가 글을 올렸습니다', timeText: '14분 전' },
      { id: 'blog-notice-3', title: '내 글이 인기 목록에 올랐습니다', timeText: '38분 전' },
      { id: 'blog-notice-4', title: '새 팔로워가 생겼습니다', timeText: '1시간 전' },
    ],
  },
  {
    id: 'feed-feed',
    serviceId: 'feed',
    metrics: [
      { label: '관찰 중인 아이템', value: '18' },
      { label: '관찰 중인 스트리머', value: '7' },
    ],
    notifications: [
      { id: 'feed-notice-1', title: '관심 스트리머 방송이 시작되었습니다', timeText: '12분 전' },
      { id: 'feed-notice-2', title: '관심 상품이 목표가 아래로 내려갔습니다', timeText: '22분 전' },
      { id: 'feed-notice-3', title: '새 가격 변동이 감지되었습니다', timeText: '46분 전' },
      { id: 'feed-notice-4', title: '관찰 목록에 새 업데이트가 있습니다', timeText: '2시간 전' },
    ],
  },
];

/** 준비 중 서비스 알림 안내 */
const PLANNED_SERVICE_NOTIFICATIONS: MemberServiceFeedNotification[] = [
  { id: 'planned-1', title: '서비스 데이터 구조를 준비 중입니다', timeText: '예정' },
  { id: 'planned-2', title: '활성화 후 개인 피드가 표시됩니다', timeText: '예정' },
];

/**
 * 로그인 사용자에게 서비스별 요약 피드를 표시합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 로그인 사용자용 서비스 피드 섹션
 */
export function MemberServiceFeedSection({ todaySummaries, recentActivities, services }: MemberServiceFeedSectionProps) {
  return (
    <section className="grid gap-4" aria-label="내 서비스 피드">
      <div className="grid grid-cols-3 gap-2">
        {todaySummaries.map((summary) => (
          <article key={summary.label} className="rounded-2xl border border-border bg-surface p-3 text-center">
            <p className="text-2xl font-black text-foreground">{summary.value}</p>
            <p className="mt-1 text-xs leading-4 text-muted">{summary.label}</p>
          </article>
        ))}
      </div>

      <section className="rounded-3xl border border-border bg-surface p-5" aria-labelledby="member-feed-title">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-primary">내 피드</p>
            <h2 id="member-feed-title" className="mt-1 text-xl font-bold leading-tight">
              서비스별 활동 요약
            </h2>
          </div>
          <button className="h-9 rounded-[10px] bg-surface-strong px-3 text-sm font-bold text-foreground" type="button">
            모두 보기
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          {recentActivities.map((activity) => (
            <article key={activity.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-surface-strong p-3">
              <span className={`grid size-9 place-items-center rounded-full text-xs font-black ${ACTIVITY_TONE_CLASS_NAME[activity.tone]}`}>
                {activity.serviceName.slice(0, 1)}
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-foreground">{activity.title}</h3>
                <p className="mt-1 text-xs text-muted">{activity.serviceName}</p>
              </div>
              <time className="text-xs text-muted">{activity.timeText}</time>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-3" aria-labelledby="service-feed-card-title">
        <div className="px-1">
          <p className="text-sm font-bold text-primary">서비스별 피드</p>
          <h2 id="service-feed-card-title" className="mt-1 text-xl font-bold leading-tight text-foreground">
            각 서비스 흐름을 바로 확인
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
                      <article key={metric.label} className="rounded-2xl bg-surface-strong p-3 transition hover:bg-primary-soft">
                        <p className="text-2xl font-black text-foreground">{metric.value}</p>
                        <p className="mt-1 text-xs leading-4 text-muted">{metric.label}</p>
                      </article>
                    ))}
                  </div>
                )}

                <div className="grid gap-2">
                  {notifications.map((notification) => (
                    <article key={notification.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-surface-strong p-3 transition hover:bg-primary-soft">
                      <h4 className="truncate text-sm font-bold text-foreground">{notification.title}</h4>
                      <time className="text-xs text-muted">{notification.timeText}</time>
                    </article>
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
