'use client';

import Link from 'next/link';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Icon } from '@/shared/ui/Icon';
import { PageIntroCard } from '@/shared/ui/PageIntroCard';

import { PopularTargetSection } from './PopularTargetSection';
import { PopularTargetEventSection } from './PopularTargetEventSection';
import { ObservationTargetSection } from './ObservationTargetSection';
import { MyFeedManageSection } from './MyFeedManageSection';
import type { FeedMenuKind, FeedViewModel } from '../model/feedTypes';

/**
 * feed 메뉴 화면 컴포넌트의 Props
 */
type FeedMenuViewProps = {
  menuKind: FeedMenuKind;   // 표시할 메뉴 종류
  viewModel: FeedViewModel; // feed 화면 데이터
};

/** feed 메뉴별 화면 문구 */
const FEED_MENU_COPY: Record<FeedMenuKind, { eyebrow: string; title: string; description: string }> = {
  popular: {
    eyebrow: 'feed / popular',
    title: '실시간 순위',
    description: '등록과 반응이 늘고 있는 아이템, 스트리머, 아티스트를 모아봐요.',
  },
  observations: {
    eyebrow: 'feed / observations',
    title: '관찰',
    description: '가격, 방송, 신곡처럼 계속 지켜볼 대상을 확인해보세요.',
  },
  me: {
    eyebrow: 'feed / me',
    title: '내 피드',
    description: '내가 등록한 관찰 대상과 알림 설정으로 이동해요.',
  },
};

/**
 * feed 하단 메뉴로 진입하는 목록 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns feed 메뉴 화면
 */
export function FeedMenuView({ menuKind, viewModel }: FeedMenuViewProps) {
  const copy = FEED_MENU_COPY[menuKind];
  const isMember = viewModel.authStatus === 'member';
  const popularTargets = [...viewModel.targets].sort((a, b) => a.rank - b.rank);
  const watchingTargets = viewModel.targets.filter((target) => target.isWatching);
  const myTargets = viewModel.targets.filter((target) => target.isMine);

  return (
    <AppFrame>
      <AppTopBar
        isLoggedIn={isMember}
        serviceName="feed"
        serviceHref="/feed"
        leading={
          <Link className="grid size-10 place-items-center rounded-[10px] text-foreground" href="/feed" aria-label="feed 홈으로 돌아가기">
            <Icon name="chevronLeft" />
          </Link>
        }
      />

      <AppContent className="grid gap-3">
        {menuKind !== 'me' && (
          <PageIntroCard
            domainPath={copy.eyebrow}
            title={copy.title}
            description={copy.description}
          />
        )}

        {menuKind === 'popular' && (
          <>
            <PopularTargetSection targets={popularTargets} />
            <PopularTargetEventSection activities={viewModel.activities} />
          </>
        )}
        {menuKind === 'observations' && <ObservationTargetSection targets={watchingTargets} />}
        {menuKind === 'me' && <MyFeedManageSection summaries={viewModel.summaries} targets={myTargets} />}
      </AppContent>

      <BottomNavigation
        items={[
          { label: '홈', href: '/feed', iconName: 'home' },
          { label: '인기', href: '/feed/popular', iconName: 'trophy', isActive: menuKind === 'popular' },
          { label: '관찰', href: '/feed/observations', iconName: 'barChart', isActive: menuKind === 'observations' },
          { label: '내 피드', href: '/feed/me', iconName: 'user', isActive: menuKind === 'me' },
        ]}
      />
    </AppFrame>
  );
}
