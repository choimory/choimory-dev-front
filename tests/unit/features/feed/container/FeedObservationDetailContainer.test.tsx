import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FeedObservationDetailContainer } from '@/features/feed/container/FeedObservationDetailContainer';
import { feedViewModel } from '@/features/feed/model/feedTypes';

/**
 * FeedObservationDetailContainer 테스트
 * 컨테이너가 observationId에 해당하는 관찰 항목을 보여주고, 없는 id이면 첫 번째 항목으로 대체하며 authStatus를 반영하는지 확인합니다.
 */
describe('FeedObservationDetailContainer', () => {
  it('observationId에 해당하는 관찰 항목을 보여준다', () => {
    render(<FeedObservationDetailContainer authStatus="guest" observationId="observation-2" />);

    expect(screen.getByRole('heading', { level: 1, name: feedViewModel.observations[1].title })).toBeInTheDocument();
  });

  it('없는 observationId이면 첫 번째 관찰 항목을 보여준다', () => {
    render(<FeedObservationDetailContainer authStatus="guest" observationId="unknown" />);

    expect(screen.getByRole('heading', { level: 1, name: feedViewModel.observations[0].title })).toBeInTheDocument();
  });

  it('authStatus에 따라 상단바 링크가 달라진다', () => {
    const { rerender } = render(<FeedObservationDetailContainer authStatus="guest" observationId="observation-1" />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    // member 상태로 다시 렌더링한다
    rerender(<FeedObservationDetailContainer authStatus="member" observationId="observation-1" />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });
});
