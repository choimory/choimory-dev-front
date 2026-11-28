'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import { LoginLink } from '@/features/auth/components/LoginLink';
import { useAuth } from '@/features/auth/context/AuthContext';
import { platformHomeViewModel } from '@/features/platform/model/platformHomeTypes';
import { hardNavigate } from '@/shared/navigation/hardNavigate';

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
  { id: 'notice-1', service: 'blog', title: '블로그에 새 댓글이 달렸어요', time: '방금' },
  { id: 'notice-2', service: 'feed', title: '관심 스트리머 방송이 시작됐어요', time: '12분 전' },
  { id: 'notice-3', service: 'feed', title: '관심 상품이 목표가 아래로 내려갔어요', time: '38분 전' },
] satisfies Array<{ id: string; service: NotificationService; title: string; time: string }>;

/** 알림 서비스별 표시 이름 */
const NOTIFICATION_SERVICE_LABEL: Record<NotificationService, string> = {
  blog: '블로그',
  feed: '피드',
};

/** 상단바 로그인, 로그아웃 버튼 클래스 */
const AUTH_BUTTON_CLASS_NAME = 'key hit-area grid h-9 shrink-0 place-items-center whitespace-nowrap px-3 text-sm font-semibold min-[380px]:px-4';

/** 상단바 아이콘 버튼 클래스 */
const TOP_BAR_ICON_BUTTON_CLASS_NAME = 'hit-area hidden size-10 place-items-center rounded-input text-foreground transition-colors hover:bg-surface-strong min-[380px]:grid';

/** 상단바 팝오버 패널 클래스 */
const TOP_BAR_POPOVER_CLASS_NAME = 'cut absolute right-4 top-16 w-[min(calc(100vw-2rem),320px)] border border-border bg-surface p-3 shadow-card min-[768px]:right-[max(1rem,calc((100vw-768px)/2))]';

/** 검색 오버레이 중앙 영역 위치 클래스 */
const SEARCH_PANEL_CLASS_NAME = [
  'fixed left-1/2 top-[42%]',
  'grid w-[min(calc(100vw-2rem),720px)] -translate-x-1/2 -translate-y-1/2 gap-5',
].join(' ');

/** 검색 폼 클래스 */
const SEARCH_FORM_CLASS_NAME = [
  'grid grid-cols-[92px_minmax(0,1fr)_auto] gap-2',
  'cut border border-border bg-surface p-2 shadow-card',
].join(' ');

/**
 * 상단바의 검색, 알림, 로그인 액션을 담당합니다.
 * 로그아웃 버튼을 누르면 로그아웃한 뒤 홈으로 전체 이동합니다.
 * 로그인 필요 화면에서는 로그인 가드가 동시에 로그인 화면으로 보내려 하므로, 진행 중인 이동을 덮어쓰도록 전체 이동을 씁니다.
 *
 * @param props 컴포넌트 Props
 * @returns 상단바 액션 영역
 */
