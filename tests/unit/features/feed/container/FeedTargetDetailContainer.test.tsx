import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FeedTargetDetailContainer } from '@/features/feed/container/FeedTargetDetailContainer';
import { feedViewModel } from '@/features/feed/model/feedTypes';

/**
 * FeedTargetDetailContainer 테스트
 * 컨테이너가 targetId에 해당하는 대상을 보여주고, 없는 id이면 첫 번째 대상으로 대체하며 authStatus를 반영하는지 확인합니다.
 */
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

    // member 상태로 다시 렌더링한다
    rerender(<FeedTargetDetailContainer authStatus="member" targetId="target-keyboard" />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });
});
