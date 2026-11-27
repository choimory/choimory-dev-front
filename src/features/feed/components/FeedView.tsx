import Link from 'next/link';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Icon } from '@/shared/ui/Icon';
import { IconBadge } from '@/shared/ui/IconBadge';
import { ListRow } from '@/shared/ui/ListRow';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { StatCard } from '@/shared/ui/StatCard';

import { TargetPreviewLink } from './TargetPreviewLink';
import type { FeedViewModel } from '../model/feedTypes';

/**
 * feed 화면 컴포넌트의 Props
 */
type FeedViewProps = {
  viewModel: FeedViewModel; // feed 화면 데이터
};

/**
 * 아이템, 스트리머, 아티스트 관찰 알림을 모아보는 feed 서비스 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns feed 서비스 화면
 */
export function FeedView({ viewModel }: FeedViewProps) {
  const isMember = viewModel.authStatus === 'member';
  const featuredTargets = viewModel.targets.filter((target) => target.isWatching).slice(0, 3);

  return (
    <AppFrame>
      <AppTopBar
        isLoggedIn={isMember}
        serviceName="feed"
        serviceHref="/feed"
        leading={
          <Link className="grid size-11 place-items-center rounded-input text-foreground hover:bg-surface-strong active:bg-surface-strong" href="/" aria-label="플랫폼 홈으로 돌아가기">
            <Icon name="chevronLeft" />
          </Link>
        }
      />

      <AppContent className="grid gap-6">
        <section className="px-1" aria-labelledby="feed-title">
          <h1 id="feed-title" className="font-display text-display font-semibold leading-tight text-balance text-foreground">
            가격, 방송, 신곡 알림을 한 피드에서
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">{viewModel.description}</p>

          {!isMember && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Link className="key key-primary relative inline-flex h-10 items-center whitespace-nowrap px-4 text-sm font-semibold after:absolute after:-inset-y-0.5 after:inset-x-0" href="/login">
                로그인
              </Link>
              <Link className="key relative inline-flex h-10 items-center whitespace-nowrap px-4 text-sm font-semibold after:absolute after:-inset-y-0.5 after:inset-x-0" href="/signup">
                회원가입
              </Link>
            </div>
          )}
        </section>

        {isMember ? (
          <>
            <section className="grid grid-cols-2 gap-3 min-[360px]:grid-cols-4" aria-label="feed 요약">
              {viewModel.summaries.map((summary) => (
                <Link key={summary.label} className="min-w-0 hover:bg-surface-strong active:bg-surface-strong" href="/feed/observations">
                  <StatCard label={summary.label} value={summary.value} />
                </Link>
              ))}
            </section>

            <section className="grid gap-1" aria-labelledby="feed-observation-title">
              <SectionHeader domainPath="feed / target" title="관심 대상" headingId="feed-observation-title" />
              <div className="grid">
                {featuredTargets.map((target) => (
                  <TargetPreviewLink key={target.id} target={target} href={`/feed/targets/${target.id}`} />
                ))}
              </div>
            </section>

            <section className="grid gap-1" aria-labelledby="feed-activity-title">
              <SectionHeader domainPath="feed / activity" title="최근 알림" headingId="feed-activity-title" />
              <div className="grid">
                {viewModel.activities.map((activity) => (
                  <ListRow
                    key={activity.id}
                    href={`/feed/targets/${activity.targetId}`}
                    className="active:bg-surface-strong"
                    leading={(
                      <IconBadge as="span" size="sm" tone="strong">
                        <Icon className="size-4" name="bell" />
                      </IconBadge>
                    )}
                    trailing={<time className="whitespace-nowrap text-xs tabular-nums text-muted">{activity.timeText}</time>}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-foreground">{activity.title}</span>
                      <span className="mt-1 block text-xs text-muted">{activity.source}</span>
                    </span>
                  </ListRow>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="grid gap-1" aria-labelledby="feed-signal-title">
              <SectionHeader domainPath="feed / preview" title="준비 중인 알림" headingId="feed-signal-title" />
              <div className="grid">
                {viewModel.signals.map((signal) => (
                  <ListRow as="article" key={signal.id} className="items-baseline sm:grid-cols-[10rem_minmax(0,1fr)]">
                    <h3 className="text-start text-base font-semibold text-foreground">{signal.title}</h3>
                    <p className="text-sm leading-6 text-muted">{signal.description}</p>
                  </ListRow>
                ))}
              </div>
            </section>

            <section className="grid gap-1" aria-labelledby="feed-benefit-title">
              <SectionHeader domainPath="feed / benefits" title="맞춤 피드" headingId="feed-benefit-title" />
              <div className="grid">
                {viewModel.guestBenefits.map((benefit) => (
                  <ListRow as="article" key={benefit.id} className="items-baseline sm:grid-cols-[10rem_minmax(0,1fr)]">
                    <h3 className="text-start text-base font-semibold text-foreground">{benefit.title}</h3>
                    <p className="text-sm leading-6 text-muted">{benefit.description}</p>
                  </ListRow>
                ))}
              </div>
            </section>
          </>
        )}
      </AppContent>

      <BottomNavigation
        items={[
          { label: '홈', href: '/feed', iconName: 'home', isActive: true },
          { label: '인기', href: '/feed/popular', iconName: 'trophy' },
          { label: '관찰', href: '/feed/observations', iconName: 'barChart' },
          { label: '내 피드', href: '/feed/me', iconName: 'user' },
        ]}
      />
    </AppFrame>
  );
}
