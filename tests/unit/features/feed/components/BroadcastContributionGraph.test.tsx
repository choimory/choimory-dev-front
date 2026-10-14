import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { BroadcastContributionGraph } from '@/features/feed/components/BroadcastContributionGraph';

import { FEED_BROADCAST_DAYS_FIXTURE, FEED_BROADCAST_DAYS_WITH_SESSIONS_FIXTURE } from '../../../../fixtures/feed';

/**
 * BroadcastContributionGraph 테스트
 * 방송 기록 격자 그래프의 요일과 범례, 주 단위 열, 칸 상태(활성, 비활성)와 강도별 색, 칸 클릭 시 방송 세션 팝오버(열기, 닫기, 전환, 바깥 클릭)를 확인합니다.
 */
describe('BroadcastContributionGraph', () => {
  it('방송 기록 제목과 요일, 범례를 보여준다', () => {
    render(<BroadcastContributionGraph days={FEED_BROADCAST_DAYS_FIXTURE} />);

    expect(screen.getByRole('region', { name: '방송 기록' })).toBeInTheDocument();
    ['월', '화', '수', '목', '금', '토', '일'].forEach((day) => expect(screen.getByText(day)).toBeInTheDocument());
    expect(screen.getByText('Less')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();
  });

  it('주 단위로 첫째 날의 날짜를 열 제목으로 보여준다', () => {
    render(<BroadcastContributionGraph days={FEED_BROADCAST_DAYS_FIXTURE} />);

    // 10일 = 2주 (06.01, 06.08)
    expect(screen.getByText('06.01')).toBeInTheDocument();
    expect(screen.getByText('06.08')).toBeInTheDocument();
  });

  it('일자마다 칸을 만들고 비어 있는 칸은 비활성화한다', () => {
    render(<BroadcastContributionGraph days={FEED_BROADCAST_DAYS_FIXTURE} />);

    expect(screen.getAllByRole('button', { name: /방송 기록$/ }).filter((button) => !(button as HTMLButtonElement).disabled)).toHaveLength(10);
    expect(screen.getAllByRole('button', { name: '방송 기록 없음' })).toHaveLength(4);
    screen.getAllByRole('button', { name: '방송 기록 없음' }).forEach((button) => expect(button).toBeDisabled());
  });

  it('방송 강도에 따라 칸 색이 달라진다', () => {
    render(<BroadcastContributionGraph days={FEED_BROADCAST_DAYS_FIXTURE} />);

    expect(screen.getByRole('button', { name: '06.01 방송 기록' })).toHaveClass('bg-surface');
    expect(screen.getByRole('button', { name: '06.02 방송 기록' })).toHaveClass('bg-primary-soft');
    expect(screen.getByRole('button', { name: '06.05 방송 기록' })).toHaveClass('bg-primary');
  });

  it('처음에는 팝오버가 없다', () => {
    render(<BroadcastContributionGraph days={FEED_BROADCAST_DAYS_FIXTURE} />);

    expect(screen.queryByText(/시작 · 총/)).not.toBeInTheDocument();
  });

  it('칸을 누르면 해당 일의 대표 방송을 팝오버로 보여주고 document.body에 렌더링한다', async () => {
    const { container } = render(<BroadcastContributionGraph days={FEED_BROADCAST_DAYS_FIXTURE} />);

    // 06.03 칸을 클릭한다
    await userEvent.click(screen.getByRole('button', { name: '06.03 방송 기록' }));

    const sessionTitle = screen.getByText('3일차 방송');

    expect(screen.getByText('20:00 시작 · 총 2시간')).toBeInTheDocument();
    expect(container).not.toContainElement(sessionTitle);
    expect(document.body).toContainElement(sessionTitle);
  });

  it('방송이 여러 번 있었던 날은 방송 세션을 모두 보여준다', async () => {
    render(<BroadcastContributionGraph days={FEED_BROADCAST_DAYS_WITH_SESSIONS_FIXTURE} />);

    // 방송 세션이 둘인 06.01 칸을 클릭한다
    await userEvent.click(screen.getByRole('button', { name: '06.01 방송 기록' }));

    expect(screen.getByText('오전 방송')).toBeInTheDocument();
    expect(screen.getByText('10:00 시작 · 총 1시간')).toBeInTheDocument();
    expect(screen.getByText('저녁 방송')).toBeInTheDocument();
    expect(screen.getByText('20:00 시작 · 총 3시간')).toBeInTheDocument();
  });

  it('같은 칸을 다시 누르면 팝오버가 닫힌다', async () => {
    render(<BroadcastContributionGraph days={FEED_BROADCAST_DAYS_FIXTURE} />);

    const day = screen.getByRole('button', { name: '06.03 방송 기록' });
    // 같은 칸을 두 번 클릭하면 열었다가 닫는다
    await userEvent.click(day);
    await userEvent.click(day);

    expect(screen.queryByText('3일차 방송')).not.toBeInTheDocument();
  });

  it('다른 칸을 누르면 팝오버가 그 일의 내용으로 바뀐다', async () => {
    render(<BroadcastContributionGraph days={FEED_BROADCAST_DAYS_FIXTURE} />);

    // 06.03 칸을 열고
    await userEvent.click(screen.getByRole('button', { name: '06.03 방송 기록' }));
    // 다른 칸(06.04)을 클릭하면 내용이 바뀐다
    await userEvent.click(screen.getByRole('button', { name: '06.04 방송 기록' }));

    expect(screen.queryByText('3일차 방송')).not.toBeInTheDocument();
    expect(screen.getByText('4일차 방송')).toBeInTheDocument();
  });

  it('그래프 바깥 영역을 누르면 팝오버가 닫히고 팝오버 안쪽을 눌러도 닫히지 않는다', async () => {
    render(<BroadcastContributionGraph days={FEED_BROADCAST_DAYS_FIXTURE} />);

    // 06.03 칸을 열고
    await userEvent.click(screen.getByRole('button', { name: '06.03 방송 기록' }));
    // 팝오버 안쪽을 클릭해도 닫히지 않는다
    await userEvent.click(screen.getByText('3일차 방송'));

    expect(screen.getByText('3일차 방송')).toBeInTheDocument();

    // 그래프의 다른 영역을 클릭하면 닫힌다
    await userEvent.click(screen.getByText('Less'));

    expect(screen.queryByText('3일차 방송')).not.toBeInTheDocument();
  });

  it('비어 있는 칸은 눌러도 팝오버가 열리지 않는다', async () => {
    render(<BroadcastContributionGraph days={FEED_BROADCAST_DAYS_FIXTURE} />);

    // 비어 있는 칸을 클릭해도 팝오버가 열리지 않는다
    await userEvent.click(screen.getAllByRole('button', { name: '방송 기록 없음' })[0]);

    expect(within(document.body).queryByText(/시작 · 총/)).not.toBeInTheDocument();
  });

  it('방송 기록이 없으면 칸 없이 제목과 범례만 보여준다', () => {
    render(<BroadcastContributionGraph days={[]} />);

    expect(screen.getByRole('heading', { name: '방송 기록' })).toBeInTheDocument();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
