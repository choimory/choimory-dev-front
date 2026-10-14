'use client';

import { useState } from 'react';

import { Icon } from '@/shared/ui/Icon';
import { IconBadge } from '@/shared/ui/IconBadge';
import { IconButton } from '@/shared/ui/IconButton';
import { ListRow } from '@/shared/ui/ListRow';
import { Modal } from '@/shared/ui/Modal';
import { PageIntroCard } from '@/shared/ui/PageIntroCard';
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

export function MyFeedManageSection({ summaries, targets }: { summaries: FeedViewModel['summaries']; targets: FeedWatchTarget[] }) {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  return (
    <>
      <PageIntroCard domainPath="feed / me" />

      <section className="rounded-3xl border border-border bg-surface p-5" aria-labelledby="feed-me-profile-title">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
          <div className="grid size-16 place-items-center rounded-3xl bg-primary text-xl font-black text-primary-foreground">
            {FEED_ME_PROFILE.initial}
          </div>
          <div className="min-w-0">
            <h1 id="feed-me-profile-title" className="text-2xl font-black leading-tight text-foreground">
              {FEED_ME_PROFILE.nickname}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted">{FEED_ME_PROFILE.description}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="내 피드 요약">
          {summaries.map((summary) => (
            <StatCard key={summary.label} label={summary.label} value={summary.value} />
          ))}
        </div>
      </section>

      <ListRow
        as="section"
        ariaLabel="관찰 대상 추가"
        leading={(
          <IconBadge tone="primary">
            <Icon name="plus" />
          </IconBadge>
        )}
      >
        <button className="h-10 rounded-[10px] bg-surface-strong px-3 text-left text-sm text-muted" type="button" onClick={() => setIsCreateFormOpen(true)}>
          관찰할 아이템, 스트리머, 아티스트를 등록하세요
        </button>
      </ListRow>

      {isCreateFormOpen && (
        <Modal labelledBy="feed-create-target-title" onClose={() => setIsCreateFormOpen(false)} overlay="dark" size="md" className="grid max-h-[calc(100vh-3rem)] overflow-y-auto">
          <div className="mb-3 flex justify-end">
            <IconButton ariaLabel="관찰 대상 등록 닫기" onClick={() => setIsCreateFormOpen(false)}>
              <Icon name="x" />
            </IconButton>
          </div>
          <FeedTargetCreateForm />
        </Modal>
      )}

      <section className="grid gap-3" aria-labelledby="feed-my-target-title">
        <SectionHeader domainPath="feed / settings" title="내 알림 설정" headingId="feed-my-target-title" />
        <div className="grid gap-3">
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
