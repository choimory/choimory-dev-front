import { FeedMenuContainer } from '@/features/feed/container/FeedMenuContainer';

/**
 * feed 인기 화면의 라우팅 진입점입니다.
 *
 * @returns feed 인기 화면
 */
export default function FeedPopularPage() {
  return <FeedMenuContainer menuKind="popular" />;
}
