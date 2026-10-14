import { Card } from '@/shared/ui/Card';
import { StatCard } from '@/shared/ui/StatCard';

import { BroadcastContributionGraph } from './BroadcastContributionGraph';
import { ListPanel } from './ListPanel';
import type { FeedWatchTarget } from '../model/feedTypes';

export function StreamerDetailSection({ target }: { target: FeedWatchTarget }) {
  const detail = target.streamerDetail;

  if (!detail) {
    return null;
  }

  return (
    <>
      <Card as="section" aria-labelledby="feed-streamer-summary-title">
        <h2 id="feed-streamer-summary-title" className="text-base font-bold text-foreground">방송 관찰</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <StatCard size="sm" label="방송 상태" value={detail.broadcastStatus === 'live' ? 'LIVE' : '대기'} />
          <StatCard size="sm" label="이벤트" value={target.metricText} />
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">{detail.broadcastTrendText}</p>
        <p className="mt-1 text-sm leading-6 text-muted">{detail.eventTrendText}</p>
      </Card>

      <Card as="section" aria-labelledby="feed-streamer-source-title">
        <h2 id="feed-streamer-source-title" className="text-base font-bold text-foreground">원본 채널</h2>
        <p className="text-xs font-bold text-muted">원본 채널</p>
        <a className="mt-2 block truncate text-sm font-bold text-primary" href={detail.channelUrl} target="_blank" rel="noreferrer">
          {detail.channelName}
        </a>
        <p className="mt-1 truncate text-xs text-muted">{detail.channelUrl}</p>
      </Card>

      <BroadcastContributionGraph days={detail.broadcastDays} />

      <Card as="section" aria-labelledby="feed-streamer-chat-title">
        <h2 id="feed-streamer-chat-title" className="text-base font-bold text-foreground">채팅 기록</h2>
        <div className="mt-2 grid gap-2">
          {detail.chatMessages.map((message) => (
            <article key={message.id} className="rounded-xl bg-surface-strong px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-bold text-foreground">{message.channelName} 에서</p>
                <time className="shrink-0 text-xs text-muted">{message.timeText}</time>
              </div>
              <p className="mt-1 text-sm leading-5 text-muted">{message.message}</p>
            </article>
          ))}
        </div>
      </Card>

      <ListPanel items={detail.recentEvents} title="최근 방송/이벤트" />
    </>
  );
}
