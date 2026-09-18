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
    <div className="grid gap-3">
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
          {tabs.map((tab) => (
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
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </section>
    </div>
  );
}
