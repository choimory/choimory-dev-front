import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FeedTargetDetailView } from '@/features/feed/components/FeedTargetDetailView';

import { FEED_ARTIST_TARGET_FIXTURE, FEED_ITEM_TARGET_FIXTURE, FEED_STREAMER_TARGET_FIXTURE } from '../../../../fixtures/feed';

describe('FeedTargetDetailView', () => {
  it.each([
    [FEED_ITEM_TARGET_FIXTURE, '아이템', '기계식 키보드', '목표가 아래로 내려가면 알려드려요.'],
    [FEED_STREAMER_TARGET_FIXTURE, '스트리머', 'mory_live', '방송 시작과 이벤트를 알려드려요.'],
    [FEED_ARTIST_TARGET_FIXTURE, '아티스트', 'artist.nova', '신곡 발매를 알려드려요.'],
  ])('%#번째 종류의 헤더에 종류 라벨, 이름, 요약을 보여준다', (target, typeLabel, name, summary) => {
    render(<FeedTargetDetailView isLoggedIn target={target} />);

    const header = screen.getByRole('region', { name });

    expect(within(header).getByText(typeLabel)).toBeInTheDocument();
    expect(within(header).getByRole('heading', { level: 1, name })).toBeInTheDocument();
    expect(within(header).getByText(summary)).toBeInTheDocument();
  });

  it('상태, 지표, 추이 요약 카드를 보여준다', () => {
    render(<FeedTargetDetailView isLoggedIn target={FEED_ITEM_TARGET_FIXTURE} />);

    const summary = screen.getByLabelText('target 요약');

    expect(within(summary).getByText('가격 하락 중')).toBeInTheDocument();
    expect(within(summary).getByText('-8%')).toBeInTheDocument();
    expect(within(summary).getByText('지난주 대비 하락')).toBeInTheDocument();
  });

  it('아이템이면 아이템 상세 섹션만 보여준다', () => {
    render(<FeedTargetDetailView isLoggedIn target={FEED_ITEM_TARGET_FIXTURE} />);

    expect(screen.getByRole('region', { name: '가격 관찰' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: '방송 관찰' })).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: '신곡 관찰' })).not.toBeInTheDocument();
  });

  it('스트리머이면 스트리머 상세 섹션만 보여준다', () => {
    render(<FeedTargetDetailView isLoggedIn target={FEED_STREAMER_TARGET_FIXTURE} />);

    expect(screen.getByRole('region', { name: '방송 관찰' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: '가격 관찰' })).not.toBeInTheDocument();
  });

  it('아티스트이면 아티스트 상세 섹션만 보여준다', () => {
    render(<FeedTargetDetailView isLoggedIn target={FEED_ARTIST_TARGET_FIXTURE} />);

    expect(screen.getByRole('region', { name: '신곡 관찰' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: '가격 관찰' })).not.toBeInTheDocument();
  });

  it('상세 데이터가 없는 대상은 종류별 섹션 없이 공통 영역만 보여준다', () => {
    render(<FeedTargetDetailView isLoggedIn target={{ ...FEED_ITEM_TARGET_FIXTURE, itemDetail: undefined }} />);

    expect(screen.queryByRole('region', { name: '가격 관찰' })).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: '최근 알림' })).toBeInTheDocument();
  });

  it('최근 알림 목록을 보여준다', () => {
    render(<FeedTargetDetailView isLoggedIn target={FEED_ITEM_TARGET_FIXTURE} />);

    expect(within(screen.getByRole('region', { name: '최근 알림' })).getByText('목표가에 근접했어요')).toBeInTheDocument();
  });

  it('관련 소식을 새 탭에서 여는 외부 링크로 보여준다', () => {
    render(<FeedTargetDetailView isLoggedIn target={FEED_ITEM_TARGET_FIXTURE} />);

    const link = within(screen.getByRole('region', { name: '관련 소식' })).getByRole('link', { name: /키보드 가격 동향/ });

    expect(link).toHaveAttribute('href', 'https://example.com/a1');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveTextContent('커뮤니티 · 1시간 전');
  });

  it('관련 소식이 없으면 안내 문구만 보여준다', () => {
    render(<FeedTargetDetailView isLoggedIn target={FEED_STREAMER_TARGET_FIXTURE} />);

    const related = screen.getByRole('region', { name: '관련 소식' });

    expect(related).toHaveTextContent('크롤링 연동 전까지');
    expect(within(related).queryByRole('link')).not.toBeInTheDocument();
  });

  it('관찰 목록으로 돌아가는 링크를 보여주고 관찰 탭이 활성 상태다', () => {
    render(<FeedTargetDetailView isLoggedIn target={FEED_ITEM_TARGET_FIXTURE} />);

    expect(screen.getByRole('link', { name: '관찰 목록으로 돌아가기' })).toHaveAttribute('href', '/feed/observations');
    expect(screen.getByRole('link', { name: '관찰' })).toHaveAttribute('aria-current', 'page');
  });

  it('로그인 여부에 따라 상단바 링크가 달라진다', () => {
    const { rerender } = render(<FeedTargetDetailView isLoggedIn={false} target={FEED_ITEM_TARGET_FIXTURE} />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    rerender(<FeedTargetDetailView isLoggedIn target={FEED_ITEM_TARGET_FIXTURE} />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });
});
