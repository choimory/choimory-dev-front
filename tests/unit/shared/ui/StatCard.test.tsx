import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { StatCard } from '@/shared/ui/StatCard';

describe('StatCard', () => {
  it('onClick이 없으면 정적 카드(article)로 렌더링한다', () => {
    render(<StatCard label="팔로워" value="128" />);

    expect(screen.getByRole('article')).toHaveTextContent('128');
    expect(screen.getByRole('article')).toHaveTextContent('팔로워');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('onClick이 있으면 버튼으로 렌더링하고 클릭을 전달한다', async () => {
    const onClick = vi.fn();
    render(<StatCard label="팔로워" value="128" onClick={onClick} />);

    await userEvent.click(screen.getByRole('button', { name: /팔로워/ }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('size에 따라 값 글자 크기가 달라진다', () => {
    const { rerender } = render(<StatCard label="라벨" value="값" />);

    expect(screen.getByText('값')).toHaveClass('text-xl');

    rerender(<StatCard label="라벨" value="값" size="sm" />);

    expect(screen.getByText('값')).toHaveClass('text-sm');
  });
});
