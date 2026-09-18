import { Icon } from '@/shared/ui/Icon';

import type { MeSettingItem } from '../model/meTypes';

/**
 * 마이페이지 설정 항목 컴포넌트의 Props
 */
type MeSettingCardProps = {
  item: MeSettingItem; // 표시할 설정 항목
};

/**
 * 마이페이지 설정 항목을 표시합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 설정 항목 카드
 */
export function MeSettingCard({ item }: MeSettingCardProps) {
  const isDanger = item.tone === 'danger';

  return (
    <article className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-surface p-4">
      <span className={`grid size-11 place-items-center rounded-2xl ${isDanger ? 'bg-accent-orange-soft text-accent-red' : 'bg-primary-soft text-primary'}`}>
        <Icon name={item.iconName} />
      </span>
      <div className="min-w-0">
        <h2 className="text-sm font-bold text-foreground">{item.title}</h2>
        <p className="mt-1 text-sm leading-5 text-muted">{item.description}</p>
      </div>
      <button className={`h-9 rounded-[10px] px-3 text-sm font-bold ${isDanger ? 'border border-accent-red text-accent-red' : 'bg-surface-strong text-foreground'}`} type="button">
        {item.actionLabel}
      </button>
    </article>
  );
}
