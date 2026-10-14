import { Icon } from '@/shared/ui/Icon';
import { IconBadge } from '@/shared/ui/IconBadge';
import { ListRow } from '@/shared/ui/ListRow';
import { SectionHeader } from '@/shared/ui/SectionHeader';

import type { FeedViewModel } from '../model/feedTypes';

export function PopularTargetEventSection({ activities }: { activities: FeedViewModel['activities'] }) {
  return (
    <section className="grid gap-3" aria-labelledby="feed-popular-event-title">
      <SectionHeader domainPath="feed / event" title="최근 이벤트" headingId="feed-popular-event-title" />
      <div className="grid gap-3">
        {activities.map((activity) => (
          <ListRow
            key={activity.id}
            href={`/feed/targets/${activity.targetId}`}
            leading={(
              <IconBadge as="span">
                <Icon className="size-5" name="bell" />
              </IconBadge>
            )}
            trailing={<time className="text-xs text-muted">{activity.timeText}</time>}
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-foreground">{activity.title}</span>
              <span className="mt-1 block truncate text-xs text-muted">{activity.source}</span>
            </span>
          </ListRow>
        ))}
      </div>
    </section>
  );
}
