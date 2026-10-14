import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AlbumCarousel3d } from '@/features/feed/components/AlbumCarousel3d';

import { FEED_ALBUMS_FIXTURE } from '../../../../fixtures/feed';

/** 필요한 값만 바꿔서 캐러셀을 렌더링한다 */
function renderCarousel(activeAlbumIndex = 0) {
  const onMoveAlbum = vi.fn();
  const onOpenAlbum = vi.fn();

  render(<AlbumCarousel3d activeAlbumIndex={activeAlbumIndex} albums={FEED_ALBUMS_FIXTURE} onMoveAlbum={onMoveAlbum} onOpenAlbum={onOpenAlbum} />);

  return { onMoveAlbum, onOpenAlbum };
}

describe('AlbumCarousel3d', () => {
  it('"최근 앨범" 제목과 이전, 다음 버튼을 보여준다', () => {
    renderCarousel();

    expect(screen.getByText('최근 앨범')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '이전 앨범' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음 앨범' })).toBeInTheDocument();
  });

  it('앨범마다 제목과 발매일이 있는 버튼을 만든다', () => {
    renderCarousel();

    expect(screen.getByRole('button', { name: /첫번째 앨범/ })).toHaveTextContent('2026.01.01');
    expect(screen.getByRole('button', { name: /두번째 앨범/ })).toHaveTextContent('2026.02.01');
    expect(screen.getByRole('button', { name: /세번째 앨범/ })).toHaveTextContent('2026.03.01');
  });

  it('이전, 다음 버튼은 방향과 함께 onMoveAlbum을 호출한다', async () => {
    const { onMoveAlbum } = renderCarousel();

    await userEvent.click(screen.getByRole('button', { name: '이전 앨범' }));
    expect(onMoveAlbum).toHaveBeenLastCalledWith(-1);

    await userEvent.click(screen.getByRole('button', { name: '다음 앨범' }));
    expect(onMoveAlbum).toHaveBeenLastCalledWith(1);
  });

  it('앨범을 누르면 앨범 id와 함께 onOpenAlbum을 호출한다', async () => {
    const { onOpenAlbum } = renderCarousel();

    await userEvent.click(screen.getByRole('button', { name: /두번째 앨범/ }));

    expect(onOpenAlbum).toHaveBeenCalledWith('album-2');
  });

  it('활성 앨범과 양옆 앨범만 보이고 나머지는 숨긴다', () => {
    renderCarousel(0);

    // 3개 앨범 순환: 0번 활성 → 1번(다음), 2번(이전) 모두 양옆이라 전부 보인다
    FEED_ALBUMS_FIXTURE.forEach((album) => {
      expect(screen.getByRole('button', { name: new RegExp(album.title) })).toHaveClass('opacity-100');
    });
  });

  it('가운데 앨범은 앞으로 나오고 양옆 앨범은 작아진다', () => {
    renderCarousel(1);

    expect(screen.getByRole('button', { name: /두번째 앨범/ })).toHaveStyle({ zIndex: '10' });
    expect(screen.getByRole('button', { name: /첫번째 앨범/ })).toHaveStyle({ zIndex: '9' });
  });
});
