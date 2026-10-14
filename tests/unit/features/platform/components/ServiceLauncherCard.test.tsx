import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ServiceLauncherCard } from '@/features/platform/components/ServiceLauncherCard';

import { PLATFORM_SERVICES_FIXTURE } from '../../../../fixtures/platformServices';

describe('ServiceLauncherCard', () => {
  const scrollBy = vi.fn();

  beforeEach(() => {
    // jsdom에는 Element.scrollBy가 없어서 대체한다
    HTMLElement.prototype.scrollBy = scrollBy;
  });

  afterEach(() => {
    scrollBy.mockClear();
  });

  it('서비스 런처 영역에 서비스 목록을 보여준다', () => {
    render(<ServiceLauncherCard services={PLATFORM_SERVICES_FIXTURE} />);

    const launcher = screen.getByRole('region', { name: '서비스 런처' });

    expect(within(launcher).getByText('블로그')).toBeInTheDocument();
    expect(within(launcher).getByText('피드')).toBeInTheDocument();
    expect(within(launcher).getByText('가계부')).toBeInTheDocument();
  });

  it('제공 중인 서비스는 링크로 이동할 수 있다', () => {
    render(<ServiceLauncherCard services={PLATFORM_SERVICES_FIXTURE} />);

    expect(screen.getByRole('link', { name: '블로그' })).toHaveAttribute('href', '/blog');
    expect(screen.getByRole('link', { name: '피드' })).toHaveAttribute('href', '/feed');
  });

  it('준비 중인 서비스는 링크가 아니라 비활성 버튼이며 "예정" 표시가 붙는다', () => {
    render(<ServiceLauncherCard services={PLATFORM_SERVICES_FIXTURE} />);

    const planned = screen.getByRole('button', { name: /가계부/ });

    expect(planned).toHaveAttribute('aria-disabled', 'true');
    expect(planned).toHaveClass('cursor-not-allowed', 'opacity-75');
    expect(within(planned).getByText('예정')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /가계부/ })).not.toBeInTheDocument();
  });

  it('제공 중인 서비스에는 "예정" 표시가 없다', () => {
    render(<ServiceLauncherCard services={PLATFORM_SERVICES_FIXTURE} />);

    expect(within(screen.getByRole('link', { name: '블로그' })).queryByText('예정')).not.toBeInTheDocument();
  });

  it('이전, 다음 버튼은 런처를 좌우로 부드럽게 스크롤한다', async () => {
    render(<ServiceLauncherCard services={PLATFORM_SERVICES_FIXTURE} />);

    await userEvent.click(screen.getByRole('button', { name: '다음 서비스 보기' }));
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 240, behavior: 'smooth' });

    await userEvent.click(screen.getByRole('button', { name: '이전 서비스 보기' }));
    expect(scrollBy).toHaveBeenLastCalledWith({ left: -240, behavior: 'smooth' });
  });

  it('서비스가 없어도 스크롤 버튼은 렌더링한다', () => {
    render(<ServiceLauncherCard services={[]} />);

    expect(screen.getByRole('button', { name: '이전 서비스 보기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음 서비스 보기' })).toBeInTheDocument();
  });
});
