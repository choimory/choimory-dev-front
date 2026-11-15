import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { LoginView } from '@/features/auth/components/LoginView';
import { loginViewModel } from '@/features/auth/model/authTypes';

/**
 * 기본 Props로 로그인 화면을 렌더링합니다.
 *
 * @param props 덮어쓸 Props
 */
function renderLoginView(props: Partial<ComponentProps<typeof LoginView>> = {}) {
  return render(
    <LoginView
      viewModel={loginViewModel}
      email=""
      password=""
      isSubmitting={false}
      errorMessage={null}
      onChangeEmail={vi.fn()}
      onChangePassword={vi.fn()}
      onSubmit={vi.fn()}
      {...props}
    />,
  );
}

/**
 * LoginView 테스트
 * 로그인 화면의 제목과 설명, 홈 링크, 이메일/비밀번호 입력, 로그인 버튼(제출 중 상태 포함), 오류 메시지, 회원가입 링크, 소셜 로그인 버튼(제공자별 색상, 빈 목록)을 확인합니다.
 */
describe('LoginView', () => {
  it('제목과 설명을 보여준다', () => {
    renderLoginView();

    expect(screen.getByRole('heading', { level: 1, name: '로그인' })).toBeInTheDocument();
    expect(screen.getByText(loginViewModel.description)).toBeInTheDocument();
  });

  it('로고 링크는 홈으로 이동한다', () => {
    renderLoginView();

    expect(screen.getByRole('link', { name: 'choimory.dev 홈' })).toHaveAttribute('href', '/');
  });

  it('이메일과 비밀번호 입력창에 전달받은 값을 보여준다', () => {
    renderLoginView({ email: 'mory@example.com', password: 'secret' });

    expect(screen.getByLabelText('이메일')).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText('이메일')).toHaveValue('mory@example.com');
    expect(screen.getByLabelText('비밀번호')).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText('비밀번호')).toHaveValue('secret');
  });

  it('입력하면 변경 이벤트로 입력한 글자를 전달한다', async () => {
    const onChangeEmail = vi.fn();
    const onChangePassword = vi.fn();
    renderLoginView({ onChangeEmail, onChangePassword });

    // 이메일과 비밀번호를 입력한다
    await userEvent.type(screen.getByLabelText('이메일'), 'a');
    await userEvent.type(screen.getByLabelText('비밀번호'), 'b');

    // 입력한 글자가 각 변경 이벤트로 전달됐는지 확인한다
    expect(onChangeEmail).toHaveBeenCalledWith('a');
    expect(onChangePassword).toHaveBeenCalledWith('b');
  });

  it('로그인 버튼을 누르면 제출 이벤트를 호출한다', async () => {
    const onSubmit = vi.fn((event) => event.preventDefault());
    renderLoginView({ onSubmit });

    await userEvent.click(screen.getByRole('button', { name: '로그인' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('로그인 버튼은 큰 크기의 primary 제출 버튼이다', () => {
    renderLoginView();

    const button = screen.getByRole('button', { name: '로그인' });

    expect(button).toHaveClass('h-12', 'bg-primary');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('제출 중이면 버튼을 비활성화하고 진행 문구를 보여준다', () => {
    renderLoginView({ isSubmitting: true });

    expect(screen.getByRole('button', { name: '로그인 중...' })).toBeDisabled();
  });

  it('오류 메시지가 있으면 알림으로 보여주고 없으면 보여주지 않는다', () => {
    const { rerender } = renderLoginView({ errorMessage: '이메일 또는 비밀번호가 올바르지 않아요.' });

    expect(screen.getByRole('alert')).toHaveTextContent('이메일 또는 비밀번호가 올바르지 않아요.');

    // 오류 메시지를 없앤 화면으로 다시 렌더링한다
    rerender(
      <LoginView
        viewModel={loginViewModel}
        email=""
        password=""
        isSubmitting={false}
        errorMessage={null}
        onChangeEmail={vi.fn()}
        onChangePassword={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('회원가입 링크는 viewModel의 경로로 이동한다', () => {
    renderLoginView();

    expect(screen.getByRole('link', { name: loginViewModel.signupLink.label })).toHaveAttribute('href', '/signup');
  });

  it('소셜 로그인 제공자마다 버튼을 보여주고 제공자별 색상 클래스를 사용한다', () => {
    renderLoginView();

    expect(screen.getByRole('button', { name: '네이버로 로그인' })).toHaveClass('bg-[#03c75a]');
    expect(screen.getByRole('button', { name: '카카오로 로그인' })).toHaveClass('bg-[#fee500]');
    expect(screen.getByRole('button', { name: '구글로 로그인' })).toHaveClass('bg-surface-strong');
  });

  it('소셜 제공자 목록이 비어 있으면 소셜 버튼을 보여주지 않는다', () => {
    // 소셜 제공자 목록을 비운 화면을 렌더링한다
    renderLoginView({ viewModel: { ...loginViewModel, socialProviders: [] } });

    // 남은 버튼은 로그인 버튼 하나뿐이다
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.queryByRole('button', { name: '네이버로 로그인' })).not.toBeInTheDocument();
  });

  it('소셜 로그인이 화면 구성 확인용이라는 안내를 보여준다', () => {
    renderLoginView();

    const main = screen.getByRole('main');

    expect(within(main).getByText(/화면 구성 확인용/)).toBeInTheDocument();
  });
});
