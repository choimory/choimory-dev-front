import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { FormField } from '@/features/feed/components/FormField';

/**
 * FormField 테스트
 * 라벨과 입력창이 연결된 폼 필드의 라벨, placeholder, 입력을 확인합니다.
 */
describe('FormField', () => {
  it('라벨과 연결된 입력창을 보여준다', () => {
    render(<FormField label="대상 이름" placeholder="기계식 키보드" />);

    expect(screen.getByLabelText('대상 이름')).toBeInTheDocument();
  });

  it('placeholder를 입력창에 보여준다', () => {
    render(<FormField label="대상 이름" placeholder="기계식 키보드" />);

    expect(screen.getByPlaceholderText('기계식 키보드')).toBe(screen.getByLabelText('대상 이름'));
  });

  it('입력할 수 있다', async () => {
    render(<FormField label="대상 이름" placeholder="기계식 키보드" />);

    // 입력창에 값을 입력한다
    await userEvent.type(screen.getByLabelText('대상 이름'), '무선 마우스');

    expect(screen.getByLabelText('대상 이름')).toHaveValue('무선 마우스');
  });
});
