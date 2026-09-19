'use client';

import Link from 'next/link';
import { useState } from 'react';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Icon } from '@/shared/ui/Icon';

import { BlogPostCard } from './BlogPostCard';
import type { BlogPost } from '../model/blogTypes';

/**
 * 유저 blog 화면 컴포넌트의 Props
 */
type BlogUserBlogViewProps = {
  isLoggedIn: boolean; // 로그인 여부
  nickname: string;   // 표시할 유저 닉네임
  posts: BlogPost[];  // 유저 글 목록
};

/**
 * 유저 blog 프로필 mock 데이터
 */
type BlogUserProfile = {
  nickname: string;      // 사용자 닉네임
  initial: string;       // 프로필 이니셜
  description: string;   // 자기소개
  postCount: number;     // 작성 글 수
  followerCount: number; // 팔로워 수
  followingCount: number; // 팔로잉 수
};

/**
 * 사용자 관계 목록 항목
 */
type BlogRelationUser = {
  id: string;       // 사용자 고유 ID
  nickname: string; // 사용자 닉네임
  initial: string;  // 프로필 이니셜
  summary: string;  // 사용자 요약
};

/** 내 blog 프로필 mock 데이터 */
const BLOG_USER_PROFILE: BlogUserProfile = {
  nickname: 'mory.dev',
  initial: 'M',
  description: 'choimory.dev의 서비스 화면과 인터랙션을 차근차근 다듬고 있습니다.',
  postCount: 12,
  followerCount: 128,
  followingCount: 36,
};

/** 팔로워 mock 데이터 */
const BLOG_FOLLOWERS: BlogRelationUser[] = [
  { id: 'follower-1', nickname: 'jin.note', initial: 'J', summary: '개발 노트와 UI 메모를 기록' },
  { id: 'follower-2', nickname: 'ui.archive', initial: 'U', summary: '작은 인터랙션 패턴 수집' },
  { id: 'follower-3', nickname: 'nav.lab', initial: 'N', summary: '서비스 네비게이션 구조 연구' },
  { id: 'follower-4', nickname: 'feed.watch', initial: 'F', summary: '관찰 피드와 알림 흐름 기록' },
  { id: 'follower-5', nickname: 'route.log', initial: 'R', summary: '라우팅 구조를 정리하는 개발자' },
  { id: 'follower-6', nickname: 'design.memo', initial: 'D', summary: '작은 화면 설계 메모' },
];

/** 팔로잉 mock 데이터 */
const BLOG_FOLLOWINGS: BlogRelationUser[] = [
  { id: 'following-1', nickname: 'jin.note', initial: 'J', summary: '개발 노트와 UI 메모를 기록' },
  { id: 'following-2', nickname: 'ui.archive', initial: 'U', summary: '작은 인터랙션 패턴 수집' },
  { id: 'following-3', nickname: 'feed.watch', initial: 'F', summary: '관찰 피드와 알림 흐름 기록' },
  { id: 'following-4', nickname: 'nav.lab', initial: 'N', summary: '서비스 네비게이션 구조 연구' },
  { id: 'following-5', nickname: 'build.note', initial: 'B', summary: '빌드와 배포 체크리스트 기록' },
  { id: 'following-6', nickname: 'comment.lab', initial: 'C', summary: '댓글 인터랙션 실험 기록' },
];

/**
 * 팔로워/팔로잉 목록 모달입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 관계 목록 모달
 */
