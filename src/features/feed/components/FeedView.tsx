import Link from 'next/link';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Card } from '@/shared/ui/Card';
import { Chip } from '@/shared/ui/Chip';
import { Icon } from '@/shared/ui/Icon';
import { IconBadge } from '@/shared/ui/IconBadge';
import { ListRow } from '@/shared/ui/ListRow';
import { SectionHeader } from '@/shared/ui/SectionHeader';

import type { FeedTargetType, FeedViewModel, FeedWatchTarget } from '../model/feedTypes';

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
          <Link className="grid size-10 place-items-center rounded-[10px] text-foreground" href="/" aria-label="플랫폼 홈으로 돌아가기">
            <Icon name="chevronLeft" />
          </Link>
        }
      />

      <AppContent className="grid gap-4">
        <section className="rounded-3xl border border-border bg-surface p-5" aria-labelledby="feed-title">
          <p className="flex items-center gap-1 text-sm font-bold text-primary">
            <BrandLogo size="sm" isAnimated={false} />
            <span>/ feed</span>
          </p>
          <h1 id="feed-title" className="mt-1 text-2xl font-black leading-tight text-foreground">
            가격, 방송, 신곡 알림을 한 피드에서
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">{viewModel.description}</p>

          {!isMember && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Link className="grid h-10 place-items-center rounded-[10px] bg-primary px-4 text-sm font-bold text-primary-foreground" href="/login">
                로그인
              </Link>
              <Link className="grid h-10 place-items-center rounded-[10px] bg-surface-strong px-4 text-sm font-bold text-foreground" href="/signup">
                회원가입
              </Link>
            </div>
          )}
        </section>

        {isMember ? (
          <>
            <section className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="feed 요약">
              {viewModel.summaries.map((summary) => (
                <Link key={summary.label} className="rounded-2xl border border-border bg-surface p-3 text-center transition hover:bg-surface-strong" href="/feed/observations">
                  <p className="text-2xl font-black text-foreground">{summary.value}</p>
                  <p className="mt-1 text-xs leading-4 text-muted">{summary.label}</p>
                </Link>
              ))}
            </section>

            <section className="grid gap-3" aria-labelledby="feed-observation-title">
              <SectionHeader domainPath="feed / target" title="관심 대상" headingId="feed-observation-title" />
              <div className="grid gap-3">
                {featuredTargets.map((target) => (
                  <TargetPreviewLink key={target.id} target={target} href={`/feed/targets/${target.id}`} />
                ))}
              </div>
            </section>

            <section className="grid gap-3" aria-labelledby="feed-activity-title">
              <SectionHeader domainPath="feed / activity" title="최근 알림" headingId="feed-activity-title" />
            <div className="grid gap-3">
              {viewModel.activities.map((activity) => (
                <ListRow
                  key={activity.id}
                  href={`/feed/targets/${activity.targetId}`}
                  leading={(
                    <IconBadge as="span">
                      <Icon className="size-5" name="bell" />
                    </IconBadge>
                  )}
                  trailing={<time className="text-xs text-muted">{activity.timeText}</time>}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-foreground">{activity.title}</span>
                    <span className="mt-1 block text-xs text-muted">{activity.source}</span>
                  </span>
                </ListRow>
              ))}
            </div>
            </section>
          </>
        ) : (
          <>
            <section className="grid gap-3" aria-labelledby="feed-signal-title">
              <SectionHeader domainPath="feed / preview" title="준비 중인 알림" headingId="feed-signal-title" />
            <div className="grid gap-3">
              {viewModel.signals.map((signal) => (
                <Card as="article" key={signal.id}>
                  <h3 className="text-base font-bold text-foreground">{signal.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{signal.description}</p>
                </Card>
              ))}
            </div>
            </section>

            <section className="grid gap-3" aria-labelledby="feed-benefit-title">
              <SectionHeader domainPath="feed / benefits" title="맞춤 피드" headingId="feed-benefit-title" />
              <div className="grid gap-3">
                {viewModel.guestBenefits.map((benefit) => (
                  <Card as="article" key={benefit.id}>
                    <h3 className="text-base font-bold text-foreground">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{benefit.description}</p>
                  </Card>
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

function TargetPreviewLink({ href, target }: { href: string; target: FeedWatchTarget }) {
  return (
    <ListRow
      href={href}
      leading={(
        <span className={`grid size-10 place-items-center rounded-full ${getTargetToneClassName(target.type)}`}>
          <Icon className="size-5" name={getTargetIconName(target.type)} />
        </span>
      )}
      trailing={<span className="text-xs font-bold text-primary">{target.trendText}</span>}
    >
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-bold text-foreground">{target.name}</span>
          <Chip size="sm" className="shrink-0">{getTargetTypeLabel(target.type)}</Chip>
        </span>
        <span className="mt-1 block truncate text-xs text-muted">{target.statusText} · {target.metricText}</span>
      </span>
    </ListRow>
  );
}

function getTargetTypeLabel(type: FeedTargetType) {
  switch (type) {
    case 'item':
      return '아이템';
    case 'streamer':
      return '스트리머';
    case 'artist':
      return '아티스트';
  }
}

function getTargetIconName(type: FeedTargetType) {
  switch (type) {
    case 'item':
      return 'tag';
    case 'streamer':
      return 'monitor';
    case 'artist':
      return 'star';
  }
}

function getTargetToneClassName(type: FeedTargetType) {
  switch (type) {
    case 'item':
      return 'bg-accent-orange-soft text-accent-orange';
    case 'streamer':
      return 'bg-primary-soft text-primary';
    case 'artist':
      return 'bg-surface-strong text-foreground';
  }
}
