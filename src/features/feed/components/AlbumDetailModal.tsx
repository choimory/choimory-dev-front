'use client';

import { Icon } from '@/shared/ui/Icon';
import { IconButton } from '@/shared/ui/IconButton';
import { ListRow } from '@/shared/ui/ListRow';
import { Modal } from '@/shared/ui/Modal';

import type { FeedArtistAlbum, FeedArtistTrack } from '../model/feedTypes';

/**
 * 선택한 앨범의 정보와 트랙 목록을 보여주는 모달입니다. 트랙을 선택하면 트랙 상세로 전환합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 앨범 상세 모달
 */
export function AlbumDetailModal({ album, onClose, onSelectTrack, selectedTrack }: { album: FeedArtistAlbum; onClose: () => void; onSelectTrack: (trackId: string | null) => void; selectedTrack?: FeedArtistTrack }) {
  const isTrackView = Boolean(selectedTrack);

  return (
    <Modal labelledBy="feed-album-modal-title" onClose={onClose} overlay="dark" size="md" className="max-h-[calc(100vh-3rem)] overflow-y-auto">
      <div className="flex items-center justify-between gap-3">
        {isTrackView ? (
          <IconButton ariaLabel="앨범 정보로 돌아가기" onClick={() => onSelectTrack(null)}>
            <Icon name="chevronLeft" />
          </IconButton>
        ) : (
          <span className="size-9" />
        )}
        <IconButton ariaLabel="앨범 상세 닫기" onClick={onClose}>
          <Icon name="x" />
        </IconButton>
      </div>

      {!selectedTrack && (
        <div className="mt-3">
          <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-3">
            <span className={`cut-sm grid aspect-square place-items-center font-display text-3xl font-semibold ${album.coverToneClassName}`}>
              {album.title.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <h2 id="feed-album-modal-title" className="min-w-0 break-words font-display text-xl font-semibold leading-tight text-foreground">{album.title}</h2>
              <p className="mt-1 text-xs font-medium text-muted">album</p>
              <p className="mt-2 text-sm tabular-nums text-muted">발매일 {album.releaseDate}</p>
            </div>
          </div>
          <div className="mt-4 grid border-t border-border">
            {album.tracks.map((track) => (
              <ListRow
                key={track.id}
                className="min-h-11 active:bg-background"
                onClick={() => onSelectTrack(track.id)}
                trailing={<span className="text-xs tabular-nums text-muted">{track.duration}</span>}
              >
                <span className="min-w-0 break-words text-sm font-medium text-foreground">{track.title}</span>
              </ListRow>
            ))}
          </div>
        </div>
      )}

      {selectedTrack && (
        <div className="mt-3">
          <h2 id="feed-album-modal-title" className="min-w-0 break-words font-display text-xl font-semibold leading-tight text-foreground">{selectedTrack.title}</h2>
          <p className="mt-1 text-xs font-medium text-muted">track</p>
          <p className="mt-2 text-sm tabular-nums text-muted">재생시간 {selectedTrack.duration}</p>
          <div className="mt-5 border-y border-border py-3">
            <p className="text-sm font-semibold text-foreground">크레딧</p>
            <p className="mt-2 text-sm leading-6 text-muted">작곡 {selectedTrack.composer}</p>
            <p className="text-sm leading-6 text-muted">작사 {selectedTrack.lyricist}</p>
          </div>
          <p className="mt-4 text-base leading-6 text-ink-2">{selectedTrack.lyricsPreview}</p>
        </div>
      )}
    </Modal>
  );
}
