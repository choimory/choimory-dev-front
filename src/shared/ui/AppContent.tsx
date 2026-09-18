import type { ReactNode } from 'react';

/**
 * 앱 콘텐츠 레이아웃 variant
 */
type AppContentVariant = 'wide' | 'narrow';

/**
 * 앱 콘텐츠 레이아웃 컴포넌트의 Props
 */
type AppContentProps = {
  children: ReactNode;          // 중앙에 표시할 콘텐츠
  className?: string;           // 추가 CSS 클래스
  variant?: AppContentVariant;  // 콘텐츠 폭
};

/** 콘텐츠 variant별 폭과 여백 클래스 */
const APP_CONTENT_CLASS_NAME: Record<AppContentVariant, string> = {
  wide: 'max-w-[768px] px-4 pb-24 pt-8 lg:px-0',
  narrow: 'max-w-[560px] px-4 pb-24 pt-5 sm:px-0',
};

/**
 * 서비스 화면에서 공통으로 사용하는 중앙 콘텐츠 레이아웃입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 앱 콘텐츠 영역
 */
export function AppContent({ children, className = '', variant = 'wide' }: AppContentProps) {
  return (
    <main className={`mx-auto w-full ${APP_CONTENT_CLASS_NAME[variant]} ${className}`.trim()}>
      {children}
    </main>
  );
}
