'use client';

import { useState } from 'react';

import { Chip } from '@/shared/ui/Chip';
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

/** feed target 순위 변화별 badge 클래스 */
const TARGET_TREND_CLASS_NAME: Record<FeedWatchTarget['trendDirection'], string> = {
  up: 'bg-primary-soft text-primary',
  down: 'bg-accent-red/15 text-accent-red',
  same: 'bg-surface text-muted',
};

/** feed target 순위 변화별 아이콘 */
const TARGET_TREND_ICON: Record<FeedWatchTarget['trendDirection'], string> = {
  up: '↑',
  down: '↓',
  same: '-',
};

export function PopularTargetSection({ targets }: { targets: FeedWatchTarget[] }) {
  const [activeTabId, setActiveTabId] = useState<FeedRankingTabId>('all');
  const rankingTargets = activeTabId === 'all' ? targets : targets.filter((target) => target.type === activeTabId);

  return (
    <section className="rounded-3xl border border-border bg-surface p-5" aria-labelledby="feed-popular-target-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-primary">feed / ranking</p>
          <h2 id="feed-popular-target-title" className="mt-1 text-xl font-black leading-tight text-foreground">
            실시간 관찰 대상 랭킹
          </h2>
        </div>
        <Chip>
          지금
        </Chip>
      </div>

      <SegmentedTabs className="mt-4" items={FEED_RANKING_TABS} activeId={activeTabId} ariaLabel="feed 인기 랭킹 종류" onChange={setActiveTabId} />

      <div className="mt-4 grid gap-2">
        {rankingTargets.map((target, index) => (
          <ListRow
            key={target.id}
            href={`/feed/targets/${target.id}`}
            tone="strong"
            className="blog-ranking-enter"
            style={{ animationDelay: `${index * 70}ms` }}
            leading={(
              <span className="grid size-9 place-items-center rounded-xl bg-surface text-sm font-black text-primary">
                {target.rank}
              </span>
            )}
            trailing={(
              <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${TARGET_TREND_CLASS_NAME[target.trendDirection]}`}>
                <span aria-hidden="true">{TARGET_TREND_ICON[target.trendDirection]}</span>
                {target.trendText}
              </span>
            )}
          >
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="truncate text-sm font-bold text-foreground">{target.name}</span>
                <Chip size="sm" tone="surface" className="shrink-0">{getTargetTypeLabel(target.type)}</Chip>
              </span>
            </span>
          </ListRow>
        ))}
      </div>
    </section>
  );
}
