import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PlatformNoticeContainer } from '@/features/platform/container/PlatformNoticeContainer';

describe('PlatformNoticeContainer', () => {
  it('guest 상태이면 로그인 링크를 보여준다', () => {
    render(<PlatformNoticeContainer authStatus="guest" />);

    expect(screen.getByRole('heading', { level: 1, name: '공지사항' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();
  });

  it('member 상태이면 로그아웃 링크를 보여준다', () => {
    render(<PlatformNoticeContainer authStatus="member" />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });
});
