import { Button } from '@/shared/ui/Button';
import { IconBadge } from '@/shared/ui/IconBadge';
import { ListRow } from '@/shared/ui/ListRow';

import { BlogPostCard } from './BlogPostCard';
import type { BlogFeedTab, BlogPost } from '../model/blogTypes';

/**
 * blog 로그인 사용자 피드 섹션 컴포넌트의 Props
 */
type BlogMemberFeedSectionProps = {
  tabs: BlogFeedTab[]; // 피드 필터 목록
  posts: BlogPost[];   // 게시글 목록
};

/**
 * 로그인 사용자에게 글쓰기와 개인화된 blog 피드를 표시합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 로그인 사용자용 blog 피드 섹션
 */
export function BlogMemberFeedSection({ tabs, posts }: BlogMemberFeedSectionProps) {
  return (
    <div className="grid gap-4">
      <section>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-display font-semibold">blog</h1>
            <p className="mt-1 text-sm leading-5 text-muted">
              인스타그램처럼 글, 이미지, 댓글, 팔로우를 다루는 서비스예요.
            </p>
          </div>
          <Button className="shrink-0">
            글쓰기
          </Button>
        </div>

        <div className="tray mt-4 grid auto-cols-fr grid-flow-col gap-1 p-1" role="tablist" aria-label="blog 피드 필터">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              className={`relative h-8 whitespace-nowrap rounded-input px-1 text-sm font-medium after:absolute after:-inset-y-1.5 after:inset-x-0 disabled:opacity-45 ${
                tab.isActive
                  ? 'bg-primary text-primary-foreground shadow-key-press'
                  : 'text-muted hover:bg-surface hover:text-foreground active:bg-surface'
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

      <ListRow
        as="section"
        ariaLabel="글 작성"
        leading={(
          <IconBadge tone="strong" className="text-sm font-semibold text-foreground!">
            C
          </IconBadge>
        )}
      >
        <Button variant="secondary" className="justify-start">
          무슨 생각을 공유할까요?
        </Button>
      </ListRow>

      <section className="grid" aria-label="blog 피드">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </section>
    </div>
  );
}
