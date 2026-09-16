import type { ReactNode } from 'react';

/**
 * 화면 전체 레이아웃 컴포넌트의 Props
 */
type ScreenLayoutProps = {
  children: ReactNode; // 화면에 렌더링할 내용
};

/**
 * 화면 전체를 감싸는 세로 배치 레이아웃 컴포넌트입니다.
 * 뷰포트 높이를 채우며 라이트/다크 모드 배경색을 적용합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 화면 레이아웃 요소
 */
export function ScreenLayout({ children }: ScreenLayoutProps) {
  return <div className="flex flex-col h-screen bg-background">{children}</div>;
}
