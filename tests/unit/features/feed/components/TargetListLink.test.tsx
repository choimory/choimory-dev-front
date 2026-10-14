import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TargetListLink } from '@/features/feed/components/TargetListLink';

import { FEED_ARTIST_TARGET_FIXTURE, FEED_ITEM_TARGET_FIXTURE, FEED_STREAMER_TARGET_FIXTURE } from '../../../../fixtures/feed';

describe('TargetListLink', () => {
  it('지정한 경로로 이동하는 링크다', () => {
    render(<TargetListLink href="/feed/targets/target-item" rightText="상세" target={FEED_ITEM_TARGET_FIXTURE} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/feed/targets/target-item');
  });

  it('대상 이름, 종류 칩, 요약, 상태와 지표를 보여준다', () => {
    render(<TargetListLink href="/x" rightText="상세" target={FEED_ITEM_TARGET_FIXTURE} />);

    const link = screen.getByRole('link');

    expect(link).toHaveTextContent('기계식 키보드');
    expect(link).toHaveTextContent('아이템');
    expect(link).toHaveTextContent('목표가 아래로 내려가면 알려드려요.');
    expect(link).toHaveTextContent('가격 하락 중 · -8%');
  });

  it('우측 문구를 보여준다', () => {
    render(<TargetListLink href="/x" rightText="관리" target={FEED_ITEM_TARGET_FIXTURE} />);

    expect(screen.getByText('관리')).toBeInTheDocument();
  });

  it.each([
    [FEED_ITEM_TARGET_FIXTURE, '아이템', 'bg-accent-orange-soft'],
    [FEED_STREAMER_TARGET_FIXTURE, '스트리머', 'bg-primary-soft'],
    [FEED_ARTIST_TARGET_FIXTURE, '아티스트', 'bg-surface-strong'],
  ])('%#번째 종류는 "%s" 라벨과 해당 색상(%s)의 아이콘 배지를 쓴다', (target, label, toneClassName) => {
    const { container } = render(<TargetListLink href="/x" rightText="상세" target={target} />);

    expect(screen.getByRole('link')).toHaveTextContent(label);
    expect(container.querySelector('.rounded-full.size-10')).toHaveClass(toneClassName);
  });
});
