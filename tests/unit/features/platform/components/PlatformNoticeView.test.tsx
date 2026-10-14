import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { PlatformNoticeView } from '@/features/platform/components/PlatformNoticeView';

describe('PlatformNoticeView', () => {
  it('페이지 소개와 공지사항 목록을 보여준다', () => {
    render(<PlatformNoticeView isLoggedIn={false} />);

    expect(screen.getByRole('heading', { level: 1, name: '공지사항' })).toBeInTheDocument();

    const list = screen.getByRole('region', { name: '공지사항 목록' });

    expect(within(list).getAllByRole('button')).toHaveLength(2);
    expect(within(list).getByText('서비스 화면 구조를 확장하고 있어요')).toBeInTheDocument();
    expect(within(list).getByText('블로그와 피드 상세 화면 준비')).toBeInTheDocument();
  });

  it('처음에는 상세 모달이 열려 있지 않다', () => {
    render(<PlatformNoticeView isLoggedIn={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('공지를 누르면 제목과 본문이 담긴 상세 모달이 열린다', async () => {
    render(<PlatformNoticeView isLoggedIn={false} />);

    await userEvent.click(screen.getByRole('button', { name: /블로그와 피드 상세 화면 준비/ }));

    const dialog = screen.getByRole('dialog', { name: '블로그와 피드 상세 화면 준비' });

    expect(within(dialog).getByText(/현재 mock 데이터 기반이에요/)).toBeInTheDocument();
    expect(within(dialog).getByText('2026.09.19')).toBeInTheDocument();
  });

  it('닫기 버튼을 누르면 모달이 닫힌다', async () => {
    render(<PlatformNoticeView isLoggedIn={false} />);

    await userEvent.click(screen.getByRole('button', { name: /서비스 화면 구조를 확장하고 있어요/ }));
    await userEvent.click(screen.getByRole('button', { name: '닫기' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('모달 배경을 누르면 모달이 닫힌다', async () => {
    render(<PlatformNoticeView isLoggedIn={false} />);

    await userEvent.click(screen.getByRole('button', { name: /서비스 화면 구조를 확장하고 있어요/ }));
    await userEvent.click(screen.getByRole('dialog').parentElement as HTMLElement);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('로그인 여부에 따라 상단바 링크가 달라진다', () => {
    const { rerender } = render(<PlatformNoticeView isLoggedIn={false} />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    rerender(<PlatformNoticeView isLoggedIn />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });

  it('하단 네비게이션에서 공지사항이 활성 상태다', () => {
    render(<PlatformNoticeView isLoggedIn={false} />);

    expect(screen.getByRole('link', { name: '공지사항' })).toHaveAttribute('aria-current', 'page');
  });
});
