import { BrandLogo } from './BrandLogo';

/**
 * 페이지 소개 카드 컴포넌트의 Props
 */
type PageIntroCardProps = {
  domainPath: string;  // 로고 뒤에 이어지는 서비스/도메인 경로 (예: 'notice', 'blog / popular')
  title: string;       // 카드 제목
  description: string; // 카드 설명
};

/**
 * 서비스/도메인 목록 화면 상단에서 공용으로 쓰는 페이지 소개 영역입니다.
 * 카드 배경/테두리 없이 로고와 타이틀을 화면 배경 위에 바로 배치합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 페이지 소개 영역
 */
export function PageIntroCard({ domainPath, title, description }: PageIntroCardProps) {
  return (
    <div className="px-1">
      <p className="flex items-center gap-1 text-sm font-bold text-primary">
        <BrandLogo size="sm" />
        <span>/ {domainPath}</span>
      </p>
      <h1 className="mt-1 text-2xl font-black leading-tight text-foreground">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}
