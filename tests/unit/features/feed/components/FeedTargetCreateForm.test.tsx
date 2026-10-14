import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { FeedTargetCreateForm } from '@/features/feed/components/FeedTargetCreateForm';

describe('FeedTargetCreateForm', () => {
  it('제목과 안내 문구, 종류 탭 3종을 보여주고 아이템 탭이 기본 선택이다', () => {
    render(<FeedTargetCreateForm />);

    expect(screen.getByRole('region', { name: '관찰 대상 등록' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual(['아이템', '스트리머', '아티스트']);
    expect(screen.getByRole('tab', { name: '아이템' })).toHaveAttribute('aria-selected', 'true');
  });

  it('모든 종류에 공통 입력 항목 4개를 보여준다', async () => {
    render(<FeedTargetCreateForm />);

    for (const tabName of ['아이템', '스트리머', '아티스트']) {
      await userEvent.click(screen.getByRole('tab', { name: tabName }));

      ['대상 이름', '설명', '원본 링크', '알림 주기'].forEach((label) => expect(screen.getByLabelText(label)).toBeInTheDocument());
    }
  });

  it('아이템 탭에는 현재 가격과 목표 가격 입력만 추가로 보여준다', () => {
    render(<FeedTargetCreateForm />);

    expect(screen.getByLabelText('현재 가격')).toBeInTheDocument();
    expect(screen.getByLabelText('목표 가격')).toBeInTheDocument();
    expect(screen.getByLabelText('대상 이름')).toHaveAttribute('placeholder', '기계식 키보드');
    expect(screen.queryByLabelText('채널명')).not.toBeInTheDocument();
    expect(screen.queryByText('방송 알림')).not.toBeInTheDocument();
  });

  it('스트리머 탭에는 채널 입력과 알림 토글 2개를 추가로 보여준다', async () => {
    render(<FeedTargetCreateForm />);

    await userEvent.click(screen.getByRole('tab', { name: '스트리머' }));

    expect(screen.getByLabelText('대상 이름')).toHaveAttribute('placeholder', 'mory_live');
    expect(screen.getByLabelText('채널명')).toBeInTheDocument();
    expect(screen.getByLabelText('채널 URL')).toBeInTheDocument();
    expect(screen.getByText('방송 알림')).toBeInTheDocument();
    expect(screen.getByText('채팅/이벤트 알림')).toBeInTheDocument();
    expect(screen.queryByLabelText('현재 가격')).not.toBeInTheDocument();
  });

  it('아티스트 탭에는 최근 발매곡 입력과 알림 토글 2개를 추가로 보여준다', async () => {
    render(<FeedTargetCreateForm />);

    await userEvent.click(screen.getByRole('tab', { name: '아티스트' }));

    expect(screen.getByLabelText('대상 이름')).toHaveAttribute('placeholder', 'artist.nova');
    expect(screen.getByLabelText('최근 발매곡')).toBeInTheDocument();
    expect(screen.getByText('신곡/앨범 알림')).toBeInTheDocument();
    expect(screen.getByText('피처링/참여곡 알림')).toBeInTheDocument();
    expect(screen.queryByLabelText('채널명')).not.toBeInTheDocument();
  });

  it('처음에는 등록 버튼과 저장 안내 문구를 보여준다', () => {
    render(<FeedTargetCreateForm />);

    expect(screen.getByRole('button', { name: '등록' })).toBeInTheDocument();
    expect(screen.getByText('저장 전 mock 입력값은 목록에 추가하지 않아요.')).toBeInTheDocument();
  });

  it('등록 버튼을 누르면 "준비 완료" 상태로 바뀐다', async () => {
    render(<FeedTargetCreateForm />);

    await userEvent.click(screen.getByRole('button', { name: '등록' }));

    expect(screen.getByRole('button', { name: '준비 완료' })).toBeInTheDocument();
    expect(screen.getByText('등록 준비가 완료됐어요.')).toBeInTheDocument();
  });

  it('탭을 바꾸면 완료 상태가 초기화된다', async () => {
    render(<FeedTargetCreateForm />);

    await userEvent.click(screen.getByRole('button', { name: '등록' }));
    await userEvent.click(screen.getByRole('tab', { name: '스트리머' }));

    expect(screen.getByRole('button', { name: '등록' })).toBeInTheDocument();
    expect(screen.queryByText('등록 준비가 완료됐어요.')).not.toBeInTheDocument();
  });
});
