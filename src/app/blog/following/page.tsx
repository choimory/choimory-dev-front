import { BlogMenuContainer } from '@/features/blog/container/BlogMenuContainer';

/**
 * blog 팔로잉 피드 화면의 라우팅 진입점입니다.
 *
 * @returns blog 팔로잉 피드 화면
 */
export default function BlogFollowingPage() {
  return <BlogMenuContainer menuKind="following" />;
}
