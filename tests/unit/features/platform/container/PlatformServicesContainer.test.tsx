import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PlatformServicesContainer } from '@/features/platform/container/PlatformServicesContainer';
import { platformHomeViewModel } from '@/features/platform/model/platformHomeTypes';

import { createAuthWrapper } from '../../../../fixtures/auth';

/**
 * PlatformServicesContainer 테스트
 * 컨테이너가 플랫폼 서비스 목록을 모두 전달하고 실제 로그인 상태를 로그인 여부로 바꿔 전달하는지 확인합니다.
 */
describe('PlatformServicesContainer', () => {
  it('플랫폼 서비스 목록을 모두 화면에 전달한다', () => {
    render(<PlatformServicesContainer />, { wrapper: createAuthWrapper('guest') });

    const list = screen.getByRole('region', { name: '서비스 목록' });

    expect(list.children).toHaveLength(platformHomeViewModel.services.length);
  });

  it('로그인 상태에 따라 상단바 버튼이 달라진다', () => {
    const { unmount } = render(<PlatformServicesContainer />, { wrapper: createAuthWrapper('guest') });

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    unmount();
    render(<PlatformServicesContainer />, { wrapper: createAuthWrapper('member') });

    expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument();
  });
});
