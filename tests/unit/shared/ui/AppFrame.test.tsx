import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AppFrame } from '@/shared/ui/AppFrame';

describe('AppFrame', () => {
  it('자식 화면을 감싸서 렌더링한다', () => {
    render(
      <AppFrame>
        <p>화면</p>
      </AppFrame>,
    );

    const screenText = screen.getByText('화면');

    expect(screenText.parentElement).toHaveClass('min-h-dvh', 'text-foreground');
  });
});
