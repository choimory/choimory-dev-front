'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';

import { Card } from '@/shared/ui/Card';

import type { FeedBroadcastDay, FeedWatchTarget } from '../model/feedTypes';

export function BroadcastContributionGraph({ days }: { days: NonNullable<FeedWatchTarget['streamerDetail']>['broadcastDays'] }) {
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
    <Card as="section" aria-labelledby="feed-streamer-broadcast-title">
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
    </Card>
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
