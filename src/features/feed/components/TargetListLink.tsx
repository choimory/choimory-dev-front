import { Icon } from '@/shared/ui/Icon';
import { ListRow } from '@/shared/ui/ListRow';

import { TargetPreviewMetrics } from './TargetPreviewLink';
import { getTargetTypeLabel, getTargetIconName, getTargetToneClassName } from '../model/feedTargetView';
import type { FeedWatchTarget } from '../model/feedTypes';

/**
 * 관찰 대상 정보(이름, 종류, 요약, 상태)와 우측 문구를 보여주는 링크 행입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 대상 링크 행
 */
export function TargetListLink({ href, rightText, target }: { href: string; rightText: string; target: FeedWatchTarget }) {
  return (
    <ListRow
      href={href}
      className="active:bg-surface-strong"
      leading={(
        <span className={`grid size-10 place-items-center rounded-input ${getTargetToneClassName(target.type)}`}>
          <Icon className="size-5" name={getTargetIconName(target.type)} />
        </span>
      )}
      trailing={<TargetPreviewMetrics target={target} trailingText={rightText} />}
    >
      <span className="min-w-0">
        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="min-w-0 text-sm font-semibold text-foreground">{target.name}</span>
          <span className="text-xs text-muted">{getTargetTypeLabel(target.type)}</span>
        </span>
        <span className="mt-1 block text-xs text-muted">{target.summary}</span>
      </span>
    </ListRow>
  );
}
