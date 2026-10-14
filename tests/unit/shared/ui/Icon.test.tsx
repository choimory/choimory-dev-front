import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Icon, type IconName } from '@/shared/ui/Icon';

/** 아이콘 이름 목록 (IconName 타입의 모든 값) */
const ICON_NAMES: IconName[] = [
  'barChart', 'bell', 'bookmark', 'calendar', 'chat', 'chevronLeft', 'grid', 'heart', 'home', 'megaphone', 'menu',
  'monitor', 'note', 'plus', 'search', 'share', 'star', 'tag', 'trophy', 'user', 'users', 'x',
];

describe('Icon', () => {
  it.each(ICON_NAMES)('%s 아이콘은 svg를 렌더링한다', (name) => {
    const { container } = render(<Icon name={name} />);

    const svg = container.querySelector('svg');

    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('기본 크기는 size-5이고 className으로 바꿀 수 있다', () => {
    const { container, rerender } = render(<Icon name="home" />);

    expect(container.querySelector('svg')).toHaveClass('size-5');

    rerender(<Icon name="home" className="size-4 rotate-90" />);

    expect(container.querySelector('svg')).toHaveClass('size-4', 'rotate-90');
    expect(container.querySelector('svg')).not.toHaveClass('size-5');
  });
});
