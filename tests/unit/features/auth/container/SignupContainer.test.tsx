import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authApi } from '@/features/auth/api/authApi';
import { SignupContainer } from '@/features/auth/container/SignupContainer';
import { ApiError } from '@/shared/api/apiTypes';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

vi.mock('@/features/auth/api/authApi', () => ({
  authApi: { join: vi.fn() },
}));

/**
 * 회원가입 폼을 채웁니다.
 *
 * @param passwordConfirm 비밀번호 확인 입력 값
 */
async function fillSignupForm(passwordConfirm = 'Password1!') {
  await userEvent.type(screen.getByLabelText('닉네임'), 'choimory');
  await userEvent.type(screen.getByLabelText('이메일'), 'choi@example.com');
  await userEvent.type(screen.getByLabelText('비밀번호', { exact: true }), 'Password1!');
  await userEvent.type(screen.getByLabelText('비밀번호 확인'), passwordConfirm);
}

/**
 * SignupContainer 테스트
 * 컨테이너가 회원가입 화면을 보여주고, 성공 시 로그인으로 이동하며, 비밀번호 불일치·검증 실패·이메일 중복 오류를 화면에 보여주는지 확인합니다.
 */
describe('SignupContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('회원가입 화면 데이터를 회원가입 화면에 전달한다', () => {
    render(<SignupContainer />);

    expect(screen.getByRole('heading', { level: 1, name: '회원가입' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '로그인' })).toHaveAttribute('href', '/login');
  });

  it('회원가입에 성공하면 입력한 값으로 API를 호출하고 로그인 화면으로 이동한다', async () => {
    vi.mocked(authApi.join).mockResolvedValue({ id: 'id', email: 'choi@example.com', nickname: 'choimory', status: 'ACTIVATE' });
    render(<SignupContainer />);

    await fillSignupForm();
    await userEvent.click(screen.getByRole('button', { name: '회원가입' }));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/login'));
    expect(authApi.join).toHaveBeenCalledWith({ email: 'choi@example.com', password: 'Password1!', nickname: 'choimory' });
  });

  it('비밀번호 확인이 다르면 API를 호출하지 않고 오류를 보여준다', async () => {
    render(<SignupContainer />);

    await fillSignupForm('Different1!');
    await userEvent.click(screen.getByRole('button', { name: '회원가입' }));

    expect(await screen.findByText('비밀번호가 일치하지 않아요.')).toBeInTheDocument();
    expect(authApi.join).not.toHaveBeenCalled();
  });

  it('서버 검증 실패는 해당 필드 아래에 보여준다', async () => {
    vi.mocked(authApi.join).mockRejectedValue(
      new ApiError(400, 'BAD_REQUEST', 'Bad Request', [{ field: 'nickname', rejectValue: 'a', message: '닉네임 형식 오류' }]),
    );
    render(<SignupContainer />);

    await fillSignupForm();
    await userEvent.click(screen.getByRole('button', { name: '회원가입' }));

    expect(await screen.findByText('닉네임 형식 오류')).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it('이메일 중복 같은 오류는 서버 메시지를 폼 오류로 보여준다', async () => {
    vi.mocked(authApi.join).mockRejectedValue(new ApiError(409, 'DUPLICATE_EMAIL', '이미 사용 중인 이메일입니다.'));
    render(<SignupContainer />);

    await fillSignupForm();
    await userEvent.click(screen.getByRole('button', { name: '회원가입' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('이미 사용 중인 이메일입니다.');
  });
});
