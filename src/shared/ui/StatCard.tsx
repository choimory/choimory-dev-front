/**
 * 통계 카드 컴포넌트의 Props
 */
type StatCardProps = {
  label: string;         // 통계 라벨
  value: string;         // 통계 값
  size?: 'sm' | 'lg';     // 카드 크기 (기본 lg: 큰 숫자 강조, sm: 상세 정보 태그용)
  onClick?: () => void;  // 클릭 핸들러 (있으면 버튼으로 렌더링)
};

/** 카드 크기별 클래스 */
const STAT_CARD_SIZE_CLASS_NAME: Record<NonNullable<StatCardProps['size']>, { card: string; value: string }> = {
  lg: { card: 'rounded-2xl border border-border bg-surface-strong p-3 text-center', value: 'text-xl font-black text-foreground' },
  sm: { card: 'rounded-2xl border border-border bg-surface-strong p-3', value: 'text-sm font-black text-foreground' },
};

/**
 * 값과 라벨을 보여주는 공용 통계 카드입니다. onClick이 있으면 버튼으로, 없으면 정적 카드로 렌더링합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 통계 카드
 */
export function StatCard({ label, value, size = 'lg', onClick }: StatCardProps) {
  const sizeClassName = STAT_CARD_SIZE_CLASS_NAME[size];
  const content = (
    <>
      <p className={sizeClassName.value}>{value}</p>
      <p className="mt-1 text-xs leading-4 text-muted">{label}</p>
    </>
  );

  if (onClick) {
    return (
      <button className={sizeClassName.card} type="button" onClick={onClick}>
        {content}
      </button>
    );
  }

  return <article className={sizeClassName.card}>{content}</article>;
}
