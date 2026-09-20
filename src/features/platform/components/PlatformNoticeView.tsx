'use client';

import { useState } from 'react';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { PageIntroCard } from '@/shared/ui/PageIntroCard';

/** 공지사항 임시 데이터 */
const PLATFORM_NOTICES = [
  {
    id: 'notice-1',
    title: '서비스 화면 구조를 확장 중입니다',
    description: '하단 메뉴와 상세 화면을 연결하는 작업을 진행하고 있습니다.',
    content: '플랫폼, 블로그, 피드의 하단 메뉴를 실제 화면과 상세 화면으로 연결했습니다. 이후에는 메뉴별 상단 카드와 모달 기반 상세 UX를 차례로 다듬습니다.',
    dateText: '2026.09.19',
  },
  {
    id: 'notice-2',
    title: '블로그와 피드 상세 화면 준비',
    description: '게시글, 관찰 항목, 알림 상세를 먼저 mock 화면으로 구성합니다.',
    content: '블로그 게시글 상세와 피드 관찰/알림 상세 화면은 현재 mock 데이터 기반입니다. 실제 API 연동 전까지 화면 밀도와 이동 흐름을 먼저 검증합니다.',
    dateText: '2026.09.19',
  },
];

/** 플랫폼 공지사항 항목 */
type PlatformNotice = (typeof PLATFORM_NOTICES)[number];

/**
 * 플랫폼 공지사항 화면 컴포넌트의 Props
 */
type PlatformNoticeViewProps = {
  isLoggedIn: boolean; // 로그인 여부
};

/**
 * 플랫폼 공지사항 메뉴 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 플랫폼 공지사항 화면
 */
export function PlatformNoticeView({ isLoggedIn }: PlatformNoticeViewProps) {
  const [selectedNotice, setSelectedNotice] = useState<PlatformNotice | null>(null);

  return (
    <AppFrame>
      <AppTopBar isLoggedIn={isLoggedIn} />
      <AppContent className="grid gap-4">
        <PageIntroCard
          domainPath="notice"
          title="공지사항"
          description="플랫폼과 하위 서비스의 변경사항을 모아봅니다."
        />

        <section className="grid gap-3" aria-label="공지사항 목록">
          {PLATFORM_NOTICES.map((notice) => (
            <button key={notice.id} className="rounded-2xl border border-border bg-surface p-4 text-left transition hover:bg-surface-strong" type="button" onClick={() => setSelectedNotice(notice)}>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-bold text-foreground">{notice.title}</h2>
                <time className="shrink-0 text-xs text-muted">{notice.dateText}</time>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{notice.description}</p>
            </button>
          ))}
        </section>
      </AppContent>

      <BottomNavigation
        items={[
          { label: '홈', href: '/', iconName: 'home' },
          { label: '공지사항', href: '/notice', iconName: 'megaphone', isActive: true },
          { label: '서비스', href: '/services', iconName: 'grid' },
          { label: '내 정보', href: '/me', iconName: 'user' },
        ]}
      />

      {selectedNotice && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/60 px-4 py-5 backdrop-blur-sm sm:place-items-center" role="presentation" onClick={() => setSelectedNotice(null)}>
          <section className="w-full max-w-[640px] rounded-3xl border border-border bg-surface p-5 shadow-[0_24px_80px_rgba(0,0,0,0.34)]" role="dialog" aria-modal="true" aria-labelledby="notice-dialog-title" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="flex items-center gap-1 text-sm font-bold text-primary">
                  <BrandLogo size="sm" isAnimated={false} />
                  <span>/ notice</span>
                </p>
                <h2 id="notice-dialog-title" className="mt-2 text-2xl font-black leading-tight text-foreground">
                  {selectedNotice.title}
                </h2>
                <time className="mt-2 block text-xs text-muted">{selectedNotice.dateText}</time>
              </div>
              <button className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-surface-strong text-sm font-bold text-muted" type="button" onClick={() => setSelectedNotice(null)}>
                닫기
              </button>
            </div>
            <div className="mt-4 rounded-2xl bg-surface-strong p-4">
              <p className="text-sm leading-6 text-foreground">{selectedNotice.content}</p>
            </div>
          </section>
        </div>
      )}
    </AppFrame>
  );
}
