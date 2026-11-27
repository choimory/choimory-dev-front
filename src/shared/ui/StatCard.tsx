/**
 * 통계 카드 컴포넌트의 Props
 */
type StatCardProps = {
  label: string;         // 통계 라벨
  value: string;         // 통계 값
  size?: 'sm' | 'lg';     // 크기 (기본 lg: 위쪽 구분선 위의 큰 숫자, sm: 상세 정보용 작은 면)
  onClick?: () => void;  // 클릭 핸들러 (있으면 버튼으로 렌더링)
};

/** 크기별 클래스 */
const STAT_CARD_SIZE_CLASS_NAME: Record<NonNullable<StatCardProps['size']>, { card: string; value: string }> = {
  lg: {
    card: 'min-w-0 border-t border-border pt-3 text-left',
    value: 'font-display text-2xl font-semibold leading-none tracking-display tabular-nums text-foreground',
  },
  sm: {
    card: 'min-w-0 rounded-input bg-surface-strong p-3 text-left',
    value: 'font-display text-sm font-semibold tabular-nums text-foreground',
  },
};

/**
 * 값과 라벨을 보여주는 공용 통계입니다. 숫자는 표 형식 숫자로 크게, 라벨은 한 단계 작게 표시합니다.
 * onClick이 있으면 버튼으로, 없으면 정적 아티클로 렌더링합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 통계 카드
 */
export function StatCard({ label, value, size = 'lg', onClick }: StatCardProps) {
  const sizeClassName = STAT_CARD_SIZE_CLASS_NAME[size];
  const content = (
    <>
      <p className={sizeClassName.value}>{value}</p>
      <p className="mt-1.5 text-xs leading-4 text-muted">{label}</p>
    </>
  );

  if (onClick) {
    return (
      <button className={`${sizeClassName.card} transition-colors hover:border-primary`} type="button" onClick={onClick}>
        {content}
      </button>
    );
  }

  return <article className={sizeClassName.card}>{content}</article>;
}
