import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '@/shared/ui/Button';

describe('Button', () => {
  it('기본값은 primary, md 크기, type=button이다', () => {
    render(<Button>저장</Button>);

    const button = screen.getByRole('button', { name: '저장' });

    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('h-10', 'rounded-[10px]', 'bg-primary', 'text-primary-foreground', 'px-4', 'text-sm', 'font-bold');
  });

  it('클릭하면 onClick을 호출한다', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>저장</Button>);

    await userEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('type과 disabled 같은 button 속성을 전달한다', () => {
    render(<Button type="submit" disabled>로그인</Button>);

    const button = screen.getByRole('button', { name: '로그인' });

    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toBeDisabled();
  });

  it.each([
    ['primary', ['bg-primary', 'text-primary-foreground']],
    ['secondary', ['bg-surface-strong', 'text-muted']],
    ['outline-danger', ['border', 'border-accent-red', 'text-accent-red']],
  ] as const)('variant %s 클래스를 사용한다', (variant, classNames) => {
    render(<Button variant={variant}>버튼</Button>);

    expect(screen.getByRole('button', { name: '버튼' })).toHaveClass(...classNames);
  });

  it('lg 크기는 h-12와 rounded-[12px]를 사용하고 className을 덧붙인다', () => {
    render(<Button size="lg" className="mt-2">로그인</Button>);

    const button = screen.getByRole('button', { name: '로그인' });

    expect(button).toHaveClass('h-12', 'rounded-[12px]', 'mt-2');
    expect(button).not.toHaveClass('h-10');
  });
});
