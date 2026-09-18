import Link from 'next/link';

import { BlogPostCard } from './BlogPostCard';
import type { BlogPost } from '../model/blogTypes';

/**
 * blog 비회원 섹션 컴포넌트의 Props
 */
type BlogGuestSectionProps = {
  posts: BlogPost[]; // 미리보기로 표시할 게시글 목록
};

/**
 * 비로그인 사용자에게 blog 서비스를 소개하고 일부 게시글을 미리 보여줍니다.
 *
 * @param props 컴포넌트 Props
 * @returns 비회원용 blog 섹션
 */
export function BlogGuestSection({ posts }: BlogGuestSectionProps) {
  return (
    <div className="grid gap-3">
      <section className="rounded-2xl border border-border bg-surface p-4" aria-labelledby="blog-guest-title">
        <p className="text-sm font-bold text-primary">choimory.dev / blog 시작하기</p>
        <h1 id="blog-guest-title" className="mt-1 text-xl font-bold leading-tight">
          글과 이미지를 둘러보고, 로그인하면 내 피드를 이어갈 수 있습니다
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          비회원은 공개 게시글을 볼 수 있고, 로그인하면 글쓰기, 좋아요, 댓글, 팔로우를 사용할 수 있습니다.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 border-y border-border py-3 text-center">
          <div>
            <p className="text-base font-black text-foreground">공개</p>
            <p className="mt-1 text-xs text-muted">피드 보기</p>
          </div>
          <div>
            <p className="text-base font-black text-foreground">로그인</p>
            <p className="mt-1 text-xs text-muted">글쓰기</p>
          </div>
          <div>
            <p className="text-base font-black text-foreground">연결</p>
            <p className="mt-1 text-xs text-muted">댓글과 팔로우</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link className="grid h-10 place-items-center rounded-[10px] bg-primary px-4 text-sm font-bold text-primary-foreground" href="/login">
            로그인
          </Link>
          <Link className="grid h-10 place-items-center rounded-[10px] bg-surface-strong px-4 text-sm font-bold text-foreground" href="/signup">
            회원가입
          </Link>
        </div>
      </section>

      <section className="grid gap-3" aria-labelledby="blog-public-preview-title">
        <div className="flex items-end justify-between gap-3 px-1">
          <div>
            <p className="text-sm font-bold text-primary">공개 글 미리보기</p>
            <h2 id="blog-public-preview-title" className="mt-1 text-lg font-bold text-foreground">
              지금 둘러볼 수 있는 글
            </h2>
          </div>
          <Link className="text-sm font-bold text-primary" href="/login">
            참여하기
          </Link>
        </div>
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </section>
    </div>
  );
}
