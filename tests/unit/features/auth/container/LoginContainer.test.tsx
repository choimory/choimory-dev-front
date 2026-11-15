import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authApi } from '@/features/auth/api/authApi';
import { LoginContainer } from '@/features/auth/container/LoginContainer';
import { ApiError } from '@/shared/api/apiTypes';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

vi.mock('@/features/auth/api/authApi', () => ({
  authApi: { login: vi.fn() },
}));

/**
 * LoginContainer 테스트
 * 컨테이너가 로그인 화면을 보여주고, 로그인 성공 시 홈으로 이동하며 실패 시 오류를 보여주는지 확인합니다.
 */
describe('LoginContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('로그인 화면 데이터를 로그인 화면에 전달한다', () => {
    render(<LoginContainer />);

    expect(screen.getByRole('heading', { level: 1, name: '로그인' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '카카오로 로그인' })).toBeInTheDocument();
  });

  it('로그인에 성공하면 입력한 값으로 API를 호출하고 홈으로 이동한다', async () => {
    vi.mocked(authApi.login).mockResolvedValue({ accessToken: 'a', tokenType: 'Bearer', accessExpiresIn: 1799 });
    render(<LoginContainer />);

    // 이메일과 비밀번호를 입력하고 로그인한다
    await userEvent.type(screen.getByLabelText('이메일'), 'mory@example.com');
    await userEvent.type(screen.getByLabelText('비밀번호'), 'Password1!');
    await userEvent.click(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/'));
    expect(authApi.login).toHaveBeenCalledWith({ email: 'mory@example.com', password: 'Password1!' });
  });

  it('로그인에 실패하면 오류 메시지를 보여주고 이동하지 않는다', async () => {
    vi.mocked(authApi.login).mockRejectedValue(new ApiError(401, 'UNAUTHORIZED', 'Unauthorized'));
    render(<LoginContainer />);

    await userEvent.click(screen.getByRole('button', { name: '로그인' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('이메일 또는 비밀번호가 올바르지 않아요.');
    expect(push).not.toHaveBeenCalled();
  });
});
