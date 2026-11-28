import { FeedMenuContainer } from '@/features/feed/container/FeedMenuContainer';

/**
 * 내 feed 화면의 라우팅 진입점입니다.
 *
 * @returns 내 feed 화면
 */
export default function FeedMePage() {
  return <FeedMenuContainer menuKind="me" />;
}
