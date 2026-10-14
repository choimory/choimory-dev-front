import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { PlatformSearchBar } from '@/features/platform/components/PlatformSearchBar';

/**
 * PlatformSearchBar 테스트
 * 플랫폼 홈 검색바의 폼 구성, 검색어 입력, 제출 시 페이지 이동을 막는 동작을 확인합니다.
 */
describe('PlatformSearchBar', () => {
  it('검색 폼과 입력창, 검색 버튼을 보여준다', () => {
    render(<PlatformSearchBar />);

    const form = screen.getByRole('search');

    expect(form).toBeInTheDocument();
    expect(screen.getByPlaceholderText('서비스나 내용을 검색하세요')).toHaveAttribute('type', 'search');
    expect(screen.getByRole('button', { name: '검색' })).toHaveAttribute('type', 'submit');
  });

  it('검색어를 입력할 수 있다', async () => {
    render(<PlatformSearchBar />);

    const input = screen.getByRole('searchbox');
    // 검색어를 입력한다
    await userEvent.type(input, 'blog');

    expect(input).toHaveValue('blog');
  });

  it('제출하면 기본 동작(페이지 이동)을 막는다', () => {
    render(<PlatformSearchBar />);

    // preventDefault가 호출되면 fireEvent는 false를 반환한다
    // 폼을 제출한다
    const isNotPrevented = fireEvent.submit(screen.getByRole('search'));

    expect(isNotPrevented).toBe(false);
  });
});
