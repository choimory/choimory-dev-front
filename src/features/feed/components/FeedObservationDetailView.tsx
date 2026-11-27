import Link from 'next/link';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Card } from '@/shared/ui/Card';
import { Icon } from '@/shared/ui/Icon';
import { StatCard } from '@/shared/ui/StatCard';

import type { FeedObservationItem } from '../model/feedTypes';

/**
 * feed 관찰 상세 화면 컴포넌트의 Props
 */
type FeedObservationDetailViewProps = {
  isLoggedIn: boolean;             // 로그인 여부
  observation: FeedObservationItem; // 표시할 관찰 항목
};

/**
 * feed 관찰 항목 상세 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns feed 관찰 상세 화면
 */
export function FeedObservationDetailView({ isLoggedIn, observation }: FeedObservationDetailViewProps) {
  return (
    <AppFrame>
      <AppTopBar
        isLoggedIn={isLoggedIn}
        serviceName="feed"
        serviceHref="/feed"
        leading={
          <Link className="key grid size-10 place-items-center rounded-input text-foreground" href="/feed/observations" aria-label="관찰 목록으로 돌아가기">
            <Icon name="chevronLeft" />
          </Link>
        }
      />

      <AppContent className="grid min-w-0 gap-6">
        <section className="pt-2" aria-labelledby="observation-detail-title">
          <h1 id="observation-detail-title" className="min-w-0 break-words font-display text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
            {observation.title}
          </h1>
          <dl className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 border-y border-border py-3 text-sm">
            <dt className="break-words font-medium text-ink-2">{observation.category}</dt>
            <dd className="text-muted">{observation.status}</dd>
          </dl>
        </section>

        <section className="grid grid-cols-2 gap-4 sm:gap-6" aria-label="관찰 상태 요약">
          <StatCard label="관찰 상태" value="ON" />
          <StatCard label="최근 알림" value="9" />
        </section>

        <Card as="section" aria-labelledby="observation-rule-title">
          <h2 id="observation-rule-title" className="font-display text-lg font-semibold text-foreground">관찰 조건</h2>
          <p className="mt-2 text-base leading-6 text-ink-2">
            실제 연동 전까지는 mock 조건을 표시하고 있어요. 이후 스트리머 활동, 가격 조건, 콘텐츠 업로드 조건을 이 화면에서 관리할 예정이에요.
          </p>
        </Card>
      </AppContent>

      <BottomNavigation
        items={[
          { label: '홈', href: '/feed', iconName: 'home' },
          { label: '인기', href: '/feed/popular', iconName: 'trophy' },
          { label: '관찰', href: '/feed/observations', iconName: 'barChart', isActive: true },
          { label: '내 피드', href: '/feed/me', iconName: 'user' },
        ]}
      />
    </AppFrame>
  );
}
