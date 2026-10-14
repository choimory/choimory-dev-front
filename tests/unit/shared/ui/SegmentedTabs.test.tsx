import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SegmentedTabs } from '@/shared/ui/SegmentedTabs';

/** 테스트용 탭 항목 3개 */
const ITEMS = [
  { id: 'search', label: '검색' },
  { id: 'mention', label: '언급' },
  { id: 'tag', label: '태그' },
] as const;

/**
 * SegmentedTabs 테스트
 * 세그먼트 탭의 tablist/tab 역할, 선택 표시, 클릭 시 onChange, 탭 수별 열 클래스, size와 className을 확인합니다.
 */
describe('SegmentedTabs', () => {
  it('tablist와 탭 목록을 렌더링하고 선택된 탭을 표시한다', () => {
    render(<SegmentedTabs items={ITEMS} activeId="mention" ariaLabel="랭킹 종류" onChange={() => {}} />);

    expect(screen.getByRole('tablist', { name: '랭킹 종류' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByRole('tab', { name: '언급' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: '검색' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tab', { name: '언급' })).toHaveClass('bg-primary', 'text-primary-foreground');
  });

  it('탭을 클릭하면 해당 id로 onChange를 호출한다', async () => {
    const onChange = vi.fn();
    render(<SegmentedTabs items={ITEMS} activeId="search" ariaLabel="랭킹 종류" onChange={onChange} />);

    // 다른 탭을 클릭한다
    await userEvent.click(screen.getByRole('tab', { name: '태그' }));

    // 클릭한 탭의 id로 onChange가 호출됐는지 확인한다
    expect(onChange).toHaveBeenCalledWith('tag');
  });

  it('탭 개수에 맞는 열 클래스를 사용한다', () => {
    const { rerender } = render(<SegmentedTabs items={ITEMS} activeId="search" ariaLabel="종류" onChange={() => {}} />);

    expect(screen.getByRole('tablist')).toHaveClass('grid-cols-3');

    // 탭이 2개로 줄면 열 클래스도 2열로 바뀐다
    rerender(<SegmentedTabs items={ITEMS.slice(0, 2)} activeId="search" ariaLabel="종류" onChange={() => {}} />);

    expect(screen.getByRole('tablist')).toHaveClass('grid-cols-2');
  });

  it('size와 className을 반영한다', () => {
    render(<SegmentedTabs items={ITEMS} activeId="search" ariaLabel="종류" size="md" className="mt-4" onChange={() => {}} />);

    expect(screen.getByRole('tablist')).toHaveClass('mt-4');
    expect(screen.getByRole('tab', { name: '검색' })).toHaveClass('text-sm');
  });
});
