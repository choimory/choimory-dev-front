import type { ReactNode } from 'react';

/**
 * 좁은 중앙 콘텐츠 레이아웃 컴포넌트의 Props
 */
type NarrowContentProps = {
  children: ReactNode;    // 중앙에 표시할 콘텐츠
  className?: string;     // 추가 CSS 클래스
};

/**
 * PC에서도 모바일 앱처럼 중앙 폭을 좁게 유지하는 레이아웃입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 좁은 중앙 콘텐츠 영역
 */
export function NarrowContent({ children, className = '' }: NarrowContentProps) {
  return (
    <main className={`mx-auto w-full max-w-[560px] px-4 pb-24 pt-5 sm:px-0 ${className}`.trim()}>
      {children}
    </main>
  );
}
