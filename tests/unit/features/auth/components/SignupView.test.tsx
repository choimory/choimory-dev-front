import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { SignupView } from '@/features/auth/components/SignupView';
import { signupViewModel } from '@/features/auth/model/authTypes';

/** 비어 있는 폼 입력 값 */
const EMPTY_VALUES = { nickname: '', email: '', password: '', passwordConfirm: '' };

/**
 * 기본 Props로 회원가입 화면을 렌더링합니다.
 *
 * @param props 덮어쓸 Props
 */
function renderSignupView(props: Partial<ComponentProps<typeof SignupView>> = {}) {
  return render(
    <SignupView
      viewModel={signupViewModel}
      values={EMPTY_VALUES}
      fieldErrors={{}}
      formError={null}
      isSubmitting={false}
      onChange={vi.fn()}
      onSubmit={vi.fn()}
      {...props}
    />,
  );
}

/**
 * SignupView 테스트
 * 회원가입 화면의 제목과 설명, 홈 링크, 입력창 4종(닉네임, 이메일, 비밀번호, 비밀번호 확인)과 입력 이벤트, 필드·폼 오류 메시지, 회원가입 버튼(제출 중 상태 포함), 로그인 링크를 확인합니다.
 */
describe('SignupView', () => {
  it('제목과 설명을 보여준다', () => {
    renderSignupView();

    expect(screen.getByRole('heading', { level: 1, name: '회원가입' })).toBeInTheDocument();
    expect(screen.getByText(signupViewModel.description)).toBeInTheDocument();
  });

  it('로고 링크는 홈으로 이동한다', () => {
    renderSignupView();

    expect(screen.getByRole('link', { name: 'choimory.dev 홈' })).toHaveAttribute('href', '/');
  });

  it('닉네임, 이메일, 비밀번호, 비밀번호 확인 입력창을 보여준다', () => {
    renderSignupView();

    expect(screen.getByLabelText('닉네임')).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('이메일')).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText('비밀번호', { exact: true })).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText('비밀번호 확인')).toHaveAttribute('type', 'password');
  });

  it('전달받은 입력 값을 각 입력창에 보여준다', () => {
    renderSignupView({
      values: { nickname: 'mory', email: 'mory@example.com', password: 'secret', passwordConfirm: 'secret2' },
    });

    expect(screen.getByLabelText('닉네임')).toHaveValue('mory');
    expect(screen.getByLabelText('이메일')).toHaveValue('mory@example.com');
    expect(screen.getByLabelText('비밀번호', { exact: true })).toHaveValue('secret');
    expect(screen.getByLabelText('비밀번호 확인')).toHaveValue('secret2');
  });

  it('입력하면 필드 이름과 입력한 글자를 변경 이벤트로 전달한다', async () => {
    const onChange = vi.fn();
    renderSignupView({ onChange });

    // 입력창 4개에 각각 한 글자씩 입력한다
    await userEvent.type(screen.getByLabelText('닉네임'), 'a');
    await userEvent.type(screen.getByLabelText('이메일'), 'b');
    await userEvent.type(screen.getByLabelText('비밀번호', { exact: true }), 'c');
    await userEvent.type(screen.getByLabelText('비밀번호 확인'), 'd');

    // 각 입력이 해당 필드 이름으로 전달됐는지 확인한다
    expect(onChange).toHaveBeenCalledWith('nickname', 'a');
    expect(onChange).toHaveBeenCalledWith('email', 'b');
    expect(onChange).toHaveBeenCalledWith('password', 'c');
    expect(onChange).toHaveBeenCalledWith('passwordConfirm', 'd');
  });

  it('필드별 오류 메시지와 폼 전체 오류 메시지를 보여준다', () => {
    renderSignupView({
      fieldErrors: { nickname: '닉네임 오류', email: '이메일 오류', password: '비밀번호 오류', passwordConfirm: '확인 오류' },
      formError: '이미 사용 중인 이메일입니다.',
    });

    expect(screen.getByText('닉네임 오류')).toBeInTheDocument();
    expect(screen.getByText('이메일 오류')).toBeInTheDocument();
    expect(screen.getByText('비밀번호 오류')).toBeInTheDocument();
    expect(screen.getByText('확인 오류')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('이미 사용 중인 이메일입니다.');
  });

  it('오류가 없으면 오류 알림을 보여주지 않는다', () => {
    renderSignupView();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('회원가입 버튼은 큰 크기의 primary 제출 버튼이다', () => {
    renderSignupView();

    const button = screen.getByRole('button', { name: '회원가입' });

    expect(button).toHaveClass('h-12', 'bg-primary');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('회원가입 버튼을 누르면 제출 이벤트를 호출한다', async () => {
    const onSubmit = vi.fn((event) => event.preventDefault());
    renderSignupView({ onSubmit });

    await userEvent.click(screen.getByRole('button', { name: '회원가입' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('제출 중이면 버튼을 비활성화하고 진행 문구를 보여준다', () => {
    renderSignupView({ isSubmitting: true });

    expect(screen.getByRole('button', { name: '가입 중...' })).toBeDisabled();
  });

  it('이미 계정이 있다는 안내와 로그인 링크를 보여준다', () => {
    renderSignupView();

    expect(screen.getByText('이미 계정이 있나요?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: signupViewModel.loginLink.label })).toHaveAttribute('href', '/login');
  });
});
