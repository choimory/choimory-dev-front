import type { HTMLAttributes } from 'react';

/**
 * 카드 컴포넌트의 Props
 */
type CardProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'section' | 'article'; // 렌더링할 태그 (기본 div)
  padding?: 'sm' | 'md';              // 안쪽 여백 (sm: p-3, 기본 md: p-4)
  tone?: 'default' | 'strong';        // 배경 톤 (기본 default: 구분선 패널, strong: 테두리 없는 한 단계 진한 면. 패널 안에 패널을 넣지 않도록 안쪽에는 strong만 사용)
};

/** 카드 안쪽 여백별 클래스 */
const CARD_PADDING_CLASS_NAME: Record<NonNullable<CardProps['padding']>, string> = {
  sm: 'p-3',
  md: 'p-4',
};

/** 카드 배경 톤별 클래스 */
const CARD_TONE_CLASS_NAME: Record<NonNullable<CardProps['tone']>, string> = {
  default: 'cut border border-border bg-surface shadow-card',
  strong: 'cut-sm bg-surface-strong',
};

/**
 * 1px 구분선으로 둘러싼 패널입니다. 대각선 두 모서리를 깎고(지원 브라우저), 섹션·아티클·일반 영역을 감쌀 때 공용으로 사용합니다.
 * 목록은 카드 여러 개 대신 ListRow의 구분선 행으로 구성합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 카드
 */
export function Card({ as: Tag = 'div', padding = 'md', tone = 'default', className, children, ...rest }: CardProps) {
  const cardClassName = [
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
