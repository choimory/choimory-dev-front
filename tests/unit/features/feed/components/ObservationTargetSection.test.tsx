import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ObservationTargetSection } from '@/features/feed/components/ObservationTargetSection';

import { FEED_TARGETS_FIXTURE } from '../../../../fixtures/feed';

/**
 * ObservationTargetSection 테스트
 * 관찰 대상 요약의 전체와 종류별 개수, 대상 링크와 추이 문구, 빈 목록을 확인합니다.
 */
describe('ObservationTargetSection', () => {
  it('관찰 대상 요약에 전체와 종류별 개수를 보여준다', () => {
    render(<ObservationTargetSection targets={FEED_TARGETS_FIXTURE} />);

    const summary = screen.getByLabelText('관찰 대상 요약');
    const cards = within(summary).getAllByRole('article');

    expect(cards.map((card) => card.textContent)).toEqual(['3관찰 중', '1아이템', '1스트리머', '1아티스트']);
  });

  it('종류가 한쪽에 몰려 있으면 개수도 그대로 센다', () => {
    render(<ObservationTargetSection targets={[FEED_TARGETS_FIXTURE[0], { ...FEED_TARGETS_FIXTURE[0], id: 'target-item-2' }]} />);

    const cards = within(screen.getByLabelText('관찰 대상 요약')).getAllByRole('article');

    expect(cards.map((card) => card.textContent)).toEqual(['2관찰 중', '2아이템', '0스트리머', '0아티스트']);
  });

  it('"관찰 중인 대상" 영역에 대상별 링크를 보여준다', () => {
    render(<ObservationTargetSection targets={FEED_TARGETS_FIXTURE} />);

    expect(screen.getByRole('region', { name: '관찰 중인 대상' })).toBeInTheDocument();

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute('href', '/feed/targets/target-item');
    expect(links[0]).toHaveTextContent('기계식 키보드');
  });

  it('각 링크 우측에 대상의 추이 문구를 보여준다', () => {
    render(<ObservationTargetSection targets={FEED_TARGETS_FIXTURE} />);

    expect(within(screen.getAllByRole('link')[0]).getByText('지난주 대비 하락')).toBeInTheDocument();
  });

  it('대상이 없으면 요약은 0이고 링크가 없다', () => {
    render(<ObservationTargetSection targets={[]} />);

    const cards = within(screen.getByLabelText('관찰 대상 요약')).getAllByRole('article');

    expect(cards.map((card) => card.textContent)).toEqual(['0관찰 중', '0아이템', '0스트리머', '0아티스트']);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
