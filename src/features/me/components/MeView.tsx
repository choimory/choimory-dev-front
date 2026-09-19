'use client';

import Link from 'next/link';
import { useState } from 'react';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';

import { MeSettingCard } from './MeSettingCard';
import type { MeSettingItem, MeViewModel } from '../model/meTypes';

/**
 * 마이페이지 화면 컴포넌트의 Props
 */
type MeViewProps = {
  viewModel: MeViewModel; // 마이페이지 화면 데이터
};

/**
 * 개인정보와 사이트 설정을 관리하는 마이페이지 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 마이페이지 화면
 */
export function MeView({ viewModel }: MeViewProps) {
  const [selectedSetting, setSelectedSetting] = useState<MeSettingItem | null>(null);

  return (
    <AppFrame>
      <AppTopBar isLoggedIn />

      <AppContent className="grid gap-4">
        <section className="rounded-3xl border border-border bg-surface p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
              <div className="grid size-16 place-items-center rounded-3xl bg-primary text-xl font-black text-primary-foreground">
                C
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-normal text-foreground">{viewModel.nickname}</h1>
                <p className="mt-1 text-sm text-muted">{viewModel.email}</p>
                <p className="mt-2 text-sm leading-5 text-muted">{viewModel.description}</p>
              </div>
            </div>
            <Link className="hidden h-10 shrink-0 place-items-center rounded-[10px] bg-primary px-4 text-sm font-bold text-primary-foreground sm:grid" href="/">
              홈
            </Link>
          </div>
        </section>

        <section className="grid gap-3" aria-label="마이페이지 설정">
          {viewModel.settingItems.map((item) => (
            <MeSettingCard key={item.id} item={item} onSelect={setSelectedSetting} />
          ))}
        </section>
      </AppContent>

      <BottomNavigation
        items={[
          { label: '홈', href: '/', iconName: 'home' },
          { label: '공지사항', href: '/notice', iconName: 'megaphone' },
          { label: '서비스', href: '/services', iconName: 'grid' },
          { label: '내 정보', href: '/me', iconName: 'user', isActive: true },
        ]}
      />

      {selectedSetting && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/60 px-4 py-5 backdrop-blur-sm sm:place-items-center" role="presentation" onClick={() => setSelectedSetting(null)}>
          <section className="w-full max-w-[560px] rounded-3xl border border-border bg-surface p-5 shadow-[0_24px_80px_rgba(0,0,0,0.34)]" role="dialog" aria-modal="true" aria-labelledby="me-setting-dialog-title" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-primary">me / settings</p>
                <h2 id="me-setting-dialog-title" className="mt-1 text-xl font-black leading-tight text-foreground">
                  {selectedSetting.title}
                </h2>
              </div>
              <button className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-surface-strong text-sm font-bold text-muted" type="button" onClick={() => setSelectedSetting(null)}>
                닫기
              </button>
            </div>

            <div className="mt-5">
              {selectedSetting.id === 'profile' && (
                <div className="grid gap-3">
                  <label className="grid gap-1 text-sm font-bold text-foreground">
                    이메일
                    <input className="h-11 rounded-[10px] border border-border bg-surface-strong px-3 text-sm font-normal text-muted" disabled value={viewModel.email} readOnly />
                  </label>
                  <label className="grid gap-1 text-sm font-bold text-foreground">
                    닉네임
                    <span className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                      <input className="h-11 min-w-0 rounded-[10px] border border-border bg-surface px-3 text-sm font-normal text-foreground" defaultValue={viewModel.nickname} />
                      <button className="h-11 rounded-[10px] bg-surface-strong px-3 text-sm font-bold text-foreground" type="button">
                        중복체크
                      </button>
                    </span>
                  </label>
                  <label className="grid gap-1 text-sm font-bold text-foreground">
                    자기소개
                    <textarea className="min-h-24 resize-none rounded-[10px] border border-border bg-surface px-3 py-3 text-sm font-normal leading-6 text-foreground" defaultValue={viewModel.description} />
                  </label>
                  <div className="flex justify-end pt-2">
                    <button className="h-10 rounded-[10px] bg-primary px-4 text-sm font-bold text-primary-foreground" type="button">
                      수정하기
                    </button>
                  </div>
                </div>
              )}

              {selectedSetting.id === 'theme' && (
                <div className="grid gap-3 rounded-2xl border border-border bg-surface-strong p-4">
                  <div>
                    <h3 className="text-base font-bold text-foreground">테마 설정</h3>
                    <p className="mt-1 text-sm leading-5 text-muted">사이트 전체 테마 표시 방식을 선택합니다.</p>
                  </div>
                  <div className="grid gap-2">
                    {['light', 'dark', 'system'].map((theme) => (
                      <label key={theme} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3 text-sm font-bold text-foreground">
                        <span>{theme}</span>
                        <input name="theme" type="radio" defaultChecked={theme === 'system'} />
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-end pt-1">
                    <button className="h-10 rounded-[10px] bg-primary px-4 text-sm font-bold text-primary-foreground" type="button">
                      저장
                    </button>
                  </div>
                </div>
              )}

              {selectedSetting.id === 'otp' && (
                <div className="grid gap-3">
                  <div className="grid gap-3 rounded-2xl border border-border bg-surface-strong p-4">
                    <div>
                      <h3 className="text-base font-bold text-foreground">2차 인증 사용 여부</h3>
                      <p className="mt-1 text-sm leading-5 text-muted">로그인 후 추가 인증을 사용할지 선택합니다.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3 text-sm font-bold text-foreground">
                        <span>사용</span>
                        <input name="otp-enabled" type="radio" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3 text-sm font-bold text-foreground">
                        <span>미사용</span>
                        <input name="otp-enabled" type="radio" />
                      </label>
                    </div>
                  </div>
                  <div className="grid gap-3 rounded-2xl border border-border bg-surface-strong p-4">
                    <div>
                      <h3 className="text-base font-bold text-foreground">인증 방식</h3>
                      <p className="mt-1 text-sm leading-5 text-muted">2차 인증에 사용할 방식을 선택합니다.</p>
                    </div>
                    <label className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3 text-sm font-bold text-foreground">
                      <span>이메일 인증</span>
                      <input name="otp" type="radio" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3 text-sm font-bold text-muted">
                      <span>모바일 앱 인증</span>
                      <span className="flex items-center gap-2">
                        <span className="rounded-full bg-surface-strong px-2.5 py-1 text-xs">미구현</span>
                        <input name="otp" type="radio" disabled />
                      </span>
                    </label>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button className="h-10 rounded-[10px] bg-primary px-4 text-sm font-bold text-primary-foreground" type="button">
                      저장
                    </button>
                  </div>
                </div>
              )}

              {selectedSetting.id === 'delete' && (
                <div className="rounded-2xl border border-accent-red bg-surface-strong p-4">
                  <h3 className="text-base font-bold text-accent-red">회원 탈퇴</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    계정과 서비스 데이터를 정리하는 위험 작업입니다. 실제 탈퇴 API가 연결되기 전까지는 화면 구조만 표시합니다.
                  </p>
                  <button className="mt-4 h-10 rounded-[10px] border border-accent-red px-4 text-sm font-bold text-accent-red" type="button">
                    탈퇴 절차 확인
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </AppFrame>
  );
}
