'use client';

import Link from 'next/link';
import { useState } from 'react';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Icon } from '@/shared/ui/Icon';
import { IconBadge } from '@/shared/ui/IconBadge';
import { IconButton } from '@/shared/ui/IconButton';
import { ListRow } from '@/shared/ui/ListRow';
import { PageIntroCard } from '@/shared/ui/PageIntroCard';
import { SectionHeader } from '@/shared/ui/SectionHeader';

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
  {
    id: 'comment-1',
    authorName: 'mory.dev',
    authorInitial: 'M',
    content: '이 구조면 상세 화면을 붙이기 쉬워 보입니다.',
    likeCount: 8,
    timeText: '3분 전',
    replies: [
      { id: 'reply-1', authorName: 'jin.note', authorInitial: 'J', content: '@mory.dev 메뉴별 상단 카드까지 들어가면 더 자연스러울 듯합니다.', likeCount: 3, timeText: '1분 전' },
    ],
  },
  {
    id: 'comment-2',
    authorName: 'jin.note',
    authorInitial: 'J',
    content: '하단 메뉴별 화면도 같은 패턴으로 가면 좋겠네요.',
    likeCount: 5,
    timeText: '12분 전',
    replies: [],
  },
];

/**
 * blog 게시글 상세 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns blog 게시글 상세 화면
 */
export function BlogPostDetailView({ isLoggedIn, post }: BlogPostDetailViewProps) {
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const isOwnPost = post.authorName === 'mory.dev';

  return (
    <AppFrame>
      <AppTopBar
        isLoggedIn={isLoggedIn}
        serviceName="blog"
        serviceHref="/blog"
        leading={
          <Link className="grid size-10 place-items-center rounded-input text-foreground hover:bg-surface-strong active:bg-surface-strong" href="/blog" aria-label="blog 홈으로 돌아가기">
            <Icon name="chevronLeft" />
          </Link>
        }
      />

      <AppContent className="grid gap-4">
        <PageIntroCard domainPath="blog / post" title={post.title} />

        <Card as="article" className="grid gap-4" aria-labelledby="post-detail-title">
          <header className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
            <IconBadge size="md" tone="strong" className="text-sm font-semibold text-foreground!">
              {post.authorInitial}
            </IconBadge>
            <div className="min-w-0">
              <h1 id="post-detail-title" className="text-title font-semibold text-foreground">{post.authorName}</h1>
              <p className="mt-1 flex flex-wrap gap-x-3 text-xs leading-5 tabular-nums text-muted">
                {post.meta.split(' · ').map((part, index) => <span key={`${index}-${part}`}>{part}</span>)}
              </p>
            </div>
          </header>

          <p className="text-md leading-7 text-foreground">{post.content}</p>

          {post.hasMedia && (
            <div
              className="cut-sm grid h-[clamp(7rem,28vw,12rem)] place-items-center bg-surface-strong text-muted"
              data-slot="blog-post-detail"
              role="img"
              aria-label="게시글 이미지"
            >
              <Icon className="size-7" name="image" />
            </div>
          )}

          <div className="grid gap-3 border-t border-border pt-3">
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
              {isOwnPost && (
                <Button variant="secondary">
                  수정
                </Button>
              )}
            </div>
            <p className="flex flex-wrap gap-x-4 text-sm font-medium tabular-nums text-foreground">
              <span>좋아요 {post.likeCount}개</span>
              <span>댓글 {post.commentCount}개</span>
            </p>
            <div className="flex flex-wrap gap-x-3" aria-label="게시글 태그">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  className="inline-flex h-8 items-center whitespace-nowrap text-sm font-medium text-muted hover:underline active:text-primary"
                  href={`/blog/popular?tag=${tag}`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </Card>

        <section className="grid gap-2" aria-labelledby="post-comments-title">
          <SectionHeader domainPath="blog / comments" title="댓글" headingId="post-comments-title" />
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 px-1 pb-2">
            <input className="h-10 min-w-0 rounded-input border border-muted bg-surface px-3 text-sm text-foreground focus-visible:border-primary" placeholder="댓글을 남겨보세요" />
            <Button>
              작성
            </Button>
          </div>
          <div className="grid border-t border-border">
            {POST_DETAIL_COMMENTS.map((comment) => (
              <ListRow as="article" className="gap-2 px-1 py-4" key={comment.id}>
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                  <IconBadge size="md" tone="strong" className="text-xs font-semibold text-foreground!">
                    {comment.authorInitial}
                  </IconBadge>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">{comment.authorName}</h3>
                    <p className="mt-1 text-sm leading-5 text-muted">{comment.content}</p>
                  </div>
                  <IconButton ariaLabel="댓글 좋아요" size="sm" tone="ghost" className="text-muted active:bg-surface-strong">
                    <Icon className="size-4" name="heart" />
                  </IconButton>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 text-xs tabular-nums text-muted">
                  <time>{comment.timeText}</time>
                  <span>좋아요 {comment.likeCount}개</span>
                  <button
                    className="relative h-8 font-semibold after:absolute after:-inset-y-1.5 after:inset-x-0 hover:underline active:text-primary"
                    type="button"
                    aria-expanded={replyingCommentId === comment.id}
                    onClick={() => setReplyingCommentId((currentId) => (currentId === comment.id ? null : comment.id))}
                  >
                    답글 달기
                  </button>
                </div>
                {replyingCommentId === comment.id && (
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 py-1">
                    <input className="h-10 min-w-0 rounded-input border border-muted bg-surface px-3 text-sm text-foreground focus-visible:border-primary" placeholder={`@${comment.authorName} 답글을 남겨보세요`} />
                    <Button variant="secondary">
                      작성
                    </Button>
                  </div>
                )}
                {comment.replies.length > 0 && (
                  <div className="grid divide-y divide-border border-l border-border pl-3">
                    {comment.replies.map((reply) => (
                      <article key={reply.id} className="py-2">
                        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                          <IconBadge size="sm" tone="strong" className="text-xs font-semibold text-foreground!">
                            {reply.authorInitial}
                          </IconBadge>
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-foreground">{reply.authorName}</h4>
                            <p className="mt-1 text-sm leading-5 text-muted">{reply.content}</p>
                          </div>
                          <IconButton ariaLabel="대댓글 좋아요" size="sm" tone="ghost" className="text-muted active:bg-surface-strong">
                            <Icon className="size-4" name="heart" />
                          </IconButton>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 text-xs tabular-nums text-muted">
                          <time>{reply.timeText}</time>
                          <span>좋아요 {reply.likeCount}개</span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </ListRow>
            ))}
          </div>
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
