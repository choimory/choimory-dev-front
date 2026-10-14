import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ItemDetailSection } from '@/features/feed/components/ItemDetailSection';

import { FEED_ITEM_TARGET_FIXTURE, FEED_STREAMER_TARGET_FIXTURE } from '../../../../fixtures/feed';

describe('ItemDetailSection', () => {
  it('아이템 상세 데이터가 없으면 아무것도 렌더링하지 않는다', () => {
    const { container } = render(<ItemDetailSection target={FEED_STREAMER_TARGET_FIXTURE} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('가격 관찰 영역에 현재 가격, 목표 가격, 변화 문구를 보여준다', () => {
    render(<ItemDetailSection target={FEED_ITEM_TARGET_FIXTURE} />);

    const summary = screen.getByRole('region', { name: '가격 관찰' });

    expect(within(summary).getByText('95,000원')).toBeInTheDocument();
    expect(within(summary).getByText('90,000원')).toBeInTheDocument();
    expect(within(summary).getByText('지난주 대비 8% 하락')).toBeInTheDocument();
  });

  it('원본 링크를 새 탭에서 여는 외부 링크로 보여준다', () => {
    render(<ItemDetailSection target={FEED_ITEM_TARGET_FIXTURE} />);

    const link = screen.getByRole('link', { name: 'Keyboard Store' });

    expect(link).toHaveAttribute('href', 'https://example.com/products/keyboard');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });

  it('가격 변동 그래프 영역에 기간 탭과 첫 기간(1주)의 그래프를 보여준다', () => {
    const { container } = render(<ItemDetailSection target={FEED_ITEM_TARGET_FIXTURE} />);

    expect(screen.getByRole('tablist', { name: '가격 추이 기간' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '1주' })).toHaveAttribute('aria-selected', 'true');
    expect(container.querySelectorAll('circle')).toHaveLength(3);
  });

  it('기간 탭을 바꾸면 해당 기간의 지점으로 그래프가 바뀐다', async () => {
    const { container } = render(<ItemDetailSection target={FEED_ITEM_TARGET_FIXTURE} />);

    await userEvent.click(screen.getByRole('tab', { name: '1개월' }));

    expect(screen.getByRole('tab', { name: '1개월' })).toHaveAttribute('aria-selected', 'true');
    expect(container.querySelectorAll('circle')).toHaveLength(2);
  });

  it('지점에 마우스를 올리면 안내가 나타나고 벗어나면 사라진다', () => {
    const { container } = render(<ItemDetailSection target={FEED_ITEM_TARGET_FIXTURE} />);

    const circle = container.querySelectorAll('circle')[1];

    // 날짜 "수"는 x축 라벨에 한 번 나온다
    expect(screen.getAllByText('수')).toHaveLength(1);

    fireEvent.mouseEnter(circle);
    expect(screen.getAllByText('수')).toHaveLength(2);

    fireEvent.mouseLeave(circle);
    expect(screen.getAllByText('수')).toHaveLength(1);
  });

  it('지점을 누르면 고정되어 마우스를 벗어나도 안내가 유지되고 다시 누르면 해제된다', async () => {
    const { container } = render(<ItemDetailSection target={FEED_ITEM_TARGET_FIXTURE} />);

    const circle = container.querySelectorAll('circle')[1];

    await userEvent.click(circle);
    fireEvent.mouseLeave(circle);

    expect(screen.getAllByText('수')).toHaveLength(2);
    expect(circle).toHaveAttribute('r', '6');

    await userEvent.click(circle);

    // 고정은 해제되지만 포인터가 아직 지점 위에 있어서 안내는 호버로 남아 있다
    expect(circle).toHaveAttribute('r', '4.5');
    expect(screen.getAllByText('수')).toHaveLength(2);

    fireEvent.mouseLeave(circle);

    expect(screen.getAllByText('수')).toHaveLength(1);
  });

  it('그래프 배경을 누르면 고정이 해제된다', async () => {
    const { container } = render(<ItemDetailSection target={FEED_ITEM_TARGET_FIXTURE} />);

    await userEvent.click(container.querySelectorAll('circle')[0]);
    await userEvent.click(screen.getByRole('img', { name: '가격 변동 라인그래프' }));

    expect(container.querySelectorAll('circle')[0]).toHaveAttribute('r', '4.5');
  });

  it('기간을 바꾸면 고정된 지점이 해제된다', async () => {
    const { container } = render(<ItemDetailSection target={FEED_ITEM_TARGET_FIXTURE} />);

    await userEvent.click(container.querySelectorAll('circle')[0]);
    await userEvent.click(screen.getByRole('tab', { name: '1개월' }));

    container.querySelectorAll('circle').forEach((circle) => expect(circle).toHaveAttribute('r', '4.5'));
  });
});
