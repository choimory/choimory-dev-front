/**
 * 페이지 소개 카드 컴포넌트의 Props
 */
type PageIntroCardProps = {
  domainPath: string;   // 서비스/도메인 경로 (예: 'notice', 'blog / popular'). 화면에는 표시하지 않음 (경로는 상단 바가 보여줌, design.md)
  title?: string;       // 카드 제목 (프로필 카드가 뒤따르는 화면은 생략 가능)
  description?: string; // 카드 설명 (도메인 목록 화면에서만 사용)
};

/**
 * 모든 화면 최상단에서 공용으로 쓰는 페이지 소개 영역입니다.
 * 카드 배경/테두리 없이 제목과 설명을 화면 배경 위에 바로 배치합니다.
 * 제목 위 로고+경로 라벨(eyebrow)은 쓰지 않습니다. 현재 위치는 상단 바의 로고와 경로가 보여줍니다.
 * title/description이 모두 없으면 아무것도 렌더링하지 않습니다 (예: 프로필 카드가 뒤따르는 내 blog/내 feed 화면).
 *
 * @param props 컴포넌트 Props
 * @returns 페이지 소개 영역 (제목·설명이 없으면 null)
 */
export function PageIntroCard({ title, description }: PageIntroCardProps) {
  if (!title && !description) {
    return null;
  }

  return (
    <div className="px-1">
      {title && <h1 className="font-display text-2xl font-semibold leading-tight tracking-display text-foreground">{title}</h1>}
      {description && <p className="mt-2 max-w-[60ch] text-sm leading-6 text-muted">{description}</p>}
    </div>
  );
}
