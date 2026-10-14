/** feed 화면 인증 상태 */
export type FeedAuthStatus = 'guest' | 'member';

/** feed 하단 메뉴 종류 */
export type FeedMenuKind = 'popular' | 'observations' | 'me';

/** feed에서 제공할 알림 유형 */
export type FeedSignal = {
  id: string;          // 알림 유형 고유 ID
  title: string;       // 알림 유형 제목
  description: string; // 알림 유형 설명
};

/** feed 비회원 혜택 안내 */
export type FeedGuestBenefit = {
  id: string;          // 혜택 고유 ID
  title: string;       // 혜택 제목
  description: string; // 혜택 설명
};

/** feed 회원용 요약 */
export type FeedSummary = {
  label: string; // 요약 항목 이름
  value: string; // 요약 값
};

/** feed 관찰 target 종류 */
export type FeedTargetType = 'item' | 'streamer' | 'artist';

/** feed target 순위 변화 */
export type FeedTargetTrendDirection = 'up' | 'down' | 'same';

/** feed target 관련 소식 */
export type FeedRelatedArticle = {
  id: string;       // 관련 소식 고유 ID
  title: string;    // 관련 소식 제목
  source: string;   // 출처
  timeText: string; // 표시 시간
  href: string;     // 원문 링크
};

/** 아이템 가격 추이 기간 */
export type FeedPriceRangeId = 'week' | 'month' | 'quarter' | 'half' | 'year';

/** 아이템 가격 추이 포인트 */
export type FeedPricePoint = {
  id: string;        // 포인트 고유 ID
  dateText: string;  // x축 날짜
  priceText: string; // y축 가격 표시
  value: number;     // 그래프 계산용 값
};

/** 아이템 가격 추이 기간별 데이터 */
export type FeedPriceRange = {
  id: FeedPriceRangeId;     // 기간 ID
  label: string;            // 기간 라벨
  points: FeedPricePoint[]; // 가격 포인트
};

/** 스트리머 개별 방송 기록 */
export type FeedBroadcastSession = {
  id: string;           // 방송 고유 ID
  startedAt: string;    // 방송 시작 시간
  title: string;        // 방송 제목
  durationText: string; // 방송 총 시간
};

/** 스트리머 방송일 기록 */
export type FeedBroadcastDay = {
  id: string;                    // 방송일 고유 ID
  dateText: string;              // 방송일
  startedAt: string;             // 대표 방송 시작 시간
  title: string;                 // 대표 방송 제목
  durationText: string;          // 대표 방송 총 시간
  intensity: 0 | 1 | 2 | 3 | 4;  // 잔디 강도
  broadcasts?: FeedBroadcastSession[]; // 하루에 발생한 방송 목록
};

/** 스트리머 채팅 기록 */
export type FeedChatMessage = {
  id: string;          // 채팅 고유 ID
  channelName: string; // 채널명
  message: string;     // 채팅 내용
  timeText: string;    // 채팅 시간
};

/** 아티스트 앨범 */
export type FeedArtistAlbum = {
  id: string;                // 앨범 고유 ID
  title: string;             // 앨범명
  releaseDate: string;       // 발매일
  coverToneClassName: string; // mock 커버 색상 클래스
  tracks: FeedArtistTrack[]; // 트랙 목록
};

/** 아티스트 트랙 */
export type FeedArtistTrack = {
  id: string;            // 트랙 고유 ID
  title: string;         // 트랙명
  duration: string;      // 재생시간
  composer: string;      // 작곡가
  lyricist: string;      // 작사가
  lyricsPreview: string; // 가사 preview
};

