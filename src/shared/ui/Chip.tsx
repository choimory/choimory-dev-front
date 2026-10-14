import type { HTMLAttributes } from 'react';

/**
 * 칩 컴포넌트의 Props
 */
type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  size?: 'sm' | 'md';          // 칩 크기 (sm: 작은 라벨, 기본 md)
  tone?: 'muted' | 'surface';  // 배경 톤 (기본 muted: bg-surface-strong, surface: bg-surface)
};

/** 칩 크기별 클래스 */
const CHIP_SIZE_CLASS_NAME: Record<NonNullable<ChipProps['size']>, string> = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-xs',
};

/** 칩 배경 톤별 클래스 */
const CHIP_TONE_CLASS_NAME: Record<NonNullable<ChipProps['tone']>, string> = {
  muted: 'bg-surface-strong',
  surface: 'bg-surface',
};

/**
 * 짧은 상태나 분류를 알약 모양으로 보여주는 공용 칩입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 칩
 */
export function Chip({ size = 'md', tone = 'muted', className, children, ...rest }: ChipProps) {
  const chipClassName = [
    'rounded-full font-bold text-muted',
    CHIP_TONE_CLASS_NAME[tone],
    CHIP_SIZE_CLASS_NAME[size],
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={chipClassName} {...rest}>
      {children}
    </span>
  );
}
