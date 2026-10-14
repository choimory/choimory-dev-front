import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BlogUserBlogContainer } from '@/features/blog/container/BlogUserBlogContainer';
import { blogViewModel } from '@/features/blog/model/blogTypes';

/**
 * BlogUserBlogContainer 테스트
 * 컨테이너가 닉네임에 해당하는 유저 blog 화면과 임시 게시글을 보여주고 authStatus를 반영하는지 확인합니다.
 */
describe('BlogUserBlogContainer', () => {
  it('닉네임에 해당하는 유저 blog 화면과 임시 게시글을 보여준다', () => {
    render(<BlogUserBlogContainer authStatus="guest" nickname="jin.note" />);

    expect(screen.getByRole('heading', { level: 1, name: 'jin.note' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '포스트' }).children.length).toBeGreaterThan(blogViewModel.posts.length - 1);
  });

  it('authStatus에 따라 상단바 링크가 달라진다', () => {
    const { rerender } = render(<BlogUserBlogContainer authStatus="guest" nickname="jin.note" />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    // member 상태로 다시 렌더링한다
    rerender(<BlogUserBlogContainer authStatus="member" nickname="jin.note" />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });
});
