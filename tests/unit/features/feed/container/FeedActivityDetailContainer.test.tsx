import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FeedActivityDetailContainer } from '@/features/feed/container/FeedActivityDetailContainer';
import { feedViewModel } from '@/features/feed/model/feedTypes';

/**
 * FeedActivityDetailContainer 테스트
 * 컨테이너가 activityId에 해당하는 알림을 보여주고, 없는 id이면 첫 번째 알림으로 대체하며 authStatus를 반영하는지 확인합니다.
 */
describe('FeedActivityDetailContainer', () => {
  it('activityId에 해당하는 알림을 보여준다', () => {
    render(<FeedActivityDetailContainer activityId="activity-2" authStatus="guest" />);

    expect(screen.getByRole('heading', { level: 1, name: feedViewModel.activities[1].title })).toBeInTheDocument();
  });

  it('없는 activityId이면 첫 번째 알림을 보여준다', () => {
    render(<FeedActivityDetailContainer activityId="unknown" authStatus="guest" />);

    expect(screen.getByRole('heading', { level: 1, name: feedViewModel.activities[0].title })).toBeInTheDocument();
  });

  it('authStatus에 따라 상단바 링크가 달라진다', () => {
    const { rerender } = render(<FeedActivityDetailContainer activityId="activity-1" authStatus="guest" />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    // member 상태로 다시 렌더링한다
    rerender(<FeedActivityDetailContainer activityId="activity-1" authStatus="member" />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });
});
