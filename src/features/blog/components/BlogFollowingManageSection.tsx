'use client';

import { useState } from 'react';

import { Icon } from '@/shared/ui/Icon';
import { IconBadge } from '@/shared/ui/IconBadge';
import { IconButton } from '@/shared/ui/IconButton';
import { ListRow } from '@/shared/ui/ListRow';
import { SegmentedTabs } from '@/shared/ui/SegmentedTabs';

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
 * 팔로워/팔로잉 사용자 요약
 */
type BlogNetworkUser = {
  id: string;          // 사용자 고유 ID
  nickname: string;    // 사용자 닉네임
  initial: string;     // 프로필 이니셜
  description: string; // 사용자 설명
  hasNewPost: boolean; // 새 글 여부
};

/** 팔로잉 화면 관계 탭 목록 */
const BLOG_RELATION_TABS: BlogRelationTab[] = [
  { id: 'followers', label: '팔로워' },
  { id: 'following', label: '팔로잉' },
];

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

/**
 * blog 팔로잉 화면 상단 관리 카드입니다.
 *
 * @returns 팔로잉 관리 섹션
 */
export function BlogFollowingManageSection() {
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
            팔로워와 팔로잉을 탭으로 나누고 필요한 사용자를 빠르게 찾아요.
          </p>
        </div>
        <IconButton ariaLabel="사용자 검색" className="shrink-0" onClick={() => setIsSearchOpen((currentValue) => !currentValue)}>
          <Icon name="search" />
        </IconButton>
      </div>

      <SegmentedTabs className="mt-4" size="md" items={BLOG_RELATION_TABS} activeId={activeTabId} ariaLabel="관계 목록 종류" onChange={handleTabClick} />

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
          <ListRow
            key={user.id}
            as="article"
            tone="strong"
            leading={(
              <IconBadge as="span" className="text-sm font-bold">
                {user.initial}
              </IconBadge>
            )}
            trailing={(
              <button className="h-9 shrink-0 rounded-[10px] bg-surface px-3 text-xs font-bold text-muted" type="button">
                {activeTabId === 'following' ? '언팔로우' : '팔로우'}
              </button>
            )}
          >
            <span className="min-w-0">
              <span className="flex min-w-0 items-center gap-2">
                <span className="truncate text-sm font-bold text-foreground">{user.nickname}</span>
                {user.hasNewPost && <span className="size-2 rounded-full bg-primary" aria-label="새 글 있음" />}
              </span>
              <span className="mt-1 block truncate text-xs text-muted">{user.description}</span>
            </span>
          </ListRow>
        ))}
        {pageUsers.length === 0 && (
          <p className="rounded-2xl bg-surface-strong p-4 text-center text-sm text-muted">
            검색 결과가 없어요.
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <IconButton ariaLabel="이전 목록" disabled={safePageIndex === 0} onClick={() => setPageIndex((currentValue) => Math.max(0, currentValue - 1))}>
          <Icon name="chevronLeft" />
        </IconButton>
        <span className="text-xs font-bold text-muted">
          {safePageIndex + 1} / {pageCount}
        </span>
        <IconButton ariaLabel="다음 목록" disabled={safePageIndex >= pageCount - 1} onClick={() => setPageIndex((currentValue) => Math.min(pageCount - 1, currentValue + 1))}>
          <Icon className="size-5 rotate-180" name="chevronLeft" />
        </IconButton>
      </div>
    </section>
  );
}
