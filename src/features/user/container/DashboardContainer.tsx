'use client';

import { useRouter } from 'next/navigation';

import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { AppHeader } from '@/shared/ui/AppHeader';
import { BottomNav } from '@/shared/ui/BottomNav';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { ScreenLayout } from '@/shared/ui/ScreenLayout';

import { FeatureHighlight } from '../components/FeatureHighlight';
import { SectionCard } from '../components/SectionCard';
import { UserSummaryCard } from '../components/UserSummaryCard';
import { useUserSummary } from '../hooks/useUserSummary';

/** 홈 화면에 표시할 예시 콘텐츠 섹션 목록 */
const SAMPLE_SECTIONS = [2, 3, 4];

/**
 * 홈 화면의 데이터 흐름과 이벤트 흐름을 담당하는 Container입니다.
 *
 * @returns 홈 화면
 */
export function DashboardContainer() {
  const router = useRouter();
  const { logout } = useAuthSession();
  const { userSummary, isLoading } = useUserSummary();

  /**
   * 세션을 해제하고 로그인 화면으로 이동합니다.
   */
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <ScreenLayout>
      <AppHeader
        actions={
          <>
            <Button variant="ghost" onClick={handleLogout}>
              로그아웃
            </Button>
            <button type="button" className="p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </>
        }
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-6 py-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Welcome</h2>
            <p className="text-gray-600 dark:text-gray-300">
              This is a mobile app style layout for choimory-dev
            </p>
          </div>

          <div className="space-y-6">
            {/* 사용자 요약 정보는 조회 중에는 자리만 확보하고, 완료된 이후에 표시한다. */}
            {isLoading && (
              <Card>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  사용자 정보를 불러오는 중입니다.
                </p>
              </Card>
            )}
            {!isLoading && userSummary && (
              <UserSummaryCard userSummary={userSummary} onEditProfile={() => {}} />
            )}

            {SAMPLE_SECTIONS.map((sectionNumber) => (
              <SectionCard
                key={sectionNumber}
                title={`Section ${sectionNumber}`}
                description="This is a sample content section. You can add any content here that fits your needs."
                actionLabel={`Action ${sectionNumber}`}
                onAction={() => {}}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <FeatureHighlight />
          </div>
        </div>
      </main>

      <BottomNav />
    </ScreenLayout>
  );
}
