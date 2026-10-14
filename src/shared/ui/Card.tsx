import type { HTMLAttributes } from 'react';

/**
 * 카드 컴포넌트의 Props
 */
type CardProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'section' | 'article'; // 렌더링할 태그 (기본 div)
  padding?: 'sm' | 'md';              // 안쪽 여백 (sm: p-3, 기본 md: p-4)
  tone?: 'default' | 'strong';        // 배경 톤 (기본 default: bg-surface, strong: bg-surface-strong)
};

/** 카드 안쪽 여백별 클래스 */
const CARD_PADDING_CLASS_NAME: Record<NonNullable<CardProps['padding']>, string> = {
  sm: 'p-3',
  md: 'p-4',
};

/** 카드 배경 톤별 클래스 */
const CARD_TONE_CLASS_NAME: Record<NonNullable<CardProps['tone']>, string> = {
  default: 'bg-surface',
  strong: 'bg-surface-strong',
};

/**
 * 테두리와 배경이 있는 기본 카드입니다. 섹션, 아티클, 일반 영역을 같은 모양으로 감쌀 때 공용으로 사용합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 카드
 */
export function Card({ as: Tag = 'div', padding = 'md', tone = 'default', className, children, ...rest }: CardProps) {
  const cardClassName = [
    'rounded-2xl border border-border',
    CARD_TONE_CLASS_NAME[tone],
    CARD_PADDING_CLASS_NAME[padding],
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag className={cardClassName} {...rest}>
      {children}
    </Tag>
  );
}
