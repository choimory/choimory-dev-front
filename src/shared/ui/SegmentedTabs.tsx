/**
 * 세그먼트 탭 항목
 */
type SegmentedTabItem<TId extends string> = {
  id: TId;        // 탭 식별자
  label: string;  // 탭에 표시할 라벨
};

/**
 * 세그먼트 탭 컴포넌트의 Props
 */
type SegmentedTabsProps<TId extends string> = {
  items: readonly SegmentedTabItem<TId>[];  // 탭 항목 목록 (2~5개)
  activeId: TId;                             // 선택된 탭 식별자
  ariaLabel: string;                         // 탭 목록 접근성 라벨
  onChange: (id: TId) => void;               // 탭 선택 핸들러
  size?: 'sm' | 'md';                        // 라벨 크기 (기본 sm: text-xs, md: text-sm)
  className?: string;                        // 바깥 영역에 추가할 클래스 (여백 등)
};

/** 탭 개수별 열 클래스 (Tailwind가 정적으로 감지할 수 있도록 전체 문자열로 작성) */
const SEGMENTED_TABS_COLUMNS_CLASS_NAME: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
};

/** 라벨 크기별 클래스 */
const SEGMENTED_TABS_SIZE_CLASS_NAME: Record<NonNullable<SegmentedTabsProps<string>['size']>, string> = {
  sm: 'text-xs',
  md: 'text-sm',
};

/**
 * 같은 영역 안에서 보기를 전환하는 공용 세그먼트 탭입니다. 선택된 탭은 강조색으로 표시합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 세그먼트 탭
 */
export function SegmentedTabs<TId extends string>({ items, activeId, ariaLabel, onChange, size = 'sm', className }: SegmentedTabsProps<TId>) {
  const tabsClassName = [
    'grid gap-1 rounded-2xl bg-surface-strong p-1',
    SEGMENTED_TABS_COLUMNS_CLASS_NAME[items.length],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={tabsClassName} role="tablist" aria-label={ariaLabel}>
      {items.map((item) => {
        const isActive = activeId === item.id;

        return (
          <button
            key={item.id}
            className={`h-9 rounded-xl font-black transition ${SEGMENTED_TABS_SIZE_CLASS_NAME[size]} ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted'}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
