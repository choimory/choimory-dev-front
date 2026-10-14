import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BlogGuestSection } from '@/features/blog/components/BlogGuestSection';

import { BLOG_POSTS_FIXTURE } from '../../../../fixtures/blog';

describe('BlogGuestSection', () => {
  it('소개 제목과 로고 경로를 보여준다', () => {
    render(<BlogGuestSection posts={BLOG_POSTS_FIXTURE} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('글과 이미지를 둘러보고');
    expect(screen.getByText('/ blog')).toBeInTheDocument();
  });

  it('공개, 로그인, 연결 안내 3가지를 보여준다', () => {
    render(<BlogGuestSection posts={BLOG_POSTS_FIXTURE} />);

    ['공개', '로그인', '연결'].forEach((label) => expect(screen.getAllByText(label).length).toBeGreaterThan(0));
    expect(screen.getByText('피드 보기')).toBeInTheDocument();
    expect(screen.getByText('댓글과 팔로우')).toBeInTheDocument();
  });

  it('로그인, 회원가입 링크를 보여준다', () => {
    render(<BlogGuestSection posts={BLOG_POSTS_FIXTURE} />);

    const intro = screen.getByRole('region', { name: /글과 이미지를 둘러보고/ });

    expect(within(intro).getByRole('link', { name: '로그인' })).toHaveAttribute('href', '/login');
    expect(within(intro).getByRole('link', { name: '회원가입' })).toHaveAttribute('href', '/signup');
  });

  it('둘러보는 글 섹션에 게시글 카드와 참여하기 링크를 보여준다', () => {
    render(<BlogGuestSection posts={BLOG_POSTS_FIXTURE} />);

    const preview = screen.getByRole('region', { name: '둘러보는 글' });

    expect(within(preview).getAllByRole('article')).toHaveLength(2);
    expect(within(preview).getByRole('link', { name: '참여하기' })).toHaveAttribute('href', '/login');
  });

  it('게시글이 없으면 게시글 카드를 보여주지 않는다', () => {
    render(<BlogGuestSection posts={[]} />);

    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
});
