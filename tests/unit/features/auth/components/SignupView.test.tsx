import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { SignupView } from '@/features/auth/components/SignupView';
import { signupViewModel } from '@/features/auth/model/authTypes';

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

    await userEvent.type(screen.getByLabelText('닉네임'), 'mory');
    await userEvent.type(screen.getByLabelText('이메일'), 'mory@example.com');
    await userEvent.type(screen.getByLabelText('비밀번호', { exact: true }), 'secret');
    await userEvent.type(screen.getByLabelText('비밀번호 확인'), 'secret');

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
