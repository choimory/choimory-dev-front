import { FeedMenuContainer } from '@/features/feed/container/FeedMenuContainer';

/**
 * feed 관찰 목록 화면의 라우팅 진입점입니다.
 *
 * @returns feed 관찰 목록 화면
 */
export default function FeedObservationsPage() {
  return <FeedMenuContainer menuKind="observations" />;
}
