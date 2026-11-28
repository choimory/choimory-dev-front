import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BlogContainer } from '@/features/blog/container/BlogContainer';

import { createAuthWrapper } from '../../../../fixtures/auth';

/**
 * BlogContainer 테스트
 * 컨테이너가 인증 컨텍스트의 상태에 따라 비회원 섹션과 회원 피드를 구분해 보여주는지 확인합니다.
 */
describe('BlogContainer', () => {
  it('guest 상태이면 비회원 섹션을 보여준다', () => {
    render(<BlogContainer />, { wrapper: createAuthWrapper('guest') });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('글과 이미지를 둘러보고');
  });

  it('member 상태이면 로그인 사용자 피드를 보여준다', () => {
    render(<BlogContainer />, { wrapper: createAuthWrapper('member') });

    expect(screen.getByRole('heading', { level: 1, name: 'blog' })).toBeInTheDocument();
  });
});
