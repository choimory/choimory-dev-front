import type { RecentActivity, TodaySummary } from '../model/platformHomeTypes';

/**
 * 로그인 사용자용 서비스 피드 섹션 컴포넌트의 Props
 */
type MemberServiceFeedSectionProps = {
  todaySummaries: TodaySummary[];      // 오늘 요약 목록
  recentActivities: RecentActivity[];  // 최근 활동 목록
};

/** 최근 활동 강조 색상 클래스 */
const ACTIVITY_TONE_CLASS_NAME: Record<RecentActivity['tone'], string> = {
  blue: 'bg-primary text-primary-foreground',
  green: 'bg-accent-green text-primary-foreground',
  orange: 'bg-accent-orange text-primary-foreground',
};

/**
 * 로그인 사용자에게 서비스별 요약 피드를 표시합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 로그인 사용자용 서비스 피드 섹션
 */
export function MemberServiceFeedSection({ todaySummaries, recentActivities }: MemberServiceFeedSectionProps) {
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
    </section>
  );
}
