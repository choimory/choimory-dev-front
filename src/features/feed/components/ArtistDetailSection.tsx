'use client';

import { useState } from 'react';

import { Card } from '@/shared/ui/Card';
import { StatCard } from '@/shared/ui/StatCard';

import { AlbumCarousel3d } from './AlbumCarousel3d';
import { AlbumDetailModal } from './AlbumDetailModal';
import type { FeedWatchTarget } from '../model/feedTypes';

/**
 * 아티스트 관찰 대상의 상세 정보(앨범 캐러셀, 앨범/트랙 상세 모달)를 보여줍니다. 아티스트 상세 데이터가 없으면 아무것도 표시하지 않습니다.
 *
 * @param props 컴포넌트 Props
 * @returns 아티스트 상세 섹션
 */
export function ArtistDetailSection({ target }: { target: FeedWatchTarget }) {
  const detail = target.artistDetail;
  const [activeAlbumIndex, setActiveAlbumIndex] = useState(0);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  if (!detail) {
    return null;
  }
  const selectedAlbum = detail.albums.find((album) => album.id === selectedAlbumId);
  const selectedTrack = selectedAlbum?.tracks.find((track) => track.id === selectedTrackId);
  const handleMoveAlbum = (direction: -1 | 1) => {
    setActiveAlbumIndex((current) => (current + direction + detail.albums.length) % detail.albums.length);
  };

  return (
    <>
      <Card as="section" aria-labelledby="feed-artist-summary-title">
        <h2 id="feed-artist-summary-title" className="text-base font-bold text-foreground">신곡 관찰</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <StatCard size="sm" label="최근 신곡" value={detail.latestReleaseTitle} />
          <StatCard size="sm" label="예정 발매" value={detail.upcomingReleaseText} />
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">{detail.releaseTrendText}</p>
      </Card>

      <Card as="section" aria-labelledby="feed-artist-album-title">
        <h2 id="feed-artist-album-title" className="text-base font-bold text-foreground">최근 앨범</h2>
        <AlbumCarousel3d
          activeAlbumIndex={activeAlbumIndex}
          albums={detail.albums}
          onMoveAlbum={handleMoveAlbum}
          onOpenAlbum={(albumId) => {
            setSelectedAlbumId(albumId);
            setSelectedTrackId(null);
          }}
        />
      </Card>

      {selectedAlbum && (
        <AlbumDetailModal
          album={selectedAlbum}
          selectedTrack={selectedTrack}
          onClose={() => {
            setSelectedAlbumId(null);
            setSelectedTrackId(null);
          }}
          onSelectTrack={setSelectedTrackId}
        />
      )}
    </>
  );
}