/** feed target 기본 정보 */
export type FeedWatchTarget = {
  id: string;                          // target 고유 ID
  type: FeedTargetType;                // target 종류
  name: string;                        // target 이름
  summary: string;                     // target 요약
  statusText: string;                  // 현재 상태 문구
  metricText: string;                  // 대표 지표 문구
  trendText: string;                   // 추이 문구
  trendDirection: FeedTargetTrendDirection; // 추이 방향
  rank: number;                        // 인기 순위
  isWatching: boolean;                 // 관찰 여부
  isMine: boolean;                     // 내 피드에서 관리 중인지 여부
  recentAlerts: string[];              // 최근 알림 문구
  relatedArticles: FeedRelatedArticle[]; // 관련 뉴스/커뮤니티 글
  itemDetail?: FeedItemDetail;         // 아이템 상세
  streamerDetail?: FeedStreamerDetail; // 스트리머 상세
  artistDetail?: FeedArtistDetail;     // 아티스트 상세
};

/** 아이템 상세 mock */
export type FeedItemDetail = {
  currentPrice: string;    // 현재 가격
  targetPrice: string;     // 목표 가격
  priceChangeText: string; // 가격 변화 문구
  pricePoints: number[];   // 가격 추이 mock
  priceRanges: FeedPriceRange[]; // 기간별 가격 추이
  sourceName: string;      // 원본 링크 이름
  sourceUrl: string;       // 원본 링크 URL
};

/** 스트리머 상세 mock */
export type FeedStreamerDetail = {
  broadcastStatus: 'live' | 'offline'; // 방송 상태
  broadcastTrendText: string;          // 방송 추이
  eventTrendText: string;              // 이벤트 추이
  recentEvents: string[];              // 최근 방송/이벤트
  channelName: string;                 // 원본 채널명
  channelUrl: string;                  // 원본 채널 링크
  broadcastDays: FeedBroadcastDay[];   // 방송일 기록
  chatMessages: FeedChatMessage[];     // 채팅 기록
};

/** 아티스트 상세 mock */
export type FeedArtistDetail = {
  latestReleaseTitle: string; // 최근 신곡
  upcomingReleaseText: string; // 예정 발매 정보
  releaseTrendText: string;   // 발매 추이 문구
  releasePoints: number[];    // 발매 추이 mock
  recentReleases: string[];   // 최근 발매 목록
  albums: FeedArtistAlbum[];  // 최근 앨범 목록
};

/** feed 관찰 중인 항목 */
export type FeedObservationItem = {
  id: string;       // 관찰 항목 고유 ID
  title: string;    // 관찰 항목 제목
  category: string; // 관찰 항목 분류
  status: string;   // 관찰 상태
};

/** feed 최근 알림 */
export type FeedActivity = {
  id: string;       // 알림 고유 ID
  title: string;    // 알림 제목
  source: string;   // 알림 출처
  timeText: string; // 화면에 표시할 시간
  targetId: string; // 연결된 target 고유 ID
};

/** feed 화면 데이터 */
export type FeedViewModel = {
  authStatus: FeedAuthStatus;      // feed 화면 인증 상태
  title: string;                   // 서비스 제목
  description: string;             // 서비스 설명
  signals: FeedSignal[];           // 제공할 알림 유형 목록
  guestBenefits: FeedGuestBenefit[]; // 비회원 혜택 안내 목록
  summaries: FeedSummary[];        // 회원용 요약 목록
  targets: FeedWatchTarget[];      // feed target 목록
  observations: FeedObservationItem[]; // 관찰 중인 항목 목록
  activities: FeedActivity[];      // 최근 알림 목록
};

