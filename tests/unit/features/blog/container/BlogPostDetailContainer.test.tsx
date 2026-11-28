import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BlogPostDetailContainer } from '@/features/blog/container/BlogPostDetailContainer';
import { blogViewModel } from '@/features/blog/model/blogTypes';

import { createAuthWrapper } from '../../../../fixtures/auth';

/**
 * BlogPostDetailContainer 테스트
 * 컨테이너가 postId에 해당하는 게시글을 찾아 보여주고, 없는 postId이면 첫 번째 게시글로 대체하며, 인증 컨텍스트의 상태를 반영하는지 확인합니다.
 */
describe('BlogPostDetailContainer', () => {
  it('postId에 해당하는 게시글을 보여준다', () => {
    render(<BlogPostDetailContainer postId="post-2" />, { wrapper: createAuthWrapper('guest') });

    expect(screen.getByRole('heading', { level: 1, name: blogViewModel.posts[1].title })).toBeInTheDocument();
  });

  it('없는 postId이면 첫 번째 게시글을 보여준다', () => {
    render(<BlogPostDetailContainer postId="unknown-post" />, { wrapper: createAuthWrapper('guest') });

    expect(screen.getByRole('heading', { level: 1, name: blogViewModel.posts[0].title })).toBeInTheDocument();
  });

  it('인증 컨텍스트의 상태에 따라 상단바 링크가 달라진다', () => {
    const { unmount } = render(<BlogPostDetailContainer postId="post-1" />, { wrapper: createAuthWrapper('guest') });

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    // 회원 인증 상태로 다시 마운트한다
    unmount();
    render(<BlogPostDetailContainer postId="post-1" />, { wrapper: createAuthWrapper('member') });

    expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument();
  });
});
