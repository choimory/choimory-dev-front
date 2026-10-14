import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { BlogUserBlogView } from '@/features/blog/components/BlogUserBlogView';

import { BLOG_POSTS_FIXTURE } from '../../../../fixtures/blog';

describe('BlogUserBlogView', () => {
  it('페이지 소개에 유저 닉네임 경로를, 프로필에 닉네임과 대문자 이니셜을 보여준다', () => {
    render(<BlogUserBlogView isLoggedIn={false} nickname="jin.note" posts={BLOG_POSTS_FIXTURE} />);

    expect(screen.getByText('/ blog / @jin.note')).toBeInTheDocument();
    const profile = screen.getByRole('region', { name: 'jin.note' });

    expect(within(profile).getByRole('heading', { level: 1, name: 'jin.note' })).toBeInTheDocument();
    expect(within(profile).getByText('J')).toBeInTheDocument();
  });

  it('소문자 닉네임의 첫 글자를 대문자 이니셜로 만든다', () => {
    render(<BlogUserBlogView isLoggedIn={false} nickname="zed" posts={[]} />);

    expect(within(screen.getByRole('region', { name: 'zed' })).getByText('Z')).toBeInTheDocument();
  });

  it('포스트 섹션에 게시글 카드를 보여준다', () => {
    render(<BlogUserBlogView isLoggedIn={false} nickname="jin.note" posts={BLOG_POSTS_FIXTURE} />);

    const section = screen.getByRole('region', { name: '포스트' });

    expect(within(section).getAllByRole('article')).toHaveLength(2);
  });

  it('게시글이 없으면 포스트 섹션에 카드가 없다', () => {
    render(<BlogUserBlogView isLoggedIn={false} nickname="jin.note" posts={[]} />);

    expect(within(screen.getByRole('region', { name: '포스트' })).queryByRole('article')).not.toBeInTheDocument();
  });

  it('처음에는 관계 모달이 열려 있지 않다', () => {
    render(<BlogUserBlogView isLoggedIn={false} nickname="jin.note" posts={BLOG_POSTS_FIXTURE} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('팔로워 카드를 누르면 팔로워 모달이, 팔로잉 카드를 누르면 팔로잉 모달이 열린다', async () => {
    render(<BlogUserBlogView isLoggedIn={false} nickname="jin.note" posts={BLOG_POSTS_FIXTURE} />);

    await userEvent.click(screen.getByRole('button', { name: /팔로워/ }));
    expect(screen.getByRole('dialog', { name: '팔로워' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '닫기' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /팔로잉/ }));
    expect(screen.getByRole('dialog', { name: '팔로잉' })).toBeInTheDocument();
  });

  it('로그인 여부에 따라 상단바 링크가 달라지고 blog 홈으로 돌아가는 링크를 보여준다', () => {
    const { rerender } = render(<BlogUserBlogView isLoggedIn={false} nickname="jin.note" posts={[]} />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'blog 홈으로 돌아가기' })).toHaveAttribute('href', '/blog');

    rerender(<BlogUserBlogView isLoggedIn nickname="jin.note" posts={[]} />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });
});
