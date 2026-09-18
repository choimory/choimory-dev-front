import Link from 'next/link';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Icon } from '@/shared/ui/Icon';

import type { FeedViewModel } from '../model/feedTypes';

/**
 * feed 화면 컴포넌트의 Props
 */
type FeedViewProps = {
  viewModel: FeedViewModel; // feed 화면 데이터
};

/**
 * 스트리머 활동 알림과 가격 알림을 모아보는 feed 서비스 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns feed 서비스 화면
 */
export function FeedView({ viewModel }: FeedViewProps) {
  const isMember = viewModel.authStatus === 'member';

  return (
    <AppFrame>
      <AppTopBar
        isLoggedIn={isMember}
        serviceName="feed"
        serviceHref="/feed"
        leading={
          <Link className="grid size-10 place-items-center rounded-[10px] text-foreground" href="/" aria-label="플랫폼 홈으로 돌아가기">
            <Icon name="chevronLeft" />
          </Link>
        }
      />

      <AppContent className="grid gap-4">
        <section className="rounded-3xl border border-border bg-surface p-5" aria-labelledby="feed-title">
          <p className="text-sm font-bold text-primary">choimory.dev / feed</p>
          <h1 id="feed-title" className="mt-1 text-2xl font-black leading-tight text-foreground">
            {viewModel.title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">{viewModel.description}</p>

          {!isMember && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Link className="grid h-10 place-items-center rounded-[10px] bg-primary px-4 text-sm font-bold text-primary-foreground" href="/login">
                로그인
              </Link>
              <Link className="grid h-10 place-items-center rounded-[10px] bg-surface-strong px-4 text-sm font-bold text-foreground" href="/signup">
                회원가입
              </Link>
            </div>
          )}
        </section>

        {isMember && (
          <section className="grid grid-cols-3 gap-2" aria-label="feed 요약">
            {viewModel.summaries.map((summary) => (
              <article key={summary.label} className="rounded-2xl border border-border bg-surface p-3 text-center">
                <p className="text-2xl font-black text-foreground">{summary.value}</p>
                <p className="mt-1 text-xs leading-4 text-muted">{summary.label}</p>
              </article>
            ))}
          </section>
        )}

        <section className="grid gap-3" aria-labelledby="feed-signal-title">
          <div className="px-1">
            <p className="text-sm font-bold text-primary">{isMember ? '추적 피드' : '준비 중인 피드'}</p>
            <h2 id="feed-signal-title" className="mt-1 text-lg font-bold text-foreground">
              {isMember ? '관심 알림 요약' : '이런 알림을 한 곳에서 볼 수 있게 준비합니다'}
            </h2>
          </div>

          {isMember ? (
            <div className="grid gap-3">
              {viewModel.activities.map((activity) => (
                <article key={activity.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-surface p-3">
                  <span className="grid size-10 place-items-center rounded-full bg-primary-soft text-primary">
                    <Icon className="size-5" name="bell" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-foreground">{activity.title}</span>
                    <span className="mt-1 block text-xs text-muted">{activity.source}</span>
                  </span>
                  <time className="text-xs text-muted">{activity.timeText}</time>
                </article>
              ))}
            </div>
          ) : (
            <div className="grid gap-3">
              {viewModel.signals.map((signal) => (
                <article key={signal.id} className="rounded-2xl border border-border bg-surface p-4">
                  <h3 className="text-base font-bold text-foreground">{signal.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{signal.description}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </AppContent>

      <BottomNavigation
        items={[
          { label: '피드', href: '/feed', iconName: 'bell', isActive: true },
          { label: '관심', href: '#', iconName: 'star' },
          { label: 'blog', href: '/blog', iconName: 'chat' },
          { label: '홈', href: '/', iconName: 'home' },
        ]}
      />
    </AppFrame>
  );
}
