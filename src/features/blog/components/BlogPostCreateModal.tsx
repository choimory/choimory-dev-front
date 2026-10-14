'use client';

import { useState, type ChangeEvent } from 'react';

import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import { IconButton } from '@/shared/ui/IconButton';
import { Modal } from '@/shared/ui/Modal';

/** 글 공개 범위 옵션 */
const POST_VISIBILITY_OPTIONS = ['전체', '팔로워', '비공개'];

/** 댓글 허용 범위 옵션 */
const COMMENT_PERMISSION_OPTIONS = ['전체', '팔로워', '비허용'];

/**
 * 글작성 모달 컴포넌트의 Props
 */
type BlogPostCreateModalProps = {
  onClose: () => void; // 닫기 핸들러
};

/**
 * 내 blog 글작성 mock 모달입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 글작성 모달
 */
export function BlogPostCreateModal({ onClose }: BlogPostCreateModalProps) {
  const [visibility, setVisibility] = useState(POST_VISIBILITY_OPTIONS[0]);
  const [commentPermission, setCommentPermission] = useState(COMMENT_PERMISSION_OPTIONS[0]);
  const [photos, setPhotos] = useState<{ id: string; name: string; previewUrl: string }[]>([]);

  /**
   * 첨부 사진 목록을 변경합니다.
   *
   * @param event 파일 input change event
   */
  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedPhotos = Array.from(event.target.files ?? []).map((file, index) => ({
      id: `${file.name}-${file.lastModified}-${Date.now()}-${index}`,
      name: file.name,
      previewUrl: URL.createObjectURL(file),
    }));

    setPhotos((currentPhotos) => [...currentPhotos, ...selectedPhotos]);
    event.target.value = '';
  };

  /**
   * 선택한 사진의 순서를 변경합니다.
   *
   * @param index 이동할 사진 index
   * @param direction 이동 방향
   */
  const movePhoto = (index: number, direction: -1 | 1) => {
    setPhotos((currentPhotos) => {
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= currentPhotos.length) {
        return currentPhotos;
      }

      const nextPhotos = [...currentPhotos];
      [nextPhotos[index], nextPhotos[nextIndex]] = [nextPhotos[nextIndex], nextPhotos[index]];

      return nextPhotos;
    });
  };

  /**
   * 선택한 사진을 제거합니다.
   *
   * @param photoId 제거할 사진 ID
   */
  const removePhoto = (photoId: string) => {
    setPhotos((currentPhotos) => currentPhotos.filter((photo) => photo.id !== photoId));
  };

  return (
    <Modal title="글작성" labelledBy="blog-modal-title" onClose={onClose} className="max-h-[86vh] overflow-y-auto">
      <div className="mt-4 grid gap-3">
        <label className="grid gap-1.5">
          <span className="text-xs font-bold text-muted">글제목</span>
          <input className="h-10 w-full rounded-[10px] border border-border bg-surface-strong px-3 text-sm text-foreground outline-none placeholder:text-muted" placeholder="제목을 입력하세요" />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs font-bold text-muted">글내용</span>
          <textarea className="min-h-28 w-full resize-none rounded-[10px] border border-border bg-surface-strong p-3 text-sm leading-6 text-foreground outline-none placeholder:text-muted" placeholder="무슨 생각을 공유할까요?" />
        </label>

        <div className="grid gap-1.5">
          <span className="text-xs font-bold text-muted">공개여부</span>
          <div className="grid grid-cols-3 gap-1 rounded-2xl bg-surface-strong p-1">
            {POST_VISIBILITY_OPTIONS.map((option) => (
              <button
                key={option}
                className={`h-9 rounded-xl text-xs font-black ${visibility === option ? 'bg-primary text-primary-foreground' : 'text-muted'}`}
                type="button"
                onClick={() => setVisibility(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-1.5">
          <span className="text-xs font-bold text-muted">댓글허용여부</span>
          <div className="grid grid-cols-3 gap-1 rounded-2xl bg-surface-strong p-1">
            {COMMENT_PERMISSION_OPTIONS.map((option) => (
              <button
                key={option}
                className={`h-9 rounded-xl text-xs font-black ${commentPermission === option ? 'bg-primary text-primary-foreground' : 'text-muted'}`}
                type="button"
                onClick={() => setCommentPermission(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <label className="grid gap-1.5">
          <span className="text-xs font-bold text-muted">태그</span>
          <input className="h-10 w-full rounded-[10px] border border-border bg-surface-strong px-3 text-sm text-foreground outline-none placeholder:text-muted" placeholder="frontend, blog, note" />
        </label>

        <div className="grid gap-1.5">
          <span className="text-xs font-bold text-muted">사진첨부</span>
          <label className="grid min-h-10 cursor-pointer place-items-center rounded-[10px] border border-border bg-surface-strong px-3 text-sm font-bold text-muted">
            사진 선택
            <input className="sr-only" type="file" accept="image/*" multiple onChange={handlePhotoChange} />
          </label>
          {photos.length > 0 && (
            <div className="grid gap-2 rounded-2xl bg-surface-strong p-3" aria-label="선택한 사진">
              {photos.map((photo, index) => (
                <article key={photo.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-surface p-2">
                  <span
                    className="size-14 rounded-[10px] bg-cover bg-center"
                    style={{ backgroundImage: `url(${photo.previewUrl})` }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-foreground">{photo.name}</p>
                    <p className="mt-1 text-xs text-muted">{index + 1}번째 사진</p>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <IconButton ariaLabel={`${photo.name} 앞으로 이동`} size="sm" disabled={index === 0} onClick={() => movePhoto(index, -1)}>
                      <Icon className="size-4 rotate-90" name="chevronLeft" />
                    </IconButton>
                    <IconButton ariaLabel={`${photo.name} 뒤로 이동`} size="sm" disabled={index === photos.length - 1} onClick={() => movePhoto(index, 1)}>
                      <Icon className="size-4 -rotate-90" name="chevronLeft" />
                    </IconButton>
                    <IconButton ariaLabel={`${photo.name} 제거`} size="sm" tone="danger" onClick={() => removePhoto(photo.id)}>
                      <Icon className="size-4" name="x" />
                    </IconButton>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button onClick={onClose}>
          저장
        </Button>
      </div>
    </Modal>
  );
}
