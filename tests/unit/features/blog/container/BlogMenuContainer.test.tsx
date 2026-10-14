import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BlogMenuContainer } from '@/features/blog/container/BlogMenuContainer';

/**
 * BlogMenuContainer 테스트
 * 컨테이너가 menuKind에 맞는 메뉴 화면을 보여주고 authStatus를 상단바에 반영하는지 확인합니다.
 */
describe('BlogMenuContainer', () => {
  it('menuKind에 맞는 메뉴 화면을 보여준다', () => {
    const { rerender } = render(<BlogMenuContainer authStatus="guest" menuKind="popular" />);

    expect(screen.getByRole('heading', { level: 1, name: '실시간 순위' })).toBeInTheDocument();

    // following 메뉴로 다시 렌더링한다
    rerender(<BlogMenuContainer authStatus="guest" menuKind="following" />);

    expect(screen.getByRole('heading', { level: 1, name: '팔로잉' })).toBeInTheDocument();
  });

  it('authStatus에 따라 상단바 링크가 달라진다', () => {
    const { rerender } = render(<BlogMenuContainer authStatus="guest" menuKind="popular" />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    // member 상태로 다시 렌더링한다
    rerender(<BlogMenuContainer authStatus="member" menuKind="popular" />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });
});
