import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FeedView } from '@/features/feed/components/FeedView';
import type { FeedViewModel } from '@/features/feed/model/feedTypes';

import { FEED_TARGETS_FIXTURE, FEED_VIEW_MODEL_FIXTURE } from '../../../../fixtures/feed';

const GUEST_VIEW_MODEL: FeedViewModel = { ...FEED_VIEW_MODEL_FIXTURE, authStatus: 'guest' };
const MEMBER_VIEW_MODEL: FeedViewModel = { ...FEED_VIEW_MODEL_FIXTURE, authStatus: 'member' };

/**
 * FeedView 테스트
 * feed 홈의 소개와 상단바, 비회원 영역(로그인 링크, 준비 중 알림, 혜택)과 회원 영역(요약, 관심 대상 최대 3개, 최근 알림)의 전환, 하단 네비게이션 상태를 확인합니다.
 */
describe('FeedView', () => {
  it('feed 소개 제목과 설명을 보여준다', () => {
    render(<FeedView viewModel={GUEST_VIEW_MODEL} />);

    expect(screen.getByRole('heading', { level: 1, name: '가격, 방송, 신곡 알림을 한 피드에서' })).toBeInTheDocument();
    expect(screen.getByText('관심 대상을 관찰하는 서비스예요.')).toBeInTheDocument();
  });

  it('상단바에 feed 서비스명과 플랫폼 홈으로 돌아가는 링크를 보여준다', () => {
    render(<FeedView viewModel={GUEST_VIEW_MODEL} />);

    expect(screen.getByRole('link', { name: '/ feed' })).toHaveAttribute('href', '/feed');
    expect(screen.getByRole('link', { name: '플랫폼 홈으로 돌아가기' })).toHaveAttribute('href', '/');
  });

  describe('비회원', () => {
    it('소개 카드에 로그인, 회원가입 링크를 보여준다', () => {
      render(<FeedView viewModel={GUEST_VIEW_MODEL} />);

      const intro = screen.getByRole('region', { name: '가격, 방송, 신곡 알림을 한 피드에서' });

      expect(within(intro).getByRole('link', { name: '로그인' })).toHaveAttribute('href', '/login');
      expect(within(intro).getByRole('link', { name: '회원가입' })).toHaveAttribute('href', '/signup');
    });

    it('준비 중인 알림과 맞춤 피드 혜택을 카드로 보여준다', () => {
      render(<FeedView viewModel={GUEST_VIEW_MODEL} />);

      expect(within(screen.getByRole('region', { name: '준비 중인 알림' })).getAllByRole('article')).toHaveLength(2);
      expect(screen.getByText('스트리머 활동 알림')).toBeInTheDocument();
      expect(within(screen.getByRole('region', { name: '맞춤 피드' })).getAllByRole('article')).toHaveLength(1);
      expect(screen.getByText('관심 대상 저장')).toBeInTheDocument();
    });

    it('회원용 영역은 보여주지 않는다', () => {
      render(<FeedView viewModel={GUEST_VIEW_MODEL} />);

      expect(screen.queryByRole('region', { name: 'feed 요약' })).not.toBeInTheDocument();
      expect(screen.queryByRole('region', { name: '관심 대상' })).not.toBeInTheDocument();
      expect(screen.queryByRole('region', { name: '최근 알림' })).not.toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: '로그인' })).toHaveLength(2);
    });
  });

  describe('회원', () => {
    it('소개 카드에 로그인 링크를 보여주지 않고 상단바에 로그아웃을 보여준다', () => {
      render(<FeedView viewModel={MEMBER_VIEW_MODEL} />);

      expect(screen.queryByRole('link', { name: '로그인' })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: '회원가입' })).not.toBeInTheDocument();
      expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
    });

    it('요약 카드를 관찰 목록으로 이동하는 링크로 보여준다', () => {
      render(<FeedView viewModel={MEMBER_VIEW_MODEL} />);

      const summary = screen.getByRole('region', { name: 'feed 요약' });
      const links = within(summary).getAllByRole('link');

      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', '/feed/observations');
      expect(links[0]).toHaveTextContent('3관찰 중');
    });

    it('관찰 중인 대상만 관심 대상으로 최대 3개까지 보여준다', () => {
      render(<FeedView viewModel={MEMBER_VIEW_MODEL} />);

      const targets = screen.getByRole('region', { name: '관심 대상' });

      // 픽스처에서 관찰 중인 대상은 아이템과 스트리머 2개다 (아티스트는 관찰 중이 아님)
      expect(within(targets).getAllByRole('link')).toHaveLength(2);
      expect(within(targets).queryByText('artist.nova')).not.toBeInTheDocument();
    });

    it('관찰 중인 대상이 4개 이상이어도 3개까지만 보여준다', () => {
      const manyTargets = Array.from({ length: 5 }, (_, index) => ({ ...FEED_TARGETS_FIXTURE[0], id: `target-${index}`, name: `대상${index}` }));
      render(<FeedView viewModel={{ ...MEMBER_VIEW_MODEL, targets: manyTargets }} />);

      expect(within(screen.getByRole('region', { name: '관심 대상' })).getAllByRole('link')).toHaveLength(3);
    });

    it('최근 알림을 대상 상세로 이동하는 링크로 보여준다', () => {
      render(<FeedView viewModel={MEMBER_VIEW_MODEL} />);

      const activities = screen.getByRole('region', { name: '최근 알림' });
      const links = within(activities).getAllByRole('link');

      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', '/feed/targets/target-streamer');
      expect(links[0]).toHaveTextContent('방송이 시작됐어요');
    });

    it('비회원용 영역은 보여주지 않는다', () => {
      render(<FeedView viewModel={MEMBER_VIEW_MODEL} />);

      expect(screen.queryByRole('region', { name: '준비 중인 알림' })).not.toBeInTheDocument();
      expect(screen.queryByRole('region', { name: '맞춤 피드' })).not.toBeInTheDocument();
    });
  });

  it('하단 네비게이션에서 홈이 활성 상태다', () => {
    render(<FeedView viewModel={GUEST_VIEW_MODEL} />);

    expect(within(screen.getByRole('navigation')).getByRole('link', { name: '홈' })).toHaveAttribute('aria-current', 'page');
  });
});
