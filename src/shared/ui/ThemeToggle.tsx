'use client';

import { useTheme } from '../hooks/useTheme';

/**
 * 라이트 테마와 다크 테마를 전환하는 버튼 컴포넌트입니다.
 *
 * 현재 테마에 따라 전환될 대상 테마의 아이콘을 표시합니다.
 *
 * @returns 테마 전환 버튼
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? '라이트 테마로 전환' : '다크 테마로 전환'}
      title={isDark ? '라이트 테마로 전환' : '다크 테마로 전환'}
      className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      {isDark ? (
        /* 다크 테마일 때는 라이트 테마 전환을 뜻하는 해 아이콘을 표시한다. */
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        /* 라이트 테마일 때는 다크 테마 전환을 뜻하는 달 아이콘을 표시한다. */
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
