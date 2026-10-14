import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card } from '@/shared/ui/Card';

describe('Card', () => {
  it('기본값으로 div, bg-surface, p-4를 사용한다', () => {
    render(<Card data-testid="card">내용</Card>);

    const card = screen.getByTestId('card');

    expect(card.tagName).toBe('DIV');
    expect(card).toHaveClass('rounded-2xl', 'border', 'border-border', 'bg-surface', 'p-4');
    expect(card).toHaveTextContent('내용');
  });

  it('as, tone, padding, className을 반영한다', () => {
    render(
      <Card as="section" tone="strong" padding="sm" className="mt-2" aria-label="영역">
        내용
      </Card>,
    );

    const card = screen.getByRole('region', { name: '영역' });

    expect(card.tagName).toBe('SECTION');
    expect(card).toHaveClass('bg-surface-strong', 'p-3', 'mt-2');
    expect(card).not.toHaveClass('bg-surface', 'p-4');
  });
});
