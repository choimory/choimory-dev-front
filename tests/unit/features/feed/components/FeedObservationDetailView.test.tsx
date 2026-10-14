import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FeedObservationDetailView } from '@/features/feed/components/FeedObservationDetailView';

import { FEED_OBSERVATIONS_FIXTURE } from '../../../../fixtures/feed';

const OBSERVATION = FEED_OBSERVATIONS_FIXTURE[0];

describe('FeedObservationDetailView', () => {
  it('관찰 항목의 분류, 제목, 상태를 보여준다', () => {
    render(<FeedObservationDetailView isLoggedIn observation={OBSERVATION} />);

    const intro = screen.getByRole('region', { name: '키보드 가격' });

    expect(screen.getByRole('heading', { level: 1, name: '키보드 가격' })).toBeInTheDocument();
    expect(intro).toHaveTextContent('아이템');
    expect(intro).toHaveTextContent('관찰 중');
  });

  it('관찰 상태 요약 카드 2개를 보여준다', () => {
    render(<FeedObservationDetailView isLoggedIn observation={OBSERVATION} />);

    const cards = within(screen.getByLabelText('관찰 상태 요약')).getAllByRole('article');

    expect(cards.map((card) => card.textContent)).toEqual(['ON관찰 상태', '9최근 알림']);
  });

  it('관찰 조건 안내 카드를 보여준다', () => {
    render(<FeedObservationDetailView isLoggedIn observation={OBSERVATION} />);

    expect(screen.getByRole('region', { name: '관찰 조건' })).toHaveTextContent('mock 조건');
  });

  it('관찰 목록으로 돌아가는 링크를 보여주고 관찰 탭이 활성 상태다', () => {
    render(<FeedObservationDetailView isLoggedIn observation={OBSERVATION} />);

    expect(screen.getByRole('link', { name: '관찰 목록으로 돌아가기' })).toHaveAttribute('href', '/feed/observations');
    expect(screen.getByRole('link', { name: '관찰' })).toHaveAttribute('aria-current', 'page');
  });

  it('로그인 여부에 따라 상단바 링크가 달라진다', () => {
    const { rerender } = render(<FeedObservationDetailView isLoggedIn={false} observation={OBSERVATION} />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    rerender(<FeedObservationDetailView isLoggedIn observation={OBSERVATION} />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });
});
