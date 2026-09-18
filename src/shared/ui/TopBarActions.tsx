'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import { BrandLogo } from './BrandLogo';
import { Icon } from './Icon';

/**
 * 상단바 액션 컴포넌트의 Props
 */
type TopBarActionsProps = {
  isLoggedIn: boolean; // 로그인 사용자 여부
};

/** 알림 탭 */
type NotificationTab = 'all' | 'blog' | 'feed';

/** 알림 서비스 */
type NotificationService = Exclude<NotificationTab, 'all'>;

/** 알림 탭 목록 */
const NOTIFICATION_TABS: Array<{ id: NotificationTab; label: string }> = [
  { id: 'all', label: '전체' },
  { id: 'blog', label: '블로그' },
  { id: 'feed', label: '피드' },
];

/** 검색 대상 목록 */
const SEARCH_TARGETS = [
  { value: 'all', label: '전체' },
  { value: 'blog', label: '블로그' },
  { value: 'feed', label: '피드' },
];

/** 알림 샘플 목록 */
const NOTIFICATION_ITEMS = [
  { id: 'notice-1', service: 'blog', title: '블로그에 새 댓글이 달렸습니다', meta: '블로그 · 방금' },
  { id: 'notice-2', service: 'feed', title: '관심 스트리머 방송이 시작되었습니다', meta: '피드 · 12분 전' },
  { id: 'notice-3', service: 'feed', title: '관심 상품이 목표가 아래로 내려갔습니다', meta: '피드 · 38분 전' },
] satisfies Array<{ id: string; service: NotificationService; title: string; meta: string }>;

/** 검색 오버레이 중앙 영역 위치 클래스 */
const SEARCH_PANEL_CLASS_NAME = [
  'fixed left-1/2 top-[42%]',
  'grid w-[min(calc(100vw-2rem),720px)] -translate-x-1/2 -translate-y-1/2 gap-5',
].join(' ');

/** 검색 폼 클래스 */
const SEARCH_FORM_CLASS_NAME = [
  'grid grid-cols-[92px_minmax(0,1fr)_auto] gap-2',
  'rounded-2xl border border-border bg-surface p-2',
  'shadow-[0_24px_70px_rgba(0,0,0,0.35)]',
].join(' ');

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
  const filteredNotificationItems = notificationTab === 'all' ? NOTIFICATION_ITEMS : NOTIFICATION_ITEMS.filter((item) => item.service === notificationTab);

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
      <Link className="grid h-9 shrink-0 place-items-center rounded-full bg-primary px-3 text-sm font-bold text-primary-foreground min-[380px]:px-4" href={isLoggedIn ? '/' : '/login'}>
        {isLoggedIn ? '로그아웃' : '로그인'}
      </Link>

      {isNotificationOpen && (
        <section className="absolute right-0 top-12 z-40 w-[min(calc(100vw-2rem),320px)] rounded-2xl border border-border bg-surface p-3 shadow-[0_18px_50px_rgba(0,0,0,0.28)]" aria-label="알림">
          <div className="grid grid-cols-3 gap-1 rounded-[10px] bg-surface-strong p-1">
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
            {filteredNotificationItems.map((item) => (
              <article key={item.id} className="rounded-[10px] bg-surface-strong p-3">
                <h2 className="text-sm font-bold leading-5 text-foreground">{item.title}</h2>
                <p className="mt-1 text-xs text-muted">{item.meta}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {isSearchOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" role="presentation" onClick={() => setIsSearchOpen(false)}>
          <div className={SEARCH_PANEL_CLASS_NAME} onClick={(event) => event.stopPropagation()}>
            <div className="flex justify-center">
              <BrandLogo size="md" />
            </div>
            <form className={SEARCH_FORM_CLASS_NAME} aria-label="검색" onSubmit={(event) => event.preventDefault()}>
              <select className="h-11 rounded-[10px] border border-border bg-surface-strong px-2 text-sm font-bold text-foreground outline-none" aria-label="검색 대상" defaultValue="all">
                {SEARCH_TARGETS.map((target) => (
                  <option key={target.value} value={target.value}>
                    {target.label}
                  </option>
                ))}
              </select>
              <input className="h-11 min-w-0 rounded-[10px] border border-border bg-surface-strong px-3 text-sm text-foreground outline-none" placeholder="검색어를 입력하세요" type="search" />
              <button className="h-11 rounded-[10px] bg-primary px-3 text-sm font-bold text-primary-foreground min-[380px]:px-4" type="submit">
                검색
              </button>
            </form>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
