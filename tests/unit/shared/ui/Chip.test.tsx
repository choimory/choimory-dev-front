import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Chip } from '@/shared/ui/Chip';

describe('Chip', () => {
  it('기본값은 md 크기의 muted 톤이다', () => {
    render(<Chip>지금</Chip>);

    expect(screen.getByText('지금')).toHaveClass('rounded-full', 'bg-surface-strong', 'px-2.5', 'py-1', 'text-xs');
  });

  it('size, tone, className을 반영한다', () => {
    render(<Chip size="sm" tone="surface" className="shrink-0">아이템</Chip>);

    const chip = screen.getByText('아이템');

    expect(chip).toHaveClass('bg-surface', 'px-2', 'py-0.5', 'text-[11px]', 'shrink-0');
    expect(chip).not.toHaveClass('bg-surface-strong');
  });
});
