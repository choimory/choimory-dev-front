import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { MyFeedManageSection } from '@/features/feed/components/MyFeedManageSection';

import { FEED_TARGETS_FIXTURE, FEED_VIEW_MODEL_FIXTURE } from '../../../../fixtures/feed';

/**
 * MyFeedManageSection 테스트
 * 내 피드 관리의 프로필, 요약 카운팅, 설정 링크 목록, 관찰 대상 등록 모달(열기, 닫기 버튼, 배경 클릭)을 확인합니다.
 */
describe('MyFeedManageSection', () => {
  it('페이지 소개와 프로필 카드를 보여준다', () => {
    render(<MyFeedManageSection summaries={FEED_VIEW_MODEL_FIXTURE.summaries} targets={FEED_TARGETS_FIXTURE} />);

    expect(screen.getByText('/ feed / me')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'mory.dev' })).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
  });

  it('내 피드 요약에 카운팅 카드를 보여준다', () => {
    render(<MyFeedManageSection summaries={FEED_VIEW_MODEL_FIXTURE.summaries} targets={FEED_TARGETS_FIXTURE} />);

    const cards = within(screen.getByLabelText('내 피드 요약')).getAllByRole('article');

    expect(cards.map((card) => card.textContent)).toEqual(['3관찰 중', '5오늘 알림']);
  });

  it('"내 알림 설정" 영역에 대상별 설정 링크를 보여준다', () => {
    render(<MyFeedManageSection summaries={[]} targets={FEED_TARGETS_FIXTURE} />);

    const section = screen.getByRole('region', { name: '내 알림 설정' });
    const links = within(section).getAllByRole('link');

    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute('href', '/feed/me/targets/target-item');
    links.forEach((link) => expect(link).toHaveTextContent('설정'));
  });

  it('처음에는 관찰 대상 등록 모달이 열려 있지 않다', () => {
    render(<MyFeedManageSection summaries={[]} targets={[]} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('관찰 대상 추가 행을 누르면 등록 폼이 담긴 모달이 열린다', async () => {
    render(<MyFeedManageSection summaries={[]} targets={[]} />);

    // 관찰 대상 추가 행을 클릭해 모달을 연다
    await userEvent.click(screen.getByRole('button', { name: '관찰할 아이템, 스트리머, 아티스트를 등록하세요' }));

    const dialog = screen.getByRole('dialog', { name: '관찰 대상 등록' });

    expect(within(dialog).getByRole('tablist', { name: '관찰 대상 등록 종류' })).toBeInTheDocument();
    expect(within(dialog).getByLabelText('대상 이름')).toBeInTheDocument();
  });

  it('모달의 닫기 버튼으로 모달이 닫힌다', async () => {
    render(<MyFeedManageSection summaries={[]} targets={[]} />);

    // 관찰 대상 추가 행을 클릭해 모달을 연 뒤
    await userEvent.click(screen.getByRole('button', { name: '관찰할 아이템, 스트리머, 아티스트를 등록하세요' }));
    // 닫기 버튼을 누르면 모달이 닫힌다
    await userEvent.click(screen.getByRole('button', { name: '관찰 대상 등록 닫기' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('모달 배경을 누르면 모달이 닫힌다', async () => {
    render(<MyFeedManageSection summaries={[]} targets={[]} />);

    // 관찰 대상 추가 행을 클릭해 모달을 연 뒤
    await userEvent.click(screen.getByRole('button', { name: '관찰할 아이템, 스트리머, 아티스트를 등록하세요' }));
    // 배경(패널의 부모)을 누르면 모달이 닫힌다
    await userEvent.click(screen.getByRole('dialog').parentElement as HTMLElement);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
