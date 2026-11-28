import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FeedTargetSettingsContainer } from '@/features/feed/container/FeedTargetSettingsContainer';
import { feedViewModel } from '@/features/feed/model/feedTypes';

import { createAuthWrapper } from '../../../../fixtures/auth';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ replace, push: vi.fn() }),
}));

/**
 * FeedTargetSettingsContainer 테스트
 * 컨테이너가 로그인한 사용자에게만 targetId에 해당하는 대상의 설정 화면을 보여주고, 없는 id이면 첫 번째 대상으로 대체하며 비로그인이면 로그인 화면으로 이동하는지 확인합니다.
 */
describe('FeedTargetSettingsContainer', () => {
  beforeEach(() => {
    replace.mockClear();
  });

  it('targetId에 해당하는 대상의 설정 화면을 보여준다', () => {
    render(<FeedTargetSettingsContainer targetId="target-artist-nova" />, { wrapper: createAuthWrapper('member') });

    expect(screen.getByRole('heading', { level: 1, name: 'artist.nova' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '아티스트 알림 설정' })).toBeInTheDocument();
  });

  it('없는 targetId이면 첫 번째 대상의 설정 화면을 보여준다', () => {
    render(<FeedTargetSettingsContainer targetId="unknown" />, { wrapper: createAuthWrapper('member') });

    expect(screen.getByRole('heading', { level: 1, name: feedViewModel.targets[0].name })).toBeInTheDocument();
  });

  it('로그인 상태이면 상단바에 로그아웃 버튼을 보여준다', () => {
    render(<FeedTargetSettingsContainer targetId="target-keyboard" />, { wrapper: createAuthWrapper('member') });

    expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('비로그인이면 화면을 숨기고 로그인 화면으로 이동한다', () => {
    render(<FeedTargetSettingsContainer targetId="target-keyboard" />, { wrapper: createAuthWrapper('guest') });

    expect(screen.queryByRole('region', { name: '아티스트 알림 설정' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '로그아웃' })).not.toBeInTheDocument();
    expect(replace).toHaveBeenCalledWith('/login');
  });
});
