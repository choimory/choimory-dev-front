import type {
  FeedActivity,
  FeedArtistAlbum,
  FeedBroadcastDay,
  FeedObservationItem,
  FeedPriceRange,
  FeedViewModel,
  FeedWatchTarget,
} from '@/features/feed/model/feedTypes';

/** 테스트용 기간별 가격 추이 (1주 3개 지점, 1개월 2개 지점) */
export const FEED_PRICE_RANGES_FIXTURE: FeedPriceRange[] = [
  {
    id: 'week',
    label: '1주',
    points: [
      { id: 'week-1', dateText: '월', priceText: '100,000원', value: 100 },
      { id: 'week-2', dateText: '수', priceText: '90,000원', value: 90 },
      { id: 'week-3', dateText: '금', priceText: '95,000원', value: 95 },
    ],
  },
  {
    id: 'month',
    label: '1개월',
    points: [
      { id: 'month-1', dateText: '1주', priceText: '120,000원', value: 120 },
      { id: 'month-2', dateText: '4주', priceText: '95,000원', value: 95 },
    ],
  },
];

/** 테스트용 방송 기록 (10일: 2주 열, 마지막 주는 3칸만 채워짐) */
export const FEED_BROADCAST_DAYS_FIXTURE: FeedBroadcastDay[] = Array.from({ length: 10 }, (_, index): FeedBroadcastDay => ({
  id: `day-${index + 1}`,
  dateText: `06.${String(index + 1).padStart(2, '0')}`,
  startedAt: '20:00',
  title: `${index + 1}일차 방송`,
  durationText: '2시간',
  intensity: (index % 5) as FeedBroadcastDay['intensity'],
}));

/** 방송이 여러 번 있었던 날의 방송 기록 (첫째 날만 방송 세션 2개) */
export const FEED_BROADCAST_DAYS_WITH_SESSIONS_FIXTURE: FeedBroadcastDay[] = [
  {
    ...FEED_BROADCAST_DAYS_FIXTURE[0],
    broadcasts: [
      { id: 'session-a', startedAt: '10:00', title: '오전 방송', durationText: '1시간' },
      { id: 'session-b', startedAt: '20:00', title: '저녁 방송', durationText: '3시간' },
    ],
  },
  ...FEED_BROADCAST_DAYS_FIXTURE.slice(1),
];

/** 테스트용 앨범 3개 (각 트랙 2개) */
export const FEED_ALBUMS_FIXTURE: FeedArtistAlbum[] = ['첫번째', '두번째', '세번째'].map((title, albumIndex) => ({
  id: `album-${albumIndex + 1}`,
  title: `${title} 앨범`,
  releaseDate: `2026.0${albumIndex + 1}.01`,
  coverToneClassName: 'bg-primary-soft',
  tracks: [1, 2].map((trackNumber) => ({
    id: `album-${albumIndex + 1}-track-${trackNumber}`,
    title: `${title} 트랙${trackNumber}`,
    duration: `3:0${trackNumber}`,
    composer: `작곡가${trackNumber}`,
    lyricist: `작사가${trackNumber}`,
    lyricsPreview: `${title} 트랙${trackNumber} 가사 미리보기`,
  })),
}));

/** 아이템 종류 관찰 대상 */
export const FEED_ITEM_TARGET_FIXTURE: FeedWatchTarget = {
  id: 'target-item',
  type: 'item',
  name: '기계식 키보드',
  summary: '목표가 아래로 내려가면 알려드려요.',
  statusText: '가격 하락 중',
  metricText: '-8%',
  trendText: '지난주 대비 하락',
  trendDirection: 'down',
  rank: 1,
  isWatching: true,
  isMine: true,
  recentAlerts: ['목표가에 근접했어요'],
  relatedArticles: [
    { id: 'article-1', title: '키보드 가격 동향', source: '커뮤니티', timeText: '1시간 전', href: 'https://example.com/a1' },
  ],
  itemDetail: {
    currentPrice: '95,000원',
    targetPrice: '90,000원',
    priceChangeText: '지난주 대비 8% 하락',
    pricePoints: [100, 90, 95],
    priceRanges: FEED_PRICE_RANGES_FIXTURE,
    sourceName: 'Keyboard Store',
    sourceUrl: 'https://example.com/products/keyboard',
  },
};