export function TopBarActions({ isLoggedIn }: TopBarActionsProps) {
  const { logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState<NotificationTab>('all');
  const filteredNotificationItems = notificationTab === 'all' ? NOTIFICATION_ITEMS : NOTIFICATION_ITEMS.filter((item) => item.service === notificationTab);

  /**
   * 로그아웃하고 홈으로 전체 이동합니다.
   */
  const handleLogout = async (): Promise<void> => {
    await logout();
    hardNavigate('/');
  };

  return (
    <div className="relative ml-auto flex shrink-0 items-center gap-1 min-[380px]:gap-2">
      <button
        className={TOP_BAR_ICON_BUTTON_CLASS_NAME}
        type="button"
        aria-label="검색"
        onClick={() => {
          setIsServiceOpen(false);
          setIsNotificationOpen(false);
          setIsSearchOpen(true);
        }}
      >
        <Icon name="search" />
      </button>
      <button
        className={TOP_BAR_ICON_BUTTON_CLASS_NAME}
        type="button"
        aria-label="알림"
        onClick={() => {
          setIsServiceOpen(false);
          setIsNotificationOpen((current) => !current);
        }}
      >
        <Icon name="bell" />
      </button>
      <button
        className={TOP_BAR_ICON_BUTTON_CLASS_NAME}
        type="button"
        aria-label="서비스"
        onClick={() => {
          setIsNotificationOpen(false);
          setIsServiceOpen((current) => !current);
        }}
      >
        <Icon name="grid" />
      </button>
      {isLoggedIn ? (
        <button className={AUTH_BUTTON_CLASS_NAME} type="button" onClick={handleLogout}>
          로그아웃
        </button>
      ) : (
        <LoginLink className={AUTH_BUTTON_CLASS_NAME}>
          로그인
        </LoginLink>
      )}

      {isNotificationOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-30 bg-transparent" role="presentation" onClick={() => setIsNotificationOpen(false)}>
          <section className={TOP_BAR_POPOVER_CLASS_NAME} aria-label="알림" onClick={(event) => event.stopPropagation()}>
            <div className="tray grid grid-cols-3 gap-1 p-1">
              {NOTIFICATION_TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`h-8 rounded-[5px] text-xs font-semibold transition-colors ${notificationTab === tab.id ? 'bg-primary text-primary-foreground shadow-key-press' : 'text-muted hover:text-foreground'}`}
                  type="button"
                  aria-pressed={notificationTab === tab.id}
                  onClick={() => setNotificationTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="mt-2 grid">
              {filteredNotificationItems.map((item) => (
                <article key={item.id} className="border-b border-border px-1 py-3 last:border-b-0">
                  <h2 className="text-sm font-semibold leading-5 text-foreground">{item.title}</h2>
                  <p className="mt-1 flex gap-2 text-xs text-muted">
                    <span>{NOTIFICATION_SERVICE_LABEL[item.service]}</span>
                    <span>{item.time}</span>
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>,
        document.body,
      )}

      {isServiceOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-30 bg-transparent" role="presentation" onClick={() => setIsServiceOpen(false)}>
          <section className={TOP_BAR_POPOVER_CLASS_NAME} aria-label="서비스" onClick={(event) => event.stopPropagation()}>
            <div className="grid grid-cols-3 gap-2">
              {platformHomeViewModel.services.map((service) => {
                const serviceContent = (
                  <>
                    <span className="grid size-11 place-items-center rounded-input bg-surface-strong text-primary">
                      <Icon name={service.iconName} />
                    </span>
                    <span className="mt-2 block truncate text-xs font-semibold text-foreground">{service.name}</span>
                    <span className="mt-0.5 block truncate text-[11px] text-muted">{service.status === 'active' ? '이동' : '준비 중'}</span>
                  </>
                );

                if (service.status === 'planned') {
                  return (
                    <Link key={service.id} className="grid justify-items-center rounded-input p-2 text-center opacity-75 transition-colors hover:bg-surface-strong" href="/services" onClick={() => setIsServiceOpen(false)}>
                      {serviceContent}
                    </Link>
                  );
                }

                return (
                  <Link key={service.id} className="grid justify-items-center rounded-input p-2 text-center transition-colors hover:bg-surface-strong" href={service.href} onClick={() => setIsServiceOpen(false)}>
                    {serviceContent}
                  </Link>
                );
              })}
            </div>
          </section>
        </div>,
        document.body,
      )}

      {isSearchOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 bg-black/60" role="presentation" onClick={() => setIsSearchOpen(false)}>
          <div className={SEARCH_PANEL_CLASS_NAME} onClick={(event) => event.stopPropagation()}>
            <div className="flex justify-center">
              <BrandLogo size="md" />
            </div>
            <form className={SEARCH_FORM_CLASS_NAME} aria-label="검색" onSubmit={(event) => event.preventDefault()}>
              <select className="h-11 rounded-input border border-rule-2 bg-background px-2 text-sm font-medium text-foreground transition-colors focus-visible:border-primary" aria-label="검색 대상" defaultValue="all">
                {SEARCH_TARGETS.map((target) => (
                  <option key={target.value} value={target.value}>
                    {target.label}
                  </option>
                ))}
              </select>
              <input className="h-11 min-w-0 rounded-input border border-rule-2 bg-background px-3 text-sm text-foreground transition-colors focus-visible:border-primary" placeholder="검색어를 입력하세요" type="search" />
              <button className="key key-primary h-11 whitespace-nowrap bg-primary px-3 text-sm font-semibold text-primary-foreground min-[380px]:px-4" type="submit">
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
