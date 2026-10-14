'use client';

import Link from 'next/link';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Card } from '@/shared/ui/Card';
import { Icon } from '@/shared/ui/Icon';
import { StatCard } from '@/shared/ui/StatCard';

import { ItemDetailSection } from './ItemDetailSection';
import { StreamerDetailSection } from './StreamerDetailSection';
import { ArtistDetailSection } from './ArtistDetailSection';
import { getTargetTypeLabel, getTargetIconName, getTargetToneClassName } from '../model/feedTargetView';
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
          <Link className="grid size-10 place-items-center rounded-[10px] text-foreground" href="/feed/observations" aria-label="관찰 목록으로 돌아가기">
            <Icon name="chevronLeft" />
          </Link>
        }
      />

      <AppContent className="grid gap-4">
        <section className="rounded-3xl border border-border bg-surface p-5" aria-labelledby="feed-target-detail-title">
          <p className="text-sm font-bold text-primary">feed / target</p>
          <div className="mt-2 flex items-start gap-3">
            <span className={`grid size-12 shrink-0 place-items-center rounded-full ${getTargetToneClassName(target.type)}`}>
              <Icon name={getTargetIconName(target.type)} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-muted">{getTargetTypeLabel(target.type)}</p>
              <h1 id="feed-target-detail-title" className="mt-1 text-2xl font-black leading-tight text-foreground">
                {target.name}
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted">{target.summary}</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-2" aria-label="target 요약">
          <StatCard size="sm" label="상태" value={target.statusText} />
          <StatCard size="sm" label="지표" value={target.metricText} />
          <StatCard size="sm" label="추이" value={target.trendText} />
        </section>

        {target.type === 'item' && target.itemDetail && <ItemDetailSection target={target} />}
        {target.type === 'streamer' && target.streamerDetail && <StreamerDetailSection target={target} />}
        {target.type === 'artist' && target.artistDetail && <ArtistDetailSection target={target} />}

        <Card as="section" aria-labelledby="feed-target-alert-title">
          <h2 id="feed-target-alert-title" className="text-base font-bold text-foreground">최근 알림</h2>
          <div className="mt-3 grid gap-2">
            {target.recentAlerts.map((alert) => (
              <p key={alert} className="rounded-xl bg-surface-strong px-3 py-2 text-sm leading-5 text-muted">
                {alert}
              </p>
            ))}
          </div>
        </Card>

        <Card as="section" aria-labelledby="feed-target-related-title">
          <h2 id="feed-target-related-title" className="text-base font-bold text-foreground">관련 소식</h2>
          <p className="mt-2 text-sm leading-6 text-muted">크롤링 연동 전까지 뉴스와 커뮤니티 글의 mock 목록을 표시하고 있어요.</p>
          <div className="mt-3 grid gap-2">
            {target.relatedArticles.map((article) => (
              <a key={article.id} className="grid gap-1 rounded-xl bg-surface-strong px-3 py-2 transition hover:bg-surface" href={article.href} target="_blank" rel="noreferrer">
                <span className="text-sm font-bold text-foreground">{article.title}</span>
                <span className="text-xs text-muted">{article.source} · {article.timeText}</span>
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
