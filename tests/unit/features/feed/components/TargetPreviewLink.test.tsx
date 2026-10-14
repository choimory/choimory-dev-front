import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TargetPreviewLink } from '@/features/feed/components/TargetPreviewLink';

import { FEED_ARTIST_TARGET_FIXTURE, FEED_ITEM_TARGET_FIXTURE, FEED_STREAMER_TARGET_FIXTURE } from '../../../../fixtures/feed';

describe('TargetPreviewLink', () => {
  it('지정한 경로로 이동하는 링크다', () => {
    render(<TargetPreviewLink href="/feed/targets/target-streamer" target={FEED_STREAMER_TARGET_FIXTURE} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/feed/targets/target-streamer');
  });

  it('대상 이름, 종류 칩, 상태와 지표를 보여주고 요약은 보여주지 않는다', () => {
    render(<TargetPreviewLink href="/x" target={FEED_STREAMER_TARGET_FIXTURE} />);

    const link = screen.getByRole('link');

    expect(link).toHaveTextContent('mory_live');
    expect(link).toHaveTextContent('스트리머');
    expect(link).toHaveTextContent('방송 중 · 이벤트 3건');
    expect(link).not.toHaveTextContent('방송 시작과 이벤트를 알려드려요.');
  });

  it('우측에 추이 문구를 보여준다', () => {
    render(<TargetPreviewLink href="/x" target={FEED_STREAMER_TARGET_FIXTURE} />);

    expect(screen.getByText('상승 중')).toBeInTheDocument();
  });

  it.each([
    [FEED_ITEM_TARGET_FIXTURE, 'bg-accent-orange-soft'],
    [FEED_STREAMER_TARGET_FIXTURE, 'bg-primary-soft'],
    [FEED_ARTIST_TARGET_FIXTURE, 'bg-surface-strong'],
  ])('%#번째 종류에 맞는 색상(%s)의 아이콘 배지를 쓴다', (target, toneClassName) => {
    const { container } = render(<TargetPreviewLink href="/x" target={target} />);

    expect(container.querySelector('.rounded-full.size-10')).toHaveClass(toneClassName);
  });
});
