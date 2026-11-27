import { Card } from '@/shared/ui/Card';
import { ListRow } from '@/shared/ui/ListRow';
import { StatCard } from '@/shared/ui/StatCard';

import { BroadcastContributionGraph } from './BroadcastContributionGraph';
import { ListPanel } from './ListPanel';
import type { FeedWatchTarget } from '../model/feedTypes';

/**
 * 스트리머 관찰 대상의 상세 정보(방송 상태, 방송 기여도, 이벤트 목록)를 보여줍니다. 스트리머 상세 데이터가 없으면 아무것도 표시하지 않습니다.
 *
 * @param props 컴포넌트 Props
 * @returns 스트리머 상세 섹션
 */
export function StreamerDetailSection({ target }: { target: FeedWatchTarget }) {
  const detail = target.streamerDetail;

  if (!detail) {
    return null;
  }

  return (
    <>
      <Card as="section" aria-labelledby="feed-streamer-summary-title">
        <h2 id="feed-streamer-summary-title" className="font-display text-lg font-semibold text-foreground">방송 관찰</h2>
        <div className="mt-3 grid sm:grid-cols-2 sm:gap-6 max-sm:*:flex max-sm:*:flex-row-reverse max-sm:*:items-baseline max-sm:*:justify-between max-sm:*:gap-3 max-sm:*:py-2 max-sm:[&>article>p:first-child]:text-right max-sm:[&>article>p:first-child]:text-base max-sm:[&>article>p:last-child]:mt-0 max-sm:[&>article>p:last-child]:shrink-0">
          <StatCard label="방송 상태" value={detail.broadcastStatus === 'live' ? 'LIVE' : '대기'} />
          <StatCard label="이벤트" value={target.metricText} />
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">{detail.broadcastTrendText}</p>
        <p className="mt-1 text-sm leading-6 text-muted">{detail.eventTrendText}</p>
      </Card>

      <section aria-labelledby="feed-streamer-source-title">
        <h2 id="feed-streamer-source-title" className="font-display text-lg font-semibold text-foreground">원본 채널</h2>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-border py-1">
          <a className="inline-flex min-h-11 items-center text-sm font-semibold text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground active:text-primary" href={detail.channelUrl} target="_blank" rel="noreferrer">
            {detail.channelName}
          </a>
          <p className="cut-sm min-w-0 break-all bg-graphite px-2 py-1 font-mono text-xs text-graphite-ink">{detail.channelUrl}</p>
        </div>
      </section>

      <BroadcastContributionGraph days={detail.broadcastDays} />

      <Card as="section" aria-labelledby="feed-streamer-chat-title">
        <h2 id="feed-streamer-chat-title" className="font-display text-lg font-semibold text-foreground">채팅 기록</h2>
        <div className="mt-2 grid">
          {detail.chatMessages.map((message) => (
            <ListRow as="article" key={message.id} className="last:border-b-0">
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className="min-w-0 break-words text-sm font-semibold text-foreground">{message.channelName} 에서</p>
                  <time className="shrink-0 text-xs tabular-nums text-muted">{message.timeText}</time>
                </div>
                <p className="mt-1 text-sm leading-5 text-ink-2">{message.message}</p>
              </div>
            </ListRow>
          ))}
        </div>
      </Card>

      <ListPanel items={detail.recentEvents} title="최근 방송/이벤트" />
    </>
  );
}
