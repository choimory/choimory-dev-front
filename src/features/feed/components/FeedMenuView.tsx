'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Icon } from '@/shared/ui/Icon';

import type { FeedMenuKind, FeedTargetType, FeedViewModel, FeedWatchTarget } from '../model/feedTypes';

/**
 * feed 메뉴 화면 컴포넌트의 Props
 */
type FeedMenuViewProps = {
  menuKind: FeedMenuKind;   // 표시할 메뉴 종류
  viewModel: FeedViewModel; // feed 화면 데이터
};

/** feed 랭킹 탭 종류 */
type FeedRankingTabId = 'all' | FeedTargetType;

/** feed 랭킹 탭 */
type FeedRankingTab = {
  id: FeedRankingTabId; // 탭 ID
  label: string;        // 탭 이름
};

/** 관찰 대상 등록 탭 종류 */
type FeedCreateTabId = FeedTargetType;

/** feed 메뉴별 화면 문구 */
const FEED_MENU_COPY: Record<FeedMenuKind, { eyebrow: string; title: string; description: string }> = {
  popular: {
    eyebrow: 'feed / popular',
    title: '인기 관찰 대상 랭킹',
    description: '등록과 반응이 늘고 있는 아이템, 스트리머, 아티스트를 모아봅니다.',
  },
  observations: {
    eyebrow: 'feed / observations',
    title: '관찰 목록',
    description: '가격, 방송, 신곡처럼 계속 지켜볼 대상을 확인합니다.',
  },
  me: {
    eyebrow: 'feed / me',
    title: '내 피드',
    description: '내가 등록한 관찰 대상과 알림 설정으로 이동합니다.',
  },
};

/** feed 인기 랭킹 탭 목록 */
const FEED_RANKING_TABS: FeedRankingTab[] = [
  { id: 'all', label: '전체' },
  { id: 'item', label: '아이템' },
  { id: 'streamer', label: '스트리머' },
  { id: 'artist', label: '아티스트' },
];

/** feed target 순위 변화별 badge 클래스 */
const TARGET_TREND_CLASS_NAME: Record<FeedWatchTarget['trendDirection'], string> = {
  up: 'bg-primary-soft text-primary',
  down: 'bg-accent-red/15 text-accent-red',
  same: 'bg-surface text-muted',
};

