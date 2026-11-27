'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';

import { Card } from '@/shared/ui/Card';

import type { FeedBroadcastDay, FeedWatchTarget } from '../model/feedTypes';

/**
 * 스트리머의 일자별 방송 기여도를 주 단위 격자 그래프로 보여주고, 날짜를 누르면 방송 세션 목록을 팝오버로 표시합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 방송 기여도 그래프
 */
export function BroadcastContributionGraph({ days }: { days: NonNullable<FeedWatchTarget['streamerDetail']>['broadcastDays'] }) {
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ left: number; top?: number; bottom?: number } | null>(null);
  const weekCount = Math.ceil(days.length / 7);
  const weeks = Array.from({ length: weekCount }, (_, weekIndex) => days.slice(weekIndex * 7, weekIndex * 7 + 7));
  const activeDay = days.find((day) => day.id === activeDayId);
  const activeSessions = activeDay ? getBroadcastSessions(activeDay) : [];

  return (
    <Card as="section" className="min-w-0" aria-labelledby="feed-streamer-broadcast-title">
      <h2 id="feed-streamer-broadcast-title" className="font-display text-lg font-semibold text-foreground">방송 기록</h2>
      <div
        className="cut-sm mt-3 min-w-0 bg-surface-strong py-2"
        onClick={() => {
          setActiveDayId(null);
          setPopoverPosition(null);
        }}
      >
        <div className="overflow-x-auto min-[420px]:px-2">
          <div className="grid min-w-[308px] grid-cols-[repeat(7,minmax(44px,1fr))] items-center gap-y-1 py-1 text-[11px] tabular-nums text-muted min-[420px]:grid-cols-[36px_repeat(7,minmax(44px,1fr))]">
            <span className="hidden min-[420px]:block" />
            {(['월', '화', '수', '목', '금', '토', '일'] as const).map((dayLabel) => (
              <span key={dayLabel} className="text-center">{dayLabel}</span>
            ))}
            {weeks.map((week, weekIndex) => (
              <div key={week[0]?.id ?? weekIndex} className="contents">
                <span className="col-span-7 pl-2 min-[420px]:col-span-1 min-[420px]:pl-0">{week[0]?.dateText}</span>
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const day = week[dayIndex];

                  return (
                    <button
                      key={day?.id ?? `${weekIndex}-${dayIndex}`}
                      className={`h-11 w-full rounded-card border-[7px] border-transparent bg-clip-padding -outline-offset-4 enabled:hover:outline enabled:hover:outline-muted focus-visible:outline-2 focus-visible:outline-focus aria-pressed:outline aria-pressed:outline-primary enabled:active:opacity-70 disabled:opacity-50 ${day ? getBroadcastIntensityClassName(day.intensity) : 'bg-surface'}`}
                      type="button"
                      aria-label={day ? `${day.dateText} 방송 기록` : '방송 기록 없음'}
                      aria-pressed={day ? activeDayId === day.id : undefined}
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
                        const positionAbove = window.innerHeight - rect.bottom < rect.top;
                        setActiveDayId(day.id);
                        setPopoverPosition({
                          left: Math.max(8, Math.min(rect.left, window.innerWidth - popoverWidth - 8)),
                          ...(positionAbove
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
        </div>
        <div className="flex items-center gap-1 px-2 text-[11px] text-muted">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((intensity) => (
            <span key={intensity} className={`size-3 rounded-[2px] border border-border ${getBroadcastIntensityClassName(intensity as 0 | 1 | 2 | 3 | 4)}`} />
          ))}
          <span>More</span>
        </div>
      </div>
      {activeDay && popoverPosition && typeof document !== 'undefined' && createPortal(
        <div
          className="cut fixed z-50 max-h-[min(60vh,320px)] w-48 overflow-y-auto border border-border bg-surface p-3"
          style={popoverPosition}
          onClick={(event) => event.stopPropagation()}
        >
          <p className="text-xs font-semibold tabular-nums text-foreground">{activeDay.dateText}</p>
          <div className="mt-2 grid divide-y divide-border">
            {activeSessions.map((session) => (
              <div key={session.id} className="py-2">
                <p className="text-xs font-semibold leading-4 text-foreground">{session.title}</p>
                <p className="sr-only">{session.startedAt} 시작 · 총 {session.durationText}</p>
                <p aria-hidden="true" className="mt-1 flex flex-wrap gap-x-2 text-[11px] leading-4 tabular-nums text-muted">
                  <span>{session.startedAt} 시작</span>
                  <span>총 {session.durationText}</span>
                </p>
              </div>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </Card>
  );
}

/**
 * 방송 일자의 방송 세션 목록을 반환합니다. 세션 정보가 없으면 일자 정보로 단일 세션을 만들어 반환합니다.
 *
 * @param day 방송 일자 데이터
 * @returns 방송 세션 목록
 */
function getBroadcastSessions(day: FeedBroadcastDay) {
  if (day.broadcasts && day.broadcasts.length > 0) {
    return day.broadcasts;
  }

  if (day.intensity === 0) {
    return [{ id: `${day.id}-empty`, startedAt: day.startedAt, title: day.title, durationText: day.durationText }];
  }

  return [{ id: `${day.id}-session`, startedAt: day.startedAt, title: day.title, durationText: day.durationText }];
}

/**
 * 방송 강도(0~4)에 맞는 격자 칸 배경 클래스를 반환합니다.
 *
 * @param intensity 방송 강도
 * @returns 강도별 배경 클래스
 */
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
