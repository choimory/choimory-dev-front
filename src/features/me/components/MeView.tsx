'use client';

import Link from 'next/link';
import { useState } from 'react';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { IconBadge } from '@/shared/ui/IconBadge';
import { Modal } from '@/shared/ui/Modal';

import { MeSettingCard } from './MeSettingCard';
import type { MeSettingItem, MeViewModel } from '../model/meTypes';

/**
 * 마이페이지 화면 컴포넌트의 Props
 */
type MeViewProps = {
  viewModel: MeViewModel; // 마이페이지 화면 데이터
};

/** 개인정보 입력창과 자기소개 입력 영역 공통 클래스 */
const PROFILE_FIELD_CLASS_NAME =
  'min-w-0 rounded-input border border-muted bg-background px-3 text-base font-normal text-foreground enabled:hover:border-ink-2 focus:border-primary focus-visible:outline-focus disabled:cursor-not-allowed disabled:bg-surface-strong disabled:text-muted';

/** 라디오 선택지를 감싸는 구분선 행 클래스 */
const OPTION_ROW_CLASS_NAME =
  'flex min-h-11 items-center justify-between gap-3 border-b border-border px-2 text-sm font-medium text-foreground has-[:enabled]:cursor-pointer has-[:enabled]:hover:bg-surface-strong has-[:enabled]:active:opacity-75 has-[:disabled]:text-muted';

/** 설정 라디오의 선택색과 키보드 포커스 클래스 */
const RADIO_CLASS_NAME = 'size-4 shrink-0 accent-primary focus-visible:outline-focus disabled:cursor-not-allowed';

/** 40px 키캡의 위아래를 2px씩 확장하는 터치 영역 */
const KEY_HIT_AREA_CLASS_NAME =
  'relative after:absolute after:-inset-y-0.5 after:inset-x-0 focus-visible:outline-focus motion-reduce:transform-none';

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

      <AppContent className="grid gap-5">
        <Card as="section" className="sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
              <IconBadge size="xl" tone="strong" className="text-section font-semibold text-ink-2">
                C
              </IconBadge>
              <div className="min-w-0">
                <h1 className="font-display text-display font-semibold text-foreground">{viewModel.nickname}</h1>
                <p className="mt-1 text-sm text-muted">{viewModel.email}</p>
              </div>
            </div>
            <Link className={`key hidden h-10 shrink-0 items-center px-4 text-sm font-semibold sm:inline-flex ${KEY_HIT_AREA_CLASS_NAME}`} href="/">
              홈
            </Link>
          </div>
          <p className="mt-3 border-t border-border pt-3 text-sm leading-6 text-muted">{viewModel.description}</p>
        </Card>

        <section className="cut grid border border-border bg-surface" aria-label="마이페이지 설정">
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
        <Modal labelledBy="me-setting-dialog-title" onClose={() => setSelectedSetting(null)} placement="bottom" overlay="dark" size="md" padding="lg" className="max-h-[calc(100dvh-2.5rem)] overflow-y-auto">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
            <h2 id="me-setting-dialog-title" className="min-w-0 font-display text-display-s font-semibold text-foreground">
              {selectedSetting.title}
            </h2>
            <Button type="button" variant="secondary" className={KEY_HIT_AREA_CLASS_NAME} onClick={() => setSelectedSetting(null)}>
              닫기
            </Button>
          </div>

          <div className="mt-5">
            {selectedSetting.id === 'profile' && (
              <div className="grid gap-3">
                <label className="grid gap-1 text-sm font-medium text-foreground">
                  이메일
                  <input className={`h-10 ${PROFILE_FIELD_CLASS_NAME}`} disabled value={viewModel.email} readOnly />
                </label>
                <label className="grid gap-1 text-sm font-medium text-foreground">
                  닉네임
                  <span className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                    <input className={`h-10 ${PROFILE_FIELD_CLASS_NAME}`} defaultValue={viewModel.nickname} />
                    <Button type="button" variant="secondary" className={KEY_HIT_AREA_CLASS_NAME}>
                      중복체크
                    </Button>
                  </span>
                </label>
                <label className="grid gap-1 text-sm font-medium text-foreground">
                  자기소개
                  <textarea className={`min-h-24 resize-none py-2 leading-6 ${PROFILE_FIELD_CLASS_NAME}`} defaultValue={viewModel.description} />
                </label>
                <div className="flex justify-end pt-2">
                  <Button className={KEY_HIT_AREA_CLASS_NAME}>
                    수정하기
                  </Button>
                </div>
              </div>
            )}

            {selectedSetting.id === 'theme' && (
              <div className="grid gap-3">
                <div>
                  <h3 className="text-title font-semibold text-foreground">테마 설정</h3>
                  <p className="mt-1 text-sm leading-5 text-muted">사이트 전체 테마 표시 방식을 선택해보세요.</p>
                </div>
                <div className="grid border-t border-border">
                  {['light', 'dark', 'system'].map((theme) => (
                    <label key={theme} className={OPTION_ROW_CLASS_NAME}>
                      <span>{theme}</span>
                      <input className={RADIO_CLASS_NAME} name="theme" type="radio" defaultChecked={theme === 'system'} />
                    </label>
                  ))}
                </div>
                <div className="flex justify-end pt-1">
                  <Button className={KEY_HIT_AREA_CLASS_NAME}>
                    저장
                  </Button>
                </div>
              </div>
            )}

            {selectedSetting.id === 'otp' && (
              <div className="grid gap-5">
                <div className="grid gap-3">
                  <div>
                    <h3 className="text-title font-semibold text-foreground">2차 인증 사용 여부</h3>
                    <p className="mt-1 text-sm leading-5 text-muted">로그인 후 추가 인증을 사용할지 선택해보세요.</p>
                  </div>
                  <div className="grid border-t border-border">
                    <label className={OPTION_ROW_CLASS_NAME}>
                      <span>사용</span>
                      <input className={RADIO_CLASS_NAME} name="otp-enabled" type="radio" defaultChecked />
                    </label>
                    <label className={OPTION_ROW_CLASS_NAME}>
                      <span>미사용</span>
                      <input className={RADIO_CLASS_NAME} name="otp-enabled" type="radio" />
                    </label>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div>
                    <h3 className="text-title font-semibold text-foreground">인증 방식</h3>
                    <p className="mt-1 text-sm leading-5 text-muted">2차 인증에 사용할 방식을 선택해보세요.</p>
                  </div>
                  <div className="grid border-t border-border">
                    <label className={OPTION_ROW_CLASS_NAME}>
                      <span>이메일 인증</span>
                      <input className={RADIO_CLASS_NAME} name="otp" type="radio" defaultChecked />
                    </label>
                    <label className={OPTION_ROW_CLASS_NAME}>
                      <span>모바일 앱 인증</span>
                      <span className="flex items-center gap-2">
                        <span className="text-xs">미구현</span>
                        <input className={RADIO_CLASS_NAME} name="otp" type="radio" disabled />
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <Button className={KEY_HIT_AREA_CLASS_NAME}>
                    저장
                  </Button>
                </div>
              </div>
            )}

            {selectedSetting.id === 'delete' && (
              <div>
                <h3 className="text-title font-semibold text-accent-red">회원 탈퇴</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  계정과 서비스 데이터를 정리하는 위험한 작업이에요. 실제 탈퇴 API가 연결되기 전까지는 화면 구조만 보여드려요.
                </p>
                <Button variant="outline-danger" className={`mt-4 ${KEY_HIT_AREA_CLASS_NAME}`}>
                  탈퇴 절차 확인
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </AppFrame>
  );
}
