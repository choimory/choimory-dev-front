import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { WideContent } from '@/shared/ui/WideContent';

import { GuestLandingSection } from './GuestLandingSection';
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
  return (
    <AppFrame>
      <AppTopBar size="wide" />
      <WideContent className="grid gap-5">
        <section className="mx-auto w-full max-w-[640px] py-2 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-normal text-foreground">choimory.dev</h1>
          <PlatformSearchBar />
        </section>

        <ServiceLauncherCard services={viewModel.services} />
        <GuestLandingSection />
      </WideContent>

      <BottomNavigation
        items={[
          { label: '홈', href: '/', iconName: 'home', isActive: true },
          { label: '서비스', href: '#', iconName: 'grid' },
          { label: '알림', href: '#', iconName: 'bell' },
          { label: '내 공간', href: '#', iconName: 'user' },
        ]}
        size="wide"
      />
    </AppFrame>
  );
}
