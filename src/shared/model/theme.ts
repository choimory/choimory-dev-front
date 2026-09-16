/** 선택한 테마를 보관하는 스토리지 키 */
export const THEME_STORAGE_KEY = 'theme';

/** 화면 테마 */
export type Theme = 'light' | 'dark';

/** 테마 변경을 구독 중인 리스너 목록 */
const listeners = new Set<() => void>();

/**
 * 구독 중인 모든 리스너에 테마 변경을 알립니다.
 */
function notifyChange(): void {
  listeners.forEach((listener) => listener());
}

/**
 * 테마 변경을 구독합니다.
 * 같은 탭에서 발생한 변경과 다른 탭에서 발생한 변경을 모두 감지합니다.
 *
 * @param listener 테마가 변경될 때 실행할 함수
 * @returns 구독을 해제하는 함수
 */
export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener('storage', listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

/**
 * 문서에 현재 적용되어 있는 테마를 조회합니다.
 *
 * 최초 값은 `layout.tsx`의 인라인 스크립트가 지정하므로,
 * 저장소가 아니라 문서 속성을 기준으로 판단합니다.
 *
 * @returns 현재 적용된 테마
 */
export function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

/**
 * 서버 렌더링 시점의 테마를 반환합니다.
 * 서버에서는 문서와 저장소를 조회할 수 없으므로 기본값을 사용합니다.
 *
 * @returns 항상 `light`
 */
export function readServerTheme(): Theme {
  return 'light';
}

/**
 * 테마를 문서에 적용하고 저장한 뒤 구독자에게 알립니다.
 *
 * @param theme 적용할 테마
 */
export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  notifyChange();
}
