import Link from 'next/link';

import { StatCard } from '@/shared/ui/StatCard';

import type { BlogRelationUser } from './BlogRelationModal';

/**
 * blog 사용자 프로필 mock 데이터
 */
export type BlogUserProfile = {
  nickname: string;       // 사용자 닉네임
  initial: string;        // 프로필 이니셜
  description: string;    // 자기소개
  postCount: number;      // 작성 글 수
  followerCount: number;  // 팔로워 수
  followingCount: number; // 팔로잉 수
};

/** blog 프로필 mock 데이터 */
export const BLOG_USER_PROFILE: BlogUserProfile = {
  nickname: 'mory.dev',
  initial: 'M',
  description: 'choimory.dev의 서비스 화면과 인터랙션을 차근차근 다듬고 있습니다.',
  postCount: 12,
  followerCount: 128,
  followingCount: 36,
};

/** 팔로워 mock 데이터 */
export const BLOG_FOLLOWERS: BlogRelationUser[] = [
  { id: 'follower-1', nickname: 'jin.note', initial: 'J', summary: '개발 노트와 UI 메모를 기록' },
  { id: 'follower-2', nickname: 'ui.archive', initial: 'U', summary: '작은 인터랙션 패턴 수집' },
  { id: 'follower-3', nickname: 'nav.lab', initial: 'N', summary: '서비스 네비게이션 구조 연구' },
  { id: 'follower-4', nickname: 'feed.watch', initial: 'F', summary: '관찰 피드와 알림 흐름 기록' },
  { id: 'follower-5', nickname: 'route.log', initial: 'R', summary: '라우팅 구조를 정리하는 개발자' },
  { id: 'follower-6', nickname: 'design.memo', initial: 'D', summary: '작은 화면 설계 메모' },
];

/** 팔로잉 mock 데이터 */
export const BLOG_FOLLOWINGS: BlogRelationUser[] = [
  { id: 'following-1', nickname: 'jin.note', initial: 'J', summary: '개발 노트와 UI 메모를 기록' },
  { id: 'following-2', nickname: 'ui.archive', initial: 'U', summary: '작은 인터랙션 패턴 수집' },
  { id: 'following-3', nickname: 'feed.watch', initial: 'F', summary: '관찰 피드와 알림 흐름 기록' },
  { id: 'following-4', nickname: 'nav.lab', initial: 'N', summary: '서비스 네비게이션 구조 연구' },
  { id: 'following-5', nickname: 'build.note', initial: 'B', summary: '빌드와 배포 체크리스트 기록' },
  { id: 'following-6', nickname: 'comment.lab', initial: 'C', summary: '댓글 인터랙션 실험 기록' },
];

/**
 * blog 활동 카운팅 항목 (내 댓글, 좋아요, 북마크 등 내 blog 전용 확장 통계)
 */
type BlogActivityStat = {
  label: string; // 통계 라벨
  value: string; // 통계 값
};

/**
 * blog 프로필 카드 컴포넌트의 Props
 */
type BlogProfileCardProps = {
  headingId: string;                                            // 닉네임 제목 요소 id
  profile: BlogUserProfile;                                     // 표시할 프로필 데이터
  onSelectRelation: (kind: 'followers' | 'following') => void;  // 팔로워/팔로잉 카드 클릭 핸들러
  profileHref?: string;                                         // 있으면 아바타/닉네임을 공개 blog로 이동하는 링크로 감쌈
  extraStats?: BlogActivityStat[];                              // 기본 3개 카운팅 카드 뒤에 이어 붙일 추가 카운팅 (내 blog 전용)
};

/**
 * 아바타, 닉네임, 소개와 작성 글/팔로워/팔로잉 카운팅을 보여주는 공용 blog 프로필 카드입니다.
 * 유저 blog 메인 화면과 내 blog 관리 화면에서 공용으로 사용합니다.
 *
 * @param props 컴포넌트 Props
 * @returns blog 프로필 카드
 */
export function BlogProfileCard({ headingId, profile, onSelectRelation, profileHref, extraStats }: BlogProfileCardProps) {
  const header = (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
      <div className="grid size-16 place-items-center rounded-3xl bg-primary text-xl font-black text-primary-foreground">
        {profile.initial}
      </div>
      <div className="min-w-0">
        <h1 id={headingId} className="text-2xl font-black leading-tight text-foreground">
          {profile.nickname}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">{profile.description}</p>
      </div>
    </div>
  );

  return (
    <section className="rounded-3xl border border-border bg-surface p-5" aria-labelledby={headingId}>
      {profileHref ? (
        <Link className="block" href={profileHref} aria-label={`${profile.nickname} 공개 블로그로 이동`}>
          {header}
        </Link>
      ) : (
        header
      )}

      <div className="mt-4 grid grid-cols-3 gap-2">
        <StatCard label="작성 글" value={`${profile.postCount}`} />
        <StatCard label="팔로워" value={`${profile.followerCount}`} onClick={() => onSelectRelation('followers')} />
        <StatCard label="팔로잉" value={`${profile.followingCount}`} onClick={() => onSelectRelation('following')} />
        {extraStats?.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>
    </section>
  );
}
