import { Icon } from '@/shared/ui/Icon';
import { IconBadge } from '@/shared/ui/IconBadge';
import { ListRow } from '@/shared/ui/ListRow';
import { SectionHeader } from '@/shared/ui/SectionHeader';

import type { FeedViewModel } from '../model/feedTypes';

/**
 * 인기 대상의 최근 이벤트 목록을 보여줍니다. 항목을 누르면 해당 대상 상세로 이동합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 최근 이벤트 섹션
 */
export function PopularTargetEventSection({ activities }: { activities: FeedViewModel['activities'] }) {
  return (
    <section className="grid gap-1" aria-labelledby="feed-popular-event-title">
      <SectionHeader domainPath="feed / event" title="최근 이벤트" headingId="feed-popular-event-title" />
      <div className="grid">
        {activities.map((activity) => (
          <ListRow
            key={activity.id}
            href={`/feed/targets/${activity.targetId}`}
            className="active:bg-surface-strong"
            leading={(
              <IconBadge as="span" size="sm" tone="strong">
                <Icon className="size-4" name="bell" />
              </IconBadge>
            )}
            trailing={<time className="whitespace-nowrap text-xs tabular-nums text-muted">{activity.timeText}</time>}
          >
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-foreground">{activity.title}</span>
              <span className="mt-1 block text-xs text-muted">{activity.source}</span>
            </span>
          </ListRow>
        ))}
      </div>
    </section>
  );
}
