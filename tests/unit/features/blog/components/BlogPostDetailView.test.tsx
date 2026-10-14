import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { BlogPostDetailView } from '@/features/blog/components/BlogPostDetailView';

import { BLOG_POSTS_FIXTURE } from '../../../../fixtures/blog';

const [OWN_POST, OTHER_POST] = BLOG_POSTS_FIXTURE;

describe('BlogPostDetailView', () => {
  it('페이지 소개 제목과 게시글 작성자, 부가 정보를 보여준다', () => {
    render(<BlogPostDetailView isLoggedIn post={OWN_POST} />);

    expect(screen.getByRole('heading', { level: 1, name: '중앙 피드 폭 고정하기' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'mory.dev' })).toBeInTheDocument();
    expect(screen.getByText('프론트 구성 기획 · 8분 전')).toBeInTheDocument();
  });

  it('좋아요와 댓글 수, 본문을 보여준다', () => {
    render(<BlogPostDetailView isLoggedIn post={OWN_POST} />);

    expect(screen.getByText('좋아요 128개 · 댓글 24개')).toBeInTheDocument();
    expect(screen.getByText(/모바일 앱 같은 느낌을 유지할 수 있어요/)).toBeInTheDocument();
  });

  it('이미지 여부에 따라 이미지 영역을 보여준다', () => {
    const { rerender } = render(<BlogPostDetailView isLoggedIn post={OWN_POST} />);

    expect(screen.getByLabelText('게시글 이미지')).toBeInTheDocument();

    rerender(<BlogPostDetailView isLoggedIn post={OTHER_POST} />);

    expect(screen.queryByLabelText('게시글 이미지')).not.toBeInTheDocument();
  });

  it('태그를 인기 화면 태그 검색 링크로 보여준다', () => {
    render(<BlogPostDetailView isLoggedIn post={OWN_POST} />);

    const tags = screen.getByLabelText('게시글 태그');

    expect(within(tags).getByRole('link', { name: 'frontend' })).toHaveAttribute('href', '/blog/popular?tag=frontend');
    expect(within(tags).getByRole('link', { name: 'layout' })).toHaveAttribute('href', '/blog/popular?tag=layout');
  });

  it('내 글(mory.dev)에는 수정 버튼을 보여주고 다른 사람 글에는 보여주지 않는다', () => {
    const { rerender } = render(<BlogPostDetailView isLoggedIn post={OWN_POST} />);

    expect(screen.getByRole('button', { name: '수정' })).toBeInTheDocument();

    rerender(<BlogPostDetailView isLoggedIn post={OTHER_POST} />);

    expect(screen.queryByRole('button', { name: '수정' })).not.toBeInTheDocument();
  });

  it('게시글 액션 아이콘 버튼 4종을 보여준다', () => {
    render(<BlogPostDetailView isLoggedIn post={OWN_POST} />);

    const article = screen.getAllByRole('article')[0];

    ['좋아요', '댓글', '공유', '저장'].forEach((name) => {
      expect(within(article).getByRole('button', { name })).toBeInTheDocument();
    });
  });

  it('댓글 입력창과 작성 버튼, 댓글 목록을 보여준다', () => {
    render(<BlogPostDetailView isLoggedIn post={OWN_POST} />);

    const comments = screen.getByRole('region', { name: '댓글' });

    expect(within(comments).getByPlaceholderText('댓글을 남겨보세요')).toBeInTheDocument();
    expect(within(comments).getByRole('button', { name: '작성' })).toBeInTheDocument();
    expect(within(comments).getByText('이 구조면 상세 화면을 붙이기 쉬워 보입니다.')).toBeInTheDocument();
    expect(within(comments).getByText('하단 메뉴별 화면도 같은 패턴으로 가면 좋겠네요.')).toBeInTheDocument();
  });

  it('첫 댓글에는 대댓글이 있고 두 번째 댓글에는 없다', () => {
    render(<BlogPostDetailView isLoggedIn post={OWN_POST} />);

    expect(screen.getAllByRole('button', { name: '대댓글 좋아요' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: '댓글 좋아요' })).toHaveLength(2);
    expect(screen.getByText(/메뉴별 상단 카드까지 들어가면/)).toBeInTheDocument();
  });

  it('"답글 달기"를 누르면 해당 댓글에만 답글 입력창이 열리고 다시 누르면 닫힌다', async () => {
    render(<BlogPostDetailView isLoggedIn post={OWN_POST} />);

    const [firstReply, secondReply] = screen.getAllByRole('button', { name: '답글 달기' });

    await userEvent.click(firstReply);
    expect(screen.getByPlaceholderText('@mory.dev 답글을 남겨보세요')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('@jin.note 답글을 남겨보세요')).not.toBeInTheDocument();

    await userEvent.click(firstReply);
    expect(screen.queryByPlaceholderText('@mory.dev 답글을 남겨보세요')).not.toBeInTheDocument();

    await userEvent.click(secondReply);
    expect(screen.getByPlaceholderText('@jin.note 답글을 남겨보세요')).toBeInTheDocument();
  });

  it('다른 댓글의 "답글 달기"를 누르면 열려 있던 답글 입력창은 닫힌다', async () => {
    render(<BlogPostDetailView isLoggedIn post={OWN_POST} />);

    const [firstReply, secondReply] = screen.getAllByRole('button', { name: '답글 달기' });

    await userEvent.click(firstReply);
    await userEvent.click(secondReply);

    expect(screen.queryByPlaceholderText('@mory.dev 답글을 남겨보세요')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('@jin.note 답글을 남겨보세요')).toBeInTheDocument();
  });

  it('로그인 여부에 따라 상단바 링크가 달라지고 blog 홈으로 돌아가는 링크를 보여준다', () => {
    const { rerender } = render(<BlogPostDetailView isLoggedIn={false} post={OWN_POST} />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'blog 홈으로 돌아가기' })).toHaveAttribute('href', '/blog');

    rerender(<BlogPostDetailView isLoggedIn post={OWN_POST} />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });
});
