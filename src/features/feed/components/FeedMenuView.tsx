import Link from 'next/link';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Icon } from '@/shared/ui/Icon';

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
    title: '많이 확인한 알림',
    description: '최근 반응이 많거나 자주 확인한 알림 흐름을 모아봅니다.',
  },
  observations: {
    eyebrow: 'feed / observations',
    title: '관찰 목록',
    description: '방송, 가격, 콘텐츠처럼 계속 지켜볼 대상을 관리합니다.',
  },
  me: {
    eyebrow: 'feed / me',
    title: '내 피드',
    description: '내 관심사에 맞춰 들어온 알림과 관찰 상태를 확인합니다.',
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
  const isObservationMenu = menuKind === 'observations';
  const listItems = isObservationMenu ? viewModel.observations : viewModel.activities;

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
        <section className="rounded-3xl border border-border bg-surface p-5" aria-labelledby="feed-menu-title">
          <p className="text-sm font-bold text-primary">{copy.eyebrow}</p>
          <h1 id="feed-menu-title" className="mt-1 text-2xl font-black leading-tight text-foreground">
            {copy.title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">{copy.description}</p>
        </section>

        <section className="grid gap-3" aria-label={copy.title}>
          {listItems.map((item) => {
            const href = isObservationMenu ? `/feed/observations/${item.id}` : `/feed/activities/${item.id}`;
            const subtitle = 'category' in item ? `${item.category} · ${item.status}` : item.source;
            return (
              <Link key={item.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition hover:bg-surface-strong" href={href}>
                <span className="grid size-10 place-items-center rounded-full bg-primary-soft text-primary">
                  <Icon className="size-5" name={isObservationMenu ? 'star' : 'bell'} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-foreground">{item.title}</span>
                  <span className="mt-1 block text-xs text-muted">{subtitle}</span>
                </span>
                {'timeText' in item && <time className="text-xs text-muted">{item.timeText}</time>}
              </Link>
            );
          })}
        </section>
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
