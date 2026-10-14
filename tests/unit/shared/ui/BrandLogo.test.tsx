import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BrandLogo } from '@/shared/ui/BrandLogo';

describe('BrandLogo', () => {
  it('접근성 라벨과 로고 텍스트를 보여준다', () => {
    render(<BrandLogo />);

    const logo = screen.getByLabelText('choimory.dev');

    expect(logo).toHaveTextContent('{choimory.dev()}');
  });

  it('기본값은 md 크기에 타자기 애니메이션이 켜진다', () => {
    render(<BrandLogo />);

    const logo = screen.getByLabelText('choimory.dev');

    expect(logo).toHaveClass('text-xl', 'brand-logo-typewriter');
    expect(logo.style.getPropertyValue('--brand-logo-character-count')).toBe('16');
  });

  it('size와 isAnimated를 반영한다', () => {
    render(<BrandLogo size="sm" isAnimated={false} />);

    const logo = screen.getByLabelText('choimory.dev');

    expect(logo).toHaveClass('text-base');
    expect(logo).not.toHaveClass('brand-logo-typewriter');
    expect(logo.style.getPropertyValue('--brand-logo-character-count')).toBe('');
  });
});
