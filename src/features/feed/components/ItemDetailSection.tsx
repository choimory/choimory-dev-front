'use client';

import { useState } from 'react';

import { Card } from '@/shared/ui/Card';
import { SegmentedTabs } from '@/shared/ui/SegmentedTabs';
import { StatCard } from '@/shared/ui/StatCard';

import { MiniLineChart } from './MiniLineChart';
import type { FeedPriceRangeId, FeedWatchTarget } from '../model/feedTypes';

export function ItemDetailSection({ target }: { target: FeedWatchTarget }) {
  const detail = target.itemDetail;
  const [activeRangeId, setActiveRangeId] = useState<FeedPriceRangeId>('week');
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);
  const [pinnedPointId, setPinnedPointId] = useState<string | null>(null);

  if (!detail) {
    return null;
  }
  const activeRange = detail.priceRanges.find((range) => range.id === activeRangeId) ?? detail.priceRanges[0];
  const activePointId = pinnedPointId ?? hoveredPointId;
  const activePoint = activeRange.points.find((point) => point.id === activePointId);

  return (
    <>
      <Card as="section" aria-labelledby="feed-item-summary-title">
        <h2 id="feed-item-summary-title" className="text-base font-bold text-foreground">가격 관찰</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <StatCard size="sm" label="현재 가격" value={detail.currentPrice} />
          <StatCard size="sm" label="목표 가격" value={detail.targetPrice} />
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">{detail.priceChangeText}</p>
      </Card>

      <Card as="section" aria-labelledby="feed-item-chart-title">
        <h2 id="feed-item-chart-title" className="text-base font-bold text-foreground">가격 변동 그래프</h2>
        <SegmentedTabs
          className="mt-4"
          items={detail.priceRanges}
          activeId={activeRange.id}
          ariaLabel="가격 추이 기간"
          onChange={(rangeId) => {
            setActiveRangeId(rangeId);
            setHoveredPointId(null);
            setPinnedPointId(null);
          }}
        />
        <MiniLineChart
          activePoint={activePoint}
          label="가격 변동"
          pinnedPointId={pinnedPointId}
          points={activeRange.points}
          onClearPinnedPoint={() => {
            setPinnedPointId(null);
            setHoveredPointId(null);
          }}
          onHoverPoint={setHoveredPointId}
          onTogglePinPoint={(pointId) => setPinnedPointId((current) => (current === pointId ? null : pointId))}
        />
      </Card>

      <Card as="section" aria-labelledby="feed-item-source-title">
        <h2 id="feed-item-source-title" className="text-base font-bold text-foreground">원본 링크</h2>
        <p className="text-xs font-bold text-muted">원본 링크</p>
        <a className="mt-2 block truncate text-sm font-bold text-primary" href={detail.sourceUrl} target="_blank" rel="noreferrer">
          {detail.sourceName}
        </a>
        <p className="mt-1 truncate text-xs text-muted">{detail.sourceUrl}</p>
      </Card>
    </>
  );
}
