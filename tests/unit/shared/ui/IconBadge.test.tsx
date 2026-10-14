import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { IconBadge } from '@/shared/ui/IconBadge';

/**
 * IconBadge 테스트
 * 원형 배지의 기본값과 크기 5종, 톤 4종, 태그(as)와 추가 className 반영을 확인합니다.
 */
describe('IconBadge', () => {
  it('기본값은 div, lg 크기, soft 톤이다', () => {
    render(<IconBadge>C</IconBadge>);

    const badge = screen.getByText('C');

    expect(badge.tagName).toBe('DIV');
    expect(badge).toHaveClass('size-10', 'rounded-full', 'bg-primary-soft', 'text-primary');
  });

  it.each([
    ['xs', 'size-6'],
    ['sm', 'size-8'],
    ['md', 'size-9'],
    ['lg', 'size-10'],
    ['xl', 'size-12'],
  ] as const)('size %s는 %s 클래스를 사용한다', (size, className) => {
    render(<IconBadge size={size}>C</IconBadge>);

    expect(screen.getByText('C')).toHaveClass(className);
  });

  it.each([
    ['primary', 'bg-primary', 'text-primary-foreground'],
    ['soft', 'bg-primary-soft', 'text-primary'],
    ['strong', 'bg-surface-strong', 'text-primary'],
    ['surface', 'bg-surface', 'text-primary'],
  ] as const)('tone %s 색상 클래스를 사용한다', (tone, bg, text) => {
    render(<IconBadge tone={tone}>C</IconBadge>);

    expect(screen.getByText('C')).toHaveClass(bg, text);
  });

  it('as=span과 className을 반영한다', () => {
    render(<IconBadge as="span" className="text-sm font-bold">M</IconBadge>);

    const badge = screen.getByText('M');

    expect(badge.tagName).toBe('SPAN');
    expect(badge).toHaveClass('text-sm', 'font-bold');
  });
});
