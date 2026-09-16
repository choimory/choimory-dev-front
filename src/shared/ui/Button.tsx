'use client';

import type { ReactNode } from 'react';

/** 버튼의 시각적 유형 */
export type ButtonVariant = 'primary' | 'social' | 'ghost';

/** 버튼의 크기 */
export type ButtonSize = 'md' | 'sm';

/**
 * 공통 버튼 컴포넌트의 Props
 */
type ButtonProps = {
  children: ReactNode;            // 버튼에 표시할 내용
  variant?: ButtonVariant;        // 버튼 시각적 유형
  size?: ButtonSize;              // 버튼 크기
  type?: 'button' | 'submit';     // 버튼 동작 유형
  isFullWidth?: boolean;          // 가로 전체 너비 사용 여부
  isDisabled?: boolean;           // 비활성화 여부
  onClick?: () => void;           // 클릭 시 실행할 동작
};

/** 유형별 기본 스타일 */
const VARIANT_CLASS_NAME: Record<ButtonVariant, string> = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors',
  social:
    'flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
  ghost: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors',
};

/** 크기별 여백 스타일 */
const SIZE_CLASS_NAME: Record<ButtonSize, string> = {
  md: 'px-4 py-3',
  sm: 'px-4 py-2 text-sm',
};

/** 비활성화 상태 스타일 */
const DISABLED_CLASS_NAME = 'bg-gray-300 text-gray-500 cursor-not-allowed';

/**
 * 서비스 전반에서 사용하는 공통 버튼 컴포넌트입니다.
 * 유형과 크기에 따라 스타일이 결정되며 비활성화 상태를 지원합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 버튼 요소
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  isFullWidth = false,
  isDisabled = false,
  onClick,
}: ButtonProps) {
  // ghost 유형은 여백 스타일을 적용하지 않는다.
  const sizeClassName = variant === 'ghost' ? 'text-sm' : SIZE_CLASS_NAME[size];

  // 비활성화 상태인 경우 유형별 스타일 대신 비활성화 스타일을 적용한다.
  const appearanceClassName = isDisabled ? DISABLED_CLASS_NAME : VARIANT_CLASS_NAME[variant];

  const widthClassName = isFullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`rounded-lg ${appearanceClassName} ${sizeClassName} ${widthClassName}`.trim()}
    >
      {children}
    </button>
  );
}
