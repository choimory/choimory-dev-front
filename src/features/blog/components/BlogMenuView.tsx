'use client';

import Link from 'next/link';
import { useState } from 'react';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Icon } from '@/shared/ui/Icon';

import { BlogPostCard } from './BlogPostCard';
import type { BlogMenuKind, BlogViewModel } from '../model/blogTypes';

/**
 * blog 메뉴 화면 컴포넌트의 Props
 */
type BlogMenuViewProps = {
  menuKind: BlogMenuKind;   // 표시할 메뉴 종류
  viewModel: BlogViewModel; // blog 화면 데이터
};

/** 인기 랭킹 탭 종류 */
type BlogRankingTabId = 'search' | 'mention' | 'follower' | 'tag';

/**
 * 인기 랭킹 탭
 */
type BlogRankingTab = {
  id: BlogRankingTabId; // 탭 ID
  label: string;        // 탭 이름
};

/** 팔로잉 화면 관계 탭 종류 */
type BlogRelationTabId = 'followers' | 'following';

/**
 * 팔로잉 화면 관계 탭
 */
type BlogRelationTab = {
  id: BlogRelationTabId; // 탭 ID
  label: string;         // 탭 이름
};

/**
 * 인기 랭킹 항목
 */
type BlogRankingItem = {
  id: string;           // 랭킹 항목 ID
  rank: number;         // 현재 순위
  label: string;        // 랭킹 표시 이름
  description: string;  // 보조 설명
  valueText: string;    // 숫자 지표
  trend: 'up' | 'down' | 'same' | 'new'; // 순위 변동 상태
};

/**
 * 팔로워/팔로잉 사용자 요약
 */
type BlogNetworkUser = {
  id: string;          // 사용자 고유 ID
  nickname: string;    // 사용자 닉네임
  initial: string;     // 프로필 이니셜
  description: string; // 사용자 설명
  hasNewPost: boolean; // 새 글 여부
};

/** blog 메뉴별 화면 문구 */
const BLOG_MENU_COPY: Record<BlogMenuKind, { eyebrow: string; title: string; description: string }> = {
  popular: {
    eyebrow: 'blog / popular',
    title: '지금 인기 있는 글',
    description: '검색어, 멘션, 팔로워, 태그 흐름을 기준으로 많이 움직이는 글을 모아봅니다.',
  },
  following: {
    eyebrow: 'blog / following',
    title: '팔로잉 피드',
    description: '팔로워와 팔로잉 목록을 확인하고 필요한 사용자를 빠르게 찾습니다.',
  },
};

/** 인기 랭킹 탭 목록 */
const BLOG_RANKING_TABS: BlogRankingTab[] = [
  { id: 'search', label: '검색어' },
  { id: 'mention', label: '멘션' },
  { id: 'follower', label: '팔로워' },
  { id: 'tag', label: '태그' },
];

/** 팔로잉 화면 관계 탭 목록 */
const BLOG_RELATION_TABS: BlogRelationTab[] = [
  { id: 'followers', label: '팔로워' },
  { id: 'following', label: '팔로잉' },
];

