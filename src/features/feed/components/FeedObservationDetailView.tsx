import Link from 'next/link';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Icon } from '@/shared/ui/Icon';

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
          <Link className="grid size-10 place-items-center rounded-[10px] text-foreground" href="/feed/observations" aria-label="관찰 목록으로 돌아가기">
            <Icon name="chevronLeft" />
          </Link>
        }
      />

      <AppContent className="grid gap-4">
        <section className="rounded-3xl border border-border bg-surface p-5" aria-labelledby="observation-detail-title">
          <p className="text-sm font-bold text-primary">{observation.category}</p>
          <h1 id="observation-detail-title" className="mt-1 text-2xl font-black leading-tight text-foreground">
            {observation.title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">{observation.status}</p>
        </section>

        <section className="grid grid-cols-2 gap-2" aria-label="관찰 상태 요약">
          <article className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-2xl font-black text-foreground">ON</p>
            <p className="mt-1 text-xs text-muted">관찰 상태</p>
          </article>
          <article className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-2xl font-black text-foreground">9</p>
            <p className="mt-1 text-xs text-muted">최근 알림</p>
          </article>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-4" aria-labelledby="observation-rule-title">
          <h2 id="observation-rule-title" className="text-base font-bold text-foreground">관찰 조건</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            실제 연동 전까지는 mock 조건을 표시합니다. 이후 스트리머 활동, 가격 조건, 콘텐츠 업로드 조건을 이 화면에서 관리합니다.
          </p>
        </section>
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
