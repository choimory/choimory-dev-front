import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BlogMenuView } from '@/features/blog/components/BlogMenuView';
import type { BlogViewModel } from '@/features/blog/model/blogTypes';

import { BLOG_POSTS_FIXTURE, BLOG_TABS_FIXTURE } from '../../../../fixtures/blog';

const VIEW_MODEL: BlogViewModel = { authStatus: 'guest', tabs: BLOG_TABS_FIXTURE, posts: BLOG_POSTS_FIXTURE };

/**
 * BlogMenuView 테스트
 * blog 메뉴 화면이 popular, following 메뉴에 맞는 소개와 섹션을 보여주고, 메뉴별 하단 네비게이션 활성 상태와 인증별 상단바를 처리하는지 확인합니다.
 */
describe('BlogMenuView', () => {
  it('popular 메뉴는 "실시간 순위" 소개와 인기 랭킹 섹션을 보여준다', () => {
    render(<BlogMenuView menuKind="popular" viewModel={VIEW_MODEL} />);

    expect(screen.getByRole('heading', { level: 1, name: '실시간 순위' })).toBeInTheDocument();
    expect(screen.getByText('blog / popular', { exact: false })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '실시간 랭킹' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: '관계 목록' })).not.toBeInTheDocument();
  });

  it('following 메뉴는 "팔로잉" 소개와 관계 목록 섹션을 보여준다', () => {
    render(<BlogMenuView menuKind="following" viewModel={VIEW_MODEL} />);

    expect(screen.getByRole('heading', { level: 1, name: '팔로잉' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '관계 목록' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: '실시간 랭킹' })).not.toBeInTheDocument();
  });

  it('메뉴 제목 영역에 게시글 카드를 보여준다', () => {
    render(<BlogMenuView menuKind="popular" viewModel={VIEW_MODEL} />);

    const posts = screen.getByRole('region', { name: '실시간 순위' });

    expect(within(posts).getAllByRole('article')).toHaveLength(2);
  });

  it('메뉴 종류에 맞는 하단 네비게이션 항목만 활성 상태다', () => {
    const { rerender } = render(<BlogMenuView menuKind="popular" viewModel={VIEW_MODEL} />);

    expect(screen.getByRole('link', { name: '인기' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: '팔로잉' })).not.toHaveAttribute('aria-current');

    // following 메뉴로 다시 렌더링하면 활성 탭이 팔로잉으로 바뀐다
    rerender(<BlogMenuView menuKind="following" viewModel={VIEW_MODEL} />);

    expect(screen.getByRole('link', { name: '팔로잉', description: '' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: '인기' })).not.toHaveAttribute('aria-current');
  });

  it('인증 상태에 따라 상단바 링크가 달라진다', () => {
    const { rerender } = render(<BlogMenuView menuKind="popular" viewModel={VIEW_MODEL} />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    // member 상태로 다시 렌더링하면 링크가 로그아웃으로 바뀐다
    rerender(<BlogMenuView menuKind="popular" viewModel={{ ...VIEW_MODEL, authStatus: 'member' }} />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });

  it('blog 홈으로 돌아가는 링크를 보여준다', () => {
    render(<BlogMenuView menuKind="popular" viewModel={VIEW_MODEL} />);

    expect(screen.getByRole('link', { name: 'blog 홈으로 돌아가기' })).toHaveAttribute('href', '/blog');
  });
});
