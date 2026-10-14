import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BlogContainer } from '@/features/blog/container/BlogContainer';

describe('BlogContainer', () => {
  it('guest 상태이면 비회원 섹션을 보여준다', () => {
    render(<BlogContainer authStatus="guest" />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('글과 이미지를 둘러보고');
  });

  it('member 상태이면 로그인 사용자 피드를 보여준다', () => {
    render(<BlogContainer authStatus="member" />);

    expect(screen.getByRole('heading', { level: 1, name: 'blog' })).toBeInTheDocument();
  });
});
