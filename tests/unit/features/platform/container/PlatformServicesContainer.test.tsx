import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PlatformServicesContainer } from '@/features/platform/container/PlatformServicesContainer';
import { platformHomeViewModel } from '@/features/platform/model/platformHomeTypes';

describe('PlatformServicesContainer', () => {
  it('플랫폼 서비스 목록을 모두 화면에 전달한다', () => {
    render(<PlatformServicesContainer authStatus="guest" />);

    const list = screen.getByRole('region', { name: '서비스 목록' });

    expect(list.children).toHaveLength(platformHomeViewModel.services.length);
  });

  it('authStatus에 따라 상단바 링크가 달라진다', () => {
    const { rerender } = render(<PlatformServicesContainer authStatus="guest" />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    rerender(<PlatformServicesContainer authStatus="member" />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });
});
