import Link from 'next/link';

/**
 * 섹션 헤더 우측 액션 링크
 */
type SectionHeaderAction = {
  label: string; // 링크 라벨
  href: string;  // 이동 경로
};

/**
 * 섹션 헤더 컴포넌트의 Props
 */
type SectionHeaderProps = {
  domainPath: string;            // 서비스/도메인 경로 (예: 'blog / setting'). 화면에는 표시하지 않음 (경로는 상단 바가 보여줌, design.md)
  title: string;                  // 섹션 제목
  headingId?: string;             // h2 id (부모 section의 aria-labelledby 연결용)
  action?: SectionHeaderAction;   // 우측에 배치할 선택적 액션 링크
};

/**
 * 페이지 내부에서 섹션을 구분할 때 공용으로 쓰는 헤더입니다. 제목과 선택적 액션 링크만 표시합니다.
 * 제목 위 경로 라벨(eyebrow)은 쓰지 않습니다. 현재 위치는 상단 바의 경로가 보여줍니다.
 *
 * @param props 컴포넌트 Props
 * @returns 섹션 헤더
 */
export function SectionHeader({ title, headingId, action }: SectionHeaderProps) {
  return (
    <div className="flex items-baseline justify-between gap-3 px-1 pt-4">
      <h2 id={headingId} className="min-w-0 font-display text-lg font-semibold tracking-display text-foreground">{title}</h2>
      {action && (
        <Link className="shrink-0 text-sm font-medium text-primary underline-offset-4 hover:underline" href={action.href}>
          {action.label}
        </Link>
      )}
    </div>
  );
}
