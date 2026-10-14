import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TogglePreview } from '@/features/feed/components/TogglePreview';

describe('TogglePreview', () => {
  it('라벨을 보여준다', () => {
    render(<TogglePreview label="가격 알림" />);

    expect(screen.getByText('가격 알림')).toBeInTheDocument();
  });

  it('켜진 상태의 스위치를 장식 요소로 보여주고 상호작용 요소는 없다', () => {
    const { container } = render(<TogglePreview label="가격 알림" />);

    const switchTrack = container.querySelector('[aria-hidden="true"]');

    expect(switchTrack).toHaveClass('justify-end', 'bg-primary');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });
});
