import type { ButtonHTMLAttributes } from 'react';

/**
 * 버튼 컴포넌트의 Props
 */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline-danger'; // 버튼 종류 (기본 primary: 강조색, secondary: 보조, outline-danger: 위험 테두리)
  size?: 'md' | 'lg';                                    // 크기 (기본 md: 높이 40px, lg: 높이 48px)
};

/** 버튼 종류별 클래스 */
const BUTTON_VARIANT_CLASS_NAME: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-surface-strong text-muted',
  'outline-danger': 'border border-accent-red text-accent-red',
};

/** 버튼 크기별 클래스 */
const BUTTON_SIZE_CLASS_NAME: Record<NonNullable<ButtonProps['size']>, string> = {
  md: 'h-10 rounded-[10px]',
  lg: 'h-12 rounded-[12px]',
};

/**
 * 텍스트가 들어가는 공용 버튼입니다. 등록, 취소, 로그인 같은 동작에 사용합니다.
 * type을 따로 지정하지 않으면 button으로 동작합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 버튼
 */
export function Button({ variant = 'primary', size = 'md', type = 'button', className, children, ...rest }: ButtonProps) {
  const buttonClassName = [
    'px-4 text-sm font-bold',
    BUTTON_SIZE_CLASS_NAME[size],
    BUTTON_VARIANT_CLASS_NAME[variant],
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={buttonClassName} type={type} {...rest}>
      {children}
    </button>
  );
}
