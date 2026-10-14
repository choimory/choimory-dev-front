import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SignupContainer } from '@/features/auth/container/SignupContainer';

/**
 * SignupContainer 테스트
 * 컨테이너가 회원가입 임시 데이터를 회원가입 화면에 전달하는지 확인합니다.
 */
describe('SignupContainer', () => {
  it('회원가입 화면 데이터를 회원가입 화면에 전달한다', () => {
    render(<SignupContainer />);

    expect(screen.getByRole('heading', { level: 1, name: '회원가입' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '로그인' })).toHaveAttribute('href', '/login');
  });
});
