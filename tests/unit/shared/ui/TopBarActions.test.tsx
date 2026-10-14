import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AnchorHTMLAttributes } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { TopBarActions } from '@/shared/ui/TopBarActions';

// Next.js Link는 라우터 없이 클릭하면 실제 페이지 이동을 시도하므로, 이 파일에서는 이동 없이 onClick만 실행되는 a 태그로 대체한다
vi.mock('next/link', () => ({
  default: ({ href, onClick, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
      {...rest}
    >
      {children}
    </a>
  ),
}));

/**
 * TopBarActions 테스트
 * 상단바 액션(검색 오버레이, 알림 패널과 탭 필터, 서비스 패널, 로그인/로그아웃 링크)의 열고 닫기 동작을 확인합니다.
 * Next Link는 라우터 없이 클릭하면 실제 이동을 시도하므로 이 파일에서는 이동 없이 onClick만 실행되는 a 태그로 대체합니다.
 */
describe('TopBarActions', () => {
  it('비로그인이면 로그인 링크를, 로그인이면 로그아웃 링크를 보여준다', () => {
    const { rerender } = render(<TopBarActions isLoggedIn={false} />);

    expect(screen.getByRole('link', { name: '로그인' })).toHaveAttribute('href', '/login');

    // 로그인 상태로 다시 렌더링하면 링크가 로그아웃으로 바뀐다
    rerender(<TopBarActions isLoggedIn />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toHaveAttribute('href', '/');
  });

  it('처음에는 검색, 알림, 서비스 패널이 열려 있지 않다', () => {
    render(<TopBarActions isLoggedIn={false} />);

    expect(screen.queryByRole('form', { name: '검색' })).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: '알림' })).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: '서비스' })).not.toBeInTheDocument();
  });

  it('검색 버튼을 누르면 검색 오버레이가 열리고 배경을 누르면 닫힌다', async () => {
    render(<TopBarActions isLoggedIn={false} />);

    // 검색 버튼을 눌러 오버레이를 연다
    await userEvent.click(screen.getByRole('button', { name: '검색' }));

    const form = screen.getByRole('form', { name: '검색' });

    expect(within(form).getByRole('combobox', { name: '검색 대상' })).toHaveValue('all');
    expect(within(form).getByPlaceholderText('검색어를 입력하세요')).toBeInTheDocument();

    // 오버레이 배경을 눌러 닫는다
    await userEvent.click(form.closest('[role="presentation"]') as HTMLElement);

    expect(screen.queryByRole('form', { name: '검색' })).not.toBeInTheDocument();
  });

  it('알림 버튼을 누르면 알림 패널이 열리고 탭으로 서비스별 알림을 거른다', async () => {
    render(<TopBarActions isLoggedIn={false} />);

    // 알림 버튼을 눌러 패널을 연다
    await userEvent.click(screen.getByRole('button', { name: '알림' }));

    const panel = screen.getByRole('region', { name: '알림' });

    expect(within(panel).getAllByRole('article')).toHaveLength(3);

    // 블로그 탭에서는 블로그 알림 1건만 보인다
    await userEvent.click(within(panel).getByRole('button', { name: '블로그' }));
    expect(within(panel).getAllByRole('article')).toHaveLength(1);
    expect(within(panel).getByText('블로그에 새 댓글이 달렸어요')).toBeInTheDocument();

    // 피드 탭에서는 피드 알림 2건이 보인다
    await userEvent.click(within(panel).getByRole('button', { name: '피드' }));
    expect(within(panel).getAllByRole('article')).toHaveLength(2);

    // 전체 탭으로 돌아오면 3건이 모두 보인다
    await userEvent.click(within(panel).getByRole('button', { name: '전체' }));
    expect(within(panel).getAllByRole('article')).toHaveLength(3);
  });

  it('알림 버튼을 다시 누르면 알림 패널이 닫힌다', async () => {
    render(<TopBarActions isLoggedIn={false} />);

    // 알림 버튼을 두 번 눌러 열었다가 닫는다
    await userEvent.click(screen.getByRole('button', { name: '알림' }));
    await userEvent.click(screen.getByRole('button', { name: '알림' }));

    expect(screen.queryByRole('region', { name: '알림' })).not.toBeInTheDocument();
  });

  it('서비스 버튼을 누르면 서비스 목록이 열리고 활성/준비 중 서비스를 구분한다', async () => {
    render(<TopBarActions isLoggedIn={false} />);

    // 서비스 버튼을 눌러 서비스 목록을 연다
    await userEvent.click(screen.getByRole('button', { name: '서비스' }));

    const panel = screen.getByRole('region', { name: '서비스' });

    expect(within(panel).getByRole('link', { name: /블로그/ })).toHaveAttribute('href', '/blog');
    expect(within(panel).getByRole('link', { name: /피드/ })).toHaveAttribute('href', '/feed');
    expect(within(panel).getByRole('link', { name: /커뮤니티/ })).toHaveAttribute('href', '/services');
    expect(within(panel).getByRole('link', { name: /커뮤니티/ })).toHaveClass('opacity-75');
  });

  it('서비스 항목을 누르면 서비스 목록이 닫힌다', async () => {
    render(<TopBarActions isLoggedIn={false} />);

    // 서비스 목록을 연다
    await userEvent.click(screen.getByRole('button', { name: '서비스' }));
    // 서비스 항목(블로그 링크)을 누른다
    await userEvent.click(screen.getByRole('link', { name: /블로그/ }));

    expect(screen.queryByRole('region', { name: '서비스' })).not.toBeInTheDocument();
  });

  it('알림 패널이 열린 상태에서 서비스 버튼을 누르면 알림 패널은 닫히고 서비스 패널만 열린다', async () => {
    render(<TopBarActions isLoggedIn={false} />);

    // 알림 패널을 먼저 연 뒤
    await userEvent.click(screen.getByRole('button', { name: '알림' }));
    // 서비스 버튼을 누르면 알림 패널은 닫히고 서비스 패널만 열린다
    await userEvent.click(screen.getByRole('button', { name: '서비스' }));

    expect(screen.queryByRole('region', { name: '알림' })).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: '서비스' })).toBeInTheDocument();
  });
});