/** feed target 순위 변화별 아이콘 */
const TARGET_TREND_ICON: Record<FeedWatchTarget['trendDirection'], string> = {
  up: '↑',
  down: '↓',
  same: '-',
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
        <section className="rounded-3xl border border-border bg-surface p-5" aria-labelledby="feed-menu-title">
          <p className="text-sm font-bold text-primary">{copy.eyebrow}</p>
          <h1 id="feed-menu-title" className="mt-1 text-2xl font-black leading-tight text-foreground">
            {copy.title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">{copy.description}</p>
        </section>

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

function PopularTargetSection({ targets }: { targets: FeedWatchTarget[] }) {
  const [activeTabId, setActiveTabId] = useState<FeedRankingTabId>('all');
  const rankingTargets = activeTabId === 'all' ? targets : targets.filter((target) => target.type === activeTabId);

  return (
    <section className="rounded-3xl border border-border bg-surface p-5" aria-labelledby="feed-popular-target-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-primary">feed / ranking</p>
          <h2 id="feed-popular-target-title" className="mt-1 text-xl font-black leading-tight text-foreground">
            실시간 관찰 대상 랭킹
          </h2>
        </div>
        <span className="rounded-full bg-surface-strong px-2.5 py-1 text-xs font-bold text-muted">
          지금
        </span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-1 rounded-2xl bg-surface-strong p-1" role="tablist" aria-label="feed 인기 랭킹 종류">
        {FEED_RANKING_TABS.map((tab) => {
          const isActive = activeTabId === tab.id;

          return (
            <button
              key={tab.id}
              className={`h-9 rounded-xl text-xs font-black transition ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted'}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTabId(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-2">
        {rankingTargets.map((target, index) => (
          <Link
            key={target.id}
            className="blog-ranking-enter grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-surface-strong p-3"
            href={`/feed/targets/${target.id}`}
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <span className="grid size-9 place-items-center rounded-xl bg-surface text-sm font-black text-primary">
              {target.rank}
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="truncate text-sm font-bold text-foreground">{target.name}</span>
                <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-[11px] font-bold text-muted">{getTargetTypeLabel(target.type)}</span>
              </span>
            </span>
            <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${TARGET_TREND_CLASS_NAME[target.trendDirection]}`}>
              <span aria-hidden="true">{TARGET_TREND_ICON[target.trendDirection]}</span>
              {target.trendText}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function PopularTargetEventSection({ activities }: { activities: FeedViewModel['activities'] }) {
  return (
    <section className="grid gap-3" aria-labelledby="feed-popular-event-title">
      <div className="px-1">
        <p className="text-sm font-bold text-primary">feed / event</p>
        <h2 id="feed-popular-event-title" className="mt-1 text-lg font-bold text-foreground">
          인기 대상 최근 이벤트
        </h2>
      </div>
      <div className="grid gap-3">
        {activities.map((activity) => (
          <Link key={activity.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition hover:bg-surface-strong" href={`/feed/targets/${activity.targetId}`}>
            <span className="grid size-10 place-items-center rounded-full bg-primary-soft text-primary">
              <Icon className="size-5" name="bell" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-foreground">{activity.title}</span>
              <span className="mt-1 block truncate text-xs text-muted">{activity.source}</span>
            </span>
            <time className="text-xs text-muted">{activity.timeText}</time>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ObservationTargetSection({ targets }: { targets: FeedWatchTarget[] }) {
  return (
    <section className="grid gap-3" aria-labelledby="feed-watching-target-title">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="관찰 대상 요약">
        <SummaryCard label="관찰 중" value={`${targets.length}`} />
        <SummaryCard label="아이템" value={`${targets.filter((target) => target.type === 'item').length}`} />
        <SummaryCard label="스트리머" value={`${targets.filter((target) => target.type === 'streamer').length}`} />
        <SummaryCard label="아티스트" value={`${targets.filter((target) => target.type === 'artist').length}`} />
      </div>
      <div className="px-1">
        <p className="text-sm font-bold text-primary">feed / target</p>
        <h2 id="feed-watching-target-title" className="mt-1 text-lg font-bold text-foreground">
          내가 관찰 중인 대상
        </h2>
      </div>
      <div className="grid gap-3">
        {targets.map((target) => (
          <TargetListLink
            key={target.id}
            href={`/feed/targets/${target.id}`}
            rightText={target.trendText}
            target={target}
          />
        ))}
      </div>
    </section>
  );
}

function MyFeedManageSection({ summaries, targets }: { summaries: FeedViewModel['summaries']; targets: FeedWatchTarget[] }) {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  return (
    <>
      <section className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="내 피드 요약">
        {summaries.map((summary) => (
          <SummaryCard key={summary.label} label={summary.label} value={summary.value} />
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4" aria-labelledby="feed-add-target-title">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-primary">feed / add</p>
            <h2 id="feed-add-target-title" className="mt-1 text-base font-bold text-foreground">
              관찰 대상 추가
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">아이템, 스트리머, 아티스트를 등록해 알림 조건을 관리합니다.</p>
          </div>
          <button className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-primary text-primary-foreground" type="button" aria-label="관찰 대상 추가" onClick={() => setIsCreateFormOpen(true)}>
            <Icon name="plus" />
          </button>
        </div>
      </section>

      {isCreateFormOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 bg-black/60 px-4 py-6 backdrop-blur-sm" role="presentation" onClick={() => setIsCreateFormOpen(false)}>
          <div className="mx-auto grid max-h-[calc(100vh-3rem)] w-full max-w-[560px] overflow-y-auto rounded-3xl border border-border bg-surface p-4 shadow-[0_24px_70px_rgba(0,0,0,0.35)]" role="dialog" aria-modal="true" aria-labelledby="feed-create-target-title" onClick={(event) => event.stopPropagation()}>
            <div className="mb-3 flex justify-end">
              <button className="grid size-9 place-items-center rounded-[10px] bg-surface-strong text-muted" type="button" aria-label="관찰 대상 등록 닫기" onClick={() => setIsCreateFormOpen(false)}>
                <Icon name="x" />
              </button>
            </div>
            <FeedTargetCreateForm />
          </div>
        </div>,
        document.body,
      )}

      <section className="grid gap-3" aria-labelledby="feed-my-target-title">
        <div className="px-1">
          <p className="text-sm font-bold text-primary">feed / settings</p>
          <h2 id="feed-my-target-title" className="mt-1 text-lg font-bold text-foreground">
            내 알림 설정
          </h2>
        </div>
        <div className="grid gap-3">
          {targets.map((target) => (
            <TargetListLink
              key={target.id}
              href={`/feed/me/targets/${target.id}`}
              rightText="설정"
              target={target}
            />
          ))}
        </div>
      </section>
    </>
  );
}

function TargetListLink({ href, rightText, target }: { href: string; rightText: string; target: FeedWatchTarget }) {
  return (
    <Link className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition hover:bg-surface-strong" href={href}>
      <span className={`grid size-10 place-items-center rounded-full ${getTargetToneClassName(target.type)}`}>
        <Icon className="size-5" name={getTargetIconName(target.type)} />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-bold text-foreground">{target.name}</span>
          <span className="shrink-0 rounded-full bg-surface-strong px-2 py-0.5 text-[11px] font-bold text-muted">{getTargetTypeLabel(target.type)}</span>
        </span>
        <span className="mt-1 block truncate text-xs text-muted">{target.summary}</span>
        <span className="mt-1 block truncate text-xs text-muted">{target.statusText} · {target.metricText}</span>
      </span>
      <span className="text-xs font-bold text-primary">{rightText}</span>
    </Link>
  );
}

function FeedTargetCreateForm() {
  const [activeTabId, setActiveTabId] = useState<FeedCreateTabId>('item');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChangeTab = (tabId: FeedCreateTabId) => {
    setActiveTabId(tabId);
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <section className="rounded-2xl border border-border bg-surface p-4" aria-labelledby="feed-create-target-title">
      <div>
        <p className="text-sm font-bold text-primary">feed / register</p>
        <h2 id="feed-create-target-title" className="mt-1 text-base font-bold text-foreground">
          관찰 대상 등록
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">API 연결 전까지 화면에 필요한 입력 형태만 먼저 확인합니다.</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-1 rounded-2xl bg-surface-strong p-1" role="tablist" aria-label="관찰 대상 등록 종류">
        {(['item', 'streamer', 'artist'] satisfies FeedCreateTabId[]).map((tabId) => {
          const isActive = activeTabId === tabId;

          return (
            <button
              key={tabId}
              className={`h-9 rounded-xl text-xs font-black transition ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted'}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleChangeTab(tabId)}
            >
              {getTargetTypeLabel(tabId)}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3">
        <FormField label="대상 이름" placeholder={activeTabId === 'item' ? '기계식 키보드' : activeTabId === 'streamer' ? 'mory_live' : 'artist.nova'} />
        <FormField label="설명" placeholder="관찰 대상의 요약 설명" />
        <FormField label="원본 링크" placeholder="https://example.com/original" />
        <FormField label="알림 주기" placeholder="즉시 / 하루 요약 / 주간 요약" />

        {activeTabId === 'item' && (
          <>
            <FormField label="현재 가격" placeholder="128,000원" />
            <FormField label="목표 가격" placeholder="120,000원" />
          </>
        )}

        {activeTabId === 'streamer' && (
          <>
            <FormField label="채널명" placeholder="mory_live channel" />
            <FormField label="채널 URL" placeholder="https://example.com/stream/channel" />
            <TogglePreview label="방송 알림" />
            <TogglePreview label="채팅/이벤트 알림" />
          </>
        )}

        {activeTabId === 'artist' && (
          <>
            <FormField label="최근 발매곡" placeholder="Midnight Compile" />
            <TogglePreview label="신곡/앨범 알림" />
            <TogglePreview label="피처링/참여곡 알림" />
          </>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted">{isSubmitted ? '등록 준비가 완료되었습니다.' : '저장 전 mock 입력값은 목록에 추가하지 않습니다.'}</p>
        <button className="h-10 shrink-0 rounded-[10px] bg-primary px-4 text-sm font-bold text-primary-foreground" type="button" onClick={handleSubmit}>
          {isSubmitted ? '준비 완료' : '등록'}
        </button>
      </div>
    </section>
  );
}

function FormField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-foreground">{label}</span>
      <input className="h-11 rounded-[10px] border border-border bg-surface-strong px-3 text-sm text-foreground outline-none focus:border-primary" placeholder={placeholder} />
    </label>
  );
}

function TogglePreview({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[10px] bg-surface-strong px-3 py-2">
      <span className="text-sm font-bold text-foreground">{label}</span>
      <span className="grid h-7 w-12 justify-end rounded-full bg-primary p-1" aria-hidden>
        <span className="size-5 rounded-full bg-white shadow-sm" />
      </span>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-3 text-center">
      <p className="text-2xl font-black text-foreground">{value}</p>
      <p className="mt-1 text-xs leading-4 text-muted">{label}</p>
    </article>
  );
}

function getTargetTypeLabel(type: FeedTargetType) {
  switch (type) {
    case 'item':
      return '아이템';
    case 'streamer':
      return '스트리머';
    case 'artist':
      return '아티스트';
  }
}

function getTargetIconName(type: FeedTargetType) {
  switch (type) {
    case 'item':
      return 'tag';
    case 'streamer':
      return 'monitor';
    case 'artist':
      return 'star';
  }
}

function getTargetToneClassName(type: FeedTargetType) {
  switch (type) {
    case 'item':
      return 'bg-accent-orange-soft text-accent-orange';
    case 'streamer':
      return 'bg-primary-soft text-primary';
    case 'artist':
      return 'bg-surface-strong text-foreground';
  }
}
