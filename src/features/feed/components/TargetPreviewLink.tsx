import { Chip } from '@/shared/ui/Chip';
import { Icon } from '@/shared/ui/Icon';
import { ListRow } from '@/shared/ui/ListRow';

import { getTargetTypeLabel, getTargetIconName, getTargetToneClassName } from '../model/feedTargetView';
import type { FeedWatchTarget } from '../model/feedTypes';

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
      leading={(
        <span className={`grid size-10 place-items-center rounded-full ${getTargetToneClassName(target.type)}`}>
          <Icon className="size-5" name={getTargetIconName(target.type)} />
        </span>
      )}
      trailing={<span className="text-xs font-bold text-primary">{target.trendText}</span>}
    >
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-bold text-foreground">{target.name}</span>
          <Chip size="sm" className="shrink-0">{getTargetTypeLabel(target.type)}</Chip>
        </span>
        <span className="mt-1 block truncate text-xs text-muted">{target.statusText} · {target.metricText}</span>
      </span>
    </ListRow>
  );
}
