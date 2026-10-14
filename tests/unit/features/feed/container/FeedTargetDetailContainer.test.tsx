import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FeedTargetDetailContainer } from '@/features/feed/container/FeedTargetDetailContainer';
import { feedViewModel } from '@/features/feed/model/feedTypes';

describe('FeedTargetDetailContainer', () => {
  it('targetId에 해당하는 대상을 보여준다', () => {
    render(<FeedTargetDetailContainer authStatus="guest" targetId="target-streamer-mory" />);

    expect(screen.getByRole('heading', { level: 1, name: 'mory_live' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '방송 관찰' })).toBeInTheDocument();
  });

  it('없는 targetId이면 첫 번째 대상을 보여준다', () => {
    render(<FeedTargetDetailContainer authStatus="guest" targetId="unknown" />);

    expect(screen.getByRole('heading', { level: 1, name: feedViewModel.targets[0].name })).toBeInTheDocument();
  });

  it('authStatus에 따라 상단바 링크가 달라진다', () => {
    const { rerender } = render(<FeedTargetDetailContainer authStatus="guest" targetId="target-keyboard" />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    rerender(<FeedTargetDetailContainer authStatus="member" targetId="target-keyboard" />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });
});
