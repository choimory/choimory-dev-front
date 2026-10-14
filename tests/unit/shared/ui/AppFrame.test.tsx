import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AppFrame } from '@/shared/ui/AppFrame';

/**
 * AppFrame 테스트
 * 화면 기본 배경 프레임이 자식 화면을 감싸서 렌더링하는지 확인합니다.
 */
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
