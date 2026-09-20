'use client';

import Link from 'next/link';
import { useState } from 'react';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Icon } from '@/shared/ui/Icon';
import { PageIntroCard } from '@/shared/ui/PageIntroCard';
import { SectionHeader } from '@/shared/ui/SectionHeader';

import { BLOG_FOLLOWERS, BLOG_FOLLOWINGS, BLOG_USER_PROFILE, BlogProfileCard } from './BlogProfileCard';
import { BlogPostCard } from './BlogPostCard';
import { BlogRelationModal } from './BlogRelationModal';
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
        <PageIntroCard domainPath={`blog / @${profile.nickname}`} />

        <BlogProfileCard headingId="blog-user-profile-title" profile={profile} onSelectRelation={setRelationModal} />

        <section className="grid gap-3" aria-labelledby="blog-user-post-title">
          <SectionHeader domainPath="blog / post" title="포스트" headingId="blog-user-post-title" />
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
