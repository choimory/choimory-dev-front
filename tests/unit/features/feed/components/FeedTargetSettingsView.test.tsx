import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { FeedTargetSettingsView } from '@/features/feed/components/FeedTargetSettingsView';

import { FEED_ARTIST_TARGET_FIXTURE, FEED_ITEM_TARGET_FIXTURE, FEED_STREAMER_TARGET_FIXTURE } from '../../../../fixtures/feed';

/** 토글 버튼의 스위치(장식 요소)가 켜진 상태인지 확인한다 */
function isToggleOn(label: RegExp) {
  const button = screen.getByRole('button', { name: label });

  return button.querySelector('[aria-hidden="true"]')?.classList.contains('justify-end') ?? false;
}

describe('FeedTargetSettingsView', () => {
  it('설정 헤더에 종류 라벨, 대상 이름, 안내 문구를 보여준다', () => {
    render(<FeedTargetSettingsView isLoggedIn target={FEED_ITEM_TARGET_FIXTURE} />);

    const header = screen.getByRole('region', { name: '기계식 키보드' });

    expect(within(header).getByText('아이템')).toBeInTheDocument();
    expect(within(header).getByText('feed / settings')).toBeInTheDocument();
    expect(within(header).getByText('내가 어떻게 알림을 받을지 조정해보세요.')).toBeInTheDocument();
  });

  it('관찰 상태 토글은 대상의 관찰 여부로 시작하고 누르면 바뀐다', async () => {
    const { unmount } = render(<FeedTargetSettingsView isLoggedIn target={FEED_ITEM_TARGET_FIXTURE} />);

    expect(isToggleOn(/관찰 상태/)).toBe(true);

    await userEvent.click(screen.getByRole('button', { name: /관찰 상태/ }));

    expect(isToggleOn(/관찰 상태/)).toBe(false);

    unmount();
    render(<FeedTargetSettingsView isLoggedIn target={FEED_ARTIST_TARGET_FIXTURE} />);

    expect(isToggleOn(/관찰 상태/)).toBe(false);
  });

  it('알림 주기는 "즉시"가 기본 선택이고 다른 주기를 고를 수 있다', async () => {
    render(<FeedTargetSettingsView isLoggedIn target={FEED_ITEM_TARGET_FIXTURE} />);

    expect(screen.getByRole('button', { name: '즉시' })).toHaveClass('bg-primary');

    await userEvent.click(screen.getByRole('button', { name: '주간 요약' }));

    expect(screen.getByRole('button', { name: '주간 요약' })).toHaveClass('bg-primary');
    expect(screen.getByRole('button', { name: '즉시' })).not.toHaveClass('bg-primary');
  });

  it('아이템 대상이면 가격 알림 토글과 목표 가격 입력을 보여준다', () => {
    render(<FeedTargetSettingsView isLoggedIn target={FEED_ITEM_TARGET_FIXTURE} />);

    const section = screen.getByRole('region', { name: '아이템 알림 설정' });

    expect(within(section).getByRole('button', { name: /가격 알림/ })).toBeInTheDocument();
    expect(within(section).getByLabelText('목표 가격')).toHaveValue('90,000원');
    expect(screen.queryByRole('region', { name: '스트리머 알림 설정' })).not.toBeInTheDocument();
  });

  it('목표 가격을 수정할 수 있다', async () => {
    render(<FeedTargetSettingsView isLoggedIn target={FEED_ITEM_TARGET_FIXTURE} />);

    const input = screen.getByLabelText('목표 가격');
    await userEvent.clear(input);
    await userEvent.type(input, '85,000원');

    expect(input).toHaveValue('85,000원');
  });

  it('스트리머 대상이면 방송 알림과 채팅/이벤트 알림 토글을 보여주고 서로 독립적이다', async () => {
    render(<FeedTargetSettingsView isLoggedIn target={FEED_STREAMER_TARGET_FIXTURE} />);

    const section = screen.getByRole('region', { name: '스트리머 알림 설정' });

    expect(within(section).getByRole('button', { name: /방송 알림/ })).toBeInTheDocument();
    expect(within(section).getByRole('button', { name: /채팅\/이벤트 알림/ })).toBeInTheDocument();

    await userEvent.click(within(section).getByRole('button', { name: /방송 알림/ }));

    expect(isToggleOn(/방송 알림/)).toBe(false);
    expect(isToggleOn(/채팅\/이벤트 알림/)).toBe(true);
  });

  it('아티스트 대상이면 신곡/앨범 알림과 피처링/참여곡 알림 토글을 보여준다', () => {
    render(<FeedTargetSettingsView isLoggedIn target={FEED_ARTIST_TARGET_FIXTURE} />);

    const section = screen.getByRole('region', { name: '아티스트 알림 설정' });

    expect(within(section).getByRole('button', { name: /신곡\/앨범 알림/ })).toBeInTheDocument();
    expect(within(section).getByRole('button', { name: /피처링\/참여곡 알림/ })).toBeInTheDocument();
  });

  it('저장 전에는 안내 문구와 "저장" 버튼을 보여주고, 누르면 저장 완료 상태가 된다', async () => {
    render(<FeedTargetSettingsView isLoggedIn target={FEED_ITEM_TARGET_FIXTURE} />);

    const section = screen.getByRole('region', { name: '설정 저장' });

    expect(within(section).getByText('변경한 알림 조건을 저장해요.')).toBeInTheDocument();

    await userEvent.click(within(section).getByRole('button', { name: '저장' }));

    expect(within(section).getByRole('button', { name: '저장 완료' })).toBeInTheDocument();
    expect(within(section).getByText('mock 설정이 저장됐어요.')).toBeInTheDocument();
  });

  it('저장한 뒤 설정을 바꾸면 저장 완료 상태가 해제된다', async () => {
    render(<FeedTargetSettingsView isLoggedIn target={FEED_ITEM_TARGET_FIXTURE} />);

    await userEvent.click(screen.getByRole('button', { name: '저장' }));
    await userEvent.click(screen.getByRole('button', { name: '하루 요약' }));

    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
    expect(screen.queryByText('mock 설정이 저장됐어요.')).not.toBeInTheDocument();
  });

  it('취소 링크는 내 피드로 이동한다', () => {
    render(<FeedTargetSettingsView isLoggedIn target={FEED_ITEM_TARGET_FIXTURE} />);

    expect(within(screen.getByRole('region', { name: '설정 저장' })).getByRole('link', { name: '취소' })).toHaveAttribute('href', '/feed/me');
  });

  it('위험 작업 영역에 삭제 버튼과 안내를 보여준다', () => {
    render(<FeedTargetSettingsView isLoggedIn target={FEED_ITEM_TARGET_FIXTURE} />);

    const danger = screen.getByRole('region', { name: '위험 작업' });

    expect(within(danger).getByRole('button', { name: '삭제' })).toBeInTheDocument();
    expect(within(danger).getByText(/실제 삭제는 진행하지 않아요/)).toBeInTheDocument();
  });

  it('내 피드로 돌아가는 링크를 보여주고 내 피드 탭이 활성 상태다', () => {
    render(<FeedTargetSettingsView isLoggedIn target={FEED_ITEM_TARGET_FIXTURE} />);

    expect(screen.getByRole('link', { name: '내 피드로 돌아가기' })).toHaveAttribute('href', '/feed/me');
    expect(screen.getByRole('link', { name: '내 피드' })).toHaveAttribute('aria-current', 'page');
  });

  it('로그인 여부에 따라 상단바 링크가 달라진다', () => {
    const { rerender } = render(<FeedTargetSettingsView isLoggedIn={false} target={FEED_ITEM_TARGET_FIXTURE} />);

    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument();

    rerender(<FeedTargetSettingsView isLoggedIn target={FEED_ITEM_TARGET_FIXTURE} />);

    expect(screen.getByRole('link', { name: '로그아웃' })).toBeInTheDocument();
  });
});