/** 키보드 아이템 기간별 가격 mock 데이터 */
const KEYBOARD_PRICE_RANGES: FeedPriceRange[] = [
  {
    id: 'week',
    label: '1주',
    points: [
      { id: 'keyboard-week-1', dateText: '09.14', priceText: '136,000원', value: 136 },
      { id: 'keyboard-week-2', dateText: '09.15', priceText: '134,000원', value: 134 },
      { id: 'keyboard-week-3', dateText: '09.16', priceText: '132,000원', value: 132 },
      { id: 'keyboard-week-4', dateText: '09.17', priceText: '131,000원', value: 131 },
      { id: 'keyboard-week-5', dateText: '09.18', priceText: '129,000원', value: 129 },
      { id: 'keyboard-week-6', dateText: '09.19', priceText: '128,000원', value: 128 },
    ],
  },
  {
    id: 'month',
    label: '1개월',
    points: [
      { id: 'keyboard-month-1', dateText: '08.20', priceText: '149,000원', value: 149 },
      { id: 'keyboard-month-2', dateText: '08.27', priceText: '145,000원', value: 145 },
      { id: 'keyboard-month-3', dateText: '09.03', priceText: '141,000원', value: 141 },
      { id: 'keyboard-month-4', dateText: '09.10', priceText: '136,000원', value: 136 },
      { id: 'keyboard-month-5', dateText: '09.17', priceText: '131,000원', value: 131 },
      { id: 'keyboard-month-6', dateText: '09.20', priceText: '128,000원', value: 128 },
    ],
  },
  {
    id: 'quarter',
    label: '3개월',
    points: [
      { id: 'keyboard-quarter-1', dateText: '07월', priceText: '162,000원', value: 162 },
      { id: 'keyboard-quarter-2', dateText: '07.15', priceText: '158,000원', value: 158 },
      { id: 'keyboard-quarter-3', dateText: '08월', priceText: '151,000원', value: 151 },
      { id: 'keyboard-quarter-4', dateText: '08.20', priceText: '146,000원', value: 146 },
      { id: 'keyboard-quarter-5', dateText: '09월', priceText: '136,000원', value: 136 },
      { id: 'keyboard-quarter-6', dateText: '09.20', priceText: '128,000원', value: 128 },
    ],
  },
  {
    id: 'half',
    label: '6개월',
    points: [
      { id: 'keyboard-half-1', dateText: '04월', priceText: '178,000원', value: 178 },
      { id: 'keyboard-half-2', dateText: '05월', priceText: '171,000원', value: 171 },
      { id: 'keyboard-half-3', dateText: '06월', priceText: '165,000원', value: 165 },
      { id: 'keyboard-half-4', dateText: '07월', priceText: '158,000원', value: 158 },
      { id: 'keyboard-half-5', dateText: '08월', priceText: '145,000원', value: 145 },
      { id: 'keyboard-half-6', dateText: '09월', priceText: '128,000원', value: 128 },
    ],
  },
  {
    id: 'year',
    label: '12개월',
    points: [
      { id: 'keyboard-year-1', dateText: '2025.10', priceText: '198,000원', value: 198 },
      { id: 'keyboard-year-2', dateText: '2025.12', priceText: '188,000원', value: 188 },
      { id: 'keyboard-year-3', dateText: '2026.02', priceText: '179,000원', value: 179 },
      { id: 'keyboard-year-4', dateText: '2026.04', priceText: '171,000원', value: 171 },
      { id: 'keyboard-year-5', dateText: '2026.06', priceText: '156,000원', value: 156 },
      { id: 'keyboard-year-6', dateText: '2026.09', priceText: '128,000원', value: 128 },
    ],
  },
];

