import { Card } from '@/shared/ui/Card';

export function ListPanel({ items, title }: { items: string[]; title: string }) {
  return (
    <Card as="section" aria-labelledby="feed-streamer-event-title">
      <h2 id="feed-streamer-event-title" className="text-base font-bold text-foreground">{title}</h2>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <p key={item} className="rounded-xl bg-surface-strong px-3 py-2 text-sm text-muted">
            {item}
          </p>
        ))}
      </div>
    </Card>
  );
}
