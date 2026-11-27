'use client';

import Link from 'next/link';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Card } from '@/shared/ui/Card';
import { Icon } from '@/shared/ui/Icon';
import { IconBadge } from '@/shared/ui/IconBadge';
import { ListRow } from '@/shared/ui/ListRow';
import { StatCard } from '@/shared/ui/StatCard';

import { ItemDetailSection } from './ItemDetailSection';
import { StreamerDetailSection } from './StreamerDetailSection';
import { ArtistDetailSection } from './ArtistDetailSection';
import { getTargetTypeLabel, getTargetIconName } from '../model/feedTargetView';
import type { FeedWatchTarget } from '../model/feedTypes';

/**
 * feed target 상세 화면 컴포넌트의 Props
 */
type FeedTargetDetailViewProps = {
  isLoggedIn: boolean;      // 로그인 여부
  target: FeedWatchTarget;  // 표시할 target
};

/**
 * 아이템, 스트리머, 아티스트 공통 target 상세 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns feed target 상세 화면
 */
export function FeedTargetDetailView({ isLoggedIn, target }: FeedTargetDetailViewProps) {
  return (
    <AppFrame>
      <AppTopBar
        isLoggedIn={isLoggedIn}
        serviceName="feed"
        serviceHref="/feed"
        leading={
          <Link className="key grid size-10 place-items-center rounded-input text-foreground" href="/feed/observations" aria-label="관찰 목록으로 돌아가기">
            <Icon name="chevronLeft" />
          </Link>
        }
      />

      <AppContent className="grid min-w-0 grid-cols-1 gap-6">
        <section className="pt-2" aria-labelledby="feed-target-detail-title">
          <div className="flex items-start gap-3">
            <IconBadge as="span" tone="strong" size="xl">
              <Icon className="size-5 text-ink-2" name={getTargetIconName(target.type)} />
            </IconBadge>
            <div className="min-w-0">
              <h1 id="feed-target-detail-title" className="min-w-0 break-words font-display text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
                {target.name}
              </h1>
              <p className="mt-1 text-xs font-medium text-muted">{getTargetTypeLabel(target.type)}</p>
              <p className="mt-2 text-base leading-6 text-ink-2">{target.summary}</p>
            </div>
          </div>
        </section>

        <section
          className="grid sm:grid-cols-3 sm:gap-6 max-sm:*:flex max-sm:*:flex-row-reverse max-sm:*:items-baseline max-sm:*:justify-between max-sm:*:gap-3 max-sm:*:py-2 max-sm:[&>article>p:first-child]:text-right max-sm:[&>article>p:first-child]:text-base max-sm:[&>article>p:last-child]:mt-0 max-sm:[&>article>p:last-child]:shrink-0"
          aria-label="target 요약"
        >
          <StatCard label="상태" value={target.statusText} />
          <StatCard label="지표" value={target.metricText} />
          <StatCard label="추이" value={target.trendText} />
        </section>

        {target.type === 'item' && target.itemDetail && <ItemDetailSection target={target} />}
        {target.type === 'streamer' && target.streamerDetail && <StreamerDetailSection target={target} />}
        {target.type === 'artist' && target.artistDetail && <ArtistDetailSection target={target} />}

        <Card as="section" aria-labelledby="feed-target-alert-title">
          <h2 id="feed-target-alert-title" className="font-display text-lg font-semibold text-foreground">최근 알림</h2>
          <div className="mt-2 grid">
            {target.recentAlerts.map((alert) => (
              <ListRow key={alert} className="last:border-b-0">
                <p className="text-sm leading-5 text-ink-2">{alert}</p>
              </ListRow>
            ))}
          </div>
        </Card>

        <Card as="section" aria-labelledby="feed-target-related-title">
          <h2 id="feed-target-related-title" className="font-display text-lg font-semibold text-foreground">관련 소식</h2>
          <p className="mt-2 text-sm leading-6 text-muted">크롤링 연동 전까지 뉴스와 커뮤니티 글의 mock 목록을 표시하고 있어요.</p>
          <div className="mt-2 grid divide-y divide-border">
            {target.relatedArticles.map((article) => (
              <a key={article.id} className="grid min-h-11 gap-1 px-3 py-3 hover:bg-surface-strong active:bg-background" href={article.href} target="_blank" rel="noreferrer">
                <span className="text-sm font-semibold text-foreground">{article.title}</span>
                <span className="flex flex-wrap gap-x-3 text-xs tabular-nums text-muted">
                  <span>{article.source}</span>
                  <span className="sr-only" aria-hidden="true">{' · '}</span>
                  <span>{article.timeText}</span>
                </span>
              </a>
            ))}
          </div>
        </Card>
      </AppContent>

      <BottomNavigation
        items={[
          { label: '홈', href: '/feed', iconName: 'home' },
          { label: '인기', href: '/feed/popular', iconName: 'trophy' },
          { label: '관찰', href: '/feed/observations', iconName: 'barChart', isActive: true },
          { label: '내 피드', href: '/feed/me', iconName: 'user' },
        ]}
      />
    </AppFrame>
  );
}
