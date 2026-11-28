import type { ReactNode } from 'react';
import { vi } from 'vitest';

import { AuthContext, type AuthContextValue, type AuthStatus } from '@/features/auth/context/AuthContext';

/**
 * 테스트용 인증 상태 값을 만듭니다.
 *
 * @param authStatus 로그인 여부 (기본 guest)
 * @param overrides 덮어쓸 값 (예: logout mock)
 * @returns 인증 상태 값
 */
export function createAuthValue(authStatus: AuthStatus = 'guest', overrides: Partial<AuthContextValue> = {}): AuthContextValue {
  return {
    state: authStatus,
    authStatus,
    isLoggedIn: authStatus === 'member',
    markLoggedIn: vi.fn(),
    logout: vi.fn(async () => {}),
    ...overrides,
  };
}

/**
 * 테스트에서 인증 상태를 고정해 주는 Provider입니다. 실제 토큰 복원 요청은 보내지 않습니다.
 * 사용 예: `render(<Component />, { wrapper: createAuthWrapper('member') })`
 *
 * @param authStatus 로그인 여부 (기본 guest)
 * @param overrides 덮어쓸 값
 * @returns render의 wrapper로 쓸 컴포넌트
 */
export function createAuthWrapper(authStatus: AuthStatus = 'guest', overrides: Partial<AuthContextValue> = {}) {
  const value = createAuthValue(authStatus, overrides);

  return function AuthWrapper({ children }: { children: ReactNode }) {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };
}