/** GPU 아이템 기간별 가격 mock 데이터 */
const GPU_PRICE_RANGES: FeedPriceRange[] = [
  {
    id: 'week',
    label: '1주',
    points: [
      { id: 'gpu-week-1', dateText: '09.14', priceText: '762,000원', value: 762 },
      { id: 'gpu-week-2', dateText: '09.15', priceText: '781,000원', value: 781 },
      { id: 'gpu-week-3', dateText: '09.16', priceText: '774,000원', value: 774 },
      { id: 'gpu-week-4', dateText: '09.17', priceText: '801,000원', value: 801 },
      { id: 'gpu-week-5', dateText: '09.18', priceText: '792,000원', value: 792 },
      { id: 'gpu-week-6', dateText: '09.19', priceText: '789,000원', value: 789 },
    ],
  },
  {
    id: 'month',
    label: '1개월',
    points: [
      { id: 'gpu-month-1', dateText: '08.20', priceText: '820,000원', value: 820 },
      { id: 'gpu-month-2', dateText: '08.27', priceText: '803,000원', value: 803 },
      { id: 'gpu-month-3', dateText: '09.03', priceText: '775,000원', value: 775 },
      { id: 'gpu-month-4', dateText: '09.10', priceText: '798,000원', value: 798 },
      { id: 'gpu-month-5', dateText: '09.17', priceText: '801,000원', value: 801 },
      { id: 'gpu-month-6', dateText: '09.20', priceText: '789,000원', value: 789 },
    ],
  },
  {
    id: 'quarter',
    label: '3개월',
    points: [
      { id: 'gpu-quarter-1', dateText: '07월', priceText: '868,000원', value: 868 },
      { id: 'gpu-quarter-2', dateText: '07.15', priceText: '842,000원', value: 842 },
      { id: 'gpu-quarter-3', dateText: '08월', priceText: '824,000원', value: 824 },
      { id: 'gpu-quarter-4', dateText: '08.20', priceText: '820,000원', value: 820 },
      { id: 'gpu-quarter-5', dateText: '09월', priceText: '798,000원', value: 798 },
      { id: 'gpu-quarter-6', dateText: '09.20', priceText: '789,000원', value: 789 },
    ],
  },
  {
    id: 'half',
    label: '6개월',
    points: [
      { id: 'gpu-half-1', dateText: '04월', priceText: '920,000원', value: 920 },
      { id: 'gpu-half-2', dateText: '05월', priceText: '901,000원', value: 901 },
      { id: 'gpu-half-3', dateText: '06월', priceText: '884,000원', value: 884 },
      { id: 'gpu-half-4', dateText: '07월', priceText: '842,000원', value: 842 },
      { id: 'gpu-half-5', dateText: '08월', priceText: '820,000원', value: 820 },
      { id: 'gpu-half-6', dateText: '09월', priceText: '789,000원', value: 789 },
    ],
  },
  {
    id: 'year',
    label: '12개월',
    points: [
      { id: 'gpu-year-1', dateText: '2025.10', priceText: '990,000원', value: 990 },
      { id: 'gpu-year-2', dateText: '2025.12', priceText: '956,000원', value: 956 },
      { id: 'gpu-year-3', dateText: '2026.02', priceText: '932,000원', value: 932 },
      { id: 'gpu-year-4', dateText: '2026.04', priceText: '910,000원', value: 910 },
      { id: 'gpu-year-5', dateText: '2026.06', priceText: '872,000원', value: 872 },
      { id: 'gpu-year-6', dateText: '2026.09', priceText: '789,000원', value: 789 },
    ],
  },
];