/** blog 인기 랭킹 mock 데이터 */
const BLOG_RANKING_ITEMS: Record<BlogRankingTabId, BlogRankingItem[]> = {
  search: [
    { id: 'search-1', rank: 1, label: '프론트 화면 구조', description: '상세 화면과 메뉴 연결 검색이 늘었습니다.', valueText: '12', trend: 'up' },
    { id: 'search-2', rank: 2, label: '피드 관찰 UX', description: '관찰 목록과 알림 설정 글이 주목받고 있습니다.', valueText: 'NEW', trend: 'new' },
    { id: 'search-3', rank: 3, label: '블로그 댓글 개선', description: '댓글, 대댓글, 멘션 UI 논의가 이어집니다.', valueText: '2', trend: 'down' },
    { id: 'search-4', rank: 4, label: '유저 블로그 라우팅', description: '내 블로그를 유저 페이지로 합치는 흐름이 검색됩니다.', valueText: '6', trend: 'up' },
    { id: 'search-5', rank: 5, label: '팔로잉 목록 검색', description: '관계 목록을 빠르게 찾는 UI가 함께 언급됩니다.', valueText: '1', trend: 'same' },
  ],
  mention: [
    { id: 'mention-1', rank: 1, label: '@mory.dev', description: '화면 구조 글에서 가장 많이 언급되었습니다.', valueText: '18회', trend: 'up' },
    { id: 'mention-2', rank: 2, label: '@jin.note', description: '개발 노트 댓글에서 멘션이 늘었습니다.', valueText: '11회', trend: 'up' },
    { id: 'mention-3', rank: 3, label: '@ui.archive', description: '상세보기 개선 글에 자주 연결됩니다.', valueText: '7회', trend: 'same' },
    { id: 'mention-4', rank: 4, label: '@nav.lab', description: '서비스 내비게이션 글에서 새로 언급됩니다.', valueText: '5회', trend: 'new' },
    { id: 'mention-5', rank: 5, label: '@feed.watch', description: '관찰 피드 사례와 함께 멘션됩니다.', valueText: '2회', trend: 'down' },
  ],
  follower: [
    { id: 'follower-1', rank: 1, label: 'mory.dev', description: '최근 화면 기획 글 이후 팔로워가 늘었습니다.', valueText: '24명', trend: 'up' },
    { id: 'follower-2', rank: 2, label: 'jin.note', description: '짧은 개발 메모가 꾸준히 저장되고 있습니다.', valueText: '15명', trend: 'up' },
    { id: 'follower-3', rank: 3, label: 'ui.archive', description: 'UI 패턴 아카이브 유입이 안정적입니다.', valueText: '9명', trend: 'same' },
    { id: 'follower-4', rank: 4, label: 'nav.lab', description: '메뉴 구조 정리 글 이후 팔로워가 늘었습니다.', valueText: '7명', trend: 'up' },
    { id: 'follower-5', rank: 5, label: 'feed.watch', description: '가격 알림 사례가 다시 읽히고 있습니다.', valueText: '3명', trend: 'down' },
  ],
  tag: [
    { id: 'tag-1', rank: 1, label: '#frontend', description: '상세 화면과 레이아웃 글에서 클릭이 많습니다.', valueText: '42회', trend: 'up' },
    { id: 'tag-2', rank: 2, label: '#feed', description: 'feed 서비스 화면과 함께 자주 이동합니다.', valueText: '29회', trend: 'up' },
    { id: 'tag-3', rank: 3, label: '#comment', description: '댓글 UX 개선 글에서 반복 클릭됩니다.', valueText: '16회', trend: 'new' },
    { id: 'tag-4', rank: 4, label: '#profile', description: '유저 블로그 프로필 카드에서 클릭됩니다.', valueText: '12회', trend: 'up' },
    { id: 'tag-5', rank: 5, label: '#following', description: '관계 목록 개선 글에서 함께 쓰입니다.', valueText: '8회', trend: 'same' },
  ],
};

/** 팔로워 mock 데이터 */
const FOLLOWER_USERS: BlogNetworkUser[] = [
  { id: 'follower-user-1', nickname: 'jin.note', initial: 'J', description: '개발 노트와 UI 메모를 기록', hasNewPost: true },
  { id: 'follower-user-2', nickname: 'ui.archive', initial: 'U', description: '작은 인터랙션 패턴 수집', hasNewPost: false },
  { id: 'follower-user-3', nickname: 'nav.lab', initial: 'N', description: '서비스 네비게이션 구조 연구', hasNewPost: true },
  { id: 'follower-user-4', nickname: 'feed.watch', initial: 'F', description: '관찰 피드와 알림 흐름 기록', hasNewPost: false },
  { id: 'follower-user-5', nickname: 'design.memo', initial: 'D', description: '작은 화면 설계 메모', hasNewPost: true },
  { id: 'follower-user-6', nickname: 'route.log', initial: 'R', description: '라우팅 구조를 정리하는 개발자', hasNewPost: false },
];

/** 팔로잉 mock 데이터 */
const FOLLOWING_USERS: BlogNetworkUser[] = [
  { id: 'following-1', nickname: 'mory.dev', initial: 'M', description: '플랫폼 화면 구조를 다듬는 중', hasNewPost: true },
  { id: 'following-2', nickname: 'jin.note', initial: 'J', description: '개발 노트와 UI 메모를 기록', hasNewPost: true },
  { id: 'following-3', nickname: 'ui.archive', initial: 'U', description: '작은 인터랙션 패턴 수집', hasNewPost: false },
  { id: 'following-4', nickname: 'feed.watch', initial: 'F', description: '관찰 피드와 알림 흐름 기록', hasNewPost: false },
  { id: 'following-5', nickname: 'nav.lab', initial: 'N', description: '서비스 네비게이션 구조 연구', hasNewPost: true },
  { id: 'following-6', nickname: 'build.note', initial: 'B', description: '빌드와 배포 체크리스트 기록', hasNewPost: false },
];

