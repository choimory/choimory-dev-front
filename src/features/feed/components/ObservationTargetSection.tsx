import { SectionHeader } from '@/shared/ui/SectionHeader';
import { StatCard } from '@/shared/ui/StatCard';

import { TargetListLink } from './TargetListLink';
import type { FeedWatchTarget } from '../model/feedTypes';

/**
 * 관찰 중인 대상의 종류별 요약 카운팅과 대상 목록을 보여줍니다.
 *
 * @param props 컴포넌트 Props
 * @returns 관찰 대상 섹션
 */
export function ObservationTargetSection({ targets }: { targets: FeedWatchTarget[] }) {
  return (
    <section aria-labelledby="feed-watching-target-title">
      <div className="grid grid-cols-2 gap-3 min-[360px]:grid-cols-4" aria-label="관찰 대상 요약">
        <StatCard label="관찰 중" value={`${targets.length}`} />
        <StatCard label="아이템" value={`${targets.filter((target) => target.type === 'item').length}`} />
        <StatCard label="스트리머" value={`${targets.filter((target) => target.type === 'streamer').length}`} />
        <StatCard label="아티스트" value={`${targets.filter((target) => target.type === 'artist').length}`} />
      </div>
      <div className="mt-6 grid gap-1">
        <SectionHeader domainPath="feed / target" title="관찰 중인 대상" headingId="feed-watching-target-title" />
        <div className="grid">
          {targets.map((target) => (
            <TargetListLink
              key={target.id}
              href={`/feed/targets/${target.id}`}
              rightText={target.trendText}
              target={target}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
