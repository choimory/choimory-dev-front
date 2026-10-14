import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FeedActivityDetailView } from '@/features/feed/components/FeedActivityDetailView';

import { FEED_ACTIVITIES_FIXTURE } from '../../../../fixtures/feed';

const ACTIVITY = FEED_ACTIVITIES_FIXTURE[0];

describe('FeedActivityDetailView', () => {
  it('알림의 출처, 제목, 시간을 보여준다', () => {
    render(<FeedActivityDetailView activity={ACTIVITY} isLoggedIn />);

    const intro = screen.getByRole('region', { name: '방송이 시작됐어요' });

    expect(screen.getByRole('heading', { level: 1, name: '방송이 시작됐어요' })).toBeInTheDocument();
    expect(intro).toHaveTextContent('mory_live');
    expect(intro).toHaveTextContent('12분 전');
  });

  it('알림 내용 안내 카드를 보여준다', () => {
    render(<FeedActivityDetailView activity={ACTIVITY} isLoggedIn />);

    expect(screen.getByRole('region', { name: '알림 내용' })).toHaveTextContent('실제 알림 API가 연결되기 전까지');
  });

  it('내 피드로 돌아가는 링크를 보여주고 내 피드 탭이 활성 상태다', () => {
    render(<FeedActivityDetailView activity={ACTIVITY} isLoggedIn />);

    expect(screen.getByRole('link', { name: '내 피드로 돌아가기' })).toHaveAttribute('href', '/feed/me');
    expect(screen.getByRole('link', { name: '내 피드' })).toHaveAttribute('aria-current', 'page');
  });

  it('로그인 여부에 따라 상단바 링크가 달라진다', () => {
    const { rerender } = render(<FeedActivityDetailView activity={ACTIVITY} isLoggedIn={false} />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    rerender(<FeedActivityDetailView activity={ACTIVITY} isLoggedIn />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });
});
