'use client';

import { useState } from 'react';

import { Chip } from '@/shared/ui/Chip';
import { ListRow } from '@/shared/ui/ListRow';
import { SegmentedTabs } from '@/shared/ui/SegmentedTabs';

/** 인기 랭킹 탭 종류 */
type BlogRankingTabId = 'search' | 'mention' | 'follower' | 'tag';

/**
 * 인기 랭킹 탭
 */
type BlogRankingTab = {
  id: BlogRankingTabId; // 탭 ID
  label: string;        // 탭 이름
};

/**
 * 인기 랭킹 항목
 */
type BlogRankingItem = {
  id: string;           // 랭킹 항목 ID
  rank: number;         // 현재 순위
  label: string;        // 랭킹 표시 이름
  description: string;  // 보조 설명
  valueText: string;    // 숫자 지표
  trend: 'up' | 'down' | 'same' | 'new'; // 순위 변동 상태
};

/** 인기 랭킹 탭 목록 */
const BLOG_RANKING_TABS: BlogRankingTab[] = [
  { id: 'search', label: '검색어' },
  { id: 'mention', label: '멘션' },
  { id: 'follower', label: '팔로워' },
  { id: 'tag', label: '태그' },
];

/** blog 인기 랭킹 mock 데이터 */
const BLOG_RANKING_ITEMS: Record<BlogRankingTabId, BlogRankingItem[]> = {
  search: [
    { id: 'search-1', rank: 1, label: '프론트 화면 구조', description: '상세 화면과 메뉴 연결 검색이 늘었어요.', valueText: '12', trend: 'up' },
    { id: 'search-2', rank: 2, label: '피드 관찰 UX', description: '관찰 목록과 알림 설정 글이 주목받고 있어요.', valueText: 'NEW', trend: 'new' },
    { id: 'search-3', rank: 3, label: '블로그 댓글 개선', description: '댓글, 대댓글, 멘션 UI 논의가 이어지고 있어요.', valueText: '2', trend: 'down' },
    { id: 'search-4', rank: 4, label: '유저 블로그 라우팅', description: '내 블로그를 유저 페이지로 합치는 흐름이 검색되고 있어요.', valueText: '6', trend: 'up' },
    { id: 'search-5', rank: 5, label: '팔로잉 목록 검색', description: '관계 목록을 빠르게 찾는 UI가 함께 언급돼요.', valueText: '1', trend: 'same' },
  ],
  mention: [
    { id: 'mention-1', rank: 1, label: '@mory.dev', description: '화면 구조 글에서 가장 많이 언급됐어요.', valueText: '18회', trend: 'up' },
    { id: 'mention-2', rank: 2, label: '@jin.note', description: '개발 노트 댓글에서 멘션이 늘었어요.', valueText: '11회', trend: 'up' },
    { id: 'mention-3', rank: 3, label: '@ui.archive', description: '상세보기 개선 글에 자주 연결돼요.', valueText: '7회', trend: 'same' },
    { id: 'mention-4', rank: 4, label: '@nav.lab', description: '서비스 내비게이션 글에서 새로 언급돼요.', valueText: '5회', trend: 'new' },
    { id: 'mention-5', rank: 5, label: '@feed.watch', description: '관찰 피드 사례와 함께 멘션돼요.', valueText: '2회', trend: 'down' },
  ],
  follower: [
    { id: 'follower-1', rank: 1, label: 'mory.dev', description: '최근 화면 기획 글 이후 팔로워가 늘었어요.', valueText: '24명', trend: 'up' },
    { id: 'follower-2', rank: 2, label: 'jin.note', description: '짧은 개발 메모가 꾸준히 저장되고 있어요.', valueText: '15명', trend: 'up' },
    { id: 'follower-3', rank: 3, label: 'ui.archive', description: 'UI 패턴 아카이브 유입이 안정적이에요.', valueText: '9명', trend: 'same' },
    { id: 'follower-4', rank: 4, label: 'nav.lab', description: '메뉴 구조 정리 글 이후 팔로워가 늘었어요.', valueText: '7명', trend: 'up' },
    { id: 'follower-5', rank: 5, label: 'feed.watch', description: '가격 알림 사례가 다시 읽히고 있어요.', valueText: '3명', trend: 'down' },
  ],
  tag: [
    { id: 'tag-1', rank: 1, label: '#frontend', description: '상세 화면과 레이아웃 글에서 클릭이 많아요.', valueText: '42회', trend: 'up' },
    { id: 'tag-2', rank: 2, label: '#feed', description: 'feed 서비스 화면과 함께 자주 이동해요.', valueText: '29회', trend: 'up' },
    { id: 'tag-3', rank: 3, label: '#comment', description: '댓글 UX 개선 글에서 반복 클릭돼요.', valueText: '16회', trend: 'new' },
    { id: 'tag-4', rank: 4, label: '#profile', description: '유저 블로그 프로필 카드에서 클릭돼요.', valueText: '12회', trend: 'up' },
    { id: 'tag-5', rank: 5, label: '#following', description: '관계 목록 개선 글에서 함께 쓰여요.', valueText: '8회', trend: 'same' },
  ],
};

/** 인기 랭킹 상태별 badge 클래스 */
const RANKING_TREND_CLASS_NAME: Record<BlogRankingItem['trend'], string> = {
  up: 'bg-primary-soft text-primary',
  down: 'bg-accent-red/15 text-accent-red',
  same: 'bg-surface text-muted',
  new: 'bg-accent-green-soft text-accent-green',
};

/** 인기 랭킹 상태별 아이콘 */
const RANKING_TREND_ICON: Record<BlogRankingItem['trend'], string> = {
  up: '↑',
  down: '↓',
  same: '-',
  new: '+',
};

/**
 * blog 인기 화면 상단 랭킹 카드입니다.
 *
 * @returns 인기 랭킹 섹션
 */
export function BlogPopularInsightSection() {
  const [activeTabId, setActiveTabId] = useState<BlogRankingTabId>('search');
  const rankingItems = BLOG_RANKING_ITEMS[activeTabId];

  return (
    <section className="rounded-3xl border border-border bg-surface p-5" aria-labelledby="blog-popular-ranking-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-primary">blog / ranking</p>
          <h2 id="blog-popular-ranking-title" className="mt-1 text-xl font-black leading-tight text-foreground">
            실시간 랭킹
          </h2>
        </div>
        <Chip>
          지금
        </Chip>
      </div>

      <SegmentedTabs className="mt-4" items={BLOG_RANKING_TABS} activeId={activeTabId} ariaLabel="인기 랭킹 종류" onChange={setActiveTabId} />

      <div className="mt-4 grid gap-2">
        {rankingItems.map((item, index) => (
          <ListRow
            key={item.id}
            as="article"
            tone="strong"
            className="blog-ranking-enter"
            style={{ animationDelay: `${index * 70}ms` }}
            leading={(
              <span className="grid size-9 place-items-center rounded-xl bg-surface text-sm font-black text-primary">
                {item.rank}
              </span>
            )}
            trailing={(
              <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${RANKING_TREND_CLASS_NAME[item.trend]}`}>
                <span aria-hidden="true">{RANKING_TREND_ICON[item.trend]}</span>
                {item.valueText}
              </span>
            )}
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-foreground">{item.label}</span>
              <span className="mt-1 block text-xs leading-4 text-muted">{item.description}</span>
            </span>
          </ListRow>
        ))}
      </div>
    </section>
  );
}
