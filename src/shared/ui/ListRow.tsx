import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

/**
 * 목록 행 컴포넌트의 Props
 */
type ListRowProps = {
  children: ReactNode;                     // 본문 영역
  leading?: ReactNode;                     // 좌측 영역 (아이콘, 순위 등)
  trailing?: ReactNode;                    // 우측 영역 (시간, 상태 등)
  href?: string;                           // 이동 경로 (있으면 링크로 렌더링)
  onClick?: () => void;                    // 클릭 핸들러 (있으면 버튼으로 렌더링)
  as?: 'div' | 'article' | 'section';      // 정적 행의 태그 (기본 div)
  tone?: 'default' | 'strong';             // 배경 톤 (default: 테두리 + bg-surface, strong: 테두리 없는 bg-surface-strong)
  padding?: 'sm' | 'md';                   // 안쪽 여백 (기본 sm: p-3, md: p-4)
  isDimmed?: boolean;                      // 흐리게 표시 여부 (준비 중 항목 등)
  ariaLabel?: string;                      // 접근성 라벨
  style?: CSSProperties;                   // 인라인 스타일 (애니메이션 지연 등)
  className?: string;                      // 추가 클래스
};

/** 행 안쪽 여백별 클래스 */
const LIST_ROW_PADDING_CLASS_NAME: Record<NonNullable<ListRowProps['padding']>, string> = {
  sm: 'p-3',
  md: 'p-4',
};

/** 행 배경 톤별 클래스 */
const LIST_ROW_TONE_CLASS_NAME: Record<NonNullable<ListRowProps['tone']>, string> = {
  default: 'border border-border bg-surface',
  strong: 'bg-surface-strong',
};

/** 좌측/우측 영역 유무별 열 클래스 (Tailwind가 정적으로 감지할 수 있도록 전체 문자열로 작성) */
const LIST_ROW_COLUMNS_CLASS_NAME = {
  both: 'grid-cols-[auto_minmax(0,1fr)_auto]',
  leading: 'grid-cols-[auto_minmax(0,1fr)]',
  trailing: 'grid-cols-[minmax(0,1fr)_auto]',
  none: '',
};

/**
 * 좌측 영역, 본문, 우측 영역으로 이루어진 공용 목록 행입니다.
 * href가 있으면 링크로, onClick이 있으면 버튼으로, 둘 다 없으면 정적 행으로 렌더링합니다.
 * 기본 톤의 클릭 가능한 행은 hover 시 배경이 바뀝니다.
 *
 * @param props 컴포넌트 Props
 * @returns 목록 행
 */
export function ListRow({
  children,
  leading,
  trailing,
  href,
  onClick,
  as: Tag = 'div',
  tone = 'default',
  padding = 'sm',
  isDimmed = false,
  ariaLabel,
  style,
  className,
}: ListRowProps) {
  const columnsKey = leading && trailing ? 'both' : leading ? 'leading' : trailing ? 'trailing' : 'none';
  const isInteractive = Boolean(href || onClick);
  const rowClassName = [
    'grid items-center gap-3 rounded-2xl',
    LIST_ROW_COLUMNS_CLASS_NAME[columnsKey],
    LIST_ROW_TONE_CLASS_NAME[tone],
    LIST_ROW_PADDING_CLASS_NAME[padding],
    isInteractive && tone === 'default' && 'transition hover:bg-surface-strong',
    onClick && 'text-left',
    isDimmed && 'opacity-75',
    className,
  ].filter(Boolean).join(' ');

  const content = (
    <>
      {leading}
      {children}
      {trailing}
    </>
  );

  if (href) {
    return (
      <Link className={rowClassName} href={href} style={style} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button className={rowClassName} type="button" style={style} aria-label={ariaLabel} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <Tag className={rowClassName} style={style} aria-label={ariaLabel}>
      {content}
    </Tag>
  );
}
