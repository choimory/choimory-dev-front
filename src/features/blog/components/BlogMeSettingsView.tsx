'use client';

import Link from 'next/link';
import { useState, type ChangeEvent, type ReactNode } from 'react';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Icon } from '@/shared/ui/Icon';
import { PageIntroCard } from '@/shared/ui/PageIntroCard';
import { SectionHeader } from '@/shared/ui/SectionHeader';

import { BLOG_FOLLOWERS, BLOG_FOLLOWINGS, BLOG_USER_PROFILE, BlogProfileCard } from './BlogProfileCard';
import { BlogRelationModal } from './BlogRelationModal';

/**
 * 내 blog 설정/관리 화면 컴포넌트의 Props
 */
type BlogMeSettingsViewProps = {
  isLoggedIn: boolean; // 로그인 여부
};

/** 내 blog 설정 항목 ID */
type BlogSettingItemId = 'visibility' | 'comments' | 'tag';

/**
 * 내 blog 설정 카드 항목
 */
type BlogSettingItem = {
  id: BlogSettingItemId; // 설정 항목 ID
  title: string;         // 설정 제목
  description: string;   // 설정 설명
  value: string;         // 현재 설정값
  options: string[];     // 선택 가능한 설정값 목록
};

/** 내 blog 설정 카드 mock 데이터 */
const BLOG_SETTING_ITEMS: BlogSettingItem[] = [
  {
    id: 'visibility',
    title: '블로그 공개 여부',
    description: '현재 전체 공개 상태예요.',
    value: '전체 공개',
    options: ['전체 공개', '팔로워 공개', '비공개'],
  },
  {
    id: 'comments',
    title: '기본 댓글 허용 범위',
    description: '새 글 작성 시 기본 댓글 범위를 정해요.',
    value: '전체',
    options: ['전체', '팔로워', '비허용'],
  },
  {
    id: 'tag',
    title: '태그 추천',
    description: '자주 쓰는 태그를 글 작성에 활용해요.',
    value: '켜짐',
    options: ['켜짐', '꺼짐'],
  },
];

/** 내 활동 카운팅 mock 데이터 */
const BLOG_ME_ACTIVITY_STATS = [
  { label: '내 댓글', value: '47' },
  { label: '좋아요', value: '96' },
  { label: '북마크', value: '18' },
];

/** 글 공개 범위 옵션 */
const POST_VISIBILITY_OPTIONS = ['전체', '팔로워', '비공개'];

/** 댓글 허용 범위 옵션 */
const COMMENT_PERMISSION_OPTIONS = ['전체', '팔로워', '비허용'];

/**
 * 모달 shell 컴포넌트의 Props
 */
type BlogModalShellProps = {
  title: string;      // 모달 제목
  children: ReactNode; // 모달 본문
  onClose: () => void; // 닫기 핸들러
};

/**
 * blog 관리 화면에서 사용하는 공통 모달 shell입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 공통 모달 shell
 */
function BlogModalShell({ title, children, onClose }: BlogModalShellProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-background/70 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-modal-title"
      onClick={onClose}
    >
      <section className="max-h-[86vh] w-full max-w-sm overflow-y-auto rounded-3xl border border-border bg-surface p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between gap-3">
          <h2 id="blog-modal-title" className="text-lg font-black text-foreground">{title}</h2>
          <button className="grid size-9 place-items-center rounded-[10px] bg-surface-strong text-muted" type="button" aria-label="닫기" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

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
function BlogPostCreateModal({ onClose }: BlogPostCreateModalProps) {
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
    <BlogModalShell title="글작성" onClose={onClose}>
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
                    <button
                      className="grid size-8 place-items-center rounded-[10px] bg-surface-strong text-muted disabled:opacity-35"
                      type="button"
                      aria-label={`${photo.name} 앞으로 이동`}
                      disabled={index === 0}
                      onClick={() => movePhoto(index, -1)}
                    >
                      <Icon className="size-4 rotate-90" name="chevronLeft" />
                    </button>
                    <button
                      className="grid size-8 place-items-center rounded-[10px] bg-surface-strong text-muted disabled:opacity-35"
                      type="button"
                      aria-label={`${photo.name} 뒤로 이동`}
                      disabled={index === photos.length - 1}
                      onClick={() => movePhoto(index, 1)}
                    >
                      <Icon className="size-4 -rotate-90" name="chevronLeft" />
                    </button>
                    <button
                      className="grid size-8 place-items-center rounded-[10px] bg-surface-strong text-accent-red"
                      type="button"
                      aria-label={`${photo.name} 제거`}
                      onClick={() => removePhoto(photo.id)}
                    >
                      <Icon className="size-4" name="x" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button className="h-10 rounded-[10px] bg-surface-strong text-sm font-bold text-muted" type="button" onClick={onClose}>
          취소
        </button>
        <button className="h-10 rounded-[10px] bg-primary text-sm font-bold text-primary-foreground" type="button" onClick={onClose}>
          저장
        </button>
      </div>
    </BlogModalShell>
  );
}

