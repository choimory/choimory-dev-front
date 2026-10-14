import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FeedMenuContainer } from '@/features/feed/container/FeedMenuContainer';

describe('FeedMenuContainer', () => {
  it('menuKind에 맞는 메뉴 화면을 보여준다', () => {
    const { rerender } = render(<FeedMenuContainer authStatus="guest" menuKind="popular" />);

    expect(screen.getByRole('heading', { level: 1, name: '실시간 순위' })).toBeInTheDocument();

    rerender(<FeedMenuContainer authStatus="guest" menuKind="observations" />);

    expect(screen.getByRole('heading', { level: 1, name: '관찰' })).toBeInTheDocument();

    rerender(<FeedMenuContainer authStatus="guest" menuKind="me" />);

    expect(screen.getByRole('region', { name: '내 알림 설정' })).toBeInTheDocument();
  });

  it('authStatus에 따라 상단바 링크가 달라진다', () => {
    const { rerender } = render(<FeedMenuContainer authStatus="guest" menuKind="popular" />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    rerender(<FeedMenuContainer authStatus="member" menuKind="popular" />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });
});
