'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { authApi } from '../api/authApi';

/** 로그인 상태. 복원 중이면 loading입니다. */
export type AuthState = 'loading' | 'member' | 'guest';

/** 화면이 로그인 여부를 구분할 때 쓰는 상태. loading은 guest로 취급합니다. */
export type AuthStatus = 'member' | 'guest';

/**
 * 인증 상태 값
 */
export type AuthContextValue = {
  state: AuthState;                  // 복원 중(loading)을 구분하는 인증 상태
  authStatus: AuthStatus;            // 화면 구분용 상태 (loading은 guest)
  isLoggedIn: boolean;               // 로그인 사용자 여부
  markLoggedIn: () => void;          // 로그인 성공을 반영
  logout: () => Promise<void>;       // 로그아웃하고 비로그인 상태로 전환
};

/** AuthProvider 밖에서 사용할 때의 기본 값 (항상 guest) */
const GUEST_CONTEXT_VALUE: AuthContextValue = {
  state: 'guest',
  authStatus: 'guest',
  isLoggedIn: false,
  markLoggedIn: () => {},
  logout: async () => {},
};

/** 인증 상태 Context */
export const AuthContext = createContext<AuthContextValue>(GUEST_CONTEXT_VALUE);

/**
 * 인증 상태를 읽습니다. AuthProvider 밖에서는 항상 guest입니다.
 *
 * @returns 인증 상태와 로그인, 로그아웃 반영 함수
 */
export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

/**
 * 앱 전체에 로그인 상태를 제공합니다.
 * 마운트되면 쿠키의 Refresh Token으로 로그인 상태를 복원하고, 복원이 끝나기 전에는 loading입니다.
 *
 * @param props children
 * @returns 인증 상태를 제공하는 Provider
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>('loading');

  useEffect(() => {
    let isCancelled = false;

    authApi
      .restoreSession()
      .then(() => {
        if (!isCancelled) {
          setState('member');
        }
      })
      .catch(() => {
        // 복원 중에 로그인이 먼저 반영됐다면 그 상태를 유지한다.
        if (!isCancelled) {
          setState((current) => (current === 'loading' ? 'guest' : current));
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const markLoggedIn = useCallback(() => {
    setState('member');
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // 서버 처리가 실패해도 토큰과 쿠키는 지워지므로 화면은 비로그인으로 바꾼다.
    } finally {
      setState('guest');
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      state,
      authStatus: state === 'member' ? 'member' : 'guest',
      isLoggedIn: state === 'member',
      markLoggedIn,
      logout,
    }),
    [state, markLoggedIn, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
