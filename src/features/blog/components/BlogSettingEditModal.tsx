'use client';

import { useState } from 'react';

import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';

/** 내 blog 설정 항목 ID */
type BlogSettingItemId = 'visibility' | 'comments' | 'tag';

/**
 * 내 blog 설정 카드 항목
 */
export type BlogSettingItem = {
  id: BlogSettingItemId; // 설정 항목 ID
  title: string;         // 설정 제목
  description: string;   // 설정 설명
  value: string;         // 현재 설정값
  options: string[];     // 선택 가능한 설정값 목록
};

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
export function BlogSettingEditModal({ item, onClose }: BlogSettingEditModalProps) {
  const [selectedValue, setSelectedValue] = useState(item.value);

  return (
    <Modal title={item.title} labelledBy="blog-modal-title" onClose={onClose} className="max-h-[86vh] overflow-y-auto">
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
