'use client';

import { useState } from 'react';

import { Icon } from '@/shared/ui/Icon';
import { IconBadge } from '@/shared/ui/IconBadge';
import { IconButton } from '@/shared/ui/IconButton';
import { ListRow } from '@/shared/ui/ListRow';
import { Modal } from '@/shared/ui/Modal';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { StatCard } from '@/shared/ui/StatCard';

import { TargetListLink } from './TargetListLink';
import { FeedTargetCreateForm } from './FeedTargetCreateForm';
import type { FeedViewModel, FeedWatchTarget } from '../model/feedTypes';

/** 내 피드 프로필 mock 데이터 */
const FEED_ME_PROFILE = {
  nickname: 'mory.dev',
  initial: 'M',
  description: '관심 상품, 스트리머, 아티스트를 등록해 알림 조건을 관리해요.',
};

/**
 * 내 피드 관리 화면입니다. 프로필 카드, 요약 카운팅, 관찰 대상 추가 행과 내 관찰 대상 목록을 보여줍니다.
 *
 * @param props 컴포넌트 Props
 * @returns 내 피드 관리 섹션
 */
export function MyFeedManageSection({ summaries, targets }: { summaries: FeedViewModel['summaries']; targets: FeedWatchTarget[] }) {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  return (
    <>
      <section className="grid gap-6" aria-labelledby="feed-me-profile-title">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 px-1">
          <IconBadge size="xl" tone="strong" className="text-lg font-semibold text-ink-2!">
            {FEED_ME_PROFILE.initial}
          </IconBadge>
          <div className="min-w-0">
            <h1 id="feed-me-profile-title" className="font-display text-display font-semibold leading-tight text-foreground">
              {FEED_ME_PROFILE.nickname}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted">{FEED_ME_PROFILE.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 min-[360px]:grid-cols-4" aria-label="내 피드 요약">
          {summaries.map((summary) => (
            <StatCard key={summary.label} label={summary.label} value={summary.value} />
          ))}
        </div>
      </section>

      <section aria-label="관찰 대상 추가">
        <ListRow className="min-h-11 w-full border-t px-0 py-1 active:bg-surface-strong" onClick={() => setIsCreateFormOpen(true)}>
          <span className="flex items-center gap-2 text-xs font-medium text-foreground sm:text-sm">
            <Icon className="size-5 shrink-0 text-primary" name="plus" />
            <span>관찰할 아이템, 스트리머, 아티스트를 등록하세요</span>
          </span>
        </ListRow>
      </section>

      {isCreateFormOpen && (
        <Modal labelledBy="feed-create-target-title" onClose={() => setIsCreateFormOpen(false)} overlay="dark" size="md" className="relative max-h-[calc(100dvh-3rem)] overflow-y-auto">
          <div className="absolute end-4 top-4">
            <IconButton ariaLabel="관찰 대상 등록 닫기" onClick={() => setIsCreateFormOpen(false)}>
              <Icon name="x" />
            </IconButton>
          </div>
          <FeedTargetCreateForm />
        </Modal>
      )}

      <section className="grid gap-1" aria-labelledby="feed-my-target-title">
        <SectionHeader domainPath="feed / settings" title="내 알림 설정" headingId="feed-my-target-title" />
        <div className="grid">
          {targets.map((target) => (
            <TargetListLink
              key={target.id}
              href={`/feed/me/targets/${target.id}`}
              rightText="설정"
              target={target}
            />
          ))}
        </div>
      </section>
    </>
  );
}
