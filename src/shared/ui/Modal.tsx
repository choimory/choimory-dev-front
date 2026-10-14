'use client';

import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { Icon } from './Icon';
import { IconButton } from './IconButton';

/**
 * 모달 컴포넌트의 Props
 */
type ModalProps = {
  children: ReactNode;                  // 모달 본문
  labelledBy: string;                   // 모달 제목 요소의 id (aria-labelledby 연결용)
  title?: string;                       // 기본 헤더에 표시할 제목 (있으면 제목과 닫기 버튼 헤더를 렌더링)
  onClose: () => void;                  // 닫기 핸들러 (배경 클릭 시 호출)
  placement?: 'center' | 'bottom';      // 위치 (기본 center: 화면 가운데, bottom: 모바일에서는 하단, sm 이상에서는 가운데)
  overlay?: 'soft' | 'dark';            // 배경 막 (기본 soft: 테마 배경색 70%, dark: 검정 60%)
  size?: 'sm' | 'md' | 'lg';            // 최대 폭 (기본 sm: 384px, md: 560px, lg: 640px)
  padding?: 'md' | 'lg';                // 안쪽 여백 (기본 md: p-4, lg: p-5)
  className?: string;                   // 모달 패널에 추가할 클래스 (최대 높이, 스크롤 등)
};

/** 모달 위치별 배경 막 클래스 */
const MODAL_PLACEMENT_CLASS_NAME: Record<NonNullable<ModalProps['placement']>, string> = {
  center: 'place-items-center px-4',
  bottom: 'place-items-end px-4 py-5 sm:place-items-center',
};

/** 모달 배경 막 종류별 클래스 */
const MODAL_OVERLAY_CLASS_NAME: Record<NonNullable<ModalProps['overlay']>, { overlay: string; panel: string }> = {
  soft: { overlay: 'bg-background/70', panel: 'shadow-2xl' },
  dark: { overlay: 'bg-black/60', panel: 'shadow-[0_24px_80px_rgba(0,0,0,0.34)]' },
};

/** 모달 최대 폭별 클래스 */
const MODAL_SIZE_CLASS_NAME: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-[560px]',
  lg: 'max-w-[640px]',
};

/** 모달 안쪽 여백별 클래스 */
const MODAL_PADDING_CLASS_NAME: Record<NonNullable<ModalProps['padding']>, string> = {
  md: 'p-4',
  lg: 'p-5',
};

/**
 * 화면 전체를 덮는 배경 막 위에 패널을 띄우는 공용 모달입니다.
 * document.body 포털로 렌더링하며, 배경을 누르면 onClose를 호출하고 패널 안쪽 클릭은 막습니다.
 *
 * @param props 컴포넌트 Props
 * @returns 모달 (서버 렌더링 중에는 null)
 */
export function Modal({
  children,
  labelledBy,
  title,
  onClose,
  placement = 'center',
  overlay = 'soft',
  size = 'sm',
  padding = 'md',
  className,
}: ModalProps) {
  if (typeof document === 'undefined') {
    return null;
  }

  const overlayClassName = [
    'fixed inset-0 z-50 grid backdrop-blur-sm',
    MODAL_PLACEMENT_CLASS_NAME[placement],
    MODAL_OVERLAY_CLASS_NAME[overlay].overlay,
  ].join(' ');
  const panelClassName = [
    'w-full rounded-3xl border border-border bg-surface',
    MODAL_SIZE_CLASS_NAME[size],
    MODAL_PADDING_CLASS_NAME[padding],
    MODAL_OVERLAY_CLASS_NAME[overlay].panel,
    className,
  ].filter(Boolean).join(' ');

  return createPortal(
    <div className={overlayClassName} role="presentation" onClick={onClose}>
      <section className={panelClassName} role="dialog" aria-modal="true" aria-labelledby={labelledBy} onClick={(event) => event.stopPropagation()}>
        {title && (
          <div className="flex items-center justify-between gap-3">
            <h2 id={labelledBy} className="text-lg font-black text-foreground">{title}</h2>
            <IconButton ariaLabel="닫기" onClick={onClose}>
              <Icon name="x" />
            </IconButton>
          </div>
        )}
        {children}
      </section>
    </div>,
    document.body,
  );
}
