import { Icon } from '@/shared/ui/Icon';
import { IconBadge } from '@/shared/ui/IconBadge';
import { ListRow } from '@/shared/ui/ListRow';

import type { MeSettingItem } from '../model/meTypes';

/**
 * 마이페이지 설정 항목 컴포넌트의 Props
 */
type MeSettingCardProps = {
  item: MeSettingItem; // 표시할 설정 항목
  onSelect: (item: MeSettingItem) => void; // 설정 항목 선택 이벤트
};

/**
 * 마이페이지 설정 항목을 표시합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 설정 항목 카드
 */
export function MeSettingCard({ item, onSelect }: MeSettingCardProps) {
  const isDanger = item.tone === 'danger';
  const actionLabel = isDanger ? '탈퇴' : '열기';

  return (
    <ListRow
      onClick={() => onSelect(item)}
      className="w-full transition-none last:border-b-0 focus-visible:relative focus-visible:z-10 focus-visible:-outline-offset-2 focus-visible:outline-focus enabled:active:opacity-75 disabled:cursor-not-allowed disabled:opacity-50"
      leading={(
        <IconBadge as="span" size="sm" tone="strong" className={isDanger ? 'text-accent-red' : 'text-ink-2'}>
          <Icon name={item.iconName} />
        </IconBadge>
      )}
      trailing={(
        <span className={`whitespace-nowrap text-sm font-medium ${isDanger ? 'inline-flex h-8 items-center rounded-input border border-accent-red px-2 text-accent-red' : 'px-2 text-ink-2'}`}>
          {actionLabel}
        </span>
      )}
    >
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-foreground">{item.title}</h2>
        <p className="mt-1 text-sm leading-5 text-muted">{item.description}</p>
      </div>
    </ListRow>
  );
}
