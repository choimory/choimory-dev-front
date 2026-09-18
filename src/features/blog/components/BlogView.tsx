import Link from 'next/link';

import { AppFrame } from '@/shared/ui/AppFrame';
import { AppTopBar } from '@/shared/ui/AppTopBar';
import { BottomNavigation } from '@/shared/ui/BottomNavigation';
import { Icon } from '@/shared/ui/Icon';
import { NarrowContent } from '@/shared/ui/NarrowContent';

import { BlogGuestSection } from './BlogGuestSection';
import { BlogMemberFeedSection } from './BlogMemberFeedSection';
import type { BlogViewModel } from '../model/blogTypes';

/**
 * blog 화면 컴포넌트의 Props
 */
type BlogViewProps = {
  viewModel: BlogViewModel; // blog 화면 데이터
};

/**
 * blog 서비스의 피드 화면입니다.
 *
 * @param props 컴포넌트 Props
 * @returns blog 피드 화면
 */
export function BlogView({ viewModel }: BlogViewProps) {
  const isMember = viewModel.authStatus === 'member';

  return (
    <AppFrame>
      <AppTopBar
        isLoggedIn={isMember}
        serviceName="blog"
        serviceHref="/blog"
        leading={
          <Link className="grid size-10 place-items-center rounded-[10px] text-foreground" href="/" aria-label="플랫폼 홈으로 돌아가기">
            <Icon name="chevronLeft" />
          </Link>
        }
      />

      <NarrowContent className="grid gap-3">
        {isMember ? (
          <BlogMemberFeedSection posts={viewModel.posts} tabs={viewModel.tabs} />
        ) : (
          <BlogGuestSection posts={viewModel.posts} />
        )}
      </NarrowContent>

      <BottomNavigation
        items={[
          { label: '피드', href: '/blog', iconName: 'menu', isActive: true },
          { label: '인기', href: '#', iconName: 'star' },
          { label: '작성', href: '#', iconName: 'plus' },
          { label: '홈', href: '/', iconName: 'home' },
        ]}
      />
    </AppFrame>
  );
}
