import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FeedTargetSettingsContainer } from '@/features/feed/container/FeedTargetSettingsContainer';
import { feedViewModel } from '@/features/feed/model/feedTypes';

describe('FeedTargetSettingsContainer', () => {
  it('targetId에 해당하는 대상의 설정 화면을 보여준다', () => {
    render(<FeedTargetSettingsContainer authStatus="member" targetId="target-artist-nova" />);

    expect(screen.getByRole('heading', { level: 1, name: 'artist.nova' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '아티스트 알림 설정' })).toBeInTheDocument();
  });

  it('없는 targetId이면 첫 번째 대상의 설정 화면을 보여준다', () => {
    render(<FeedTargetSettingsContainer authStatus="member" targetId="unknown" />);

    expect(screen.getByRole('heading', { level: 1, name: feedViewModel.targets[0].name })).toBeInTheDocument();
  });

  it('authStatus에 따라 상단바 링크가 달라진다', () => {
    const { rerender } = render(<FeedTargetSettingsContainer authStatus="guest" targetId="target-keyboard" />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    rerender(<FeedTargetSettingsContainer authStatus="member" targetId="target-keyboard" />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });
});
