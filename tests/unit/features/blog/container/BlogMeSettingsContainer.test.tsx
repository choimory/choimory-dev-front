import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BlogMeSettingsContainer } from '@/features/blog/container/BlogMeSettingsContainer';

import { createAuthWrapper } from '../../../../fixtures/auth';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ replace, push: vi.fn() }),
}));

/**
 * BlogMeSettingsContainer 테스트
 * 컨테이너가 로그인한 사용자에게만 내 blog 설정 화면을 보여주고, 비로그인이면 로그인 화면으로 이동하는지 확인합니다.
 */
describe('BlogMeSettingsContainer', () => {
  beforeEach(() => {
    replace.mockClear();
  });

  it('로그인 상태이면 내 blog 설정 화면과 로그아웃 버튼을 보여준다', () => {
    render(<BlogMeSettingsContainer />, { wrapper: createAuthWrapper('member') });

    expect(screen.getByRole('region', { name: '설정' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('비로그인이면 화면을 숨기고 로그인 화면으로 이동한다', () => {
    render(<BlogMeSettingsContainer />, { wrapper: createAuthWrapper('guest') });

    expect(screen.queryByRole('region', { name: '설정' })).not.toBeInTheDocument();
    expect(replace).toHaveBeenCalledWith('/login');
  });
});
