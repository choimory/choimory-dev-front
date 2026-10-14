import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { FormField } from '@/features/feed/components/FormField';

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

    await userEvent.type(screen.getByLabelText('대상 이름'), '무선 마우스');

    expect(screen.getByLabelText('대상 이름')).toHaveValue('무선 마우스');
  });
});
