import { Chip } from '@/shared/ui/Chip';
import { Icon } from '@/shared/ui/Icon';
import { ListRow } from '@/shared/ui/ListRow';

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
      leading={(
        <span className={`grid size-10 place-items-center rounded-full ${getTargetToneClassName(target.type)}`}>
          <Icon className="size-5" name={getTargetIconName(target.type)} />
        </span>
      )}
      trailing={<span className="text-xs font-bold text-primary">{rightText}</span>}
    >
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-bold text-foreground">{target.name}</span>
          <Chip size="sm" className="shrink-0">{getTargetTypeLabel(target.type)}</Chip>
        </span>
        <span className="mt-1 block truncate text-xs text-muted">{target.summary}</span>
        <span className="mt-1 block truncate text-xs text-muted">{target.statusText} · {target.metricText}</span>
      </span>
    </ListRow>
  );
}
