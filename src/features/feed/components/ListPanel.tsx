import { Card } from '@/shared/ui/Card';

/**
 * 제목과 문자열 목록을 카드 안에 나열하는 패널입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 목록 패널
 */
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
