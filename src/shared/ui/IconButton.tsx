import type { ReactNode } from 'react';

/**
 * 아이콘 버튼 컴포넌트의 Props
 */
type IconButtonProps = {
  ariaLabel: string;                       // 접근성 라벨 (아이콘만 있으므로 필수)
  children: ReactNode;                     // 버튼 안에 표시할 아이콘
  onClick?: () => void;                    // 클릭 핸들러
  disabled?: boolean;                      // 비활성화 여부
  size?: 'sm' | 'md' | 'lg';               // 크기 (sm 32px, 기본 md 36px, lg 40px)
  tone?: 'muted' | 'danger' | 'ghost';     // 색상 톤 (기본 muted: 배경 + 흐린 글자, danger: 배경 + 위험색, ghost: 배경 없음, 색은 className으로 지정)
  className?: string;                      // 추가 클래스 (ghost 색상, shrink-0 등)
};

/** 버튼 크기별 클래스 */
const ICON_BUTTON_SIZE_CLASS_NAME: Record<NonNullable<IconButtonProps['size']>, string> = {
  sm: 'size-8',
  md: 'size-9',
  lg: 'size-10',
};

/** 버튼 색상 톤별 클래스 */
const ICON_BUTTON_TONE_CLASS_NAME: Record<NonNullable<IconButtonProps['tone']>, string> = {
  muted: 'bg-surface-strong text-muted',
  danger: 'bg-surface-strong text-accent-red',
  ghost: '',
};

/**
 * 아이콘만 들어가는 정사각 공용 버튼입니다. 닫기, 이전/다음, 더보기 같은 동작에 사용합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 아이콘 버튼
 */
export function IconButton({ ariaLabel, children, onClick, disabled, size = 'md', tone = 'muted', className }: IconButtonProps) {
  const buttonClassName = [
    'grid place-items-center rounded-[10px] disabled:opacity-35',
    ICON_BUTTON_SIZE_CLASS_NAME[size],
    ICON_BUTTON_TONE_CLASS_NAME[tone],
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={buttonClassName} type="button" aria-label={ariaLabel} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
