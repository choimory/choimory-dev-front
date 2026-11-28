import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BlogUserBlogContainer } from '@/features/blog/container/BlogUserBlogContainer';
import { blogViewModel } from '@/features/blog/model/blogTypes';

import { createAuthWrapper } from '../../../../fixtures/auth';

/**
 * BlogUserBlogContainer 테스트
 * 컨테이너가 닉네임에 해당하는 유저 blog 화면과 임시 게시글을 보여주고 인증 컨텍스트의 상태를 반영하는지 확인합니다.
 */
describe('BlogUserBlogContainer', () => {
  it('닉네임에 해당하는 유저 blog 화면과 임시 게시글을 보여준다', () => {
    render(<BlogUserBlogContainer nickname="jin.note" />, { wrapper: createAuthWrapper('guest') });

    expect(screen.getByRole('heading', { level: 1, name: 'jin.note' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '포스트' }).children.length).toBeGreaterThan(blogViewModel.posts.length - 1);
  });

  it('인증 컨텍스트의 상태에 따라 상단바 링크가 달라진다', () => {
    const { unmount } = render(<BlogUserBlogContainer nickname="jin.note" />, { wrapper: createAuthWrapper('guest') });

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    // 회원 인증 상태로 다시 마운트한다
    unmount();
    render(<BlogUserBlogContainer nickname="jin.note" />, { wrapper: createAuthWrapper('member') });

    expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument();
  });
});
