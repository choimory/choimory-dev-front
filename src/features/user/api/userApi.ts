import type { UserSummaryResponse } from '../model/userTypes';

/** 백엔드 연동 전까지 사용할 사용자 요약 정보 mock 응답 */
const MOCK_USER_SUMMARY: UserSummaryResponse = {
  nickname: 'choimory',
  postCount: 15,
  commentCount: 42,
  followingCount: 128,
  followerCount: 256,
  joinedAt: '2024-01-15',
  lastLoggedInAt: '2024-12-19',
};

/**
 * 사용자 관련 API 모음입니다.
 *
 * 백엔드가 연동되기 전이므로 현재는 mock 응답을 반환합니다.
 * 실제 연동 시 각 함수 내부 구현만 교체하면 되며, 호출부는 수정하지 않습니다.
 */
export const userApi = {
  /**
   * 로그인한 사용자의 요약 정보를 조회합니다.
   *
   * @returns 사용자 요약 정보
   */
  getUserSummary: async (): Promise<UserSummaryResponse> => {
    // TODO: 실제 사용자 요약 정보 조회 API 호출로 교체한다.
    return MOCK_USER_SUMMARY;
  },
};
