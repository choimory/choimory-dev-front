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
  domainPath: string;            // 서비스/도메인 경로 (예: 'blog / setting'), 로고 없이 텍스트만 표시
  title: string;                  // 섹션 제목
  headingId?: string;             // h2 id (부모 section의 aria-labelledby 연결용)
  action?: SectionHeaderAction;   // 우측에 배치할 선택적 액션 링크
};

/**
 * 페이지 내부에서 섹션을 구분할 때 공용으로 쓰는 헤더입니다. 로고 없이 eyebrow + 제목만 표시합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 섹션 헤더
 */
export function SectionHeader({ domainPath, title, headingId, action }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-3 px-1">
      <div className="min-w-0">
        <p className="text-sm font-bold text-primary">{domainPath}</p>
        <h2 id={headingId} className="mt-1 text-lg font-bold text-foreground">{title}</h2>
      </div>
      {action && (
        <Link className="shrink-0 text-sm font-bold text-primary" href={action.href}>
          {action.label}
        </Link>
      )}
    </div>
  );
}
