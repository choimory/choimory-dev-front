import Link from 'next/link';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Icon } from '@/shared/ui/Icon';

import type { BlogPost } from '../model/blogTypes';

/**
 * blog 게시글 상세 화면 컴포넌트의 Props
 */
type BlogPostDetailViewProps = {
  isLoggedIn: boolean; // 로그인 여부
  post: BlogPost;     // 표시할 게시글
};

/** 게시글 상세 댓글 임시 데이터 */
const POST_DETAIL_COMMENTS = [
  { id: 'comment-1', authorName: 'mory.dev', content: '이 구조면 상세 화면을 붙이기 쉬워 보입니다.', timeText: '3분 전' },
  { id: 'comment-2', authorName: 'jin.note', content: '하단 메뉴별 화면도 같은 패턴으로 가면 좋겠네요.', timeText: '12분 전' },
];

/**
 * blog 게시글 상세 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns blog 게시글 상세 화면
 */
export function BlogPostDetailView({ isLoggedIn, post }: BlogPostDetailViewProps) {
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
        <article className="overflow-hidden rounded-3xl border border-border bg-surface" aria-labelledby="post-detail-title">
          <header className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 p-4">
            <div className="grid size-12 place-items-center rounded-full bg-surface-strong text-sm font-bold text-primary">
              {post.authorInitial}
            </div>
            <div className="min-w-0">
              <h1 id="post-detail-title" className="text-base font-bold text-foreground">{post.authorName}</h1>
              <p className="mt-1 text-xs leading-5 text-muted">{post.meta}</p>
            </div>
          </header>

          {post.hasMedia && (
            <div
              className="aspect-[4/5] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_72%,transparent),transparent),linear-gradient(45deg,color-mix(in_srgb,var(--color-accent-green)_55%,transparent),color-mix(in_srgb,var(--color-accent-red)_40%,transparent))]"
              aria-label="게시글 이미지"
            />
          )}

          <div className="grid gap-4 p-4">
            <p className="text-sm leading-6 text-foreground">{post.content}</p>
            <div className="grid grid-cols-2 gap-2">
              <article className="rounded-2xl bg-surface-strong p-3">
                <p className="text-2xl font-black text-foreground">{post.likeCount}</p>
                <p className="mt-1 text-xs text-muted">좋아요</p>
              </article>
              <article className="rounded-2xl bg-surface-strong p-3">
                <p className="text-2xl font-black text-foreground">{post.commentCount}</p>
                <p className="mt-1 text-xs text-muted">댓글</p>
              </article>
            </div>
          </div>
        </article>

        <section className="grid gap-3" aria-labelledby="post-comments-title">
          <div className="px-1">
            <p className="text-sm font-bold text-primary">comments</p>
            <h2 id="post-comments-title" className="mt-1 text-lg font-bold text-foreground">
              댓글
            </h2>
          </div>
          {POST_DETAIL_COMMENTS.map((comment) => (
            <article key={comment.id} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-bold text-foreground">{comment.authorName}</h3>
                <time className="text-xs text-muted">{comment.timeText}</time>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{comment.content}</p>
            </article>
          ))}
        </section>
      </AppContent>

      <BottomNavigation
        items={[
          { label: '홈', href: '/blog', iconName: 'home', isActive: true },
          { label: '인기', href: '/blog/popular', iconName: 'trophy' },
          { label: '팔로잉', href: '/blog/following', iconName: 'heart' },
          { label: '내 블로그', href: '/blog/me', iconName: 'user' },
        ]}
      />
    </AppFrame>
  );
}