/** feed 화면에 표시할 임시 데이터 */
export const feedViewModel: FeedViewModel = {
  authStatus: 'guest',
  title: '피드',
  description: '가격, 방송, 신곡 알림을 관심 대상별로 관찰하고 한 곳에서 모아보는 서비스예요.',
  signals: [
    {
      id: 'streamer',
      title: '스트리머 활동 알림',
      description: '방송 시작, 채팅 이벤트, 새 콘텐츠 업로드 같은 활동을 모아볼 수 있게 준비하고 있어요.',
    },
    {
      id: 'price',
      title: '가격 알림',
      description: '관심 상품이 목표 가격 아래로 내려가면 놓치지 않도록 알려주는 흐름을 준비하고 있어요.',
    },
    {
      id: 'artist',
      title: '아티스트 신곡 알림',
      description: '신곡, 앨범, 피처링 참여곡 발매 흐름을 관찰하고 새 소식을 바로 확인할 수 있게 준비하고 있어요.',
    },
    {
      id: 'custom',
      title: '사용자 정의 피드',
      description: '아이템, 스트리머, 아티스트를 원하는 조건으로 묶어 나만의 알림 피드를 만들 수 있게 확장하고 있어요.',
    },
  ],
  guestBenefits: [
    {
      id: 'save-targets',
      title: '관심 대상 저장',
      description: '자주 보는 상품, 스트리머, 아티스트를 저장해 한 피드에서 모아볼 수 있게 준비하고 있어요.',
    },
    {
      id: 'price-goal',
      title: '목표 가격 설정',
      description: '원하는 가격 조건을 등록하고, 조건이 맞을 때 알림을 받는 흐름을 준비하고 있어요.',
    },
    {
      id: 'release-watch',
      title: '신곡 발매 관찰',
      description: '좋아하는 아티스트의 싱글, 앨범, 참여곡 발매 흐름을 놓치지 않도록 구성하고 있어요.',
    },
    {
      id: 'history',
      title: '알림 히스토리 확인',
      description: '놓친 방송 시작, 가격 변동, 신곡 발매를 시간순으로 다시 확인할 수 있게 구성하고 있어요.',
    },
  ],
  summaries: [
    { label: '등록 수', value: '9' },
    { label: '관찰 중', value: '7' },
    { label: '새 알림', value: '12' },
    { label: '관심 항목', value: '3종' },
  ],
  targets: [
    {
      id: 'target-keyboard',
      type: 'item',
      name: '기계식 키보드',
      summary: '저소음 적축 모델의 가격 하락을 관찰하고 있어요.',
      statusText: '현재 128,000원',
      metricText: '목표가 120,000원',
      trendText: '7일간 -8%',
      trendDirection: 'down',
      rank: 1,
      isWatching: true,
      isMine: true,
      recentAlerts: ['최저가가 어제보다 4,000원 내려갔어요.', '목표가까지 8,000원 남았어요.'],
      relatedArticles: [
        { id: 'article-keyboard-1', title: '저소음 키보드 특가 공유 thread', source: 'keyboard.community', timeText: '18분 전', href: 'https://example.com/keyboard/thread' },
        { id: 'article-keyboard-2', title: '이번 주 입력장치 가격 하락 정리', source: 'price.watch', timeText: '2시간 전', href: 'https://example.com/keyboard/news' },
      ],
      itemDetail: {
        currentPrice: '128,000원',
        targetPrice: '120,000원',
        priceChangeText: '지난주 대비 8% 하락',
        pricePoints: [72, 68, 64, 61, 58, 55],
        priceRanges: KEYBOARD_PRICE_RANGES,
        sourceName: 'Keyboard Store',
        sourceUrl: 'https://example.com/products/keyboard',
      },
    },
    {
      id: 'target-streamer-mory',
      type: 'streamer',
      name: 'mory_live',
      summary: '방송 시작과 채팅 이벤트를 관찰하고 있어요.',
      statusText: '라이브 준비 중',
      metricText: '최근 7일 방송 4회',
      trendText: '활동 +18%',
      trendDirection: 'up',
      rank: 2,
      isWatching: true,
      isMine: true,
      recentAlerts: ['오늘 21:00 방송 예고가 등록됐어요.', '채팅 이벤트가 2건 감지됐어요.'],
      relatedArticles: [
        { id: 'article-mory-1', title: 'mory_live 주간 방송 일정 정리', source: 'stream.board', timeText: '34분 전', href: 'https://example.com/stream/mory-schedule' },
        { id: 'article-mory-2', title: '채팅 Q&A 이벤트 후기', source: 'community.dev', timeText: '어제', href: 'https://example.com/stream/mory-event' },
      ],
      streamerDetail: {
        broadcastStatus: 'offline',
        broadcastTrendText: '최근 방송 빈도가 증가했어요.',
        eventTrendText: '채팅 이벤트 반응이 지난주보다 18% 증가했어요.',
        recentEvents: ['주간 개발 방송 예고', '채팅 Q&A 이벤트', '새 클립 업로드'],
        channelName: 'mory_live channel',
        channelUrl: 'https://example.com/stream/mory-live',
        broadcastDays: [
          { id: 'mory-day-1', dateText: '09.14', startedAt: '17:00', title: '안녕하세요', durationText: '5시간 30분', intensity: 4 },
          { id: 'mory-day-2', dateText: '09.15', startedAt: '20:30', title: '작업 로그', durationText: '2시간 10분', intensity: 2 },
          { id: 'mory-day-3', dateText: '09.16', startedAt: '휴방', title: '방송 없음', durationText: '0분', intensity: 0 },
          { id: 'mory-day-4', dateText: '09.17', startedAt: '19:00', title: 'UI 다듬기', durationText: '3시간 40분', intensity: 3 },
          { id: 'mory-day-5', dateText: '09.18', startedAt: '21:00', title: '채팅 Q&A', durationText: '1시간 50분', intensity: 2 },
          {
            id: 'mory-day-6',
            dateText: '09.19',
            startedAt: '18:00',
            title: '피드 설계',
            durationText: '4시간 20분',
            intensity: 4,
            broadcasts: [
              { id: 'mory-broadcast-6-1', startedAt: '14:00', title: '피드 설계 리허설', durationText: '1시간 20분' },
              { id: 'mory-broadcast-6-2', startedAt: '18:00', title: '피드 설계', durationText: '4시간 20분' },
            ],
          },
          { id: 'mory-day-7', dateText: '09.20', startedAt: '예정', title: '주간 개발 방송', durationText: '예정', intensity: 1 },
        ],
        chatMessages: [
          { id: 'mory-chat-1', channelName: 'mory_live', message: '오늘 피드 화면 구조 괜찮네요', timeText: '방금' },
          { id: 'mory-chat-2', channelName: 'devlog 채널', message: '관찰 대상 등록폼도 필요할 듯', timeText: '12분 전' },
          { id: 'mory-chat-3', channelName: 'mory_live', message: '가격 그래프는 기간 선택이 있으면 좋겠어요', timeText: '31분 전' },
        ],
      },
    },
    {
      id: 'target-artist-nova',
      type: 'artist',
      name: 'artist.nova',
      summary: '신곡과 피처링 참여곡 발매를 관찰하고 있어요.',
      statusText: '신곡 발매 2일 전',
      metricText: '최근 90일 3곡',
      trendText: '발매 빈도 증가',
      trendDirection: 'up',
      rank: 3,
      isWatching: true,
      isMine: true,
      recentAlerts: ['새 싱글 티저가 공개됐어요.', '피처링 참여곡이 발매될 예정이에요.'],
      relatedArticles: [
        { id: 'article-nova-1', title: 'artist.nova 새 싱글 티저 공개', source: 'music.news', timeText: '12분 전', href: 'https://example.com/music/nova-teaser' },
        { id: 'article-nova-2', title: '피처링 참여곡 발매 일정 공유', source: 'fan.community', timeText: '1시간 전', href: 'https://example.com/music/nova-feature' },
      ],
      artistDetail: {
        latestReleaseTitle: 'Midnight Compile',
        upcomingReleaseText: '새 싱글 2일 뒤 공개 예정',
        releaseTrendText: '최근 분기 발매 수가 이전 분기보다 증가했어요.',
        releasePoints: [1, 0, 1, 2, 1, 3],
        recentReleases: ['Midnight Compile', 'Loop Again', 'City Static'],
        albums: [
          {
            id: 'nova-album-1',
            title: 'Midnight Compile',
            releaseDate: '2026-09-18',
            coverToneClassName: 'bg-primary-soft text-primary',
            tracks: [
              { id: 'nova-track-1', title: 'Midnight Compile', duration: '3:18', composer: 'nova, cache.wav', lyricist: 'nova', lyricsPreview: '밤의 로그를 따라가면 다시 빛나는 화면' },
              { id: 'nova-track-2', title: 'Static Heart', duration: '2:54', composer: 'loop.station', lyricist: 'nova', lyricsPreview: '멈춘 줄 알았던 파형이 다시 뛰어' },
            ],
          },
          {
            id: 'nova-album-2',
            title: 'Loop Again',
            releaseDate: '2026-08-02',
            coverToneClassName: 'bg-accent-purple-soft text-accent-purple',
            tracks: [
              { id: 'nova-track-3', title: 'Loop Again', duration: '3:04', composer: 'nova', lyricist: 'nova', lyricsPreview: '같은 장면을 돌아도 다른 마음으로' },
              { id: 'nova-track-4', title: 'Patch Note', duration: '2:47', composer: 'cache.wav', lyricist: 'nova', lyricsPreview: '작은 수정 끝에 너를 다시 만났어' },
            ],
          },
        ],
      },
    },
    {
      id: 'target-gpu',
      type: 'item',
      name: '그래픽카드 RTX 5070',
      summary: '등록 수와 가격 변동이 모두 높은 아이템이에요.',
      statusText: '가격 변동 큼',
      metricText: '등록 128명',
      trendText: '관심 +24%',
      trendDirection: 'up',
      rank: 4,
      isWatching: false,
      isMine: false,
      recentAlerts: ['가격 변동 알림이 하루 3건 발생했어요.'],
      relatedArticles: [
        { id: 'article-gpu-1', title: 'RTX 5070 재고와 가격 변동 모니터링', source: 'hardware.news', timeText: '45분 전', href: 'https://example.com/hardware/rtx5070' },
        { id: 'article-gpu-2', title: '그래픽카드 가격 변동 체감 후기', source: 'pc.community', timeText: '3시간 전', href: 'https://example.com/hardware/community' },
      ],
      itemDetail: {
        currentPrice: '789,000원',
        targetPrice: '740,000원',
        priceChangeText: '24시간 내 가격 변동 3회',
        pricePoints: [60, 66, 63, 70, 67, 74],
        priceRanges: GPU_PRICE_RANGES,
        sourceName: 'GPU Market',
        sourceUrl: 'https://example.com/products/rtx5070',
      },
    },
    {
      id: 'target-streamer-alpha',
      type: 'streamer',
      name: 'streamer.alpha',
      summary: '방송 활동과 이벤트 반응이 빠르게 늘고 있어요.',
      statusText: '방송 중',
      metricText: '이벤트 12건',
      trendText: '활동 +31%',
      trendDirection: 'up',
      rank: 5,
      isWatching: false,
      isMine: false,
      recentAlerts: ['라이브 방송이 시작됐어요.'],
      relatedArticles: [
        { id: 'article-alpha-1', title: 'streamer.alpha 라이브 이벤트 시작', source: 'stream.news', timeText: '방금', href: 'https://example.com/stream/alpha-live' },
        { id: 'article-alpha-2', title: '시청자 참여 이벤트 반응 모음', source: 'live.community', timeText: '20분 전', href: 'https://example.com/stream/alpha-event' },
      ],
      streamerDetail: {
        broadcastStatus: 'live',
        broadcastTrendText: '저녁 시간대 방송 빈도가 높아요.',
        eventTrendText: '시청자 참여 이벤트가 증가했어요.',
        recentEvents: ['라이브 방송 시작', '구독자 이벤트', '새 VOD 업로드'],
        channelName: 'streamer.alpha channel',
        channelUrl: 'https://example.com/stream/alpha',
        broadcastDays: [
          { id: 'alpha-day-1', dateText: '09.14', startedAt: '20:00', title: '랭킹 읽기', durationText: '2시간 40분', intensity: 2 },
          { id: 'alpha-day-2', dateText: '09.15', startedAt: '19:30', title: '구독자 이벤트', durationText: '4시간 10분', intensity: 4 },
          { id: 'alpha-day-3', dateText: '09.16', startedAt: '21:10', title: '게임 방송', durationText: '3시간 5분', intensity: 3 },
          { id: 'alpha-day-4', dateText: '09.17', startedAt: '휴방', title: '방송 없음', durationText: '0분', intensity: 0 },
          { id: 'alpha-day-5', dateText: '09.18', startedAt: '22:00', title: '새 VOD 리뷰', durationText: '2시간 20분', intensity: 2 },
          {
            id: 'alpha-day-6',
            dateText: '09.19',
            startedAt: '18:40',
            title: '라이브 이벤트',
            durationText: '5시간 5분',
            intensity: 4,
            broadcasts: [
              { id: 'alpha-broadcast-6-1', startedAt: '13:10', title: '이벤트 사전 안내', durationText: '45분' },
              { id: 'alpha-broadcast-6-2', startedAt: '18:40', title: '라이브 이벤트', durationText: '5시간 5분' },
            ],
          },
        ],
        chatMessages: [
          { id: 'alpha-chat-1', channelName: 'streamer.alpha', message: '이벤트 보상 다시 알려주세요', timeText: '5분 전' },
          { id: 'alpha-chat-2', channelName: 'alpha clips', message: '오늘 VOD 올라오나요?', timeText: '16분 전' },
        ],
      },
    },
    {
      id: 'target-artist-luna',
      type: 'artist',
      name: 'luna.archive',
      summary: '앨범 발매 전 선공개곡 반응이 높은 아티스트예요.',
      statusText: '선공개곡 공개',
      metricText: '최근 30일 2곡',
      trendText: '발매 +2',
      trendDirection: 'up',
      rank: 6,
      isWatching: true,
      isMine: true,
      recentAlerts: ['선공개곡이 공개됐어요.', '앨범 트랙리스트가 업데이트됐어요.'],
      relatedArticles: [
        { id: 'article-luna-1', title: 'luna.archive 선공개곡 공개', source: 'music.feed', timeText: '28분 전', href: 'https://example.com/music/luna-release' },
        { id: 'article-luna-2', title: '정규 앨범 트랙리스트 반응', source: 'fan.board', timeText: '2시간 전', href: 'https://example.com/music/luna-tracklist' },
      ],
      artistDetail: {
        latestReleaseTitle: 'Soft Launch',
        upcomingReleaseText: '정규 앨범 다음 달 공개 예정',
        releaseTrendText: '앨범 공개 전 싱글 발매가 이어지고 있어요.',
        releasePoints: [0, 1, 0, 1, 2, 2],
        recentReleases: ['Soft Launch', 'Warm Cache'],
        albums: [
          {
            id: 'luna-album-1',
            title: 'Soft Launch',
            releaseDate: '2026-09-16',
            coverToneClassName: 'bg-accent-green-soft text-accent-green',
            tracks: [
              { id: 'luna-track-1', title: 'Soft Launch', duration: '3:22', composer: 'luna.archive', lyricist: 'luna.archive', lyricsPreview: '천천히 열리는 문 사이로 조용한 빛' },
              { id: 'luna-track-2', title: 'Preview Room', duration: '2:58', composer: 'warm.cache', lyricist: 'luna.archive', lyricsPreview: '미리 듣던 계절이 마침내 도착해' },
            ],
          },
          {
            id: 'luna-album-2',
            title: 'Warm Cache',
            releaseDate: '2026-08-21',
            coverToneClassName: 'bg-accent-orange-soft text-accent-orange',
            tracks: [
              { id: 'luna-track-3', title: 'Warm Cache', duration: '3:11', composer: 'warm.cache', lyricist: 'luna.archive', lyricsPreview: '남겨둔 온기가 화면에 머물러' },
              { id: 'luna-track-4', title: 'Index', duration: '2:41', composer: 'luna.archive', lyricist: 'luna.archive', lyricsPreview: '찾아둔 이름들 사이에 너를 적어' },
            ],
          },
        ],
      },
    },
  ],
  observations: [
    {
      id: 'observation-1',
      title: 'mory_live',
      category: '스트리머',
      status: '방송 시작 감지',
    },
    {
      id: 'observation-2',
      title: '기계식 키보드',
      category: '가격 알림',
      status: '목표가 120,000원',
    },
    {
      id: 'observation-3',
      title: 'devlog 채널',
      category: '콘텐츠',
      status: '새 업로드 대기',
    },
  ],
  activities: [
    {
      id: 'activity-1',
      title: '관심 스트리머 방송 시작',
      source: '스트리머 활동 알림',
      timeText: '방금',
      targetId: 'target-streamer-mory',
    },
    {
      id: 'activity-2',
      title: '키보드 가격이 목표가 아래로 내려감',
      source: '가격 알림',
      timeText: '12분 전',
      targetId: 'target-keyboard',
    },
    {
      id: 'activity-3',
      title: '오늘 확인하지 않은 알림 3개',
      source: '통합 피드',
      timeText: '42분 전',
      targetId: 'target-artist-nova',
    },
  ],
};
