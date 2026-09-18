import Link from 'next/link';

import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';

import { MeSettingCard } from './MeSettingCard';
import type { MeViewModel } from '../model/meTypes';

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
            <MeSettingCard key={item.id} item={item} />
          ))}
        </section>
      </AppContent>

      <BottomNavigation
        items={[
          { label: '홈', href: '/', iconName: 'home' },
          { label: '서비스', href: '#', iconName: 'grid' },
          { label: '알림', href: '#', iconName: 'bell' },
          { label: '내 공간', href: '/me', iconName: 'user', isActive: true },
        ]}
      />
    </AppFrame>
  );
}
