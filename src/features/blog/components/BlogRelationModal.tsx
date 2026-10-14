'use client';

import { useState } from 'react';

import { Icon } from '@/shared/ui/Icon';
import { IconBadge } from '@/shared/ui/IconBadge';
import { IconButton } from '@/shared/ui/IconButton';
import { ListRow } from '@/shared/ui/ListRow';
import { Modal } from '@/shared/ui/Modal';

/**
 * 사용자 관계 목록 항목
 */
export type BlogRelationUser = {
  id: string;       // 사용자 고유 ID
  nickname: string; // 사용자 닉네임
  initial: string;  // 프로필 이니셜
  summary: string;  // 사용자 요약
};

/**
 * 팔로워/팔로잉 목록 모달 컴포넌트의 Props
 */
type BlogRelationModalProps = {
  title: string;             // 모달 제목
  users: BlogRelationUser[]; // 표시할 사용자 목록
  onClose: () => void;       // 닫기 핸들러
};

/**
 * 팔로워/팔로잉 목록 모달입니다. 유저 blog 메인 화면과 내 blog 관리 화면에서 공용으로 사용합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 관계 목록 모달
 */
export function BlogRelationModal({ title, users, onClose }: BlogRelationModalProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 3;
  const pageCount = Math.max(1, Math.ceil(users.length / pageSize));
  const pageUsers = users.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);

  return (
    <Modal title={title} labelledBy="blog-relation-modal-title" onClose={onClose}>
      <div className="mt-4 grid gap-2">
        {pageUsers.map((user) => (
          <ListRow
            key={user.id}
            as="article"
            tone="strong"
            leading={(
              <IconBadge as="span" className="text-sm font-bold">
                {user.initial}
              </IconBadge>
            )}
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-foreground">{user.nickname}</span>
              <span className="mt-1 block truncate text-xs text-muted">{user.summary}</span>
            </span>
          </ListRow>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <IconButton ariaLabel="이전 목록" disabled={pageIndex === 0} onClick={() => setPageIndex((currentValue) => Math.max(0, currentValue - 1))}>
          <Icon name="chevronLeft" />
        </IconButton>
        <span className="text-xs font-bold text-muted">
          {pageIndex + 1} / {pageCount}
        </span>
        <IconButton ariaLabel="다음 목록" disabled={pageIndex >= pageCount - 1} onClick={() => setPageIndex((currentValue) => Math.min(pageCount - 1, currentValue + 1))}>
          <Icon className="size-5 rotate-180" name="chevronLeft" />
        </IconButton>
      </div>
    </Modal>
  );
}
