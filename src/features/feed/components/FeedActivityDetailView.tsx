import Link from 'next/link';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Card } from '@/shared/ui/Card';
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
          <Link className="key grid size-10 place-items-center rounded-input text-foreground" href="/feed/me" aria-label="내 피드로 돌아가기">
            <Icon name="chevronLeft" />
          </Link>
        }
      />

      <AppContent className="grid min-w-0 gap-6">
        <section className="pt-2" aria-labelledby="activity-detail-title">
          <h1 id="activity-detail-title" className="min-w-0 break-words font-display text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
            {activity.title}
          </h1>
          <dl className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 border-y border-border py-3 text-sm">
            <dt className="break-words font-medium text-ink-2">{activity.source}</dt>
            <dd className="tabular-nums text-muted"><time>{activity.timeText}</time></dd>
          </dl>
        </section>

        <Card as="section" aria-labelledby="activity-body-title">
          <h2 id="activity-body-title" className="font-display text-lg font-semibold text-foreground">알림 내용</h2>
          <p className="mt-2 text-base leading-6 text-ink-2">
            실제 알림 API가 연결되기 전까지 상세 화면의 정보 구조를 먼저 확인하고 있어요. 이후 원본 대상, 발생 조건, 재알림 설정을 이 화면에 연결할 예정이에요.
          </p>
        </Card>
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
