import type { PlatformService } from '@/features/platform/model/platformHomeTypes';

/** 테스트용 서비스 목록 (제공 중 2개, 준비 중 1개) */
export const PLATFORM_SERVICES_FIXTURE: PlatformService[] = [
  {
    id: 'blog',
    name: '블로그',
    description: '글과 댓글을 쓰는 서비스',
    href: '/blog',
    iconName: 'note',
    tone: 'blue',
    status: 'active',
    meta: '제공 중',
  },
  {
    id: 'feed',
    name: '피드',
    description: '관찰 대상 알림을 보는 서비스',
    href: '/feed',
    iconName: 'bell',
    tone: 'green',
    status: 'active',
    meta: '제공 중',
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
];