/** 스트리머 종류 관찰 대상 */
export const FEED_STREAMER_TARGET_FIXTURE: FeedWatchTarget = {
  id: 'target-streamer',
  type: 'streamer',
  name: 'mory_live',
  summary: '방송 시작과 이벤트를 알려드려요.',
  statusText: '방송 중',
  metricText: '이벤트 3건',
  trendText: '상승 중',
  trendDirection: 'up',
  rank: 2,
  isWatching: true,
  isMine: false,
  recentAlerts: ['방송이 시작됐어요'],
  relatedArticles: [],
  streamerDetail: {
    broadcastStatus: 'live',
    broadcastTrendText: '이번 주 방송 5회',
    eventTrendText: '이번 주 이벤트 3건',
    recentEvents: ['신규 구독 이벤트', '채팅 이벤트'],
    channelName: 'mory_live 채널',
    channelUrl: 'https://example.com/channels/mory',
    broadcastDays: FEED_BROADCAST_DAYS_FIXTURE,
    chatMessages: [
      { id: 'chat-1', channelName: 'mory_live 채널', message: '안녕하세요!', timeText: '방금' },
    ],
  },
};

/** 아티스트 종류 관찰 대상 */
export const FEED_ARTIST_TARGET_FIXTURE: FeedWatchTarget = {
  id: 'target-artist',
  type: 'artist',
  name: 'artist.nova',
  summary: '신곡 발매를 알려드려요.',
  statusText: '발매 예정',
  metricText: '앨범 3장',
  trendText: '유지',
  trendDirection: 'same',
  rank: 3,
  isWatching: false,
  isMine: false,
  recentAlerts: [],
  relatedArticles: [],
  artistDetail: {
    latestReleaseTitle: '최신곡',
    upcomingReleaseText: '다음 달 발매 예정',
    releaseTrendText: '분기마다 발매',
    releasePoints: [1, 2, 3],
    recentReleases: ['최신곡', '이전곡'],
    albums: FEED_ALBUMS_FIXTURE,
  },
};

/** 관찰 대상 목록 */
export const FEED_TARGETS_FIXTURE: FeedWatchTarget[] = [
  FEED_ITEM_TARGET_FIXTURE,
  FEED_STREAMER_TARGET_FIXTURE,
  FEED_ARTIST_TARGET_FIXTURE,
];

/** 최근 알림 목록 */
export const FEED_ACTIVITIES_FIXTURE: FeedActivity[] = [
  { id: 'activity-1', title: '방송이 시작됐어요', source: 'mory_live', timeText: '12분 전', targetId: 'target-streamer' },
  { id: 'activity-2', title: '목표가에 근접했어요', source: '기계식 키보드', timeText: '22분 전', targetId: 'target-item' },
];

/** 관찰 중인 항목 목록 */
export const FEED_OBSERVATIONS_FIXTURE: FeedObservationItem[] = [
  { id: 'observation-1', title: '키보드 가격', category: '아이템', status: '관찰 중' },
];

/** 테스트용 feed 화면 데이터 */
export const FEED_VIEW_MODEL_FIXTURE: FeedViewModel = {
  authStatus: 'guest',
  title: '피드',
  description: '관심 대상을 관찰하는 서비스예요.',
  signals: [
    { id: 'signal-1', title: '스트리머 활동 알림', description: '방송 시작을 알려드려요.' },
    { id: 'signal-2', title: '가격 알림', description: '목표가 아래로 내려가면 알려드려요.' },
  ],
  guestBenefits: [
    { id: 'benefit-1', title: '관심 대상 저장', description: '자주 보는 대상을 저장해요.' },
  ],
  summaries: [
    { label: '관찰 중', value: '3' },
    { label: '오늘 알림', value: '5' },
  ],
  targets: FEED_TARGETS_FIXTURE,
  observations: FEED_OBSERVATIONS_FIXTURE,
  activities: FEED_ACTIVITIES_FIXTURE,
};
