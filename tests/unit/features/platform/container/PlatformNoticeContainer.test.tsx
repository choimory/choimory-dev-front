import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PlatformNoticeContainer } from '@/features/platform/container/PlatformNoticeContainer';

import { createAuthWrapper } from '../../../../fixtures/auth';

/**
 * PlatformNoticeContainer 테스트
 * 컨테이너가 실제 로그인 상태를 로그인 여부로 바꿔 공지사항 화면에 전달하는지 확인합니다.
 */
describe('PlatformNoticeContainer', () => {
  it('guest 상태이면 로그인 링크를 보여준다', () => {
    render(<PlatformNoticeContainer />, { wrapper: createAuthWrapper('guest') });

    expect(screen.getByRole('heading', { level: 1, name: '공지사항' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();
  });

  it('member 상태이면 로그아웃 버튼을 보여준다', () => {
    render(<PlatformNoticeContainer />, { wrapper: createAuthWrapper('member') });

    expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument();
  });
});