/** 인기 랭킹 상태별 badge 클래스 */
const RANKING_TREND_CLASS_NAME: Record<BlogRankingItem['trend'], string> = {
  up: 'bg-primary-soft text-primary',
  down: 'bg-accent-red/15 text-accent-red',
  same: 'bg-surface text-muted',
  new: 'bg-accent-green-soft text-accent-green',
};

/** 인기 랭킹 상태별 아이콘 */
const RANKING_TREND_ICON: Record<BlogRankingItem['trend'], string> = {
  up: '↑',
  down: '↓',
  same: '-',
  new: '+',
};

/**
 * blog 인기 화면 상단 랭킹 카드입니다.
 *
 * @returns 인기 랭킹 섹션
 */
function BlogPopularInsightSection() {
  const [activeTabId, setActiveTabId] = useState<BlogRankingTabId>('search');
  const rankingItems = BLOG_RANKING_ITEMS[activeTabId];

  return (
    <section className="rounded-3xl border border-border bg-surface p-5" aria-labelledby="blog-popular-ranking-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-primary">blog / ranking</p>
          <h2 id="blog-popular-ranking-title" className="mt-1 text-xl font-black leading-tight text-foreground">
            실시간 랭킹
          </h2>
        </div>
        <span className="rounded-full bg-surface-strong px-2.5 py-1 text-xs font-bold text-muted">
          지금
        </span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-1 rounded-2xl bg-surface-strong p-1" role="tablist" aria-label="인기 랭킹 종류">
        {BLOG_RANKING_TABS.map((tab) => {
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
        {rankingItems.map((item, index) => (
          <article
            key={item.id}
            className="blog-ranking-enter grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-surface-strong p-3"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <span className="grid size-9 place-items-center rounded-xl bg-surface text-sm font-black text-primary">
              {item.rank}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-foreground">{item.label}</span>
              <span className="mt-1 block text-xs leading-4 text-muted">{item.description}</span>
            </span>
            <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${RANKING_TREND_CLASS_NAME[item.trend]}`}>
              <span aria-hidden="true">{RANKING_TREND_ICON[item.trend]}</span>
              {item.valueText}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

/**
 * blog 팔로잉 화면 상단 관리 카드입니다.
 *
 * @returns 팔로잉 관리 섹션
 */
function BlogFollowingManageSection() {
  const [activeTabId, setActiveTabId] = useState<BlogRelationTabId>('following');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const users = activeTabId === 'followers' ? FOLLOWER_USERS : FOLLOWING_USERS;
  const filteredUsers = users.filter((user) => {
    const normalizedSearchText = searchText.trim().toLowerCase();

    if (normalizedSearchText.length === 0) {
      return true;
    }

    return `${user.nickname} ${user.description}`.toLowerCase().includes(normalizedSearchText);
  });
  const pageSize = 3;
  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safePageIndex = Math.min(pageIndex, pageCount - 1);
  const pageUsers = filteredUsers.slice(safePageIndex * pageSize, safePageIndex * pageSize + pageSize);

  /**
   * 관계 탭을 변경합니다.
   *
   * @param tabId 변경할 탭 ID
   */
  const handleTabClick = (tabId: BlogRelationTabId) => {
    setActiveTabId(tabId);
    setPageIndex(0);
    setSearchText('');
  };

  return (
    <section className="rounded-3xl border border-border bg-surface p-5" aria-labelledby="blog-following-manage-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-primary">blog / following</p>
          <h2 id="blog-following-manage-title" className="mt-1 text-xl font-black leading-tight text-foreground">
            관계 목록
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            팔로워와 팔로잉을 탭으로 나누고 필요한 사용자를 빠르게 찾습니다.
          </p>
        </div>
        <button
          className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-surface-strong text-muted"
          type="button"
          aria-label="사용자 검색"
          onClick={() => setIsSearchOpen((currentValue) => !currentValue)}
        >
          <Icon name="search" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-1 rounded-2xl bg-surface-strong p-1" role="tablist" aria-label="관계 목록 종류">
        {BLOG_RELATION_TABS.map((tab) => {
          const isActive = activeTabId === tab.id;

          return (
            <button
              key={tab.id}
              className={`h-9 rounded-xl text-sm font-black transition ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted'}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {isSearchOpen && (
        <input
          className="mt-3 h-10 w-full rounded-[10px] border border-border bg-surface-strong px-3 text-sm text-foreground outline-none placeholder:text-muted"
          placeholder="닉네임이나 설명으로 검색"
          value={searchText}
          onChange={(event) => {
            setSearchText(event.target.value);
            setPageIndex(0);
          }}
        />
      )}

      <div className="mt-4 grid gap-2">
        {pageUsers.map((user) => (
          <article key={user.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-surface-strong p-3">
            <span className="grid size-10 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">
              {user.initial}
            </span>
            <span className="min-w-0">
              <span className="flex min-w-0 items-center gap-2">
                <span className="truncate text-sm font-bold text-foreground">{user.nickname}</span>
                {user.hasNewPost && <span className="size-2 rounded-full bg-primary" aria-label="새 글 있음" />}
              </span>
              <span className="mt-1 block truncate text-xs text-muted">{user.description}</span>
            </span>
            <button className="h-9 shrink-0 rounded-[10px] bg-surface px-3 text-xs font-bold text-muted" type="button">
              {activeTabId === 'following' ? '언팔로우' : '팔로우'}
            </button>
          </article>
        ))}
        {pageUsers.length === 0 && (
          <p className="rounded-2xl bg-surface-strong p-4 text-center text-sm text-muted">
            검색 결과가 없습니다.
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          className="grid size-9 place-items-center rounded-[10px] bg-surface-strong text-muted disabled:opacity-35"
          type="button"
          aria-label="이전 목록"
          disabled={safePageIndex === 0}
          onClick={() => setPageIndex((currentValue) => Math.max(0, currentValue - 1))}
        >
          <Icon name="chevronLeft" />
        </button>
        <span className="text-xs font-bold text-muted">
          {safePageIndex + 1} / {pageCount}
        </span>
        <button
          className="grid size-9 place-items-center rounded-[10px] bg-surface-strong text-muted disabled:opacity-35"
          type="button"
          aria-label="다음 목록"
          disabled={safePageIndex >= pageCount - 1}
          onClick={() => setPageIndex((currentValue) => Math.min(pageCount - 1, currentValue + 1))}
        >
          <Icon className="size-5 rotate-180" name="chevronLeft" />
        </button>
      </div>
    </section>
  );
}

/**
 * blog 하단 메뉴로 진입하는 목록 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns blog 메뉴 화면
 */
export function BlogMenuView({ menuKind, viewModel }: BlogMenuViewProps) {
  const copy = BLOG_MENU_COPY[menuKind];
  const isMember = viewModel.authStatus === 'member';

  return (
    <AppFrame>
      <AppTopBar
        isLoggedIn={isMember}
        serviceName="blog"
        serviceHref="/blog"
        leading={
          <Link className="grid size-10 place-items-center rounded-[10px] text-foreground" href="/blog" aria-label="blog 홈으로 돌아가기">
            <Icon name="chevronLeft" />
          </Link>
        }
      />

      <AppContent className="grid gap-3">
        <section className="rounded-3xl border border-border bg-surface p-5" aria-labelledby="blog-menu-title">
          <p className="text-sm font-bold text-primary">{copy.eyebrow}</p>
          <h1 id="blog-menu-title" className="mt-1 text-2xl font-black leading-tight text-foreground">
            {copy.title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">{copy.description}</p>
        </section>

        {menuKind === 'popular' && <BlogPopularInsightSection />}
        {menuKind === 'following' && <BlogFollowingManageSection />}

        <section className="grid gap-3" aria-label={copy.title}>
          {viewModel.posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </section>
      </AppContent>

      <BottomNavigation
        items={[
          { label: '홈', href: '/blog', iconName: 'home' },
          { label: '인기', href: '/blog/popular', iconName: 'trophy', isActive: menuKind === 'popular' },
          { label: '팔로잉', href: '/blog/following', iconName: 'heart', isActive: menuKind === 'following' },
          { label: '내 블로그', href: '/blog/me', iconName: 'user' },
        ]}
      />
    </AppFrame>
  );
}
