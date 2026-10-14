import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StreamerDetailSection } from '@/features/feed/components/StreamerDetailSection';

import { FEED_ITEM_TARGET_FIXTURE, FEED_STREAMER_TARGET_FIXTURE } from '../../../../fixtures/feed';

/**
 * StreamerDetailSection 테스트
 * 스트리머 상세의 방송 상태(LIVE, 대기), 이벤트 지표와 추이 문구, 원본 채널 링크, 방송 기록 그래프, 채팅 기록, 최근 방송과 이벤트 목록을 확인합니다.
 */
describe('StreamerDetailSection', () => {
  it('스트리머 상세 데이터가 없으면 아무것도 렌더링하지 않는다', () => {
    const { container } = render(<StreamerDetailSection target={FEED_ITEM_TARGET_FIXTURE} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('방송 관찰 영역에 방송 상태, 이벤트 지표, 추이 문구를 보여준다', () => {
    render(<StreamerDetailSection target={FEED_STREAMER_TARGET_FIXTURE} />);

    const summary = screen.getByRole('region', { name: '방송 관찰' });

    expect(within(summary).getByText('LIVE')).toBeInTheDocument();
    expect(within(summary).getByText('이벤트 3건')).toBeInTheDocument();
    expect(within(summary).getByText('이번 주 방송 5회')).toBeInTheDocument();
    expect(within(summary).getByText('이번 주 이벤트 3건')).toBeInTheDocument();
  });

  it('방송 중이 아니면 방송 상태를 "대기"로 보여준다', () => {
    const offlineTarget = {
      ...FEED_STREAMER_TARGET_FIXTURE,
      streamerDetail: { ...FEED_STREAMER_TARGET_FIXTURE.streamerDetail!, broadcastStatus: 'offline' as const },
    };
    render(<StreamerDetailSection target={offlineTarget} />);

    expect(screen.getByText('대기')).toBeInTheDocument();
    expect(screen.queryByText('LIVE')).not.toBeInTheDocument();
  });

  it('원본 채널을 새 탭에서 여는 외부 링크로 보여준다', () => {
    render(<StreamerDetailSection target={FEED_STREAMER_TARGET_FIXTURE} />);

    const link = screen.getByRole('link', { name: 'mory_live 채널' });

    expect(link).toHaveAttribute('href', 'https://example.com/channels/mory');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('방송 기록 그래프를 보여준다', () => {
    render(<StreamerDetailSection target={FEED_STREAMER_TARGET_FIXTURE} />);

    expect(screen.getByRole('region', { name: '방송 기록' })).toBeInTheDocument();
  });

  it('채팅 기록에 채널명, 시간, 메시지를 보여준다', () => {
    render(<StreamerDetailSection target={FEED_STREAMER_TARGET_FIXTURE} />);

    const chat = screen.getByRole('region', { name: '채팅 기록' });

    expect(within(chat).getByText('mory_live 채널 에서')).toBeInTheDocument();
    expect(within(chat).getByText('방금')).toBeInTheDocument();
    expect(within(chat).getByText('안녕하세요!')).toBeInTheDocument();
  });

  it('최근 방송/이벤트 목록을 보여준다', () => {
    render(<StreamerDetailSection target={FEED_STREAMER_TARGET_FIXTURE} />);

    const events = screen.getByRole('region', { name: '최근 방송/이벤트' });

    expect(within(events).getByText('신규 구독 이벤트')).toBeInTheDocument();
    expect(within(events).getByText('채팅 이벤트')).toBeInTheDocument();
  });
});
