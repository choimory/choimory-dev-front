import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { IconButton } from '@/shared/ui/IconButton';

/**
 * IconButton 테스트
 * 아이콘 버튼의 접근 가능한 이름, 클릭과 disabled 동작, 크기와 톤별 클래스를 확인합니다.
 */
describe('IconButton', () => {
  it('ariaLabel로 접근 가능한 이름을 가지며 type은 button이다', () => {
    render(<IconButton ariaLabel="닫기">x</IconButton>);

    const button = screen.getByRole('button', { name: '닫기' });

    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('size-9', 'bg-surface-strong', 'text-muted');
  });

  it('클릭하면 onClick을 호출한다', async () => {
    const onClick = vi.fn();
    render(<IconButton ariaLabel="닫기" onClick={onClick}>x</IconButton>);

    // 버튼을 클릭한다
    await userEvent.click(screen.getByRole('button', { name: '닫기' }));

    // 클릭 핸들러가 한 번 호출됐는지 확인한다
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disabled이면 클릭해도 onClick을 호출하지 않는다', async () => {
    const onClick = vi.fn();
    render(<IconButton ariaLabel="이전 목록" disabled onClick={onClick}>x</IconButton>);

    const button = screen.getByRole('button', { name: '이전 목록' });
    // 비활성 버튼을 클릭해도
    await userEvent.click(button);

    // 버튼은 비활성 상태이고 핸들러는 호출되지 않는다
    expect(button).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it.each([
    ['sm', 'size-8'],
    ['md', 'size-9'],
    ['lg', 'size-10'],
  ] as const)('size %s는 %s 클래스를 사용한다', (size, className) => {
    render(<IconButton ariaLabel="버튼" size={size}>x</IconButton>);

    expect(screen.getByRole('button', { name: '버튼' })).toHaveClass(className);
  });

  it('tone에 따라 배경과 글자 색이 달라진다', () => {
    const { rerender } = render(<IconButton ariaLabel="삭제" tone="danger">x</IconButton>);

    expect(screen.getByRole('button', { name: '삭제' })).toHaveClass('bg-surface-strong', 'text-accent-red');

    // ghost 톤으로 다시 렌더링하면 배경이 사라지고 전달한 글자 색만 남는다
    rerender(<IconButton ariaLabel="삭제" tone="ghost" className="text-accent-red">x</IconButton>);

    const ghost = screen.getByRole('button', { name: '삭제' });

    expect(ghost).not.toHaveClass('bg-surface-strong');
    expect(ghost).toHaveClass('text-accent-red');
  });
});
