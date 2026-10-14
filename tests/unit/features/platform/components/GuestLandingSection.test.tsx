import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { GuestLandingSection } from '@/features/platform/components/GuestLandingSection';

import { PLATFORM_SERVICES_FIXTURE } from '../../../../fixtures/platformServices';

describe('GuestLandingSection', () => {
  it('환영 제목과 로고 경로를 보여준다', () => {
    render(<GuestLandingSection services={PLATFORM_SERVICES_FIXTURE} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('블로그와 피드부터 둘러보고');
    expect(screen.getByText('/ welcome')).toBeInTheDocument();
  });

  it('로그인과 회원가입 링크를 보여준다', () => {
    render(<GuestLandingSection services={PLATFORM_SERVICES_FIXTURE} />);

    expect(screen.getByRole('link', { name: '로그인' })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: '회원가입' })).toHaveAttribute('href', '/signup');
  });

  it('비회원에게 안내할 서비스 특징 3가지를 보여준다', () => {
    render(<GuestLandingSection services={PLATFORM_SERVICES_FIXTURE} />);

    expect(screen.getByText('공개 블로그 피드는 바로 둘러보기')).toBeInTheDocument();
    expect(screen.getByText('피드에서 방송과 가격 알림 흐름 확인')).toBeInTheDocument();
    expect(screen.getByText('서비스별 알림과 활동 요약 확인')).toBeInTheDocument();
  });

  it('제공 중인 서비스는 이동 링크, 준비 중인 서비스는 비활성 항목으로 보여준다', () => {
    render(<GuestLandingSection services={PLATFORM_SERVICES_FIXTURE} />);

    const guide = screen.getByLabelText('비회원 서비스 안내');

    const blogLink = within(guide).getByRole('link', { name: /블로그/ });
    expect(blogLink).toHaveAttribute('href', '/blog');
    expect(blogLink).toHaveTextContent('이동');

    const planned = within(guide).getByText('가계부').closest('[aria-disabled="true"]');
    expect(planned).not.toBeNull();
    expect(planned).toHaveTextContent('준비 중');
    expect(within(guide).queryByRole('link', { name: /가계부/ })).not.toBeInTheDocument();
  });

  it('서비스 목록이 비어도 소개 영역은 렌더링한다', () => {
    render(<GuestLandingSection services={[]} />);

    expect(screen.getByLabelText('비회원 서비스 안내')).toBeEmptyDOMElement();
    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();
  });
});
