/**
 * 사용자 요약 정보 조회 응답
 */
export type UserSummaryResponse = {
  nickname: string;       // 사용자 닉네임
  postCount: number;      // 작성한 글 수
  commentCount: number;   // 작성한 댓글 수
  followingCount: number; // 팔로잉 수
  followerCount: number;  // 팔로워 수
  joinedAt: string;       // 가입 일시 (ISO 8601)
  lastLoggedInAt: string; // 최근 접속 일시 (ISO 8601)
};

/**
 * 사용자 요약 정보 화면 표시용 모델
 */
export type UserSummaryViewModel = {
  nickname: string;       // 사용자 닉네임
  initial: string;        // 프로필 이니셜. 닉네임 첫 글자를 대문자로 표기한다
  postCount: number;      // 작성한 글 수
  commentCount: number;   // 작성한 댓글 수
  followingCount: number; // 팔로잉 수
  followerCount: number;  // 팔로워 수
  joinDate: string;       // 화면에 표시할 가입일 (yyyy-MM-dd)
  lastLoginDate: string;  // 화면에 표시할 최근 접속일 (yyyy-MM-dd)
};

/**
 * ISO 8601 일시 문자열에서 날짜 부분만 추출합니다.
 *
 * @param isoDateTime 변환할 ISO 8601 일시 문자열
 * @returns `yyyy-MM-dd` 형식의 날짜 문자열
 */
function toDisplayDate(isoDateTime: string): string {
  return isoDateTime.slice(0, 10);
}

/**
 * 사용자 요약 정보 응답을 화면 표시용 모델로 변환합니다.
 *
 * @param response 사용자 요약 정보 조회 응답
 * @returns 화면 표시용 사용자 요약 정보
 */
export function toUserSummaryViewModel(response: UserSummaryResponse): UserSummaryViewModel {
  return {
    nickname: response.nickname,
    initial: response.nickname.charAt(0).toUpperCase(),
    postCount: response.postCount,
    commentCount: response.commentCount,
    followingCount: response.followingCount,
    followerCount: response.followerCount,
    joinDate: toDisplayDate(response.joinedAt),
    lastLoginDate: toDisplayDate(response.lastLoggedInAt),
  };
}
