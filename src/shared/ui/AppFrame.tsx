import type { ReactNode } from 'react';

/**
 * 앱 프레임 컴포넌트의 Props
 */
type AppFrameProps = {
  children: ReactNode; // 프레임 내부에 표시할 화면
};

/**
 * choimory.dev 화면의 기본 배경과 중앙 배치를 제공하는 프레임입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 앱 프레임
 */
export function AppFrame({ children }: AppFrameProps) {
  return (
    <div className="min-h-dvh bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-primary)_8%,transparent),transparent_28%,transparent_72%,color-mix(in_srgb,var(--color-accent-green)_7%,transparent)),var(--color-background)] text-foreground">
      {children}
    </div>
  );
}
