'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LoginLink } from '@/features/auth/components/LoginLink';
import { buildLoginHref } from '@/shared/auth/redirect';
import { Card } from '@/shared/ui/Card';
import { SectionHeader } from '@/shared/ui/SectionHeader';

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
  const pathname = usePathname();
  const loginHref = buildLoginHref(pathname ?? '/'); // 로그인 후 지금 보던 페이지로 돌아오는 주소

  return (
    <div className="grid gap-6">
      <Card as="section" aria-labelledby="blog-guest-title">
        <h1 id="blog-guest-title" className="text-display font-semibold leading-tight">
          글과 이미지를 둘러보고, 로그인하면 내 피드를 이어갈 수 있어요
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          비회원은 공개 게시글을 볼 수 있고, 로그인하면 글쓰기, 좋아요, 댓글, 팔로우를 사용할 수 있어요.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <LoginLink className="key key-primary inline-flex h-10 items-center px-4 text-sm font-semibold">
            로그인
          </LoginLink>
          <Link className="key inline-flex h-10 items-center px-4 text-sm font-semibold" href="/signup">
            회원가입
          </Link>
        </div>
        <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-3">
          <div>
            <dt className="text-sm font-semibold">공개</dt>
            <dd className="mt-1 text-xs text-muted">피드 보기</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold">로그인</dt>
            <dd className="mt-1 text-xs text-muted">글쓰기</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold">연결</dt>
            <dd className="mt-1 text-xs text-muted">댓글과 팔로우</dd>
          </div>
        </dl>
      </Card>

      <section className="grid gap-2" aria-labelledby="blog-public-preview-title">
        <SectionHeader
          domainPath="blog / preview"
          title="둘러보는 글"
          headingId="blog-public-preview-title"
          action={{ label: '참여하기', href: loginHref }}
        />
        <div className="grid">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
