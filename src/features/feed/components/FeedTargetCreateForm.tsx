'use client';

import { useState } from 'react';

import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { SegmentedTabs } from '@/shared/ui/SegmentedTabs';

import { FormField } from './FormField';
import { TogglePreview } from './TogglePreview';
import { getTargetTypeLabel } from '../model/feedTargetView';
import type { FeedTargetType } from '../model/feedTypes';

/** 관찰 대상 등록 탭 종류 */
type FeedCreateTabId = FeedTargetType;

/**
 * 관찰 대상 등록 폼입니다. 아이템, 스트리머, 아티스트 종류별 입력 형태를 탭으로 전환해 보여주고, 등록 시 완료 상태로 바꿉니다.
 *
 * @returns 관찰 대상 등록 폼
 */
export function FeedTargetCreateForm() {
  const [activeTabId, setActiveTabId] = useState<FeedCreateTabId>('item');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChangeTab = (tabId: FeedCreateTabId) => {
    setActiveTabId(tabId);
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <Card as="section" aria-labelledby="feed-create-target-title">
      <div>
        <p className="text-sm font-bold text-primary">feed / register</p>
        <h2 id="feed-create-target-title" className="mt-1 text-base font-bold text-foreground">
          관찰 대상 등록
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">API 연결 전까지 화면에 필요한 입력 형태만 먼저 확인하고 있어요.</p>
      </div>

      <SegmentedTabs
        className="mt-4"
        items={(['item', 'streamer', 'artist'] satisfies FeedCreateTabId[]).map((tabId) => ({ id: tabId, label: getTargetTypeLabel(tabId) }))}
        activeId={activeTabId}
        ariaLabel="관찰 대상 등록 종류"
        onChange={handleChangeTab}
      />

      <div className="mt-4 grid gap-3">
        <FormField label="대상 이름" placeholder={activeTabId === 'item' ? '기계식 키보드' : activeTabId === 'streamer' ? 'mory_live' : 'artist.nova'} />
        <FormField label="설명" placeholder="관찰 대상의 요약 설명" />
        <FormField label="원본 링크" placeholder="https://example.com/original" />
        <FormField label="알림 주기" placeholder="즉시 / 하루 요약 / 주간 요약" />

        {activeTabId === 'item' && (
          <>
            <FormField label="현재 가격" placeholder="128,000원" />
            <FormField label="목표 가격" placeholder="120,000원" />
          </>
        )}

        {activeTabId === 'streamer' && (
          <>
            <FormField label="채널명" placeholder="mory_live channel" />
            <FormField label="채널 URL" placeholder="https://example.com/stream/channel" />
            <TogglePreview label="방송 알림" />
            <TogglePreview label="채팅/이벤트 알림" />
          </>
        )}

        {activeTabId === 'artist' && (
          <>
            <FormField label="최근 발매곡" placeholder="Midnight Compile" />
            <TogglePreview label="신곡/앨범 알림" />
            <TogglePreview label="피처링/참여곡 알림" />
          </>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted">{isSubmitted ? '등록 준비가 완료됐어요.' : '저장 전 mock 입력값은 목록에 추가하지 않아요.'}</p>
        <Button className="shrink-0" onClick={handleSubmit}>
          {isSubmitted ? '준비 완료' : '등록'}
        </Button>
      </div>
    </Card>
  );
}
