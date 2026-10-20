import { apiClient } from '@/shared/api/apiClient';
import type { AccessTokenResponse } from '@/shared/api/apiTypes';
import { httpRequest } from '@/shared/api/httpClient';
import { refreshAccessToken } from '@/shared/api/tokenRefresher';
import { clearAccessToken, getAccessToken, saveAccessToken } from '@/shared/api/tokenStore';

import type { LoginRequest, MemberJoinRequest, MemberJoinResponse } from '../model/authTypes';

/**
 * 인증 API 호출 모음입니다.
 * 로그인, 로그아웃, 재발급은 Refresh Token을 다루므로 Next 서버(BFF)를 거치고,
 * 회원가입은 member-api를 직접 호출합니다.
 */
export const authApi = {
  /**
   * 로그인합니다. 성공하면 Access Token을 메모리에 저장합니다.
   *
   * @param request 이메일과 비밀번호
   * @returns Access Token 응답
   * @throws ApiError 이메일 또는 비밀번호가 올바르지 않을 때 등
   */
  async login(request: LoginRequest): Promise<AccessTokenResponse> {
    const token = await httpRequest<AccessTokenResponse>({
      baseUrl: '',
      path: '/api/auth/login',
      method: 'POST',
      body: request,
    });

    saveAccessToken(token.accessToken, token.accessExpiresIn);

    return token;
  },

  /**
   * 로그아웃합니다. 서버 처리 결과와 상관없이 메모리의 Access Token은 항상 지웁니다.
   *
   * @throws ApiError 서버에서 로그아웃 처리에 실패했을 때
   */
  async logout(): Promise<void> {
    const accessToken = getAccessToken();

    try {
      await httpRequest<null>({
        baseUrl: '',
        path: '/api/auth/logout',
        method: 'POST',
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });
    } finally {
      clearAccessToken();
    }
  },

  /**
   * 쿠키의 Refresh Token으로 로그인 상태를 복원합니다. 새로고침 직후 Access Token을 다시 받을 때 사용합니다.
   *
   * @returns 새 Access Token
   * @throws ApiError 로그인 상태가 아닐 때
   */
  restoreSession(): Promise<string> {
    return refreshAccessToken();
  },

  /**
   * 회원가입합니다.
   *
   * @param request 가입 정보
   * @returns 가입된 회원 정보
   * @throws ApiError 검증 실패(400)나 이메일 중복(409)일 때
   */
  join(request: MemberJoinRequest): Promise<MemberJoinResponse> {
    return apiClient.post<MemberJoinResponse>('/v1/member/join', request, { auth: false });
  },
};
