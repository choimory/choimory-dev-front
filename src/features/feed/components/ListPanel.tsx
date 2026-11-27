import { ListRow } from '@/shared/ui/ListRow';

/**
 * 제목 아래에 문자열 목록을 구분선 행으로 나열합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 목록 패널
 */
export function ListPanel({ items, title }: { items: string[]; title: string }) {
  return (
    <section aria-labelledby="feed-streamer-event-title">
      <h2 id="feed-streamer-event-title" className="font-display text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-2 grid border-t border-border">
        {items.map((item) => (
          <ListRow key={item} className="px-0">
            <p className="text-sm leading-5 text-ink-2">{item}</p>
          </ListRow>
        ))}
      </div>
    </section>
  );
}
