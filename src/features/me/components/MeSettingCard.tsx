import { Icon } from '@/shared/ui/Icon';
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
      padding="md"
      leading={(
        <span className={`grid size-11 place-items-center rounded-2xl ${isDanger ? 'bg-accent-orange-soft text-accent-red' : 'bg-primary-soft text-primary'}`}>
          <Icon name={item.iconName} />
        </span>
      )}
      trailing={(
        <span className={`grid h-9 place-items-center rounded-[10px] px-3 text-sm font-bold ${isDanger ? 'border border-accent-red text-accent-red' : 'bg-surface-strong text-foreground'}`}>
          {actionLabel}
        </span>
      )}
    >
      <div className="min-w-0">
        <h2 className="text-sm font-bold text-foreground">{item.title}</h2>
        <p className="mt-1 text-sm leading-5 text-muted">{item.description}</p>
      </div>
    </ListRow>
  );
}
