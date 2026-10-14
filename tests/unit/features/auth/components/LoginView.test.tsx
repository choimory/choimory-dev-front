import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { LoginView } from '@/features/auth/components/LoginView';
import { loginViewModel } from '@/features/auth/model/authTypes';

describe('LoginView', () => {
  it('제목과 설명을 보여준다', () => {
    render(<LoginView viewModel={loginViewModel} />);

    expect(screen.getByRole('heading', { level: 1, name: '로그인' })).toBeInTheDocument();
    expect(screen.getByText(loginViewModel.description)).toBeInTheDocument();
  });

  it('로고 링크는 홈으로 이동한다', () => {
    render(<LoginView viewModel={loginViewModel} />);

    expect(screen.getByRole('link', { name: 'choimory.dev 홈' })).toHaveAttribute('href', '/');
  });

  it('이메일과 비밀번호 입력창을 보여주고 입력할 수 있다', async () => {
    render(<LoginView viewModel={loginViewModel} />);

    const email = screen.getByLabelText('이메일');
    const password = screen.getByLabelText('비밀번호');

    expect(email).toHaveAttribute('type', 'email');
    expect(password).toHaveAttribute('type', 'password');

    await userEvent.type(email, 'mory@example.com');
    await userEvent.type(password, 'secret');

    expect(email).toHaveValue('mory@example.com');
    expect(password).toHaveValue('secret');
  });

  it('로그인 버튼은 큰 크기의 primary 버튼이다', () => {
    render(<LoginView viewModel={loginViewModel} />);

    expect(screen.getByRole('button', { name: '로그인' })).toHaveClass('h-12', 'bg-primary');
  });

  it('회원가입 링크는 viewModel의 경로로 이동한다', () => {
    render(<LoginView viewModel={loginViewModel} />);

    expect(screen.getByRole('link', { name: loginViewModel.signupLink.label })).toHaveAttribute('href', '/signup');
  });

  it('소셜 로그인 제공자마다 버튼을 보여주고 제공자별 색상 클래스를 사용한다', () => {
    render(<LoginView viewModel={loginViewModel} />);

    expect(screen.getByRole('button', { name: '네이버로 로그인' })).toHaveClass('bg-[#03c75a]');
    expect(screen.getByRole('button', { name: '카카오로 로그인' })).toHaveClass('bg-[#fee500]');
    expect(screen.getByRole('button', { name: '구글로 로그인' })).toHaveClass('bg-surface-strong');
  });

  it('소셜 제공자 목록이 비어 있으면 소셜 버튼을 보여주지 않는다', () => {
    render(<LoginView viewModel={{ ...loginViewModel, socialProviders: [] }} />);

    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.queryByRole('button', { name: '네이버로 로그인' })).not.toBeInTheDocument();
  });

  it('소셜 로그인이 화면 구성 확인용이라는 안내를 보여준다', () => {
    render(<LoginView viewModel={loginViewModel} />);

    const main = screen.getByRole('main');

    expect(within(main).getByText(/화면 구성 확인용/)).toBeInTheDocument();
  });
});
