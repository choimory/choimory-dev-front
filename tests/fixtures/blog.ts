import type { BlogRelationUser } from '@/features/blog/components/BlogRelationModal';
import type { BlogFeedTab, BlogPost } from '@/features/blog/model/blogTypes';

/** 테스트용 게시글 목록 (이미지 있음 1개, 없음 1개) */
export const BLOG_POSTS_FIXTURE: BlogPost[] = [
  {
    id: 'post-1',
    authorName: 'mory.dev',
    authorInitial: 'M',
    meta: '프론트 구성 기획 · 8분 전',
    title: '중앙 피드 폭 고정하기',
    content: '중앙 피드 폭을 고정하면 모바일 앱 같은 느낌을 유지할 수 있어요.',
    tags: ['frontend', 'layout'],
    likeCount: 128,
    commentCount: 24,
    hasMedia: true,
  },
  {
    id: 'post-2',
    authorName: 'jin.note',
    authorInitial: 'J',
    meta: '개발 노트 · 32분 전',
    title: '전역 메뉴는 가볍게',
    content: '서비스 내부 화면은 모바일처럼 길쭉하게 유지해요.',
    tags: ['platform'],
    likeCount: 42,
    commentCount: 7,
    hasMedia: false,
  },
];

/** 테스트용 피드 탭 목록 */
export const BLOG_TABS_FIXTURE: BlogFeedTab[] = [
  { label: '추천', isActive: true },
  { label: '팔로잉', isActive: false },
];

/** 테스트용 관계 사용자 7명 (한 페이지 3명 기준으로 3페이지) */
export const BLOG_RELATION_USERS_FIXTURE: BlogRelationUser[] = Array.from({ length: 7 }, (_, index) => ({
  id: `user-${index + 1}`,
  nickname: `user.${index + 1}`,
  initial: `${index + 1}`,
  summary: `${index + 1}번째 사용자 소개`,
}));
