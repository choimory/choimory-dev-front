'use client';

import { Icon } from '@/shared/ui/Icon';
import { IconButton } from '@/shared/ui/IconButton';
import { Modal } from '@/shared/ui/Modal';

import type { FeedArtistAlbum, FeedArtistTrack } from '../model/feedTypes';

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
            <span className={`grid aspect-square place-items-center rounded-2xl text-3xl font-black ${album.coverToneClassName}`}>
              {album.title.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-primary">album</p>
              <h2 id="feed-album-modal-title" className="mt-1 text-xl font-black leading-tight text-foreground">{album.title}</h2>
              <p className="mt-2 text-sm text-muted">발매일 {album.releaseDate}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            {album.tracks.map((track) => (
              <button key={track.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-surface-strong px-3 py-2 text-left" type="button" onClick={() => onSelectTrack(track.id)}>
                <span className="truncate text-sm font-bold text-foreground">{track.title}</span>
                <span className="text-xs text-muted">{track.duration}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedTrack && (
        <div className="mt-3">
          <p className="text-xs font-bold text-primary">track</p>
          <h2 id="feed-album-modal-title" className="mt-1 text-xl font-black leading-tight text-foreground">{selectedTrack.title}</h2>
          <p className="mt-2 text-sm text-muted">재생시간 {selectedTrack.duration}</p>
          <div className="mt-4 rounded-2xl bg-surface-strong p-3">
            <p className="text-sm font-bold text-foreground">크레딧</p>
            <p className="mt-2 text-sm leading-6 text-muted">작곡 {selectedTrack.composer}</p>
            <p className="text-sm leading-6 text-muted">작사 {selectedTrack.lyricist}</p>
          </div>
          <p className="mt-4 rounded-2xl bg-surface-strong p-3 text-sm leading-6 text-muted">{selectedTrack.lyricsPreview}</p>
        </div>
      )}
    </Modal>
  );
}
