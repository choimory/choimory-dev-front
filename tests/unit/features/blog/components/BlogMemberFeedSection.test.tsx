import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BlogMemberFeedSection } from '@/features/blog/components/BlogMemberFeedSection';

import { BLOG_POSTS_FIXTURE, BLOG_TABS_FIXTURE } from '../../../../fixtures/blog';

/**
 * BlogMemberFeedSection 테스트
 * 회원용 blog 섹션의 글쓰기 버튼, 피드 필터 탭과 선택 상태, 글 작성 행, 게시글 카드 목록을 확인합니다.
 */
describe('BlogMemberFeedSection', () => {
  it('blog 제목과 글쓰기 버튼을 보여준다', () => {
    render(<BlogMemberFeedSection tabs={BLOG_TABS_FIXTURE} posts={BLOG_POSTS_FIXTURE} />);

    expect(screen.getByRole('heading', { level: 1, name: 'blog' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '글쓰기' })).toBeInTheDocument();
  });

  it('피드 필터 탭을 보여주고 선택된 탭만 강조한다', () => {
    render(<BlogMemberFeedSection tabs={BLOG_TABS_FIXTURE} posts={BLOG_POSTS_FIXTURE} />);

    const tablist = screen.getByRole('tablist', { name: 'blog 피드 필터' });

    expect(within(tablist).getAllByRole('tab')).toHaveLength(2);
    expect(within(tablist).getByRole('tab', { name: '추천' })).toHaveAttribute('aria-selected', 'true');
    expect(within(tablist).getByRole('tab', { name: '추천' })).toHaveClass('bg-primary');
    expect(within(tablist).getByRole('tab', { name: '팔로잉' })).toHaveAttribute('aria-selected', 'false');
  });

  it('글 작성 행에 프로필 이니셜과 입력 유도 버튼을 보여준다', () => {
    render(<BlogMemberFeedSection tabs={BLOG_TABS_FIXTURE} posts={BLOG_POSTS_FIXTURE} />);

    const writeRow = screen.getByRole('region', { name: '글 작성' });

    expect(within(writeRow).getByText('C')).toBeInTheDocument();
    expect(within(writeRow).getByRole('button', { name: '무슨 생각을 공유할까요?' })).toBeInTheDocument();
  });

  it('피드 영역에 게시글 카드를 보여준다', () => {
    render(<BlogMemberFeedSection tabs={BLOG_TABS_FIXTURE} posts={BLOG_POSTS_FIXTURE} />);

    const feed = screen.getByRole('region', { name: 'blog 피드' });

    expect(within(feed).getAllByRole('article')).toHaveLength(2);
  });

  it('게시글이 없으면 피드 영역이 비어 있다', () => {
    render(<BlogMemberFeedSection tabs={BLOG_TABS_FIXTURE} posts={[]} />);

    expect(screen.getByRole('region', { name: 'blog 피드' })).toBeEmptyDOMElement();
  });
});
