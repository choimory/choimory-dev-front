import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FeedTargetDetailContainer } from '@/features/feed/container/FeedTargetDetailContainer';
import { feedViewModel } from '@/features/feed/model/feedTypes';

import { createAuthWrapper } from '../../../../fixtures/auth';

/**
 * FeedTargetDetailContainer 테스트
 * 컨테이너가 targetId에 해당하는 대상을 보여주고, 없는 id이면 첫 번째 대상으로 대체하며 인증 상태를 반영하는지 확인합니다.
 */
describe('FeedTargetDetailContainer', () => {
  it('targetId에 해당하는 대상을 보여준다', () => {
    render(<FeedTargetDetailContainer targetId="target-streamer-mory" />, { wrapper: createAuthWrapper('guest') });

    expect(screen.getByRole('heading', { level: 1, name: 'mory_live' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '방송 관찰' })).toBeInTheDocument();
  });

  it('없는 targetId이면 첫 번째 대상을 보여준다', () => {
    render(<FeedTargetDetailContainer targetId="unknown" />, { wrapper: createAuthWrapper('guest') });

    expect(screen.getByRole('heading', { level: 1, name: feedViewModel.targets[0].name })).toBeInTheDocument();
  });

  it('인증 상태에 따라 상단바 링크가 달라진다', () => {
    const { unmount } = render(<FeedTargetDetailContainer targetId="target-keyboard" />, { wrapper: createAuthWrapper('guest') });

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    // 비회원 화면을 제거하고 회원 상태로 렌더링한다
    unmount();
    render(<FeedTargetDetailContainer targetId="target-keyboard" />, { wrapper: createAuthWrapper('member') });

    expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument();
  });
});
