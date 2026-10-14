import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FeedContainer } from '@/features/feed/container/FeedContainer';

describe('FeedContainer', () => {
  it('guest 상태이면 비회원 영역을 보여준다', () => {
    render(<FeedContainer authStatus="guest" />);

    expect(screen.getByRole('region', { name: '준비 중인 알림' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'feed 요약' })).not.toBeInTheDocument();
  });

  it('member 상태이면 회원 영역을 보여준다', () => {
    render(<FeedContainer authStatus="member" />);

    expect(screen.getByRole('region', { name: 'feed 요약' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: '준비 중인 알림' })).not.toBeInTheDocument();
  });
});
