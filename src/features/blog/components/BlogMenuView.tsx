import Link from 'next/link';

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

/** blog 메뉴별 화면 문구 */
const BLOG_MENU_COPY: Record<BlogMenuKind, { eyebrow: string; title: string; description: string }> = {
  popular: {
    eyebrow: 'blog / popular',
    title: '지금 인기 있는 글',
    description: '좋아요와 댓글 반응이 많은 글을 먼저 모아봅니다.',
  },
  following: {
    eyebrow: 'blog / following',
    title: '팔로잉 피드',
    description: '내가 팔로우한 사용자의 글을 시간순으로 확인합니다.',
  },
  me: {
    eyebrow: 'blog / me',
    title: '내 블로그',
    description: '내가 쓴 글과 댓글, 팔로워 흐름을 확인합니다.',
  },
};

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
          { label: '내 블로그', href: '/blog/me', iconName: 'user', isActive: menuKind === 'me' },
        ]}
      />
    </AppFrame>
  );
}
