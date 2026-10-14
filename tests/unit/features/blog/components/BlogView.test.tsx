import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BlogView } from '@/features/blog/components/BlogView';
import type { BlogViewModel } from '@/features/blog/model/blogTypes';

import { BLOG_POSTS_FIXTURE, BLOG_TABS_FIXTURE } from '../../../../fixtures/blog';

const GUEST_VIEW_MODEL: BlogViewModel = { authStatus: 'guest', tabs: BLOG_TABS_FIXTURE, posts: BLOG_POSTS_FIXTURE };
const MEMBER_VIEW_MODEL: BlogViewModel = { ...GUEST_VIEW_MODEL, authStatus: 'member' };

describe('BlogView', () => {
  it('비회원이면 비회원 섹션과 로그인 링크를 보여준다', () => {
    render(<BlogView viewModel={GUEST_VIEW_MODEL} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('글과 이미지를 둘러보고');
    expect(screen.queryByRole('tablist', { name: 'blog 피드 필터' })).not.toBeInTheDocument();
    expect(within(screen.getAllByRole('banner')[0]).getByRole('link', { name: '로그인' })).toBeInTheDocument();
  });

  it('회원이면 로그인 사용자 피드와 로그아웃 링크를 보여준다', () => {
    render(<BlogView viewModel={MEMBER_VIEW_MODEL} />);

    expect(screen.getByRole('heading', { level: 1, name: 'blog' })).toBeInTheDocument();
    expect(screen.getByRole('tablist', { name: 'blog 피드 필터' })).toBeInTheDocument();
    expect(within(screen.getAllByRole('banner')[0]).getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });

  it('상단바에 blog 서비스명과 플랫폼 홈으로 돌아가는 링크를 보여준다', () => {
    render(<BlogView viewModel={GUEST_VIEW_MODEL} />);

    expect(screen.getByRole('link', { name: '/ blog' })).toHaveAttribute('href', '/blog');
    expect(screen.getByRole('link', { name: '플랫폼 홈으로 돌아가기' })).toHaveAttribute('href', '/');
  });

  it('하단 네비게이션에서 홈이 활성 상태다', () => {
    render(<BlogView viewModel={GUEST_VIEW_MODEL} />);

    const nav = screen.getByRole('navigation');

    expect(within(nav).getByRole('link', { name: '홈' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: '내 블로그' })).toHaveAttribute('href', '/blog/me');
  });
});
