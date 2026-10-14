import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LoginContainer } from '@/features/auth/container/LoginContainer';

/**
 * LoginContainer 테스트
 * 컨테이너가 로그인 임시 데이터를 로그인 화면에 전달하는지 확인합니다.
 */
describe('LoginContainer', () => {
  it('로그인 화면 데이터를 로그인 화면에 전달한다', () => {
    render(<LoginContainer />);

    expect(screen.getByRole('heading', { level: 1, name: '로그인' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '카카오로 로그인' })).toBeInTheDocument();
  });
});
