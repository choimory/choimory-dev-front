import Link from 'next/link';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Icon } from '@/shared/ui/Icon';

import type { FeedActivity } from '../model/feedTypes';

/**
 * feed 알림 상세 화면 컴포넌트의 Props
 */
type FeedActivityDetailViewProps = {
  activity: FeedActivity; // 표시할 알림
  isLoggedIn: boolean;   // 로그인 여부
};

/**
 * feed 알림 상세 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns feed 알림 상세 화면
 */
export function FeedActivityDetailView({ activity, isLoggedIn }: FeedActivityDetailViewProps) {
  return (
    <AppFrame>
      <AppTopBar
        isLoggedIn={isLoggedIn}
        serviceName="feed"
        serviceHref="/feed"
        leading={
          <Link className="grid size-10 place-items-center rounded-[10px] text-foreground" href="/feed/me" aria-label="내 피드로 돌아가기">
            <Icon name="chevronLeft" />
          </Link>
        }
      />

      <AppContent className="grid gap-4">
        <section className="rounded-3xl border border-border bg-surface p-5" aria-labelledby="activity-detail-title">
          <p className="text-sm font-bold text-primary">{activity.source}</p>
          <h1 id="activity-detail-title" className="mt-1 text-2xl font-black leading-tight text-foreground">
            {activity.title}
          </h1>
          <time className="mt-2 block text-sm text-muted">{activity.timeText}</time>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-4" aria-labelledby="activity-body-title">
          <h2 id="activity-body-title" className="text-base font-bold text-foreground">알림 내용</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            실제 알림 API가 연결되기 전까지 상세 화면의 정보 구조를 먼저 확인합니다. 이후 원본 대상, 발생 조건, 재알림 설정을 이 화면에 연결합니다.
          </p>
        </section>
      </AppContent>

      <BottomNavigation
        items={[
          { label: '홈', href: '/feed', iconName: 'home' },
          { label: '인기', href: '/feed/popular', iconName: 'trophy' },
          { label: '관찰', href: '/feed/observations', iconName: 'barChart' },
          { label: '내 피드', href: '/feed/me', iconName: 'user', isActive: true },
        ]}
      />
    </AppFrame>
  );
}
