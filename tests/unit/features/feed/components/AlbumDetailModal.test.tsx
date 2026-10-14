import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AlbumDetailModal } from '@/features/feed/components/AlbumDetailModal';

import { FEED_ALBUMS_FIXTURE } from '../../../../fixtures/feed';

const ALBUM = FEED_ALBUMS_FIXTURE[0];

/** 필요한 값만 바꿔서 모달을 렌더링한다 */
function renderModal(selectedTrack = undefined as (typeof ALBUM.tracks)[number] | undefined) {
  const onClose = vi.fn();
  const onSelectTrack = vi.fn();

  render(<AlbumDetailModal album={ALBUM} selectedTrack={selectedTrack} onClose={onClose} onSelectTrack={onSelectTrack} />);

  return { onClose, onSelectTrack };
}

/**
 * AlbumDetailModal 테스트
 * 앨범 상세 모달의 앨범 정보와 트랙 목록, 트랙 선택 시 트랙 상세(크레딧, 가사), 돌아가기, 닫기, 배경 클릭을 확인합니다.
 */
describe('AlbumDetailModal', () => {
  it('앨범 제목을 이름으로 가진 dialog와 발매일을 보여준다', () => {
    renderModal();

    expect(screen.getByRole('dialog', { name: '첫번째 앨범' })).toBeInTheDocument();
    expect(screen.getByText('발매일 2026.01.01')).toBeInTheDocument();
    expect(screen.getByText('album')).toBeInTheDocument();
  });

  it('앨범 보기에서는 트랙 목록을 시간과 함께 보여주고 돌아가기 버튼은 없다', () => {
    renderModal();

    const dialog = screen.getByRole('dialog');

    expect(within(dialog).getByRole('button', { name: /첫번째 트랙1/ })).toHaveTextContent('3:01');
    expect(within(dialog).getByRole('button', { name: /첫번째 트랙2/ })).toHaveTextContent('3:02');
    expect(within(dialog).queryByRole('button', { name: '앨범 정보로 돌아가기' })).not.toBeInTheDocument();
  });

  it('트랙을 누르면 트랙 id와 함께 onSelectTrack을 호출한다', async () => {
    const { onSelectTrack } = renderModal();

    // 두 번째 트랙을 클릭한다
    await userEvent.click(screen.getByRole('button', { name: /첫번째 트랙2/ }));

    expect(onSelectTrack).toHaveBeenCalledWith('album-1-track-2');
  });

  it('닫기 버튼으로 onClose를 호출한다', async () => {
    const { onClose } = renderModal();

    // 닫기 버튼을 클릭한다
    await userEvent.click(screen.getByRole('button', { name: '앨범 상세 닫기' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('트랙을 선택한 상태에서는 트랙 상세(재생시간, 크레딧, 가사)를 보여준다', () => {
    renderModal(ALBUM.tracks[0]);

    const dialog = screen.getByRole('dialog', { name: '첫번째 트랙1' });

    expect(within(dialog).getByText('track')).toBeInTheDocument();
    expect(within(dialog).getByText('재생시간 3:01')).toBeInTheDocument();
    expect(within(dialog).getByText('작곡 작곡가1')).toBeInTheDocument();
    expect(within(dialog).getByText('작사 작사가1')).toBeInTheDocument();
    expect(within(dialog).getByText('첫번째 트랙1 가사 미리보기')).toBeInTheDocument();
  });

  it('트랙 상세에서는 트랙 목록을 숨기고 돌아가기 버튼으로 null과 함께 onSelectTrack을 호출한다', async () => {
    const { onSelectTrack } = renderModal(ALBUM.tracks[0]);

    expect(screen.queryByText('album')).not.toBeInTheDocument();

    // 돌아가기 버튼을 클릭한다
    await userEvent.click(screen.getByRole('button', { name: '앨범 정보로 돌아가기' }));

    expect(onSelectTrack).toHaveBeenCalledWith(null);
  });

  it('배경을 누르면 onClose를 호출한다', async () => {
    const { onClose } = renderModal();

    // 배경(패널의 부모)을 클릭한다
    await userEvent.click(screen.getByRole('dialog').parentElement as HTMLElement);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
