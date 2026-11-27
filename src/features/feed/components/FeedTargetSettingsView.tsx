'use client';

import { useState } from 'react';
import Link from 'next/link';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Icon } from '@/shared/ui/Icon';
import { IconBadge } from '@/shared/ui/IconBadge';

import { SettingToggle } from './SettingToggle';
import { getTargetTypeLabel, getTargetIconName } from '../model/feedTargetView';
import type { FeedWatchTarget } from '../model/feedTypes';

/**
 * feed target 설정 화면 컴포넌트의 Props
 */
type FeedTargetSettingsViewProps = {
  isLoggedIn: boolean;      // 로그인 여부
  target: FeedWatchTarget;  // 설정할 target
};

/**
 * 내 feed target 관찰 설정 상세 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns feed target 설정 화면
 */
export function FeedTargetSettingsView({ isLoggedIn, target }: FeedTargetSettingsViewProps) {
  const [isWatching, setIsWatching] = useState(target.isWatching);
  const [isPrimaryAlertOn, setIsPrimaryAlertOn] = useState(true);
  const [isSecondaryAlertOn, setIsSecondaryAlertOn] = useState(true);
  const [interval, setInterval] = useState('즉시');
  const [targetPrice, setTargetPrice] = useState(target.itemDetail?.targetPrice ?? '');
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (change: () => void) => {
    change();
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
  };

  return (
    <AppFrame>
      <AppTopBar
        isLoggedIn={isLoggedIn}
        serviceName="feed"
        serviceHref="/feed"
        leading={
          <Link className="key grid size-10 place-items-center rounded-input text-foreground" href="/feed/me" aria-label="내 피드로 돌아가기">
            <Icon name="chevronLeft" />
          </Link>
        }
      />

      <AppContent className="grid min-w-0 gap-6">
        <section className="pt-2" aria-labelledby="feed-target-settings-title">
          <div className="flex items-start gap-3">
            <IconBadge as="span" size="xl" tone="strong">
              <Icon className="size-5 text-ink-2" name={getTargetIconName(target.type)} />
            </IconBadge>
            <div className="min-w-0">
              <h1 id="feed-target-settings-title" className="min-w-0 break-words font-display text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
                {target.name}
              </h1>
              <p className="mt-1 text-xs font-medium text-muted">{getTargetTypeLabel(target.type)}</p>
              <p className="mt-2 text-base leading-6 text-ink-2">내가 어떻게 알림을 받을지 조정해보세요.</p>
            </div>
          </div>
        </section>

        <section className="cut grid divide-y divide-border border border-border bg-surface" aria-label="관찰 기본 설정">
          <SettingToggle
            description="이 관찰 대상의 모든 알림을 켜거나 꺼요."
            isOn={isWatching}
            label="관찰 상태"
            onToggle={() => handleChange(() => setIsWatching((current) => !current))}
          />
          <div className="px-4 py-3">
            <p className="text-sm font-semibold text-foreground">알림 주기</p>
            <div className="tray mt-2 grid grid-cols-3 gap-1 p-1">
              {['즉시', '하루 요약', '주간 요약'].map((option) => (
                <button
                  key={option}
                  className={`h-10 whitespace-nowrap rounded-input border text-xs font-semibold active:shadow-key-press ${interval === option ? 'border-primary bg-primary text-primary-foreground shadow-key-press' : 'border-transparent text-muted hover:bg-surface hover:text-foreground'}`}
                  type="button"
                  aria-pressed={interval === option}
                  onClick={() => handleChange(() => setInterval(option))}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </section>

        {target.type === 'item' && (
          <section className="cut grid divide-y divide-border border border-border bg-surface" aria-label="아이템 알림 설정">
            <SettingToggle
              description="목표 가격 이하로 내려가면 알림을 받아요."
              isOn={isPrimaryAlertOn}
              label="가격 알림"
              onToggle={() => handleChange(() => setIsPrimaryAlertOn((current) => !current))}
            />
            <div className="grid gap-2 px-4 py-3">
              <label className="text-sm font-semibold text-foreground" htmlFor="feed-target-price">목표 가격</label>
              <input
                id="feed-target-price"
                className="cut-sm h-10 w-full min-w-0 border border-muted bg-background px-3 text-sm tabular-nums text-foreground focus:border-primary"
                value={targetPrice}
                onChange={(event) => handleChange(() => setTargetPrice(event.target.value))}
              />
            </div>
          </section>
        )}

        {target.type === 'streamer' && (
          <section className="cut grid divide-y divide-border border border-border bg-surface" aria-label="스트리머 알림 설정">
            <SettingToggle
              description="방송이 시작되면 알림을 받아요."
              isOn={isPrimaryAlertOn}
              label="방송 알림"
              onToggle={() => handleChange(() => setIsPrimaryAlertOn((current) => !current))}
            />
            <SettingToggle
              description="채팅 이벤트와 참여 이벤트 알림을 받아요."
              isOn={isSecondaryAlertOn}
              label="채팅/이벤트 알림"
              onToggle={() => handleChange(() => setIsSecondaryAlertOn((current) => !current))}
            />
          </section>
        )}

        {target.type === 'artist' && (
          <section className="cut grid divide-y divide-border border border-border bg-surface" aria-label="아티스트 알림 설정">
            <SettingToggle
              description="싱글, 앨범, 선공개곡이 나오면 알림을 받아요."
              isOn={isPrimaryAlertOn}
              label="신곡/앨범 알림"
              onToggle={() => handleChange(() => setIsPrimaryAlertOn((current) => !current))}
            />
            <SettingToggle
              description="피처링, OST, 참여곡 발매 알림을 받아요."
              isOn={isSecondaryAlertOn}
              label="피처링/참여곡 알림"
              onToggle={() => handleChange(() => setIsSecondaryAlertOn((current) => !current))}
            />
          </section>
        )}

        <Card as="section" aria-label="설정 저장">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">설정 저장</p>
              <p className="mt-1 text-sm leading-5 text-muted">{isSaved ? 'mock 설정이 저장됐어요.' : '변경한 알림 조건을 저장해요.'}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link className="key grid h-10 place-items-center whitespace-nowrap px-4 text-sm font-semibold" href="/feed/me">
                취소
              </Link>
              <Button onClick={handleSave}>
                {isSaved ? '저장 완료' : '저장'}
              </Button>
            </div>
          </div>
        </Card>

        <Card as="section" aria-label="위험 작업">
          <p className="text-sm font-semibold text-foreground">관찰 대상 삭제</p>
          <p className="mt-2 text-sm leading-6 text-muted">mock 화면이라 실제 삭제는 진행하지 않아요. API 연결 후 관찰 목록에서 제거돼요.</p>
          <Button variant="secondary" className="mt-3">
            삭제
          </Button>
        </Card>
      </AppContent>

      <BottomNavigation
        items={[
          { label: '홈', href: '/feed', iconName: 'home' },
          { label: '인기', href: '/feed/popular', iconName: 'trophy' },
          { label: '관찰', href: '/feed/observations', iconName: 'barChart' },
          { label: '내 피드', href: '/feed/me', iconName: 'user', isActive: true },
        ]}
      />
    </AppFrame>
  );
}
