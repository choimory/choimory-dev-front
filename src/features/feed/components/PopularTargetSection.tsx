'use client';

import { useState } from 'react';

import { ListRow } from '@/shared/ui/ListRow';
import { SegmentedTabs } from '@/shared/ui/SegmentedTabs';

import { getTargetTypeLabel } from '../model/feedTargetView';
import type { FeedTargetType, FeedWatchTarget } from '../model/feedTypes';

/** feed 랭킹 탭 종류 */
type FeedRankingTabId = 'all' | FeedTargetType;

/** feed 랭킹 탭 */
type FeedRankingTab = {
  id: FeedRankingTabId; // 탭 ID
  label: string;        // 탭 이름
};

/** feed 인기 랭킹 탭 목록 */
const FEED_RANKING_TABS: FeedRankingTab[] = [
  { id: 'all', label: '전체' },
  { id: 'item', label: '아이템' },
  { id: 'streamer', label: '스트리머' },
  { id: 'artist', label: '아티스트' },
];

/** feed target 순위 변화별 글자색 */
const TARGET_TREND_CLASS_NAME: Record<FeedWatchTarget['trendDirection'], string> = {
  up: 'text-primary',
  down: 'text-accent-red',
  same: 'text-muted',
};

/** feed target 순위 변화별 아이콘 */
const TARGET_TREND_ICON: Record<FeedWatchTarget['trendDirection'], string> = {
  up: '↑',
  down: '↓',
  same: '-',
};

/**
 * 관찰 대상 실시간 랭킹을 종류별 탭으로 전환하며 보여줍니다.
 *
 * @param props 컴포넌트 Props
 * @returns 관찰 대상 랭킹 섹션
 */
export function PopularTargetSection({ targets }: { targets: FeedWatchTarget[] }) {
  const [activeTabId, setActiveTabId] = useState<FeedRankingTabId>('all');
  const rankingTargets = activeTabId === 'all' ? targets : targets.filter((target) => target.type === activeTabId);

  return (
    <section className="grid gap-2" aria-labelledby="feed-popular-target-title">
      <div className="flex items-baseline justify-between gap-3 px-1 pt-4">
        <h2 id="feed-popular-target-title" className="font-display text-lg font-semibold tracking-display text-foreground">
          실시간 관찰 대상 랭킹
        </h2>
        <span className="shrink-0 text-xs font-medium text-muted">지금</span>
      </div>

      <SegmentedTabs items={FEED_RANKING_TABS} activeId={activeTabId} ariaLabel="feed 인기 랭킹 종류" onChange={setActiveTabId} />

      <div className="grid">
        {rankingTargets.map((target, index) => (
          <ListRow
            key={target.id}
            href={`/feed/targets/${target.id}`}
            className="blog-ranking-enter active:bg-surface-strong"
            style={{ animationDelay: `${index * 70}ms` }}
            leading={(
              <span className="w-6 text-center text-sm font-semibold tabular-nums text-ink-2">
                {target.rank}
              </span>
            )}
            trailing={(
              <span className={`inline-flex max-w-28 items-center gap-1 text-xs font-medium tabular-nums ${TARGET_TREND_CLASS_NAME[target.trendDirection]}`}>
                <span aria-hidden="true">{TARGET_TREND_ICON[target.trendDirection]}</span>
                {target.trendText}
              </span>
            )}
          >
            <span className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="min-w-0 text-sm font-semibold text-foreground">{target.name}</span>
              <span className="text-xs text-muted">{getTargetTypeLabel(target.type)}</span>
            </span>
          </ListRow>
        ))}
      </div>
    </section>
  );
}
