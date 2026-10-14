import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { MiniLineChart } from '@/features/feed/components/MiniLineChart';

import { FEED_PRICE_RANGES_FIXTURE } from '../../../../fixtures/feed';

const POINTS = FEED_PRICE_RANGES_FIXTURE[0].points;

/** 필요한 핸들러만 바꿔서 그래프를 렌더링한다 */
function renderChart(overrides: Partial<Parameters<typeof MiniLineChart>[0]> = {}) {
  const handlers = {
    onClearPinnedPoint: vi.fn(),
    onHoverPoint: vi.fn(),
    onTogglePinPoint: vi.fn(),
  };

  const view = render(
    <MiniLineChart label="가격 추이" points={POINTS} pinnedPointId={null} {...handlers} {...overrides} />,
  );

  return { ...view, ...handlers };
}

/**
 * MiniLineChart 테스트
 * 가격 꺾은선 그래프의 지점과 날짜, 최고가와 최저가, 호버와 포커스 안내, 클릭 고정과 배경 클릭 해제, 고정 지점 강조를 확인합니다.
 */
describe('MiniLineChart', () => {
  it('라벨과 라인그래프 이미지를 보여준다', () => {
    renderChart();

    expect(screen.getByText('가격 추이')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '가격 추이 라인그래프' })).toBeInTheDocument();
  });

  it('지점마다 원과 날짜 라벨을 그린다', () => {
    const { container } = renderChart();

    expect(container.querySelectorAll('circle')).toHaveLength(3);
    ['월', '수', '금'].forEach((dateText) => expect(screen.getByText(dateText)).toBeInTheDocument());
  });

  it('최고가와 최저가 표시를 보여준다', () => {
    renderChart();

    expect(screen.getByText('100,000원')).toBeInTheDocument();
    expect(screen.getByText('90,000원')).toBeInTheDocument();
  });

  it('값 순서대로 이어지는 선(polyline)을 그린다', () => {
    const { container } = renderChart();

    const polyline = container.querySelector('polyline');

    expect(polyline?.getAttribute('points')?.split(' ')).toHaveLength(3);
  });

  it('지점이 하나뿐이면 가운데(x=170)에 그린다', () => {
    const { container } = renderChart({ points: [POINTS[0]] });

    expect(container.querySelector('circle')).toHaveAttribute('cx', '170');
  });

  it('지점에 마우스를 올리면 해당 지점 id로, 벗어나면 null로 onHoverPoint를 호출한다', () => {
    const { container, onHoverPoint } = renderChart();

    const circle = container.querySelectorAll('circle')[1];

    // 지점에 마우스를 올린다
    fireEvent.mouseEnter(circle);
    expect(onHoverPoint).toHaveBeenLastCalledWith('week-2');

    // 지점에서 마우스를 벗어난다
    fireEvent.mouseLeave(circle);
    expect(onHoverPoint).toHaveBeenLastCalledWith(null);
  });

  it('지점은 포커스로도 안내를 열고 닫을 수 있다', () => {
    const { container, onHoverPoint } = renderChart();

    const circle = container.querySelectorAll('circle')[0];

    expect(circle).toHaveAttribute('tabindex', '0');

    // 지점에 포커스를 준다
    fireEvent.focus(circle);
    expect(onHoverPoint).toHaveBeenLastCalledWith('week-1');

    // 지점의 포커스를 뺀다
    fireEvent.blur(circle);
    expect(onHoverPoint).toHaveBeenLastCalledWith(null);
  });

  it('지점을 누르면 고정을 토글하고 그래프 배경의 해제 동작은 실행하지 않는다', async () => {
    const { container, onTogglePinPoint, onClearPinnedPoint } = renderChart();

    // 지점을 클릭한다
    await userEvent.click(container.querySelectorAll('circle')[2]);

    expect(onTogglePinPoint).toHaveBeenCalledWith('week-3');
    expect(onClearPinnedPoint).not.toHaveBeenCalled();
  });

  it('그래프 배경을 누르면 고정을 해제한다', async () => {
    const { onClearPinnedPoint } = renderChart();

    // 그래프 배경을 클릭한다
    await userEvent.click(screen.getByRole('img', { name: '가격 추이 라인그래프' }));

    expect(onClearPinnedPoint).toHaveBeenCalledTimes(1);
  });

  it('고정된 지점은 더 크게 강조한다', () => {
    const { container } = renderChart({ pinnedPointId: 'week-2' });

    const [first, second] = container.querySelectorAll('circle');

    expect(second).toHaveAttribute('r', '6');
    expect(second).toHaveClass('stroke-primary-foreground');
    expect(first).toHaveAttribute('r', '4.5');
  });

  it('활성 지점이 있으면 날짜와 가격 안내를 보여준다', () => {
    renderChart({ activePoint: POINTS[1] });

    // 날짜는 x축 라벨과 안내에 한 번씩, 가격은 안내에만 나온다
    expect(screen.getAllByText('수')).toHaveLength(2);
    expect(screen.getAllByText('90,000원')).toHaveLength(2);
  });

  it('활성 지점이 없으면 안내를 보여주지 않는다', () => {
    renderChart();

    expect(screen.getAllByText('수')).toHaveLength(1);
  });
});
