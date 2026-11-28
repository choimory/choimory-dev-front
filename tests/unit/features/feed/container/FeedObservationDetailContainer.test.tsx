import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FeedObservationDetailContainer } from '@/features/feed/container/FeedObservationDetailContainer';
import { feedViewModel } from '@/features/feed/model/feedTypes';

import { createAuthWrapper } from '../../../../fixtures/auth';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => '/feed/observations/observation-1',
  useRouter: () => ({ replace, push: vi.fn() }),
}));

/**
 * FeedObservationDetailContainer 테스트
 * 로그인 가드와 observationId에 해당하는 관찰 항목 표시 및 첫 번째 항목으로의 대체 동작을 확인합니다.
 */
describe('FeedObservationDetailContainer', () => {
  beforeEach(() => {
    replace.mockClear();
  });

  it('observationId에 해당하는 관찰 항목을 보여준다', () => {
    render(<FeedObservationDetailContainer observationId="observation-2" />, { wrapper: createAuthWrapper('member') });

    expect(screen.getByRole('heading', { level: 1, name: feedViewModel.observations[1].title })).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('없는 observationId이면 첫 번째 관찰 항목을 보여준다', () => {
    render(<FeedObservationDetailContainer observationId="unknown" />, { wrapper: createAuthWrapper('member') });

    expect(screen.getByRole('heading', { level: 1, name: feedViewModel.observations[0].title })).toBeInTheDocument();
  });

  it('비로그인이면 화면을 숨기고 로그인 화면으로 이동한다', () => {
    render(<FeedObservationDetailContainer observationId="observation-1" />, { wrapper: createAuthWrapper('guest') });

    expect(screen.queryByRole('heading', { level: 1, name: feedViewModel.observations[0].title })).not.toBeInTheDocument();
    expect(replace).toHaveBeenCalledWith('/login?next=%2Ffeed%2Fobservations%2Fobservation-1');
  });

  it('로그인 상태를 복원하는 중이면 화면을 숨기고 이동하지 않는다', () => {
    render(<FeedObservationDetailContainer observationId="observation-1" />, {
      wrapper: createAuthWrapper('guest', { state: 'loading' }),
    });

    expect(screen.queryByRole('heading', { level: 1, name: feedViewModel.observations[0].title })).not.toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('로그인 상태이면 상단바에 로그아웃 버튼을 보여준다', () => {
    render(<FeedObservationDetailContainer observationId="observation-1" />, { wrapper: createAuthWrapper('member') });

    expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument();
  });
});
