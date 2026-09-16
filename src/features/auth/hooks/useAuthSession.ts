'use client';

import { useCallback, useSyncExternalStore } from 'react';

import { authApi } from '../api/authApi';
import {
  clearAuthSession,
  readAuthStatus,
  readServerAuthStatus,
  saveAuthSession,
  subscribeAuthSession,
  type AuthStatus,
} from '../model/authSession';
import type { LoginRequest } from '../model/authTypes';

/**
 * 로그인 세션을 조회하고 변경하는 Custom Hook입니다.
 *
 * 저장소 접근은 `authSession` 모듈에서만 수행하므로,
 * 저장 방식이 변경되어도 이 hook을 사용하는 화면은 수정하지 않습니다.
 *
 * @returns 세션 상태와 로그인/로그아웃 함수
 */
export function useAuthSession() {
  // 브라우저 저장소를 외부 저장소로 구독하여 세션 상태를 동기화한다.
  const status: AuthStatus = useSyncExternalStore(
    subscribeAuthSession,
    readAuthStatus,
    readServerAuthStatus,
  );

  /**
   * 로그인을 요청하고 세션을 저장합니다.
   *
   * @param request 로그인 요청 정보
   * @returns 로그인 처리 완료 Promise
   */
  const login = useCallback(async (request: LoginRequest): Promise<void> => {
    await authApi.login(request);
    saveAuthSession();
  }, []);

  /**
   * 세션을 해제합니다.
   */
  const logout = useCallback((): void => {
    clearAuthSession();
  }, []);

  return { status, login, logout };
}
