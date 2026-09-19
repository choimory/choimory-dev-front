import type { IconName } from '@/shared/ui/Icon';

/** 화면 인증 상태 */
export type PlatformAuthStatus = 'guest' | 'member';

/** 플랫폼 서비스 카드 정보 */
export type PlatformService = {
  id: string;             // 서비스 고유 ID
  name: string;           // 서비스 이름
  description: string;    // 서비스 설명
  href: string;           // 서비스 진입 경로
  iconName: IconName;     // 서비스 아이콘 이름
  tone: 'blue' | 'green' | 'orange' | 'purple'; // 서비스 강조 색상
  status: 'active' | 'planned'; // 서비스 제공 상태
  meta: string;           // 서비스 상태 요약
};

/** 오늘 요약 항목 */
export type TodaySummary = {
  label: string; // 요약 항목 이름
  value: string; // 요약 값
};

/** 최근 활동 항목 */
export type RecentActivity = {
  id: string;         // 활동 고유 ID
  title: string;      // 활동 제목
  serviceName: string; // 활동이 발생한 서비스
  timeText: string;   // 화면에 표시할 시간
  tone: 'blue' | 'green' | 'orange'; // 활동 강조 색상
};

/** 플랫폼 홈 화면 데이터 */
export type PlatformHomeViewModel = {
  authStatus: PlatformAuthStatus;      // 플랫폼 홈 인증 상태
  services: PlatformService[];       // 자주 쓰는 서비스 목록
  todaySummaries: TodaySummary[];    // 오늘 요약 목록
  recentActivities: RecentActivity[]; // 최근 활동 목록
};

/** 플랫폼 홈 화면에 표시할 임시 데이터 */
export const platformHomeViewModel: PlatformHomeViewModel = {
  authStatus: 'guest',
  services: [
    {
      id: 'blog',
      name: '블로그',
      description: '사진과 글을 공유하는 서비스',
      href: '/blog',
      iconName: 'chat',
      tone: 'blue',
      status: 'active',
      meta: '피드 보기',
    },
    {
      id: 'feed',
      name: '피드',
      description: '방송, 가격 알림을 모아보는 피드',
      href: '/feed',
      iconName: 'bell',
      tone: 'orange',
      status: 'active',
      meta: '알림 모아보기',
    },
    {
      id: 'memo',
      name: '메모',
      description: '아이디어와 작업 메모',
      href: '/services',
      iconName: 'note',
      tone: 'green',
      status: 'planned',
      meta: '준비 중',
    },
    {
      id: 'schedule',
      name: '일정',
      description: '개인 일정과 이벤트 관리',
      href: '/services',
      iconName: 'calendar',
      tone: 'blue',
      status: 'planned',
      meta: '준비 중',
    },
    {
      id: 'account-book',
      name: '가계부',
      description: '수입과 지출을 기록하는 서비스',
      href: '/services',
      iconName: 'tag',
      tone: 'purple',
      status: 'planned',
      meta: '준비 중',
    },
  ],
  todaySummaries: [
    { label: '읽지 않은 알림', value: '9' },
    { label: '진행 중인 관찰', value: '18' },
    { label: '오늘 작성한 항목', value: '4' },
  ],
  recentActivities: [
    {
      id: 'memo-1',
      title: '메모 "프론트 구성"을 수정함',
      serviceName: '개인 메모장',
      timeText: '방금',
      tone: 'green',
    },
    {
      id: 'price-1',
      title: '관심 상품이 목표가 아래로 내려감',
      serviceName: '가격 알림',
      timeText: '12분 전',
      tone: 'orange',
    },
    {
      id: 'blog-1',
      title: 'blog에 새 글이 올라옴',
      serviceName: 'blog',
      timeText: '38분 전',
      tone: 'blue',
    },
  ],
};
