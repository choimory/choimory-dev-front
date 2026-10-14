'use client';

import Link from 'next/link';
import { useState } from 'react';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Icon } from '@/shared/ui/Icon';
import { IconBadge } from '@/shared/ui/IconBadge';
import { ListRow } from '@/shared/ui/ListRow';
import { PageIntroCard } from '@/shared/ui/PageIntroCard';
import { SectionHeader } from '@/shared/ui/SectionHeader';

import { BlogPostCreateModal } from './BlogPostCreateModal';
import { BlogSettingEditModal } from './BlogSettingEditModal';
import type { BlogSettingItem } from './BlogSettingEditModal';
import { BLOG_FOLLOWERS, BLOG_FOLLOWINGS, BLOG_USER_PROFILE, BlogProfileCard } from './BlogProfileCard';
import { BlogRelationModal } from './BlogRelationModal';

/**
 * 내 blog 설정/관리 화면 컴포넌트의 Props
 */
type BlogMeSettingsViewProps = {
  isLoggedIn: boolean; // 로그인 여부
};

/** 내 blog 설정 카드 mock 데이터 */
const BLOG_SETTING_ITEMS: BlogSettingItem[] = [
  {
    id: 'visibility',
    title: '블로그 공개 여부',
    description: '현재 전체 공개 상태예요.',
    value: '전체 공개',
    options: ['전체 공개', '팔로워 공개', '비공개'],
  },
  {
    id: 'comments',
    title: '기본 댓글 허용 범위',
    description: '새 글 작성 시 기본 댓글 범위를 정해요.',
    value: '전체',
    options: ['전체', '팔로워', '비허용'],
  },
  {
    id: 'tag',
    title: '태그 추천',
    description: '자주 쓰는 태그를 글 작성에 활용해요.',
    value: '켜짐',
    options: ['켜짐', '꺼짐'],
  },
];

/** 내 활동 카운팅 mock 데이터 */
const BLOG_ME_ACTIVITY_STATS = [
  { label: '내 댓글', value: '47' },
  { label: '좋아요', value: '96' },
  { label: '북마크', value: '18' },
];

/**
 * 내 blog 설정/관리 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 내 blog 설정/관리 화면
 */
export function BlogMeSettingsView({ isLoggedIn }: BlogMeSettingsViewProps) {
  const [isPostCreateModalOpen, setIsPostCreateModalOpen] = useState(false);
  const [editingSettingItem, setEditingSettingItem] = useState<BlogSettingItem | null>(null);
  const [relationModal, setRelationModal] = useState<'followers' | 'following' | null>(null);

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
        <PageIntroCard domainPath="blog / me" />

        <BlogProfileCard
          headingId="blog-me-profile-title"
          profile={BLOG_USER_PROFILE}
          onSelectRelation={setRelationModal}
          profileHref="/blog/mory.dev"
          extraStats={BLOG_ME_ACTIVITY_STATS}
        />

        <ListRow
          as="section"
          ariaLabel="글 작성"
          leading={(
            <IconBadge tone="primary" className="text-sm font-bold">
              M
            </IconBadge>
          )}
        >
          <button className="h-10 rounded-[10px] bg-surface-strong px-3 text-left text-sm text-muted" type="button" onClick={() => setIsPostCreateModalOpen(true)}>
            무슨 생각을 공유할까요?
          </button>
        </ListRow>

        <section className="grid gap-2" aria-labelledby="blog-settings-title">
          <SectionHeader domainPath="blog / setting" title="설정" headingId="blog-settings-title" />
          {BLOG_SETTING_ITEMS.map((item) => (
            <button
              key={item.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-left"
              type="button"
              onClick={() => setEditingSettingItem(item)}
            >
              <span className="min-w-0">
                <span className="block text-sm font-bold text-foreground">{item.title}</span>
                <span className="mt-1 block text-xs leading-5 text-muted">{item.description}</span>
              </span>
              <span className="rounded-full bg-surface-strong px-3 py-1 text-xs font-bold text-primary">
                {item.value}
              </span>
            </button>
          ))}
        </section>
      </AppContent>

      {isPostCreateModalOpen && (
        <BlogPostCreateModal onClose={() => setIsPostCreateModalOpen(false)} />
      )}
      {editingSettingItem && (
        <BlogSettingEditModal item={editingSettingItem} onClose={() => setEditingSettingItem(null)} />
      )}
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
          { label: '내 블로그', href: '/blog/me', iconName: 'user', isActive: true },
        ]}
      />
    </AppFrame>
  );
}
