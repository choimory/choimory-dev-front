import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FeedContainer } from '@/features/feed/container/FeedContainer';

/**
 * FeedContainer 테스트
 * 컨테이너가 authStatus(guest, member)에 따라 비회원 영역과 회원 영역을 구분해 보여주는지 확인합니다.
 */
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