function BlogRelationModal({ title, users, onClose }: { title: string; users: BlogRelationUser[]; onClose: () => void }) {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 3;
  const pageCount = Math.max(1, Math.ceil(users.length / pageSize));
  const pageUsers = users.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-background/70 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-relation-modal-title"
      onClick={onClose}
    >
      <section className="w-full max-w-sm rounded-3xl border border-border bg-surface p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between gap-3">
          <h3 id="blog-relation-modal-title" className="text-lg font-black text-foreground">{title}</h3>
          <button className="grid size-9 place-items-center rounded-[10px] bg-surface-strong text-muted" type="button" aria-label="닫기" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>
        <div className="mt-4 grid gap-2">
          {pageUsers.map((user) => (
            <article key={user.id} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl bg-surface-strong p-3">
              <span className="grid size-10 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                {user.initial}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-foreground">{user.nickname}</span>
                <span className="mt-1 block truncate text-xs text-muted">{user.summary}</span>
              </span>
            </article>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            className="grid size-9 place-items-center rounded-[10px] bg-surface-strong text-muted disabled:opacity-35"
            type="button"
            aria-label="이전 목록"
            disabled={pageIndex === 0}
            onClick={() => setPageIndex((currentValue) => Math.max(0, currentValue - 1))}
          >
            <Icon name="chevronLeft" />
          </button>
          <span className="text-xs font-bold text-muted">
            {pageIndex + 1} / {pageCount}
          </span>
          <button
            className="grid size-9 place-items-center rounded-[10px] bg-surface-strong text-muted disabled:opacity-35"
            type="button"
            aria-label="다음 목록"
            disabled={pageIndex >= pageCount - 1}
            onClick={() => setPageIndex((currentValue) => Math.min(pageCount - 1, currentValue + 1))}
          >
            <Icon className="size-5 rotate-180" name="chevronLeft" />
          </button>
        </div>
      </section>
    </div>
  );
}

/**
 * 유저 blog 메인 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 유저 blog 메인 화면
 */
export function BlogUserBlogView({ isLoggedIn, nickname, posts }: BlogUserBlogViewProps) {
  const [relationModal, setRelationModal] = useState<'followers' | 'following' | null>(null);
  const profile = {
    ...BLOG_USER_PROFILE,
    nickname,
    initial: nickname.slice(0, 1).toUpperCase(),
  };

  return (
    <AppFrame>
      <AppTopBar
        isLoggedIn={isLoggedIn}
        serviceName="blog"
        serviceHref="/blog"
        leading={
          <Link className="grid size-10 place-items-center rounded-[10px] text-foreground" href="/blog" aria-label="blog 홈으로 돌아가기">
            <Icon name="chevronLeft" />
          </Link>
        }
      />

      <AppContent className="grid gap-3">
        <section className="px-1" aria-labelledby="blog-user-profile-title">
          <p className="text-sm font-bold text-primary">blog / @{profile.nickname}</p>
        </section>

        <section className="rounded-3xl border border-border bg-surface p-5" aria-labelledby="blog-user-profile-title">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
            <div className="grid size-16 place-items-center rounded-3xl bg-primary text-xl font-black text-primary-foreground">
              {profile.initial}
            </div>
            <div className="min-w-0">
              <h1 id="blog-user-profile-title" className="text-2xl font-black leading-tight text-foreground">
                {profile.nickname}
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted">{profile.description}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <article className="rounded-2xl bg-surface-strong p-3 text-center">
              <p className="text-xl font-black text-foreground">{profile.postCount}</p>
              <p className="mt-1 text-xs text-muted">작성 글</p>
            </article>
            <button className="rounded-2xl bg-surface-strong p-3 text-center" type="button" onClick={() => setRelationModal('followers')}>
              <p className="text-xl font-black text-foreground">{profile.followerCount}</p>
              <p className="mt-1 text-xs text-muted">팔로워</p>
            </button>
            <button className="rounded-2xl bg-surface-strong p-3 text-center" type="button" onClick={() => setRelationModal('following')}>
              <p className="text-xl font-black text-foreground">{profile.followingCount}</p>
              <p className="mt-1 text-xs text-muted">팔로잉</p>
            </button>
          </div>
        </section>

        <section className="grid gap-3" aria-labelledby="blog-user-post-title">
          <div className="px-1">
            <p className="text-sm font-bold text-primary">blog / post</p>
            <h2 id="blog-user-post-title" className="mt-1 text-lg font-bold text-foreground">
              포스트
            </h2>
          </div>
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </section>
      </AppContent>

      {relationModal === 'followers' && (
        <BlogRelationModal title="팔로워" users={BLOG_FOLLOWERS} onClose={() => setRelationModal(null)} />
      )}
      {relationModal === 'following' && (
        <BlogRelationModal title="팔로잉" users={BLOG_FOLLOWINGS} onClose={() => setRelationModal(null)} />
      )}

      <BottomNavigation
        items={[
          { label: '홈', href: '/blog', iconName: 'home' },
          { label: '인기', href: '/blog/popular', iconName: 'trophy' },
          { label: '팔로잉', href: '/blog/following', iconName: 'heart' },
          { label: '내 블로그', href: '/blog/me', iconName: 'user' },
        ]}
      />
    </AppFrame>
  );
}
