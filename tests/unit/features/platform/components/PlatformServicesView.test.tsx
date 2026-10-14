import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PlatformServicesView } from '@/features/platform/components/PlatformServicesView';

import { PLATFORM_SERVICES_FIXTURE } from '../../../../fixtures/platformServices';

/**
 * PlatformServicesView 테스트
 * 서비스 메뉴 화면의 서비스 목록(제공 중은 링크, 준비 중은 흐린 행), 빈 목록, 상단바와 하단 네비게이션 상태를 확인합니다.
 */
describe('PlatformServicesView', () => {
  it('페이지 소개와 서비스 목록 영역을 보여준다', () => {
    render(<PlatformServicesView isLoggedIn={false} services={PLATFORM_SERVICES_FIXTURE} />);

    expect(screen.getByRole('heading', { level: 1, name: '서비스' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '서비스 목록' })).toBeInTheDocument();
  });

  it('제공 중인 서비스는 이동 칩이 있는 링크로 보여준다', () => {
    render(<PlatformServicesView isLoggedIn={false} services={PLATFORM_SERVICES_FIXTURE} />);

    const blog = screen.getByRole('link', { name: /블로그/ });

    expect(blog).toHaveAttribute('href', '/blog');
    expect(blog).toHaveTextContent('글과 댓글을 쓰는 서비스');
    expect(within(blog).getByText('이동')).toBeInTheDocument();
  });

  it('준비 중인 서비스는 링크 없이 흐리게 표시하고 준비 중 칩을 보여준다', () => {
    render(<PlatformServicesView isLoggedIn={false} services={PLATFORM_SERVICES_FIXTURE} />);

    const planned = screen.getByRole('article', { name: '' });

    expect(planned).toHaveTextContent('가계부');
    expect(planned).toHaveClass('opacity-75');
    expect(within(planned).getByText('준비 중')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /가계부/ })).not.toBeInTheDocument();
  });

  it('서비스가 없으면 목록이 비어 있다', () => {
    render(<PlatformServicesView isLoggedIn={false} services={[]} />);

    expect(screen.getByRole('region', { name: '서비스 목록' })).toBeEmptyDOMElement();
  });

  it('로그인 여부에 따라 상단바 링크가 달라진다', () => {
    const { rerender } = render(<PlatformServicesView isLoggedIn={false} services={[]} />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    // 로그인 상태로 다시 렌더링하면 링크가 로그아웃으로 바뀐다
    rerender(<PlatformServicesView isLoggedIn services={[]} />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });

  it('하단 네비게이션에서 서비스가 활성 상태다', () => {
    render(<PlatformServicesView isLoggedIn={false} services={[]} />);

    expect(screen.getByRole('link', { name: '서비스' })).toHaveAttribute('aria-current', 'page');
  });
});
