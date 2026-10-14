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
    <article className="overflow-hidden rounded-2xl border border-border bg-surface">
      <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3">
        <IconBadge tone="strong" className="text-sm font-bold">
          {post.authorInitial}
        </IconBadge>
        <Link className="min-w-0" href={`/blog/posts/${post.id}`}>
          <h2 className="text-sm font-bold">{post.authorName}</h2>
          <p className="text-xs leading-5 text-muted">{post.meta}</p>
        </Link>
        <IconButton ariaLabel="게시글 메뉴" tone="ghost" className="text-muted">
          <span className="text-xl leading-none">...</span>
        </IconButton>
      </header>

      {post.hasMedia && (
        <Link
          href={`/blog/posts/${post.id}`}
          className="block"
        >
          <span
            className="block aspect-[4/5] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_72%,transparent),transparent),linear-gradient(45deg,color-mix(in_srgb,var(--color-accent-green)_55%,transparent),color-mix(in_srgb,var(--color-accent-red)_40%,transparent))]"
            aria-label="게시글 이미지"
          />
        </Link>
      )}

      <div className="flex items-center gap-1 px-3 pt-2">
        <IconButton ariaLabel="좋아요" tone="ghost" className="text-accent-red">
          <Icon name="heart" />
        </IconButton>
        <IconButton ariaLabel="댓글" tone="ghost">
          <Icon name="chat" />
        </IconButton>
        <IconButton ariaLabel="공유" tone="ghost">
          <Icon name="share" />
        </IconButton>
        <span className="flex-1" />
        <IconButton ariaLabel="저장" tone="ghost">
          <Icon name="bookmark" />
        </IconButton>
      </div>

      <div className="grid gap-2 px-3 pb-4 pt-1">
        <p className="text-sm font-bold">좋아요 {post.likeCount}개</p>
        <Link className="block" href={`/blog/posts/${post.id}`}>
          <h3 className="text-sm font-bold text-foreground">{post.title}</h3>
          <p className="mt-1 text-sm leading-6">
            <strong>{post.authorName}</strong> {post.content}
          </p>
        </Link>
        <Link className="w-fit text-sm text-muted" href={`/blog/posts/${post.id}`}>
          댓글 {post.commentCount}개 모두 보기
        </Link>
      </div>
    </article>
  );
}
