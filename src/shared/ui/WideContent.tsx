import type { ReactNode } from 'react';

/**
 * 넓은 중앙 콘텐츠 레이아웃 컴포넌트의 Props
 */
type WideContentProps = {
  children: ReactNode; // 중앙에 표시할 콘텐츠
  className?: string;  // 추가 CSS 클래스
};

/**
 * 플랫폼 메인처럼 PC에서 더 넓게 사용하는 중앙 콘텐츠 레이아웃입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 넓은 중앙 콘텐츠 영역
 */
export function WideContent({ children, className = '' }: WideContentProps) {
  return (
    <main className={`mx-auto w-full max-w-[768px] px-4 pb-24 pt-8 md:px-0 ${className}`.trim()}>
      {children}
    </main>
  );
}
