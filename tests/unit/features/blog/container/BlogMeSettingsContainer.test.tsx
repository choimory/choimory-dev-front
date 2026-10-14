import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BlogMeSettingsContainer } from '@/features/blog/container/BlogMeSettingsContainer';

describe('BlogMeSettingsContainer', () => {
  it('내 blog 설정 화면을 보여준다', () => {
    render(<BlogMeSettingsContainer authStatus="member" />);

    expect(screen.getByText('/ blog / me')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '설정' })).toBeInTheDocument();
  });

  it('authStatus가 member일 때만 로그인 상태로 전달한다', () => {
    const { rerender } = render(<BlogMeSettingsContainer authStatus="guest" />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    rerender(<BlogMeSettingsContainer authStatus="member" />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });
});
