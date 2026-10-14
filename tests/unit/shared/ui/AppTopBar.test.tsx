import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AppTopBar } from '@/shared/ui/AppTopBar';

/**
 * AppTopBar 테스트
 * 상단 앱 바의 로고 링크, 로그인/로그아웃 링크, 서비스명(링크 또는 텍스트), leading 영역, 폭 옵션을 확인합니다.
 */
describe('AppTopBar', () => {
  it('브랜드 로고 링크와 로그인 링크를 렌더링한다', () => {
    render(<AppTopBar />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'choimory.dev 홈' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: '로그인' })).toHaveAttribute('href', '/login');
  });

  it('로그인 상태이면 로그아웃 링크를 보여준다', () => {
    render(<AppTopBar isLoggedIn />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toHaveAttribute('href', '/');
    expect(screen.queryByRole('link', { name: '로그인' })).not.toBeInTheDocument();
  });

  it('serviceName과 serviceHref가 있으면 서비스 링크를 보여준다', () => {
    render(<AppTopBar serviceName="blog" serviceHref="/blog" />);

    expect(screen.getByRole('link', { name: '/ blog' })).toHaveAttribute('href', '/blog');
  });

  it('serviceHref 없이 serviceName만 있으면 링크가 아닌 텍스트로 보여준다', () => {
    render(<AppTopBar serviceName="notice" />);

    expect(screen.getByText('/ notice')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '/ notice' })).not.toBeInTheDocument();
  });

  it('leading이 있으면 브랜드 앞에 렌더링한다', () => {
    render(<AppTopBar leading={<button type="button" aria-label="뒤로">←</button>} />);

    expect(screen.getByRole('button', { name: '뒤로' })).toBeInTheDocument();
  });

  it('기본 폭은 wide이고 size=narrow를 반영한다', () => {
    const { container, rerender } = render(<AppTopBar />);

    expect(container.querySelector('header > div')).toHaveClass('max-w-[768px]');

    // size를 narrow로 바꿔 다시 렌더링한다
    rerender(<AppTopBar size="narrow" />);

    expect(container.querySelector('header > div')).toHaveClass('max-w-[560px]');
  });
});