/**
 * 설정 변경 모달 컴포넌트의 Props
 */
type BlogSettingEditModalProps = {
  item: BlogSettingItem; // 수정할 설정 항목
  onClose: () => void;  // 닫기 핸들러
};

/**
 * 내 blog 설정 변경 mock 모달입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 설정 변경 모달
 */
function BlogSettingEditModal({ item, onClose }: BlogSettingEditModalProps) {
  const [selectedValue, setSelectedValue] = useState(item.value);

  return (
    <BlogModalShell title={item.title} onClose={onClose}>
      <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
      <div className="mt-4 grid gap-2">
        {item.options.map((option) => (
          <button
            key={option}
            className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border p-3 text-left ${
              selectedValue === option
                ? 'border-primary bg-primary-soft text-primary'
                : 'border-border bg-surface-strong text-foreground'
            }`}
            type="button"
            onClick={() => setSelectedValue(option)}
          >
            <span className="text-sm font-bold">{option}</span>
            <span className={`grid size-4 place-items-center rounded-full border ${selectedValue === option ? 'border-primary' : 'border-border'}`}>
              {selectedValue === option && <span className="size-2 rounded-full bg-primary" />}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button className="h-10 rounded-[10px] bg-surface-strong text-sm font-bold text-muted" type="button" onClick={onClose}>
          취소
        </button>
        <button className="h-10 rounded-[10px] bg-primary text-sm font-bold text-primary-foreground" type="button" onClick={onClose}>
          저장
        </button>
      </div>
    </BlogModalShell>
  );
}

/**
 * 내 blog 설정/관리 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 내 blog 설정/관리 화면
 */
export function BlogMeSettingsView({ isLoggedIn }: BlogMeSettingsViewProps) {
  const [isPostCreateModalOpen, setIsPostCreateModalOpen] = useState(false);
  const [editingSettingItem, setEditingSettingItem] = useState<BlogSettingItem | null>(null);
  const [relationModal, setRelationModal] = useState<'followers' | 'following' | null>(null);

  return (
    <AppFrame>
      <AppTopBar
        isLoggedIn={isLoggedIn}
        serviceName="blog"
        serviceHref="/blog"
        leading={
          <Link className="grid size-10 place-items-center rounded-[10px] text-foreground" href="/blog" aria-label="blog 홈으로 돌아가기">
            <Icon name="chevronLeft" />
          </Link>
        }
      />

      <AppContent className="grid gap-3">
        <PageIntroCard domainPath="blog / me" />

        <BlogProfileCard
          headingId="blog-me-profile-title"
          profile={BLOG_USER_PROFILE}
          onSelectRelation={setRelationModal}
          profileHref="/blog/mory.dev"
          extraStats={BLOG_ME_ACTIVITY_STATS}
        />

        <section className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-border bg-surface p-3" aria-label="글 작성">
          <div className="grid size-10 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            M
          </div>
          <button className="h-10 rounded-[10px] bg-surface-strong px-3 text-left text-sm text-muted" type="button" onClick={() => setIsPostCreateModalOpen(true)}>
            무슨 생각을 공유할까요?
          </button>
        </section>

        <section className="grid gap-2" aria-labelledby="blog-settings-title">
          <SectionHeader domainPath="blog / setting" title="설정" headingId="blog-settings-title" />
          {BLOG_SETTING_ITEMS.map((item) => (
            <button
              key={item.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-left"
              type="button"
              onClick={() => setEditingSettingItem(item)}
            >
              <span className="min-w-0">
                <span className="block text-sm font-bold text-foreground">{item.title}</span>
                <span className="mt-1 block text-xs leading-5 text-muted">{item.description}</span>
              </span>
              <span className="rounded-full bg-surface-strong px-3 py-1 text-xs font-bold text-primary">
                {item.value}
              </span>
            </button>
          ))}
        </section>
      </AppContent>

      {isPostCreateModalOpen && (
        <BlogPostCreateModal onClose={() => setIsPostCreateModalOpen(false)} />
      )}
      {editingSettingItem && (
        <BlogSettingEditModal item={editingSettingItem} onClose={() => setEditingSettingItem(null)} />
      )}
      {relationModal === 'followers' && (
        <BlogRelationModal title="팔로워" users={BLOG_FOLLOWERS} onClose={() => setRelationModal(null)} />
      )}
      {relationModal === 'following' && (
        <BlogRelationModal title="팔로잉" users={BLOG_FOLLOWINGS} onClose={() => setRelationModal(null)} />
      )}

      <BottomNavigation
        items={[
          { label: '홈', href: '/blog', iconName: 'home' },
          { label: '인기', href: '/blog/popular', iconName: 'trophy' },
          { label: '팔로잉', href: '/blog/following', iconName: 'heart' },
          { label: '내 블로그', href: '/blog/me', iconName: 'user', isActive: true },
        ]}
      />
    </AppFrame>
  );
}
