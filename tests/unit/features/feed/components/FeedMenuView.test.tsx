import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FeedMenuView } from '@/features/feed/components/FeedMenuView';
import type { FeedViewModel } from '@/features/feed/model/feedTypes';

import { FEED_ARTIST_TARGET_FIXTURE, FEED_ITEM_TARGET_FIXTURE, FEED_STREAMER_TARGET_FIXTURE, FEED_VIEW_MODEL_FIXTURE } from '../../../../fixtures/feed';

const VIEW_MODEL: FeedViewModel = { ...FEED_VIEW_MODEL_FIXTURE, authStatus: 'guest' };

describe('FeedMenuView', () => {
  describe('popular 메뉴', () => {
    it('"실시간 순위" 소개와 랭킹, 최근 이벤트 섹션을 보여준다', () => {
      render(<FeedMenuView menuKind="popular" viewModel={VIEW_MODEL} />);

      expect(screen.getByRole('heading', { level: 1, name: '실시간 순위' })).toBeInTheDocument();
      expect(screen.getByRole('region', { name: '실시간 관찰 대상 랭킹' })).toBeInTheDocument();
      expect(screen.getByRole('region', { name: '최근 이벤트' })).toBeInTheDocument();
    });

    it('대상을 입력 순서와 상관없이 순위 순으로 정렬해서 보여준다', () => {
      const shuffled = [FEED_ARTIST_TARGET_FIXTURE, FEED_ITEM_TARGET_FIXTURE, FEED_STREAMER_TARGET_FIXTURE];
      render(<FeedMenuView menuKind="popular" viewModel={{ ...VIEW_MODEL, targets: shuffled }} />);

      const ranking = screen.getByRole('region', { name: '실시간 관찰 대상 랭킹' });
      const names = within(ranking).getAllByRole('link').map((link) => link.textContent);

      expect(names[0]).toContain('기계식 키보드');
      expect(names[1]).toContain('mory_live');
      expect(names[2]).toContain('artist.nova');
    });
  });

  describe('observations 메뉴', () => {
    it('"관찰" 소개와 관찰 대상 섹션을 보여준다', () => {
      render(<FeedMenuView menuKind="observations" viewModel={VIEW_MODEL} />);

      expect(screen.getByRole('heading', { level: 1, name: '관찰' })).toBeInTheDocument();
      expect(screen.getByRole('region', { name: '관찰 중인 대상' })).toBeInTheDocument();
      expect(screen.queryByRole('region', { name: '실시간 관찰 대상 랭킹' })).not.toBeInTheDocument();
    });

    it('관찰 중인 대상만 보여준다', () => {
      render(<FeedMenuView menuKind="observations" viewModel={VIEW_MODEL} />);

      const section = screen.getByRole('region', { name: '관찰 중인 대상' });

      expect(within(section).getAllByRole('link')).toHaveLength(2);
      expect(within(section).queryByText('artist.nova')).not.toBeInTheDocument();
    });
  });

  describe('me 메뉴', () => {
    it('페이지 소개 카드 대신 내 피드 관리 섹션을 보여준다', () => {
      render(<FeedMenuView menuKind="me" viewModel={VIEW_MODEL} />);

      expect(screen.queryByRole('heading', { name: '내 피드' })).not.toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1, name: 'mory.dev' })).toBeInTheDocument();
      expect(screen.getByRole('region', { name: '내 알림 설정' })).toBeInTheDocument();
    });

    it('내가 관리하는 대상만 설정 링크로 보여준다', () => {
      render(<FeedMenuView menuKind="me" viewModel={VIEW_MODEL} />);

      const section = screen.getByRole('region', { name: '내 알림 설정' });

      // 픽스처에서 내 대상은 아이템 1개다
      expect(within(section).getAllByRole('link')).toHaveLength(1);
      expect(within(section).getByRole('link')).toHaveAttribute('href', '/feed/me/targets/target-item');
    });

    it('내 피드 요약 카운팅을 보여준다', () => {
      render(<FeedMenuView menuKind="me" viewModel={VIEW_MODEL} />);

      expect(within(screen.getByLabelText('내 피드 요약')).getAllByRole('article')).toHaveLength(2);
    });
  });

  it('메뉴 종류에 맞는 하단 네비게이션 항목만 활성 상태다', () => {
    const { rerender } = render(<FeedMenuView menuKind="popular" viewModel={VIEW_MODEL} />);

    const nav = () => within(screen.getByRole('navigation'));

    expect(nav().getByRole('link', { name: '인기' })).toHaveAttribute('aria-current', 'page');
    expect(nav().getByRole('link', { name: '관찰' })).not.toHaveAttribute('aria-current');

    rerender(<FeedMenuView menuKind="observations" viewModel={VIEW_MODEL} />);
    expect(nav().getByRole('link', { name: '관찰' })).toHaveAttribute('aria-current', 'page');

    rerender(<FeedMenuView menuKind="me" viewModel={VIEW_MODEL} />);
    expect(nav().getByRole('link', { name: '내 피드' })).toHaveAttribute('aria-current', 'page');
  });

  it('인증 상태에 따라 상단바 링크가 달라지고 feed 홈으로 돌아가는 링크를 보여준다', () => {
    const { rerender } = render(<FeedMenuView menuKind="popular" viewModel={VIEW_MODEL} />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'feed 홈으로 돌아가기' })).toHaveAttribute('href', '/feed');

    rerender(<FeedMenuView menuKind="popular" viewModel={{ ...VIEW_MODEL, authStatus: 'member' }} />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });
});
