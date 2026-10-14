import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AppContent } from '@/shared/ui/AppContent';

/**
 * AppContent 테스트
 * 서비스 화면 공통 중앙 영역(main)이 기본 wide 폭과 narrow variant, 추가 className을 반영하는지 확인합니다.
 */
describe('AppContent', () => {
  it('기본값은 wide 폭의 main 영역이다', () => {
    render(<AppContent>본문</AppContent>);

    const main = screen.getByRole('main');

    expect(main).toHaveTextContent('본문');
    expect(main).toHaveClass('max-w-[768px]');
  });

  it('narrow variant와 추가 className을 반영한다', () => {
    render(<AppContent variant="narrow" className="grid gap-4">본문</AppContent>);

    const main = screen.getByRole('main');

    expect(main).toHaveClass('max-w-[560px]', 'grid', 'gap-4');
    expect(main).not.toHaveClass('max-w-[768px]');
  });
});
