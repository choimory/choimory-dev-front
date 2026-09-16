/** 로그인 여부를 보관하는 스토리지 키 */
const AUTH_STORAGE_KEY = 'isLoggedIn';

/** 로그인 세션 상태 */
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

/** 세션 변경을 구독 중인 리스너 목록 */
const listeners = new Set<() => void>();

/**
 * 구독 중인 모든 리스너에 세션 변경을 알립니다.
 */
function notifyChange(): void {
  listeners.forEach((listener) => listener());
}

/**
 * 세션 변경을 구독합니다.
 * 같은 탭에서 발생한 변경과 다른 탭에서 발생한 변경을 모두 감지합니다.
 *
 * @param listener 세션이 변경될 때 실행할 함수
 * @returns 구독을 해제하는 함수
 */
export function subscribeAuthSession(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener('storage', listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

/**
 * 브라우저 저장소에서 현재 세션 상태를 조회합니다.
 *
 * @returns 저장소 기준 세션 상태
 */
export function readAuthStatus(): AuthStatus {
  return localStorage.getItem(AUTH_STORAGE_KEY) === 'true' ? 'authenticated' : 'unauthenticated';
}

/**
 * 서버 렌더링 시점의 세션 상태를 반환합니다.
 * 서버에서는 저장소를 조회할 수 없으므로 확인 전 상태로 처리합니다.
 *
 * @returns 항상 `loading`
 */
export function readServerAuthStatus(): AuthStatus {
  return 'loading';
}

/**
 * 로그인 상태를 저장하고 구독자에게 알립니다.
 */
export function saveAuthSession(): void {
  localStorage.setItem(AUTH_STORAGE_KEY, 'true');
  notifyChange();
}

/**
 * 로그인 상태를 해제하고 구독자에게 알립니다.
 */
export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  notifyChange();
}
