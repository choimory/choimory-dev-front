import { Icon } from '@/shared/ui/Icon';
import { ListRow } from '@/shared/ui/ListRow';

import { getTargetTypeLabel, getTargetIconName, getTargetToneClassName } from '../model/feedTargetView';
import type { FeedWatchTarget } from '../model/feedTypes';

/** 관심 대상의 변동 방향별 글자색 */
const TREND_TEXT_CLASS_NAME: Record<FeedWatchTarget['trendDirection'], string> = {
  up: 'text-primary',
  down: 'text-accent-red',
  same: 'text-muted',
};

/** 현재 상태, 보조 지표와 추이 또는 행의 안내 문구를 우측 열에 표시합니다. */
export function TargetPreviewMetrics({ target, trailingText }: { target: FeedWatchTarget; trailingText: string }) {
  const trailingTextClassName = trailingText === target.trendText ? TREND_TEXT_CLASS_NAME[target.trendDirection] : 'text-ink-2';

  return (
    <span className="grid max-w-36 justify-items-end gap-1 text-right tabular-nums">
      <span className="font-display text-lg font-semibold leading-tight text-foreground sm:text-xl">{target.statusText}</span>
      <span className="sr-only">{' · '}</span>
      <span className="text-xs leading-tight text-muted">{target.metricText}</span>
      <span className={`text-xs font-medium leading-tight ${trailingTextClassName}`}>{trailingText}</span>
    </span>
  );
}

/**
 * 관찰 대상 정보(이름, 종류, 상태)와 변동 문구를 보여주는 미리보기 링크 행입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 대상 미리보기 링크 행
 */
export function TargetPreviewLink({ href, target }: { href: string; target: FeedWatchTarget }) {
  return (
    <ListRow
      href={href}
      className="active:bg-surface-strong"
      leading={(
        <span className={`grid size-10 place-items-center rounded-input ${getTargetToneClassName(target.type)}`}>
          <Icon className="size-5" name={getTargetIconName(target.type)} />
        </span>
      )}
      trailing={<TargetPreviewMetrics target={target} trailingText={target.trendText} />}
    >
      <span className="min-w-0">
        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="min-w-0 text-sm font-semibold text-foreground">{target.name}</span>
          <span className="text-xs text-muted">{getTargetTypeLabel(target.type)}</span>
        </span>
      </span>
    </ListRow>
  );
}
