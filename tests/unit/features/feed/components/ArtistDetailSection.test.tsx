import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ArtistDetailSection } from '@/features/feed/components/ArtistDetailSection';

import { FEED_ARTIST_TARGET_FIXTURE, FEED_ITEM_TARGET_FIXTURE } from '../../../../fixtures/feed';

/**
 * ArtistDetailSection 테스트
 * 아티스트 상세의 신곡 요약, 앨범 캐러셀, 앨범과 트랙 상세 모달(열기, 트랙 선택, 돌아가기, 닫기), 캐러셀 순환 이동을 확인합니다.
 */
describe('ArtistDetailSection', () => {
  it('아티스트 상세 데이터가 없으면 아무것도 렌더링하지 않는다', () => {
    const { container } = render(<ArtistDetailSection target={FEED_ITEM_TARGET_FIXTURE} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('신곡 관찰 영역에 최근 신곡, 예정 발매, 발매 추이를 보여준다', () => {
    render(<ArtistDetailSection target={FEED_ARTIST_TARGET_FIXTURE} />);

    const summary = screen.getByRole('region', { name: '신곡 관찰' });

    expect(within(summary).getByText('최신곡')).toBeInTheDocument();
    expect(within(summary).getByText('다음 달 발매 예정')).toBeInTheDocument();
    expect(within(summary).getByText('분기마다 발매')).toBeInTheDocument();
  });

  it('최근 앨범 영역에 앨범 캐러셀을 보여주고 처음에는 모달이 없다', () => {
    render(<ArtistDetailSection target={FEED_ARTIST_TARGET_FIXTURE} />);

    expect(within(screen.getByRole('region', { name: '최근 앨범' })).getByRole('button', { name: /첫번째 앨범/ })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('앨범을 누르면 앨범 상세 모달이 열리고 닫기 버튼으로 닫힌다', async () => {
    render(<ArtistDetailSection target={FEED_ARTIST_TARGET_FIXTURE} />);

    // 두 번째 앨범을 클릭해 모달을 연다
    await userEvent.click(screen.getByRole('button', { name: /두번째 앨범/ }));

    const dialog = screen.getByRole('dialog', { name: '두번째 앨범' });

    expect(within(dialog).getByText('발매일 2026.02.01')).toBeInTheDocument();

    // 닫기 버튼을 누르면 모달이 닫힌다
    await userEvent.click(within(dialog).getByRole('button', { name: '앨범 상세 닫기' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('트랙을 누르면 트랙 상세로 바뀌고 돌아가기 버튼으로 앨범 정보로 돌아온다', async () => {
    render(<ArtistDetailSection target={FEED_ARTIST_TARGET_FIXTURE} />);

    // 첫 번째 앨범을 열고
    await userEvent.click(screen.getByRole('button', { name: /첫번째 앨범/ }));
    // 트랙을 클릭하면 트랙 상세로 바뀐다
    await userEvent.click(screen.getByRole('button', { name: /첫번째 트랙2/ }));

    expect(screen.getByRole('dialog', { name: '첫번째 트랙2' })).toBeInTheDocument();
    expect(screen.getByText('작곡 작곡가2')).toBeInTheDocument();

    // 돌아가기 버튼으로 앨범 정보로 돌아온다
    await userEvent.click(screen.getByRole('button', { name: '앨범 정보로 돌아가기' }));

    expect(screen.getByRole('dialog', { name: '첫번째 앨범' })).toBeInTheDocument();
  });

  it('모달을 닫았다가 다른 앨범을 열면 트랙 선택 상태가 초기화된다', async () => {
    render(<ArtistDetailSection target={FEED_ARTIST_TARGET_FIXTURE} />);

    // 첫 번째 앨범을 열어 트랙을 선택한 뒤 닫고
    await userEvent.click(screen.getByRole('button', { name: /첫번째 앨범/ }));
    await userEvent.click(screen.getByRole('button', { name: /첫번째 트랙1/ }));
    await userEvent.click(screen.getByRole('button', { name: '앨범 상세 닫기' }));
    // 다른 앨범(두 번째)을 열면 트랙 선택이 초기화된다
    await userEvent.click(screen.getByRole('button', { name: /두번째 앨범/ }));

    expect(screen.getByRole('dialog', { name: '두번째 앨범' })).toBeInTheDocument();
  });

  it('앨범 캐러셀의 이전, 다음 버튼은 앨범 목록을 순환해서 이동한다', async () => {
    render(<ArtistDetailSection target={FEED_ARTIST_TARGET_FIXTURE} />);

    const getZIndex = (name: RegExp) => screen.getByRole('button', { name }).style.zIndex;

    expect(getZIndex(/첫번째 앨범/)).toBe('10');

    // 다음 버튼을 누르면 두 번째 앨범이 가운데로 온다
    await userEvent.click(screen.getByRole('button', { name: '다음 앨범' }));
    expect(getZIndex(/두번째 앨범/)).toBe('10');

    // 이전 버튼을 두 번 누르면 목록 끝(세 번째 앨범)으로 순환한다
    await userEvent.click(screen.getByRole('button', { name: '이전 앨범' }));
    await userEvent.click(screen.getByRole('button', { name: '이전 앨범' }));
    expect(getZIndex(/세번째 앨범/)).toBe('10');
  });
});
