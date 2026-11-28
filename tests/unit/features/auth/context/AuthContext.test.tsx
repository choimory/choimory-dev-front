import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authApi } from '@/features/auth/api/authApi';
import { AuthProvider, useAuth } from '@/features/auth/context/AuthContext';
import { ApiError } from '@/shared/api/apiTypes';

vi.mock('@/features/auth/api/authApi', () => ({
  authApi: { restoreSession: vi.fn(), logout: vi.fn() },
}));

/** 인증 상태를 화면에 노출하는 테스트용 컴포넌트 */
function AuthProbe() {
  const { state, authStatus, isLoggedIn, markLoggedIn, logout } = useAuth();

  return (
    <div>
      <p data-testid="state">{state}</p>
      <p data-testid="status">{authStatus}</p>
      <p data-testid="logged-in">{String(isLoggedIn)}</p>
      <button type="button" onClick={markLoggedIn}>로그인 반영</button>
      <button type="button" onClick={() => void logout()}>로그아웃</button>
    </div>
  );
}

/**
 * AuthProvider와 useAuth 테스트
 * 마운트 시 세션 복원(성공, 실패), 복원 중 guest 취급, 로그인 반영, 로그아웃(실패해도 guest), Provider 밖 기본값을 확인합니다.
 */
describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('세션 복원에 성공하면 member가 된다', async () => {
    vi.mocked(authApi.restoreSession).mockResolvedValue('token');

    render(<AuthProvider><AuthProbe /></AuthProvider>);

    await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('member'));
    expect(screen.getByTestId('logged-in')).toHaveTextContent('true');
  });

  it('세션 복원에 실패하면 guest가 된다', async () => {
    vi.mocked(authApi.restoreSession).mockRejectedValue(new ApiError(401, 'UNAUTHORIZED', 'Unauthorized'));

    render(<AuthProvider><AuthProbe /></AuthProvider>);

    await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('guest'));
    expect(screen.getByTestId('logged-in')).toHaveTextContent('false');
  });

  it('복원 중에는 loading이지만 화면 구분용 상태는 guest다', () => {
    vi.mocked(authApi.restoreSession).mockReturnValue(new Promise(() => {}));

    render(<AuthProvider><AuthProbe /></AuthProvider>);

    expect(screen.getByTestId('state')).toHaveTextContent('loading');
    expect(screen.getByTestId('status')).toHaveTextContent('guest');
    expect(screen.getByTestId('logged-in')).toHaveTextContent('false');
  });

  it('복원 중에 로그인이 반영되면 복원 실패가 그 상태를 덮어쓰지 않는다', async () => {
    let rejectRestore: (error: unknown) => void = () => {};
    vi.mocked(authApi.restoreSession).mockReturnValue(new Promise((_, reject) => { rejectRestore = reject; }));

    render(<AuthProvider><AuthProbe /></AuthProvider>);
    await userEvent.click(screen.getByRole('button', { name: '로그인 반영' }));
    await act(async () => {
      rejectRestore(new ApiError(401, 'UNAUTHORIZED', 'Unauthorized'));
    });

    expect(screen.getByTestId('state')).toHaveTextContent('member');
  });

  it('로그아웃하면 guest가 된다', async () => {
    vi.mocked(authApi.restoreSession).mockResolvedValue('token');
    vi.mocked(authApi.logout).mockResolvedValue();
    render(<AuthProvider><AuthProbe /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('member'));

    await userEvent.click(screen.getByRole('button', { name: '로그아웃' }));

    await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('guest'));
    expect(authApi.logout).toHaveBeenCalledTimes(1);
  });

  it('서버 로그아웃이 실패해도 guest가 된다', async () => {
    vi.mocked(authApi.restoreSession).mockResolvedValue('token');
    vi.mocked(authApi.logout).mockRejectedValue(new ApiError(500, 'INTERNAL_SERVER_ERROR', 'error'));
    render(<AuthProvider><AuthProbe /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('member'));

    await userEvent.click(screen.getByRole('button', { name: '로그아웃' }));

    await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('guest'));
  });

  it('AuthProvider 밖에서는 항상 guest다', () => {
    render(<AuthProbe />);

    expect(screen.getByTestId('state')).toHaveTextContent('guest');
    expect(screen.getByTestId('logged-in')).toHaveTextContent('false');
  });
});
