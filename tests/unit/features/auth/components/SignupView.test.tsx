import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { SignupView } from '@/features/auth/components/SignupView';
import { signupViewModel } from '@/features/auth/model/authTypes';

/**
 * SignupView 테스트
 * 회원가입 화면의 제목과 설명, 홈 링크, 입력창 4종(닉네임, 이메일, 비밀번호, 비밀번호 확인), 회원가입 버튼, 로그인 링크를 확인합니다.
 */
describe('SignupView', () => {
  it('제목과 설명을 보여준다', () => {
    render(<SignupView viewModel={signupViewModel} />);

    expect(screen.getByRole('heading', { level: 1, name: '회원가입' })).toBeInTheDocument();
    expect(screen.getByText(signupViewModel.description)).toBeInTheDocument();
  });

  it('로고 링크는 홈으로 이동한다', () => {
    render(<SignupView viewModel={signupViewModel} />);

    expect(screen.getByRole('link', { name: 'choimory.dev 홈' })).toHaveAttribute('href', '/');
  });

  it('닉네임, 이메일, 비밀번호, 비밀번호 확인 입력창을 보여준다', () => {
    render(<SignupView viewModel={signupViewModel} />);

    expect(screen.getByLabelText('닉네임')).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('이메일')).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText('비밀번호', { exact: true })).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText('비밀번호 확인')).toHaveAttribute('type', 'password');
  });

  it('각 입력창에 입력할 수 있다', async () => {
    render(<SignupView viewModel={signupViewModel} />);

    // 입력창 4개에 각각 값을 입력한다
    await userEvent.type(screen.getByLabelText('닉네임'), 'mory');
    await userEvent.type(screen.getByLabelText('이메일'), 'mory@example.com');
    await userEvent.type(screen.getByLabelText('비밀번호', { exact: true }), 'secret');
    await userEvent.type(screen.getByLabelText('비밀번호 확인'), 'secret');

    // 입력한 값이 각 입력창에 반영됐는지 확인한다
    expect(screen.getByLabelText('닉네임')).toHaveValue('mory');
    expect(screen.getByLabelText('이메일')).toHaveValue('mory@example.com');
    expect(screen.getByLabelText('비밀번호', { exact: true })).toHaveValue('secret');
    expect(screen.getByLabelText('비밀번호 확인')).toHaveValue('secret');
  });

  it('회원가입 버튼은 큰 크기의 primary 버튼이다', () => {
    render(<SignupView viewModel={signupViewModel} />);

    expect(screen.getByRole('button', { name: '회원가입' })).toHaveClass('h-12', 'bg-primary');
  });

  it('이미 계정이 있다는 안내와 로그인 링크를 보여준다', () => {
    render(<SignupView viewModel={signupViewModel} />);

    expect(screen.getByText('이미 계정이 있나요?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: signupViewModel.loginLink.label })).toHaveAttribute('href', '/login');
  });
});
