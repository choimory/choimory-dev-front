'use client';

import { useState, type ChangeEvent } from 'react';

import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import { IconButton } from '@/shared/ui/IconButton';
import { ListRow } from '@/shared/ui/ListRow';
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
      <div className="mt-4 grid gap-4">
        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-ink-2">글제목</span>
          <input className="h-10 w-full rounded-input border border-muted bg-background px-3 text-sm text-foreground focus-visible:border-primary" placeholder="제목을 입력하세요" />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-ink-2">글내용</span>
          <textarea className="min-h-28 w-full resize-none rounded-input border border-muted bg-background p-3 text-sm leading-6 text-foreground focus-visible:border-primary" placeholder="무슨 생각을 공유할까요?" />
        </label>

        <div className="grid gap-1.5">
          <span className="text-sm font-medium text-ink-2">공개여부</span>
          <div className="tray grid grid-cols-3 gap-1 p-1">
            {POST_VISIBILITY_OPTIONS.map((option) => (
              <button
                key={option}
                className={`h-8 rounded-input text-sm font-medium ${visibility === option ? 'bg-primary text-primary-foreground shadow-key-press' : 'text-muted hover:bg-surface hover:text-foreground active:bg-surface'}`}
                type="button"
                aria-pressed={visibility === option}
                onClick={() => setVisibility(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-1.5">
          <span className="text-sm font-medium text-ink-2">댓글허용여부</span>
          <div className="tray grid grid-cols-3 gap-1 p-1">
            {COMMENT_PERMISSION_OPTIONS.map((option) => (
              <button
                key={option}
                className={`h-8 rounded-input text-sm font-medium ${commentPermission === option ? 'bg-primary text-primary-foreground shadow-key-press' : 'text-muted hover:bg-surface hover:text-foreground active:bg-surface'}`}
                type="button"
                aria-pressed={commentPermission === option}
                onClick={() => setCommentPermission(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-ink-2">태그</span>
          <input className="h-10 w-full rounded-input border border-muted bg-background px-3 text-sm text-foreground focus-visible:border-primary" placeholder="frontend, blog, note" />
        </label>

        <div className="grid gap-1.5">
          <span className="text-sm font-medium text-ink-2">사진첨부</span>
          <label className="key grid h-10 cursor-pointer place-items-center px-3 text-sm font-semibold hover:bg-surface-strong active:bg-surface-strong focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus">
            사진 선택
            <input className="sr-only" type="file" accept="image/*" multiple onChange={handlePhotoChange} />
          </label>
          {photos.length > 0 && (
            <div className="mt-1 grid border-t border-border" aria-label="선택한 사진">
              {photos.map((photo, index) => (
                <ListRow
                  key={photo.id}
                  as="article"
                  className="gap-2 px-0"
                  leading={(
                    <span
                      className="cut-sm size-10 bg-cover bg-center"
                      style={{ backgroundImage: `url(${photo.previewUrl})` }}
                      aria-hidden="true"
                    />
                  )}
                  trailing={(
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
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-foreground">{photo.name}</p>
                    <p className="mt-1 text-xs tabular-nums text-muted">{index + 1}번째 사진</p>
                  </div>
                </ListRow>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-3 border-t border-border pt-4">
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
