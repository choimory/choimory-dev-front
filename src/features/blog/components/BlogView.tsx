import Link from 'next/link';

import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Icon } from '@/shared/ui/Icon';
import { NarrowContent } from '@/shared/ui/NarrowContent';

import { BlogPostCard } from './BlogPostCard';
import type { BlogViewModel } from '../model/blogTypes';

/**
 * blog 화면 컴포넌트의 Props
 */
type BlogViewProps = {
  viewModel: BlogViewModel; // blog 화면 데이터
};

/**
 * blog 서비스의 피드 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns blog 피드 화면
 */
export function BlogView({ viewModel }: BlogViewProps) {
  return (
    <AppFrame>
      <AppTopBar
        serviceName="blog"
        serviceHref="/blog"
        leading={
          <Link className="grid size-10 place-items-center rounded-[10px] text-foreground" href="/" aria-label="플랫폼 홈으로 돌아가기">
            <Icon name="chevronLeft" />
          </Link>
        }
      />

      <NarrowContent className="grid gap-3">
        <section className="rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">blog</h1>
              <p className="mt-1 text-sm leading-5 text-muted">
                인스타그램처럼 글, 이미지, 댓글, 팔로우를 다루는 서비스입니다.
              </p>
            </div>
            <button className="h-10 shrink-0 rounded-[10px] bg-primary px-4 text-sm font-bold text-primary-foreground" type="button">
              글쓰기
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="blog 피드 필터">
            {viewModel.tabs.map((tab) => (
              <button
                key={tab.label}
                className={`h-9 rounded-full px-3 text-sm ${
                  tab.isActive
                    ? 'bg-primary font-bold text-primary-foreground'
                    : 'border border-border bg-surface text-muted'
                }`}
                type="button"
                role="tab"
                aria-selected={tab.isActive}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-border bg-surface p-3" aria-label="글 작성">
          <div className="grid size-10 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            C
          </div>
          <button className="h-10 rounded-[10px] bg-surface-strong px-3 text-left text-sm text-muted" type="button">
            무슨 생각을 공유할까요?
          </button>
        </section>

        <section className="grid gap-3" aria-label="blog 피드">
          {viewModel.posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </section>
      </NarrowContent>

      <BottomNavigation
        items={[
          { label: '피드', href: '/blog', iconName: 'menu', isActive: true },
          { label: '인기', href: '#', iconName: 'star' },
          { label: '작성', href: '#', iconName: 'plus' },
          { label: '홈', href: '/', iconName: 'home' },
        ]}
      />
    </AppFrame>
  );
}
