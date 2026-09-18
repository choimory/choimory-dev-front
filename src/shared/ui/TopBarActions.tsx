'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Icon } from './Icon';

/**
 * 상단바 액션 컴포넌트의 Props
 */
type TopBarActionsProps = {
  isLoggedIn: boolean; // 로그인 사용자 여부
};

/** 알림 탭 */
type NotificationTab = 'all' | 'service';

/** 알림 탭 목록 */
const NOTIFICATION_TABS: Array<{ id: NotificationTab; label: string }> = [
  { id: 'all', label: '전체' },
  { id: 'service', label: '서비스별' },
];

/** 검색 대상 목록 */
const SEARCH_TARGETS = [
  { value: 'all', label: '전체' },
  { value: 'blog', label: '블로그' },
  { value: 'feed', label: '피드' },
];

/** 알림 샘플 목록 */
const NOTIFICATION_ITEMS = [
  { id: 'notice-1', title: '블로그에 새 댓글이 달렸습니다', meta: '블로그 · 방금' },
  { id: 'notice-2', title: '관심 스트리머 방송이 시작되었습니다', meta: '피드 · 12분 전' },
  { id: 'notice-3', title: '관심 상품이 목표가 아래로 내려갔습니다', meta: '피드 · 38분 전' },
];

/**
 * 상단바의 검색, 알림, 로그인 액션을 담당합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 상단바 액션 영역
 */
export function TopBarActions({ isLoggedIn }: TopBarActionsProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState<NotificationTab>('all');

  return (
    <div className="relative ml-auto flex shrink-0 items-center gap-1 min-[380px]:gap-2">
      <button
        className="hidden size-10 place-items-center rounded-[10px] text-foreground min-[380px]:grid"
        type="button"
        aria-label="검색"
        onClick={() => setIsSearchOpen(true)}
      >
        <Icon name="search" />
      </button>
      <button
        className="hidden size-10 place-items-center rounded-[10px] text-foreground min-[380px]:grid"
        type="button"
        aria-label="알림"
        onClick={() => setIsNotificationOpen((current) => !current)}
      >
        <Icon name="bell" />
      </button>
      <Link className="grid h-9 shrink-0 place-items-center rounded-full bg-primary px-3 text-sm font-bold text-primary-foreground min-[380px]:px-4" href={isLoggedIn ? '/me' : '/login'}>
        {isLoggedIn ? '내 정보' : '로그인'}
      </Link>

      {isNotificationOpen && (
        <section className="absolute right-0 top-12 z-40 w-[min(calc(100vw-2rem),320px)] rounded-2xl border border-border bg-surface p-3 shadow-[0_18px_50px_rgba(0,0,0,0.28)]" aria-label="알림">
          <div className="grid grid-cols-2 gap-1 rounded-[10px] bg-surface-strong p-1">
            {NOTIFICATION_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`h-8 rounded-[8px] text-xs font-bold ${notificationTab === tab.id ? 'bg-primary text-primary-foreground' : 'text-muted'}`}
                type="button"
                onClick={() => setNotificationTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="mt-3 grid gap-2">
            {NOTIFICATION_ITEMS.map((item) => (
              <article key={item.id} className="rounded-[10px] bg-surface-strong p-3">
                <h2 className="text-sm font-bold leading-5 text-foreground">{item.title}</h2>
                <p className="mt-1 text-xs text-muted">{item.meta}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {isSearchOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 backdrop-blur-sm" role="presentation">
          <section className="w-full max-w-[520px] rounded-3xl border border-border bg-surface p-4 shadow-[0_24px_70px_rgba(0,0,0,0.35)]" aria-label="검색">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-foreground">통합 검색</h2>
              <button className="grid size-9 place-items-center rounded-[10px] text-muted" type="button" aria-label="검색 닫기" onClick={() => setIsSearchOpen(false)}>
                <span className="text-xl leading-none">×</span>
              </button>
            </div>
            <form className="mt-4 grid grid-cols-[120px_minmax(0,1fr)_auto] gap-2" onSubmit={(event) => event.preventDefault()}>
              <select className="h-11 rounded-[10px] border border-border bg-surface-strong px-3 text-sm font-bold text-foreground outline-none" aria-label="검색 대상" defaultValue="all">
                {SEARCH_TARGETS.map((target) => (
                  <option key={target.value} value={target.value}>
                    {target.label}
                  </option>
                ))}
              </select>
              <input className="h-11 min-w-0 rounded-[10px] border border-border bg-surface-strong px-3 text-sm text-foreground outline-none" placeholder="검색어를 입력하세요" type="search" />
              <button className="h-11 rounded-[10px] bg-primary px-4 text-sm font-bold text-primary-foreground" type="submit">
                검색
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
