import Link from 'next/link';
import type { ReactNode } from 'react';

import { ThemeToggle } from './ThemeToggle';

/** 서비스명. 모든 화면의 헤더에 공통으로 노출한다. */
const SERVICE_NAME = 'choimory-dev';

/**
 * 화면 상단 헤더 컴포넌트의 Props
 */
type AppHeaderProps = {
  actions?: ReactNode;  // 헤더 우측에 배치할 액션 영역
  isCentered?: boolean; // 서비스명을 중앙 정렬할지 여부. 회원가입 등 인증 화면에서 사용한다
  isLinked?: boolean;   // 서비스명을 홈 링크로 렌더링할지 여부
};

/**
 * 화면 상단에 서비스명과 액션 영역을 표시하는 헤더 컴포넌트입니다.
 * 테마 전환 버튼은 모든 화면에서 공통으로 노출합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 헤더 요소
 */
export function AppHeader({ actions, isCentered = false, isLinked = true }: AppHeaderProps) {
  // 중앙 정렬 여부에 따라 배치 방식을 결정한다.
  const alignmentClassName = isCentered ? 'justify-center' : 'justify-between';

  // 중앙 정렬인 경우 서비스명이 가운데 유지되도록 액션 영역을 우측에 겹쳐 배치한다.
  const actionsPositionClassName = isCentered ? 'absolute right-6' : '';

  const title = <h1 className="text-xl font-bold">{SERVICE_NAME}</h1>;

  return (
    <header
      className={`relative flex items-center ${alignmentClassName} px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-background`}
    >
      {isLinked ? <Link href="/home">{title}</Link> : title}

      <div className={`flex items-center space-x-3 ${actionsPositionClassName}`}>
        {actions}
        <ThemeToggle />
      </div>
    </header>
  );
}
