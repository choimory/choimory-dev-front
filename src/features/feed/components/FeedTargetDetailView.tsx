'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Icon } from '@/shared/ui/Icon';

import type { FeedArtistAlbum, FeedArtistTrack, FeedBroadcastDay, FeedPricePoint, FeedPriceRangeId, FeedTargetType, FeedWatchTarget } from '../model/feedTypes';

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
          <SummaryCard label="상태" value={target.statusText} />
          <SummaryCard label="지표" value={target.metricText} />
          <SummaryCard label="추이" value={target.trendText} />
        </section>

        {target.type === 'item' && target.itemDetail && <ItemDetailSection target={target} />}
        {target.type === 'streamer' && target.streamerDetail && <StreamerDetailSection target={target} />}
        {target.type === 'artist' && target.artistDetail && <ArtistDetailSection target={target} />}

        <section className="rounded-2xl border border-border bg-surface p-4" aria-labelledby="feed-target-alert-title">
          <h2 id="feed-target-alert-title" className="text-base font-bold text-foreground">최근 알림</h2>
          <div className="mt-3 grid gap-2">
            {target.recentAlerts.map((alert) => (
              <p key={alert} className="rounded-xl bg-surface-strong px-3 py-2 text-sm leading-5 text-muted">
                {alert}
              </p>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-4" aria-labelledby="feed-target-related-title">
          <h2 id="feed-target-related-title" className="text-base font-bold text-foreground">관련 소식</h2>
          <p className="mt-2 text-sm leading-6 text-muted">크롤링 연동 전까지 뉴스와 커뮤니티 글의 mock 목록을 표시합니다.</p>
          <div className="mt-3 grid gap-2">
            {target.relatedArticles.map((article) => (
              <a key={article.id} className="grid gap-1 rounded-xl bg-surface-strong px-3 py-2 transition hover:bg-surface" href={article.href} target="_blank" rel="noreferrer">
                <span className="text-sm font-bold text-foreground">{article.title}</span>
                <span className="text-xs text-muted">{article.source} · {article.timeText}</span>
              </a>
            ))}
          </div>
        </section>
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

function ItemDetailSection({ target }: { target: FeedWatchTarget }) {
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
      <section className="rounded-2xl border border-border bg-surface p-4" aria-labelledby="feed-item-summary-title">
        <h2 id="feed-item-summary-title" className="text-base font-bold text-foreground">가격 관찰</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <SummaryCard label="현재 가격" value={detail.currentPrice} />
          <SummaryCard label="목표 가격" value={detail.targetPrice} />
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">{detail.priceChangeText}</p>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4" aria-labelledby="feed-item-chart-title">
        <h2 id="feed-item-chart-title" className="text-base font-bold text-foreground">가격 변동 그래프</h2>
        <div className="mt-4 grid grid-cols-5 gap-1 rounded-2xl bg-surface-strong p-1" role="tablist" aria-label="가격 추이 기간">
          {detail.priceRanges.map((range) => {
            const isActive = activeRange.id === range.id;

            return (
              <button
                key={range.id}
                className={`h-9 rounded-xl text-xs font-black transition ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted'}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveRangeId(range.id);
                  setHoveredPointId(null);
                  setPinnedPointId(null);
                }}
              >
                {range.label}
              </button>
            );
          })}
        </div>
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
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4" aria-labelledby="feed-item-source-title">
        <h2 id="feed-item-source-title" className="text-base font-bold text-foreground">원본 링크</h2>
        <p className="text-xs font-bold text-muted">원본 링크</p>
        <a className="mt-2 block truncate text-sm font-bold text-primary" href={detail.sourceUrl} target="_blank" rel="noreferrer">
          {detail.sourceName}
        </a>
        <p className="mt-1 truncate text-xs text-muted">{detail.sourceUrl}</p>
      </section>
    </>
  );
}

function StreamerDetailSection({ target }: { target: FeedWatchTarget }) {
  const detail = target.streamerDetail;

  if (!detail) {
    return null;
  }

  return (
    <>
      <section className="rounded-2xl border border-border bg-surface p-4" aria-labelledby="feed-streamer-summary-title">
        <h2 id="feed-streamer-summary-title" className="text-base font-bold text-foreground">방송 관찰</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <SummaryCard label="방송 상태" value={detail.broadcastStatus === 'live' ? 'LIVE' : '대기'} />
          <SummaryCard label="이벤트" value={target.metricText} />
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">{detail.broadcastTrendText}</p>
        <p className="mt-1 text-sm leading-6 text-muted">{detail.eventTrendText}</p>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4" aria-labelledby="feed-streamer-source-title">
        <h2 id="feed-streamer-source-title" className="text-base font-bold text-foreground">원본 채널</h2>
        <p className="text-xs font-bold text-muted">원본 채널</p>
        <a className="mt-2 block truncate text-sm font-bold text-primary" href={detail.channelUrl} target="_blank" rel="noreferrer">
          {detail.channelName}
        </a>
        <p className="mt-1 truncate text-xs text-muted">{detail.channelUrl}</p>
      </section>

      <BroadcastContributionGraph days={detail.broadcastDays} />

      <section className="rounded-2xl border border-border bg-surface p-4" aria-labelledby="feed-streamer-chat-title">
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
      </section>

      <ListPanel items={detail.recentEvents} title="최근 방송/이벤트" />
    </>
  );
}

function ArtistDetailSection({ target }: { target: FeedWatchTarget }) {
  const detail = target.artistDetail;
  const [activeAlbumIndex, setActiveAlbumIndex] = useState(0);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  if (!detail) {
    return null;
  }
  const selectedAlbum = detail.albums.find((album) => album.id === selectedAlbumId);
  const selectedTrack = selectedAlbum?.tracks.find((track) => track.id === selectedTrackId);
  const handleMoveAlbum = (direction: -1 | 1) => {
    setActiveAlbumIndex((current) => (current + direction + detail.albums.length) % detail.albums.length);
  };

  return (
    <>
      <section className="rounded-2xl border border-border bg-surface p-4" aria-labelledby="feed-artist-summary-title">
        <h2 id="feed-artist-summary-title" className="text-base font-bold text-foreground">신곡 관찰</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <SummaryCard label="최근 신곡" value={detail.latestReleaseTitle} />
          <SummaryCard label="예정 발매" value={detail.upcomingReleaseText} />
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">{detail.releaseTrendText}</p>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4" aria-labelledby="feed-artist-album-title">
        <h2 id="feed-artist-album-title" className="text-base font-bold text-foreground">최근 앨범</h2>
        <AlbumCarousel3d
          activeAlbumIndex={activeAlbumIndex}
          albums={detail.albums}
          onMoveAlbum={handleMoveAlbum}
          onOpenAlbum={(albumId) => {
            setSelectedAlbumId(albumId);
            setSelectedTrackId(null);
          }}
        />
      </section>

      {selectedAlbum && typeof document !== 'undefined' && createPortal(
        <AlbumDetailModal
          album={selectedAlbum}
          selectedTrack={selectedTrack}
          onClose={() => {
            setSelectedAlbumId(null);
            setSelectedTrackId(null);
          }}
          onSelectTrack={setSelectedTrackId}
        />,
        document.body,
      )}
    </>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-border bg-surface-strong p-3">
      <p className="text-sm font-black text-foreground">{value}</p>
      <p className="mt-1 text-xs leading-4 text-muted">{label}</p>
    </article>
  );
}

function MiniLineChart({
  activePoint,
  label,
  onClearPinnedPoint,
  onHoverPoint,
  onTogglePinPoint,
  pinnedPointId,
  points,
}: {
  activePoint?: FeedPricePoint;
  label: string;
  onClearPinnedPoint: () => void;
  onHoverPoint: (pointId: string | null) => void;
  onTogglePinPoint: (pointId: string) => void;
  pinnedPointId: string | null;
  points: FeedPricePoint[];
}) {
  const maxValue = Math.max(...points.map((point) => point.value));
  const minValue = Math.min(...points.map((point) => point.value));
  const range = Math.max(1, maxValue - minValue);
  const chartPoints = points.map((point, index) => {
    const x = points.length === 1 ? 170 : 28 + (index / (points.length - 1)) * 284;
    const y = 124 - ((point.value - minValue) / range) * 96;

    return { ...point, x, y };
  });
  const polylinePoints = chartPoints.map((point) => `${point.x},${point.y}`).join(' ');
  const activeChartPoint = chartPoints.find((point) => point.id === activePoint?.id);
  const maxPriceText = points.find((point) => point.value === maxValue)?.priceText ?? `${maxValue}`;
  const minPriceText = points.find((point) => point.value === minValue)?.priceText ?? `${minValue}`;

  return (
    <div className="mt-4" aria-label={label}>
      <p className="text-xs font-bold text-muted">{label}</p>
      <div className="mt-2 rounded-2xl bg-surface-strong px-0 py-3">
        <svg className="h-64 w-full overflow-visible" viewBox="0 0 340 168" role="img" aria-label={`${label} 라인그래프`} onClick={onClearPinnedPoint}>
          <line className="text-border" stroke="currentColor" strokeWidth="1" x1="28" x2="320" y1="136" y2="136" />
          <line className="text-border" stroke="currentColor" strokeWidth="1" x1="28" x2="28" y1="18" y2="136" />
          <text className="fill-muted text-[8px]" x="2" y="22">{maxPriceText}</text>
          <text className="fill-muted text-[8px]" x="2" y="136">{minPriceText}</text>
          <polyline fill="none" points={polylinePoints} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="text-primary" />
          {chartPoints.map((point) => (
            <g key={point.id}>
              <circle
                cx={point.x}
                cy={point.y}
                r={pinnedPointId === point.id ? '6' : '4.5'}
                className={pinnedPointId === point.id ? 'fill-primary stroke-primary-foreground' : 'fill-primary'}
                strokeWidth="2"
                onClick={(event) => {
                  event.stopPropagation();
                  onTogglePinPoint(point.id);
                }}
                onMouseEnter={() => onHoverPoint(point.id)}
                onMouseLeave={() => onHoverPoint(null)}
                onFocus={() => onHoverPoint(point.id)}
                onBlur={() => onHoverPoint(null)}
                tabIndex={0}
              />
              <text className="fill-muted text-[8px]" textAnchor="middle" x={point.x} y="158">{point.dateText}</text>
            </g>
          ))}
          {activeChartPoint && (
            <g pointerEvents="none">
              <rect
                className="fill-surface stroke-border"
                height="28"
                rx="6"
                width="86"
                x={Math.min(246, Math.max(30, activeChartPoint.x - 43))}
                y={Math.max(2, activeChartPoint.y - 40)}
              />
              <text className="fill-foreground text-[8px] font-bold" textAnchor="middle" x={Math.min(289, Math.max(73, activeChartPoint.x))} y={Math.max(13, activeChartPoint.y - 26)}>
                {activeChartPoint.dateText}
              </text>
              <text className="fill-muted text-[8px]" textAnchor="middle" x={Math.min(289, Math.max(73, activeChartPoint.x))} y={Math.max(25, activeChartPoint.y - 14)}>
                {activeChartPoint.priceText}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

function BroadcastContributionGraph({ days }: { days: NonNullable<FeedWatchTarget['streamerDetail']>['broadcastDays'] }) {
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ left: number; top?: number; bottom?: number } | null>(null);
  const weekCount = Math.ceil(days.length / 7);
  const weeks = Array.from({ length: weekCount }, (_, weekIndex) => days.slice(weekIndex * 7, weekIndex * 7 + 7));
  const monthLabels = weeks.map((week) => week[0]?.dateText ?? '');
  const activeDay = days.find((day) => day.id === activeDayId);
  const activeSessions = activeDay ? getBroadcastSessions(activeDay) : [];
  const activeDayIndex = activeDay ? days.findIndex((day) => day.id === activeDay.id) : -1;
  const activeWeekdayIndex = activeDayIndex >= 0 ? activeDayIndex % 7 : 0;
  const isLowerRow = activeWeekdayIndex >= 4;

  return (
    <section className="rounded-2xl border border-border bg-surface p-4" aria-labelledby="feed-streamer-broadcast-title">
      <h2 id="feed-streamer-broadcast-title" className="text-base font-bold text-foreground">방송 기록</h2>
      <div
        className="mt-2 overflow-x-auto rounded-2xl bg-surface-strong p-3"
        onClick={() => {
          setActiveDayId(null);
          setPopoverPosition(null);
        }}
      >
        <div className="relative min-w-max">
          <div className="grid gap-1" style={{ gridTemplateColumns: `28px repeat(${weekCount}, 14px)` }}>
            <span />
            {monthLabels.map((label, index) => (
              <span key={`${label}-${index}`} className="h-4 text-[10px] leading-4 text-muted">
                {label}
              </span>
            ))}
            {(['월', '화', '수', '목', '금', '토', '일'] as const).map((dayLabel, dayIndex) => (
              <div key={dayLabel} className="contents">
                <span className={`h-3 text-[10px] leading-3 text-muted ${dayIndex % 2 === 1 ? 'opacity-0' : ''}`}>
                  {dayLabel}
                </span>
                {weeks.map((week, weekIndex) => {
                  const day = week[dayIndex];

                  return (
                    <button
                      key={day?.id ?? `${weekIndex}-${dayIndex}`}
                      className={`size-3 rounded-[3px] ${day ? getBroadcastIntensityClassName(day.intensity) : 'bg-surface'}`}
                      type="button"
                      aria-label={day ? `${day.dateText} 방송 기록` : '방송 기록 없음'}
                      disabled={!day}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (!day) return;
                        if (activeDayId === day.id) {
                          setActiveDayId(null);
                          setPopoverPosition(null);
                          return;
                        }

                        const rect = event.currentTarget.getBoundingClientRect();
                        const popoverWidth = 192;
                        setActiveDayId(day.id);
                        setPopoverPosition({
                          left: Math.max(8, Math.min(rect.left, window.innerWidth - popoverWidth - 8)),
                          ...(isLowerRow
                            ? { bottom: Math.max(8, window.innerHeight - rect.top + 4) }
                            : { top: Math.min(window.innerHeight - 8, rect.bottom + 4) }),
                        });
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-end gap-1 text-[10px] text-muted">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((intensity) => (
              <span key={intensity} className={`size-3 rounded-[3px] ${getBroadcastIntensityClassName(intensity as 0 | 1 | 2 | 3 | 4)}`} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
      {activeDay && popoverPosition && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed z-50 max-h-[min(60vh,320px)] w-48 overflow-y-auto rounded-xl border border-border bg-surface p-3 shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
          style={popoverPosition}
          onClick={(event) => event.stopPropagation()}
        >
          <p className="text-xs font-bold text-primary">{activeDay.dateText}</p>
          <div className="mt-2 grid gap-2">
            {activeSessions.map((session) => (
              <div key={session.id} className="rounded-[10px] bg-surface-strong px-2 py-1.5">
                <p className="text-xs font-bold leading-4 text-foreground">{session.title}</p>
                <p className="mt-1 text-[11px] leading-4 text-muted">{session.startedAt} 시작 · 총 {session.durationText}</p>
              </div>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </section>
  );
}

function AlbumCarousel3d({
  activeAlbumIndex,
  albums,
  onMoveAlbum,
  onOpenAlbum,
}: {
  activeAlbumIndex: number;
  albums: FeedArtistAlbum[];
  onMoveAlbum: (direction: -1 | 1) => void;
  onOpenAlbum: (albumId: string) => void;
}) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-muted">최근 앨범</p>
        <div className="flex gap-1">
          <button className="grid size-8 place-items-center rounded-[10px] bg-surface-strong text-muted" type="button" aria-label="이전 앨범" onClick={() => onMoveAlbum(-1)}>
            <Icon name="chevronLeft" />
          </button>
          <button className="grid size-8 place-items-center rounded-[10px] bg-surface-strong text-muted" type="button" aria-label="다음 앨범" onClick={() => onMoveAlbum(1)}>
            <Icon className="size-5 rotate-180" name="chevronLeft" />
          </button>
        </div>
      </div>
      <div className="relative mt-3 h-56 overflow-hidden rounded-2xl bg-surface-strong" style={{ perspective: '900px' }}>
        {albums.map((album, index) => {
          const offset = index - activeAlbumIndex;
          const normalizedOffset = offset > albums.length / 2 ? offset - albums.length : offset < -albums.length / 2 ? offset + albums.length : offset;
          const isVisible = Math.abs(normalizedOffset) <= 1;
          const transform = `translateX(${normalizedOffset * 116}px) translateZ(${normalizedOffset === 0 ? 48 : -30}px) rotateY(${normalizedOffset * -34}deg) scale(${normalizedOffset === 0 ? 1 : 0.82})`;

          return (
            <button
              key={album.id}
              className={`absolute left-1/2 top-5 w-36 -translate-x-1/2 rounded-2xl border border-border bg-surface p-3 text-left shadow-[0_18px_40px_rgba(0,0,0,0.25)] transition duration-300 ${isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
              style={{ transform: `translateX(-50%) ${transform}`, zIndex: 10 - Math.abs(normalizedOffset) }}
              type="button"
              onClick={() => onOpenAlbum(album.id)}
            >
              <span className={`relative grid aspect-square place-items-center rounded-xl text-3xl font-black ${album.coverToneClassName}`}>
                <span className="absolute inset-y-3 left-2 w-2 rounded-full bg-black/15" />
                {album.title.slice(0, 1)}
              </span>
              <span className="mt-3 block truncate text-sm font-bold text-foreground">{album.title}</span>
              <span className="mt-1 block text-xs text-muted">{album.releaseDate}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AlbumDetailModal({ album, onClose, onSelectTrack, selectedTrack }: { album: FeedArtistAlbum; onClose: () => void; onSelectTrack: (trackId: string | null) => void; selectedTrack?: FeedArtistTrack }) {
  const isTrackView = Boolean(selectedTrack);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" role="presentation" onClick={onClose}>
      <section className="max-h-[calc(100vh-3rem)] w-full max-w-[560px] overflow-y-auto rounded-3xl border border-border bg-surface p-4 shadow-[0_24px_70px_rgba(0,0,0,0.35)]" role="dialog" aria-modal="true" aria-labelledby="feed-album-modal-title" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between gap-3">
          {isTrackView ? (
            <button className="grid size-9 place-items-center rounded-[10px] bg-surface-strong text-muted" type="button" aria-label="앨범 정보로 돌아가기" onClick={() => onSelectTrack(null)}>
              <Icon name="chevronLeft" />
            </button>
          ) : (
            <span className="size-9" />
          )}
          <button className="grid size-9 place-items-center rounded-[10px] bg-surface-strong text-muted" type="button" aria-label="앨범 상세 닫기" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>

        {!selectedTrack && (
          <div className="mt-3">
            <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-3">
              <span className={`grid aspect-square place-items-center rounded-2xl text-3xl font-black ${album.coverToneClassName}`}>
                {album.title.slice(0, 1)}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-primary">album</p>
                <h2 id="feed-album-modal-title" className="mt-1 text-xl font-black leading-tight text-foreground">{album.title}</h2>
                <p className="mt-2 text-sm text-muted">발매일 {album.releaseDate}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              {album.tracks.map((track) => (
                <button key={track.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-surface-strong px-3 py-2 text-left" type="button" onClick={() => onSelectTrack(track.id)}>
                  <span className="truncate text-sm font-bold text-foreground">{track.title}</span>
                  <span className="text-xs text-muted">{track.duration}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedTrack && (
          <div className="mt-3">
            <p className="text-xs font-bold text-primary">track</p>
            <h2 id="feed-album-modal-title" className="mt-1 text-xl font-black leading-tight text-foreground">{selectedTrack.title}</h2>
            <p className="mt-2 text-sm text-muted">재생시간 {selectedTrack.duration}</p>
            <div className="mt-4 rounded-2xl bg-surface-strong p-3">
              <p className="text-sm font-bold text-foreground">크레딧</p>
              <p className="mt-2 text-sm leading-6 text-muted">작곡 {selectedTrack.composer}</p>
              <p className="text-sm leading-6 text-muted">작사 {selectedTrack.lyricist}</p>
            </div>
            <p className="mt-4 rounded-2xl bg-surface-strong p-3 text-sm leading-6 text-muted">{selectedTrack.lyricsPreview}</p>
          </div>
        )}
      </section>
    </div>
  );
}

function getBroadcastSessions(day: FeedBroadcastDay) {
  if (day.broadcasts && day.broadcasts.length > 0) {
    return day.broadcasts;
  }

  if (day.intensity === 0) {
    return [{ id: `${day.id}-empty`, startedAt: day.startedAt, title: day.title, durationText: day.durationText }];
  }

  return [{ id: `${day.id}-session`, startedAt: day.startedAt, title: day.title, durationText: day.durationText }];
}

function getBroadcastIntensityClassName(intensity: 0 | 1 | 2 | 3 | 4) {
  switch (intensity) {
    case 0:
      return 'bg-surface';
    case 1:
      return 'bg-primary-soft';
    case 2:
      return 'bg-primary/40';
    case 3:
      return 'bg-primary/70';
    case 4:
      return 'bg-primary';
  }
}

function ListPanel({ items, title }: { items: string[]; title: string }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-4" aria-labelledby="feed-streamer-event-title">
      <h2 id="feed-streamer-event-title" className="text-base font-bold text-foreground">{title}</h2>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <p key={item} className="rounded-xl bg-surface-strong px-3 py-2 text-sm text-muted">
            {item}
          </p>
        ))}
      </div>
    </section>
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
