import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { PopularTargetSection } from '@/features/feed/components/PopularTargetSection';

import { FEED_TARGETS_FIXTURE } from '../../../../fixtures/feed';

describe('PopularTargetSection', () => {
  it('제목, 경로, "지금" 칩을 보여준다', () => {
    render(<PopularTargetSection targets={FEED_TARGETS_FIXTURE} />);

    expect(screen.getByRole('region', { name: '실시간 관찰 대상 랭킹' })).toBeInTheDocument();
    expect(screen.getByText('feed / ranking')).toBeInTheDocument();
    expect(screen.getByText('지금')).toBeInTheDocument();
  });

  it('탭 4종을 보여주고 전체 탭이 기본 선택이다', () => {
    render(<PopularTargetSection targets={FEED_TARGETS_FIXTURE} />);

    const tablist = screen.getByRole('tablist', { name: 'feed 인기 랭킹 종류' });

    expect(within(tablist).getAllByRole('tab').map((tab) => tab.textContent)).toEqual(['전체', '아이템', '스트리머', '아티스트']);
    expect(within(tablist).getByRole('tab', { name: '전체' })).toHaveAttribute('aria-selected', 'true');
  });

  it('전체 탭에서는 모든 대상을 순위와 함께 링크로 보여준다', () => {
    render(<PopularTargetSection targets={FEED_TARGETS_FIXTURE} />);

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute('href', '/feed/targets/target-item');
    expect(links[0]).toHaveTextContent('1');
    expect(links[0]).toHaveTextContent('기계식 키보드');
    expect(links[2]).toHaveTextContent('3');
  });

  it.each([
    ['아이템', ['기계식 키보드']],
    ['스트리머', ['mory_live']],
    ['아티스트', ['artist.nova']],
  ])('%s 탭에서는 해당 종류의 대상만 보여준다', async (tabName, names) => {
    render(<PopularTargetSection targets={FEED_TARGETS_FIXTURE} />);

    await userEvent.click(screen.getByRole('tab', { name: tabName }));

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(names.length);
    names.forEach((name) => expect(screen.getByText(name)).toBeInTheDocument());
  });

  it('전체 탭으로 돌아오면 모든 대상을 다시 보여준다', async () => {
    render(<PopularTargetSection targets={FEED_TARGETS_FIXTURE} />);

    await userEvent.click(screen.getByRole('tab', { name: '아이템' }));
    await userEvent.click(screen.getByRole('tab', { name: '전체' }));

    expect(screen.getAllByRole('link')).toHaveLength(3);
  });

  it('추이 방향에 따라 아이콘과 색상을 보여준다', () => {
    render(<PopularTargetSection targets={FEED_TARGETS_FIXTURE} />);

    const [itemLink, streamerLink, artistLink] = screen.getAllByRole('link');

    expect(within(itemLink).getByText('지난주 대비 하락').closest('span')).toHaveClass('text-accent-red');
    expect(within(itemLink).getByText('↓')).toHaveAttribute('aria-hidden', 'true');
    expect(within(streamerLink).getByText('상승 중').closest('span')).toHaveClass('text-primary');
    expect(within(streamerLink).getByText('↑')).toBeInTheDocument();
    expect(within(artistLink).getByText('유지').closest('span')).toHaveClass('text-muted');
    expect(within(artistLink).getByText('-')).toBeInTheDocument();
  });

  it('종류별 칩과 등장 애니메이션 지연을 보여준다', () => {
    render(<PopularTargetSection targets={FEED_TARGETS_FIXTURE} />);

    const links = screen.getAllByRole('link');

    expect(within(links[1]).getByText('스트리머')).toBeInTheDocument();
    expect(links[0]).toHaveStyle({ animationDelay: '0ms' });
    expect(links[2]).toHaveStyle({ animationDelay: '140ms' });
  });

  it('대상이 없으면 링크가 없다', () => {
    render(<PopularTargetSection targets={[]} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
