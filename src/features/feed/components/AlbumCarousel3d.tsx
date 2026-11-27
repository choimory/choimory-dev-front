'use client';

import { Icon } from '@/shared/ui/Icon';
import { IconButton } from '@/shared/ui/IconButton';

import type { FeedArtistAlbum } from '../model/feedTypes';

/**
 * 아티스트 앨범을 3D 캐러셀로 보여주고, 이전/다음 이동과 앨범 선택을 처리합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 앨범 캐러셀
 */
export function AlbumCarousel3d({
  activeAlbumIndex,
  albums,
  onMoveAlbum,
  onOpenAlbum,
}: {
  activeAlbumIndex: number;
  albums: FeedArtistAlbum[];
  onMoveAlbum: (direction: -1 | 1) => void;
  onOpenAlbum: (albumId: string) => void;
}) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-muted">최근 앨범</p>
        <div className="flex gap-2">
          <IconButton ariaLabel="이전 앨범" size="lg" onClick={() => onMoveAlbum(-1)}>
            <Icon name="chevronLeft" />
          </IconButton>
          <IconButton ariaLabel="다음 앨범" size="lg" onClick={() => onMoveAlbum(1)}>
            <Icon className="size-5 rotate-180" name="chevronLeft" />
          </IconButton>
        </div>
      </div>
      <div className="cut-sm relative mt-3 h-60 overflow-hidden bg-surface-strong" style={{ perspective: '900px' }}>
        {albums.map((album, index) => {
          const offset = index - activeAlbumIndex;
          const normalizedOffset = offset > albums.length / 2 ? offset - albums.length : offset < -albums.length / 2 ? offset + albums.length : offset;
          const isVisible = Math.abs(normalizedOffset) <= 1;
          const transform = `translateX(${normalizedOffset * 104}px) translateZ(${normalizedOffset === 0 ? 48 : -30}px) rotateY(${normalizedOffset * -34}deg) scale(${normalizedOffset === 0 ? 1 : 0.82})`;

          return (
            <button
              key={album.id}
              className={`cut absolute left-1/2 top-5 w-36 border border-rule-2 bg-surface p-3 text-left transition-[transform,opacity] duration-(--dur-short) hover:border-muted active:bg-background motion-reduce:transition-none ${isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
              style={{ transform: `translateX(-50%) ${transform}`, zIndex: 10 - Math.abs(normalizedOffset) }}
              type="button"
              aria-hidden={!isVisible || undefined}
              tabIndex={isVisible ? 0 : -1}
              onClick={() => onOpenAlbum(album.id)}
            >
              <span className={`cut-sm grid aspect-square place-items-center font-display text-3xl font-semibold ${album.coverToneClassName}`}>
                {album.title.slice(0, 1)}
              </span>
              <span className="mt-3 block min-w-0 break-words text-sm font-semibold leading-5 text-foreground">{album.title}</span>
              <span className="mt-1 block text-xs tabular-nums text-muted">{album.releaseDate}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
