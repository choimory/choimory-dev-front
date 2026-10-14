import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BlogPostDetailContainer } from '@/features/blog/container/BlogPostDetailContainer';
import { blogViewModel } from '@/features/blog/model/blogTypes';

describe('BlogPostDetailContainer', () => {
  it('postId에 해당하는 게시글을 보여준다', () => {
    render(<BlogPostDetailContainer authStatus="guest" postId="post-2" />);

    expect(screen.getByRole('heading', { level: 1, name: blogViewModel.posts[1].title })).toBeInTheDocument();
  });

  it('없는 postId이면 첫 번째 게시글을 보여준다', () => {
    render(<BlogPostDetailContainer authStatus="guest" postId="unknown-post" />);

    expect(screen.getByRole('heading', { level: 1, name: blogViewModel.posts[0].title })).toBeInTheDocument();
  });

  it('authStatus에 따라 상단바 링크가 달라진다', () => {
    const { rerender } = render(<BlogPostDetailContainer authStatus="guest" postId="post-1" />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    rerender(<BlogPostDetailContainer authStatus="member" postId="post-1" />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });
});
