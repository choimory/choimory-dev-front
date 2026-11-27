import Link from 'next/link';

import { Icon } from '@/shared/ui/Icon';
import { IconBadge } from '@/shared/ui/IconBadge';
import { IconButton } from '@/shared/ui/IconButton';

import type { BlogPost } from '../model/blogTypes';

/**
 * blog 게시글 카드 컴포넌트의 Props
 */
type BlogPostCardProps = {
  post: BlogPost; // 표시할 게시글
};

/**
 * blog 피드에 표시되는 게시글 카드입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 게시글 카드
 */
export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="grid min-w-0 gap-3 border-b border-border px-1 py-4">
      <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <IconBadge size="md" tone="strong" className="text-sm font-semibold text-foreground!">
          {post.authorInitial}
        </IconBadge>
        <Link className="min-w-0 hover:underline active:text-primary" href={`/blog/posts/${post.id}`}>
          <h2 className="text-sm font-semibold">{post.authorName}</h2>
          <p className="flex flex-wrap gap-x-3 text-xs leading-5 tabular-nums text-muted">
            {post.meta.split(' · ').map((part, index) => <span key={`${index}-${part}`}>{part}</span>)}
          </p>
        </Link>
        <IconButton ariaLabel="게시글 메뉴" tone="ghost" className="text-muted active:bg-surface-strong">
          <span className="text-xl leading-none">…</span>
        </IconButton>
      </header>

      <div className={`grid items-start gap-3 ${post.hasMedia ? 'grid-cols-[minmax(0,1fr)_auto]' : ''}`}>
        <Link className="block min-w-0 text-foreground hover:[&_h3]:underline active:[&_h3]:text-primary" href={`/blog/posts/${post.id}`}>
          <h3 className="text-section font-semibold leading-snug">{post.title}</h3>
          <p className="mt-1 text-sm leading-6 text-ink-2">
            <strong className="font-semibold text-foreground">{post.authorName}</strong> {post.content}
          </p>
        </Link>
        {post.hasMedia && (
          <Link href={`/blog/posts/${post.id}`} className="cut-sm block hover:ring-1 hover:ring-muted active:opacity-80">
            <span
              className="cut-sm grid size-[4.5rem] place-items-center bg-surface-strong text-muted"
              data-slot="blog-post-preview"
              role="img"
              aria-label="게시글 이미지"
            >
              <Icon name="image" />
            </span>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-1">
        <IconButton ariaLabel="좋아요" tone="ghost" className="text-accent-red active:bg-surface-strong">
          <Icon name="heart" />
        </IconButton>
        <IconButton ariaLabel="댓글" tone="ghost" className="active:bg-surface-strong">
          <Icon name="chat" />
        </IconButton>
        <IconButton ariaLabel="공유" tone="ghost" className="active:bg-surface-strong">
          <Icon name="share" />
        </IconButton>
        <span className="flex-1" />
        <IconButton ariaLabel="저장" tone="ghost" className="active:bg-surface-strong">
          <Icon name="bookmark" />
        </IconButton>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm tabular-nums">
        <p className="font-medium">좋아요 {post.likeCount}개</p>
        <Link className="whitespace-nowrap text-muted hover:underline active:text-primary" href={`/blog/posts/${post.id}`}>
          댓글 {post.commentCount}개 모두 보기
        </Link>
      </div>
    </article>
  );
}
