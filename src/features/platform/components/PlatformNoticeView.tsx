import { AppContent } from '@/shared/ui/AppContent';
import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';

/** 공지사항 임시 데이터 */
const PLATFORM_NOTICES = [
  {
    id: 'notice-1',
    title: '서비스 화면 구조를 확장 중입니다',
    description: '하단 메뉴와 상세 화면을 연결하는 작업을 진행하고 있습니다.',
    dateText: '2026.09.19',
  },
  {
    id: 'notice-2',
    title: '블로그와 피드 상세 화면 준비',
    description: '게시글, 관찰 항목, 알림 상세를 먼저 mock 화면으로 구성합니다.',
    dateText: '2026.09.19',
  },
];

/**
 * 플랫폼 공지사항 화면 컴포넌트의 Props
 */
type PlatformNoticeViewProps = {
  isLoggedIn: boolean; // 로그인 여부
};

/**
 * 플랫폼 공지사항 메뉴 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 플랫폼 공지사항 화면
 */
export function PlatformNoticeView({ isLoggedIn }: PlatformNoticeViewProps) {
  return (
    <AppFrame>
      <AppTopBar isLoggedIn={isLoggedIn} />
      <AppContent className="grid gap-4">
        <section className="rounded-3xl border border-border bg-surface p-5" aria-labelledby="notice-title">
          <p className="text-sm font-bold text-primary">choimory.dev / notice</p>
          <h1 id="notice-title" className="mt-1 text-2xl font-black leading-tight text-foreground">
            공지사항
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            플랫폼과 하위 서비스의 변경사항을 모아봅니다.
          </p>
        </section>

        <section className="grid gap-3" aria-label="공지사항 목록">
          {PLATFORM_NOTICES.map((notice) => (
            <article key={notice.id} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-bold text-foreground">{notice.title}</h2>
                <time className="shrink-0 text-xs text-muted">{notice.dateText}</time>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{notice.description}</p>
            </article>
          ))}
        </section>
      </AppContent>

      <BottomNavigation
        items={[
          { label: '홈', href: '/', iconName: 'home' },
          { label: '공지사항', href: '/notice', iconName: 'megaphone', isActive: true },
          { label: '서비스', href: '/services', iconName: 'grid' },
          { label: '내 정보', href: '/me', iconName: 'user' },
        ]}
      />
    </AppFrame>
  );
}
