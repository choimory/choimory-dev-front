/** blog 화면 인증 상태 */
export type BlogAuthStatus = 'guest' | 'member';

/** blog 하단 메뉴 종류 */
export type BlogMenuKind = 'popular' | 'following' | 'me';

/** blog 피드 필터 */
export type BlogFeedTab = {
  label: string;      // 필터 이름
  isActive: boolean;  // 현재 선택 여부
};

/** blog 게시글 */
export type BlogPost = {
  id: string;          // 게시글 고유 ID
  authorName: string;  // 작성자 이름
  authorInitial: string; // 작성자 아바타 이니셜
  meta: string;        // 게시글 부가 정보
  content: string;     // 게시글 본문
  likeCount: number;   // 좋아요 수
  commentCount: number; // 댓글 수
  hasMedia: boolean;   // 이미지 영역 표시 여부
};

/** blog 화면 데이터 */
export type BlogViewModel = {
  authStatus: BlogAuthStatus; // blog 화면 인증 상태
  tabs: BlogFeedTab[]; // 피드 필터 목록
  posts: BlogPost[];   // 게시글 목록
};

/** blog 화면에 표시할 임시 데이터 */
export const blogViewModel: BlogViewModel = {
  authStatus: 'guest',
  tabs: [
    { label: '추천', isActive: true },
    { label: '팔로잉', isActive: false },
    { label: '최신', isActive: false },
    { label: '인기', isActive: false },
  ],
  posts: [
    {
      id: 'post-1',
      authorName: 'mory.dev',
      authorInitial: 'M',
      meta: '프론트 구성 기획 · 8분 전',
      content:
        'PC에서도 좌우를 꽉 채우지 않고, 중앙 피드 폭을 고정하면 지금 프로젝트의 모바일 앱 같은 느낌을 유지할 수 있음.',
      likeCount: 128,
      commentCount: 24,
      hasMedia: true,
    },
    {
      id: 'post-2',
      authorName: 'jin.note',
      authorInitial: 'J',
      meta: '개발 노트 · 32분 전',
      content:
        '전역 메뉴는 상단이나 작은 레일 정도만 두고, 서비스 내부 화면은 모바일처럼 길쭉하게 유지하는 쪽이 깔끔함.',
      likeCount: 42,
      commentCount: 7,
      hasMedia: false,
    },
  ],
};
