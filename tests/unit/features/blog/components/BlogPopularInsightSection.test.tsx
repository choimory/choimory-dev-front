import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { BlogPopularInsightSection } from '@/features/blog/components/BlogPopularInsightSection';

/**
 * BlogPopularInsightSection 테스트
 * 인기 화면의 실시간 랭킹 카드가 탭 4종과 기본 탭의 랭킹 5개, 탭 전환, 순위 변동별 색상, 등장 애니메이션 지연을 보여주는지 확인합니다.
 */
describe('BlogPopularInsightSection', () => {
  it('실시간 랭킹 제목과 "지금" 칩을 보여준다', () => {
    render(<BlogPopularInsightSection />);

    expect(screen.getByRole('region', { name: '실시간 랭킹' })).toBeInTheDocument();
    expect(screen.getByText('지금')).toBeInTheDocument();
  });

  it('탭 4종을 보여주고 검색어 탭이 기본 선택이다', () => {
    render(<BlogPopularInsightSection />);

    const tablist = screen.getByRole('tablist', { name: '인기 랭킹 종류' });

    expect(within(tablist).getAllByRole('tab').map((tab) => tab.textContent)).toEqual(['검색어', '멘션', '팔로워', '태그']);
    expect(within(tablist).getByRole('tab', { name: '검색어' })).toHaveAttribute('aria-selected', 'true');
  });

  it('기본 탭의 랭킹 5개를 순위 순서대로 보여준다', () => {
    render(<BlogPopularInsightSection />);

    const items = screen.getAllByRole('article');

    expect(items).toHaveLength(5);
    expect(within(items[0]).getByText('1')).toBeInTheDocument();
    expect(within(items[0]).getByText('프론트 화면 구조')).toBeInTheDocument();
    expect(within(items[4]).getByText('5')).toBeInTheDocument();
    expect(within(items[4]).getByText('팔로잉 목록 검색')).toBeInTheDocument();
  });

  it.each([
    ['멘션', '@mory.dev'],
    ['팔로워', 'mory.dev'],
    ['태그', '#frontend'],
  ])('%s 탭을 누르면 해당 랭킹 1위(%s)를 보여준다', async (tabName, firstLabel) => {
    render(<BlogPopularInsightSection />);

    // 해당 탭을 클릭한다
    await userEvent.click(screen.getByRole('tab', { name: tabName }));

    expect(screen.getByRole('tab', { name: tabName })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: '검색어' })).toHaveAttribute('aria-selected', 'false');
    expect(within(screen.getAllByRole('article')[0]).getByText(firstLabel)).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(5);
  });

  it('순위 변동 상태에 따라 색상과 지표를 보여준다', () => {
    render(<BlogPopularInsightSection />);

    const [up, newItem, down, , same] = screen.getAllByRole('article');

    expect(within(up).getByText('12').closest('span')).toHaveClass('bg-primary-soft', 'text-primary');
    expect(within(newItem).getByText('NEW').closest('span')).toHaveClass('bg-accent-green-soft', 'text-accent-green');
    expect(within(down).getByText('2').closest('span')).toHaveClass('text-accent-red');
    expect(within(same).getByText('1').closest('span')).toHaveClass('text-muted');
  });

  it('랭킹 항목은 등장 애니메이션 클래스와 순차 지연을 가진다', () => {
    render(<BlogPopularInsightSection />);

    const items = screen.getAllByRole('article');

    expect(items[0]).toHaveClass('blog-ranking-enter');
    expect(items[0]).toHaveStyle({ animationDelay: '0ms' });
    expect(items[2]).toHaveStyle({ animationDelay: '140ms' });
  });
});
