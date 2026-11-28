import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PlatformHomeContainer } from '@/features/platform/container/PlatformHomeContainer';

import { createAuthWrapper } from '../../../../fixtures/auth';

/**
 * PlatformHomeContainer 테스트
 * 컨테이너가 실제 로그인 상태(guest, member)에 따라 비회원 랜딩과 내 서비스 피드를 구분해 보여주는지 확인합니다.
 */
describe('PlatformHomeContainer', () => {
  it('guest 상태이면 비회원 랜딩을 보여준다', () => {
    render(<PlatformHomeContainer />, { wrapper: createAuthWrapper('guest') });

    expect(screen.getByRole('region', { name: /블로그와 피드부터 둘러보고/ })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: '내 서비스 피드' })).not.toBeInTheDocument();
  });

  it('member 상태이면 내 서비스 피드를 보여준다', () => {
    render(<PlatformHomeContainer />, { wrapper: createAuthWrapper('member') });

    expect(screen.getByRole('region', { name: '내 서비스 피드' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument();
  });

  it('AuthProvider 밖에서는 비회원 랜딩을 보여준다', () => {
    render(<PlatformHomeContainer />);

    expect(screen.getByRole('region', { name: /블로그와 피드부터 둘러보고/ })).toBeInTheDocument();
  });
});
