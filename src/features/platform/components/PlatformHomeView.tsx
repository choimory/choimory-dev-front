import { AppFrame } from '@/shared/ui/AppFrame';
import { AppContent } from '@/shared/ui/AppContent';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';

import { GuestLandingSection } from './GuestLandingSection';
import { MemberServiceFeedSection } from './MemberServiceFeedSection';
import { PlatformSearchBar } from './PlatformSearchBar';
import { ServiceLauncherCard } from './ServiceLauncherCard';
import type { PlatformHomeViewModel } from '../model/platformHomeTypes';

/**
 * 플랫폼 홈 화면 컴포넌트의 Props
 */
type PlatformHomeViewProps = {
  viewModel: PlatformHomeViewModel; // 플랫폼 홈 화면 데이터
};

/**
 * 여러 하위 서비스로 진입하는 포털형 플랫폼 홈 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 플랫폼 홈 화면
 */
export function PlatformHomeView({ viewModel }: PlatformHomeViewProps) {
  const isMember = viewModel.authStatus === 'member';

  return (
    <AppFrame>
      <AppTopBar isLoggedIn={isMember} />
      <AppContent className="grid gap-5">
        <section className="mx-auto w-full max-w-[640px] py-2 text-center">
          <h1 className="leading-tight tracking-normal">
            <BrandLogo size="lg" />
          </h1>
          <PlatformSearchBar />
        </section>

        <ServiceLauncherCard services={viewModel.services} />
        {isMember ? (
          <MemberServiceFeedSection
            recentActivities={viewModel.recentActivities}
            services={viewModel.services}
            todaySummaries={viewModel.todaySummaries}
          />
        ) : (
          <GuestLandingSection services={viewModel.services} />
        )}
      </AppContent>

      <BottomNavigation
        items={[
          { label: '홈', href: '/', iconName: 'home', isActive: true },
          { label: '공지사항', href: '#', iconName: 'megaphone' },
          { label: '서비스', href: '#', iconName: 'grid' },
          { label: '내 정보', href: '/me', iconName: 'user' },
        ]}
      />
    </AppFrame>
  );
}
