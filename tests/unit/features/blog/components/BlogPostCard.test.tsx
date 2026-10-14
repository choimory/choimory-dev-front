import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BlogPostCard } from '@/features/blog/components/BlogPostCard';

import { BLOG_POSTS_FIXTURE } from '../../../../fixtures/blog';

const [POST_WITH_MEDIA, POST_WITHOUT_MEDIA] = BLOG_POSTS_FIXTURE;

describe('BlogPostCard', () => {
  it('작성자 이름, 이니셜, 부가 정보를 보여준다', () => {
    render(<BlogPostCard post={POST_WITH_MEDIA} />);

    expect(screen.getByRole('heading', { level: 2, name: 'mory.dev' })).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getByText('프론트 구성 기획 · 8분 전')).toBeInTheDocument();
  });

  it('제목, 본문, 좋아요 수, 댓글 수를 보여준다', () => {
    render(<BlogPostCard post={POST_WITH_MEDIA} />);

    expect(screen.getByRole('heading', { level: 3, name: '중앙 피드 폭 고정하기' })).toBeInTheDocument();
    expect(screen.getByText(/모바일 앱 같은 느낌을 유지할 수 있어요/)).toBeInTheDocument();
    expect(screen.getByText('좋아요 128개')).toBeInTheDocument();
    expect(screen.getByText('댓글 24개 모두 보기')).toBeInTheDocument();
  });

  it('작성자, 본문, 댓글 링크는 게시글 상세로 이동한다', () => {
    render(<BlogPostCard post={POST_WITH_MEDIA} />);

    const links = screen.getAllByRole('link');

    expect(links.length).toBeGreaterThanOrEqual(4);
    links.forEach((link) => expect(link).toHaveAttribute('href', '/blog/posts/post-1'));
    expect(screen.getByRole('link', { name: '댓글 24개 모두 보기' })).toHaveAttribute('href', '/blog/posts/post-1');
  });

  it('이미지가 있는 게시글은 이미지 영역을 링크로 보여준다', () => {
    render(<BlogPostCard post={POST_WITH_MEDIA} />);

    const image = screen.getByLabelText('게시글 이미지');

    expect(image.closest('a')).toHaveAttribute('href', '/blog/posts/post-1');
  });

  it('이미지가 없는 게시글은 이미지 영역을 보여주지 않는다', () => {
    render(<BlogPostCard post={POST_WITHOUT_MEDIA} />);

    expect(screen.queryByLabelText('게시글 이미지')).not.toBeInTheDocument();
  });

  it('게시글 메뉴, 좋아요, 댓글, 공유, 저장 아이콘 버튼을 보여준다', () => {
    render(<BlogPostCard post={POST_WITH_MEDIA} />);

    ['게시글 메뉴', '좋아요', '댓글', '공유', '저장'].forEach((name) => {
      expect(screen.getByRole('button', { name })).toBeInTheDocument();
    });
  });

  it('게시글 하나가 article 하나로 렌더링된다', () => {
    render(<BlogPostCard post={POST_WITH_MEDIA} />);

    const article = screen.getByRole('article');

    expect(within(article).getAllByRole('button')).toHaveLength(5);
  });
});
