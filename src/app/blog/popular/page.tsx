import { BlogMenuContainer } from '@/features/blog/container/BlogMenuContainer';

/**
 * blog 인기 글 화면의 라우팅 진입점입니다.
 *
 * @returns blog 인기 글 화면
 */
export default function BlogPopularPage() {
  return <BlogMenuContainer menuKind="popular" />;
}
