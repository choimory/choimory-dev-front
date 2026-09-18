/** feed 화면 인증 상태 */
export type FeedAuthStatus = 'guest' | 'member';

/** feed에서 제공할 알림 유형 */
export type FeedSignal = {
  id: string;          // 알림 유형 고유 ID
  title: string;       // 알림 유형 제목
  description: string; // 알림 유형 설명
};

/** feed 회원용 요약 */
export type FeedSummary = {
  label: string; // 요약 항목 이름
  value: string; // 요약 값
};

/** feed 최근 알림 */
export type FeedActivity = {
  id: string;       // 알림 고유 ID
  title: string;    // 알림 제목
  source: string;   // 알림 출처
  timeText: string; // 화면에 표시할 시간
};

/** feed 화면 데이터 */
export type FeedViewModel = {
  authStatus: FeedAuthStatus;      // feed 화면 인증 상태
  title: string;                   // 서비스 제목
  description: string;             // 서비스 설명
  signals: FeedSignal[];           // 제공할 알림 유형 목록
  summaries: FeedSummary[];        // 회원용 요약 목록
  activities: FeedActivity[];      // 최근 알림 목록
};

/** feed 화면에 표시할 임시 데이터 */
export const feedViewModel: FeedViewModel = {
  authStatus: 'guest',
  title: '피드',
  description: '스트리머 활동 알림과 가격 알림을 한 곳에서 모아보는 서비스입니다.',
  signals: [
    {
      id: 'streamer',
      title: '스트리머 활동 알림',
      description: '방송 시작, 채팅 이벤트, 새 콘텐츠 업로드 같은 활동을 모아볼 수 있게 준비합니다.',
    },
    {
      id: 'price',
      title: '가격 알림',
      description: '관심 상품이 목표 가격 아래로 내려가면 놓치지 않도록 알려주는 흐름을 준비합니다.',
    },
    {
      id: 'custom',
      title: '사용자 정의 피드',
      description: '나중에는 원하는 조건을 직접 묶어 나만의 알림 피드를 만들 수 있게 확장합니다.',
    },
  ],
  summaries: [
    { label: '추적 중', value: '18' },
    { label: '새 알림', value: '9' },
    { label: '관심 항목', value: '6' },
  ],
  activities: [
    {
      id: 'activity-1',
      title: '관심 스트리머 방송 시작',
      source: '스트리머 활동 알림',
      timeText: '방금',
    },
    {
      id: 'activity-2',
      title: '키보드 가격이 목표가 아래로 내려감',
      source: '가격 알림',
      timeText: '12분 전',
    },
    {
      id: 'activity-3',
      title: '오늘 확인하지 않은 알림 3개',
      source: '통합 피드',
      timeText: '42분 전',
    },
  ],
};
