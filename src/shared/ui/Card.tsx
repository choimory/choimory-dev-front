import type { ReactNode } from 'react';

/**
 * 공통 카드 컴포넌트의 Props
 */
type CardProps = {
  children: ReactNode; // 카드 내부에 표시할 내용
};

/**
 * 콘텐츠를 구분하여 표시하는 공통 카드 컴포넌트입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 카드 요소
 */
export function Card({ children }: CardProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      {children}
    </div>
  );
}
