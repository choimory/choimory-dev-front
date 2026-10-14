import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PopularTargetEventSection } from '@/features/feed/components/PopularTargetEventSection';

import { FEED_ACTIVITIES_FIXTURE } from '../../../../fixtures/feed';

/**
 * PopularTargetEventSection 테스트
 * 최근 이벤트 목록의 제목, 알림별 링크(제목, 출처, 시간)와 이동 경로, 빈 목록을 확인합니다.
 */
describe('PopularTargetEventSection', () => {
  it('"최근 이벤트" 제목을 영역 이름으로 보여준다', () => {
    render(<PopularTargetEventSection activities={FEED_ACTIVITIES_FIXTURE} />);

    expect(screen.getByRole('region', { name: '최근 이벤트' })).toBeInTheDocument();
    expect(screen.getByText('feed / event')).toBeInTheDocument();
  });

  it('알림마다 제목, 출처, 시간을 가진 링크를 보여준다', () => {
    render(<PopularTargetEventSection activities={FEED_ACTIVITIES_FIXTURE} />);

    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent('방송이 시작됐어요');
    expect(links[0]).toHaveTextContent('mory_live');
    expect(links[0]).toHaveTextContent('12분 전');
  });

  it('각 알림은 연결된 대상 상세로 이동한다', () => {
    render(<PopularTargetEventSection activities={FEED_ACTIVITIES_FIXTURE} />);

    const links = screen.getAllByRole('link');

    expect(links[0]).toHaveAttribute('href', '/feed/targets/target-streamer');
    expect(links[1]).toHaveAttribute('href', '/feed/targets/target-item');
  });

  it('알림이 없으면 링크가 없다', () => {
    render(<PopularTargetEventSection activities={[]} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
