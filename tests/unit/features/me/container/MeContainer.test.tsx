import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MeContainer } from '@/features/me/container/MeContainer';
import { meViewModel } from '@/features/me/model/meTypes';

import { createAuthWrapper } from '../../../../fixtures/auth';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ replace, push: vi.fn() }),
}));

/**
 * MeContainer 테스트
 * 컨테이너가 로그인한 사용자에게만 마이페이지 임시 데이터를 화면에 전달하고,
 * 비로그인이면 화면을 숨기고 로그인 화면으로 이동하는지 확인합니다.
 */
describe('MeContainer', () => {
  beforeEach(() => {
    replace.mockClear();
  });

  it('로그인 상태이면 마이페이지 임시 데이터를 화면에 전달한다', () => {
    render(<MeContainer />, { wrapper: createAuthWrapper('member') });

    expect(screen.getByRole('heading', { level: 1, name: meViewModel.nickname })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '마이페이지 설정' }).children).toHaveLength(meViewModel.settingItems.length);
    expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('비로그인이면 화면을 숨기고 로그인 화면으로 이동한다', () => {
    render(<MeContainer />, { wrapper: createAuthWrapper('guest') });

    expect(screen.queryByRole('heading', { level: 1, name: meViewModel.nickname })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '로그아웃' })).not.toBeInTheDocument();
    expect(replace).toHaveBeenCalledWith('/login');
  });

  it('로그인 상태를 복원하는 중이면 화면을 숨기고 이동하지 않는다', () => {
    render(<MeContainer />, { wrapper: createAuthWrapper('guest', { state: 'loading' }) });

    expect(screen.queryByRole('heading', { level: 1, name: meViewModel.nickname })).not.toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
