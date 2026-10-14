import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PlatformHomeContainer } from '@/features/platform/container/PlatformHomeContainer';

describe('PlatformHomeContainer', () => {
  it('guest 상태이면 비회원 랜딩을 보여준다', () => {
    render(<PlatformHomeContainer authStatus="guest" />);

    expect(screen.getByText('/ welcome')).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: '내 서비스 피드' })).not.toBeInTheDocument();
  });

  it('member 상태이면 내 서비스 피드를 보여준다', () => {
    render(<PlatformHomeContainer authStatus="member" />);

    expect(screen.getByRole('region', { name: '내 서비스 피드' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });
});
