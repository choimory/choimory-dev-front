import { Icon } from '@/shared/ui/Icon';

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
        <div className="grid size-10 place-items-center rounded-full bg-surface-strong text-sm font-bold text-primary">
          {post.authorInitial}
        </div>
        <div>
          <h2 className="text-sm font-bold">{post.authorName}</h2>
          <p className="text-xs leading-5 text-muted">{post.meta}</p>
        </div>
        <button className="grid size-9 place-items-center rounded-[10px] text-muted" type="button" aria-label="게시글 메뉴">
          <span className="text-xl leading-none">...</span>
        </button>
      </header>

      {post.hasMedia && (
        <div
          className="aspect-[4/5] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_72%,transparent),transparent),linear-gradient(45deg,color-mix(in_srgb,var(--color-accent-green)_55%,transparent),color-mix(in_srgb,var(--color-accent-red)_40%,transparent))]"
          aria-label="게시글 이미지"
        />
      )}

      <div className="flex items-center gap-1 px-3 pt-2">
        <button className="grid size-9 place-items-center rounded-[10px] text-accent-red" type="button" aria-label="좋아요">
          <Icon name="heart" />
        </button>
        <button className="grid size-9 place-items-center rounded-[10px]" type="button" aria-label="댓글">
          <Icon name="chat" />
        </button>
        <button className="grid size-9 place-items-center rounded-[10px]" type="button" aria-label="공유">
          <Icon name="share" />
        </button>
        <span className="flex-1" />
        <button className="grid size-9 place-items-center rounded-[10px]" type="button" aria-label="저장">
          <Icon name="bookmark" />
        </button>
      </div>

      <div className="grid gap-2 px-3 pb-4 pt-1">
        <p className="text-sm font-bold">좋아요 {post.likeCount}개</p>
        <p className="text-sm leading-6">
          <strong>{post.authorName}</strong> {post.content}
        </p>
        <button className="w-fit text-sm text-muted" type="button">
          댓글 {post.commentCount}개 모두 보기
        </button>
      </div>
    </article>
  );
}
