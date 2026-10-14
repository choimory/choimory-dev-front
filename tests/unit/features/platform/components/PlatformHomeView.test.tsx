import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PlatformHomeView } from '@/features/platform/components/PlatformHomeView';
import { platformHomeViewModel } from '@/features/platform/model/platformHomeTypes';

import { PLATFORM_SERVICES_FIXTURE } from '../../../../fixtures/platformServices';

const GUEST_VIEW_MODEL = { ...platformHomeViewModel, authStatus: 'guest' as const, services: PLATFORM_SERVICES_FIXTURE };
const MEMBER_VIEW_MODEL = { ...GUEST_VIEW_MODEL, authStatus: 'member' as const };

describe('PlatformHomeView', () => {
  it('로고 제목, 검색바, 서비스 런처를 보여준다', () => {
    render(<PlatformHomeView viewModel={GUEST_VIEW_MODEL} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('{choimory.dev()}');
    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '서비스 런처' })).toBeInTheDocument();
  });

  it('비회원이면 상단바에 로그인 링크와 비회원 랜딩 섹션을 보여준다', () => {
    render(<PlatformHomeView viewModel={GUEST_VIEW_MODEL} />);

    // 상단바와 비회원 랜딩 섹션에 각각 로그인 링크가 있다
    const loginLinks = screen.getAllByRole('link', { name: '로그인' });

    expect(loginLinks).toHaveLength(2);
    loginLinks.forEach((link) => expect(link).toHaveAttribute('href', '/login'));
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('블로그와 피드부터 둘러보고');
    expect(screen.queryByRole('region', { name: '내 서비스 피드' })).not.toBeInTheDocument();
  });

  it('회원이면 상단바에 로그아웃 링크와 내 서비스 피드를 보여준다', () => {
    render(<PlatformHomeView viewModel={MEMBER_VIEW_MODEL} />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '내 서비스 피드' })).toBeInTheDocument();
    expect(screen.queryByText('/ welcome')).not.toBeInTheDocument();
  });

  it('하단 네비게이션에서 홈이 활성 상태다', () => {
    render(<PlatformHomeView viewModel={GUEST_VIEW_MODEL} />);

    expect(screen.getByRole('link', { name: '홈' })).toHaveAttribute('aria-current', 'page');
  });
});
