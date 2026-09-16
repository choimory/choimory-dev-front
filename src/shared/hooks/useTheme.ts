'use client';

import { useCallback, useSyncExternalStore } from 'react';

import {
  applyTheme,
  readServerTheme,
  readTheme,
  subscribeTheme,
  type Theme,
} from '../model/theme';

/**
 * 화면 테마를 조회하고 전환하는 Custom Hook입니다.
 *
 * 저장소와 문서 속성 접근은 `theme` 모듈에서만 수행합니다.
 *
 * @returns 현재 테마와 테마 전환 함수
 */
export function useTheme() {
  // 문서에 적용된 테마를 외부 저장소로 구독하여 동기화한다.
  const theme: Theme = useSyncExternalStore(subscribeTheme, readTheme, readServerTheme);

  /**
   * 라이트 테마와 다크 테마를 전환합니다.
   */
  const toggleTheme = useCallback((): void => {
    applyTheme(readTheme() === 'dark' ? 'light' : 'dark');
  }, []);

  return { theme, toggleTheme };
}
