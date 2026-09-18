import type { CSSProperties } from 'react';

/**
 * 브랜드 로고 컴포넌트의 Props
 */
type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg'; // 로고 표시 크기
};

/** 로고 크기별 클래스 */
const BRAND_LOGO_SIZE_CLASS_NAME: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl',
};

/** 브랜드 로고 텍스트 */
const BRAND_LOGO_TEXT = '{choimory.dev()}';

/**
 * 브랜드 로고 조각
 */
type BrandLogoSegment = {
  value: string;      // 화면에 표시할 텍스트 조각
  className?: string; // 텍스트 조각 강조 색상 클래스
};

/** 브랜드 로고를 구성하는 색상 조각 목록 */
const BRAND_LOGO_SEGMENTS: BrandLogoSegment[] = [
  { value: '{', className: 'text-primary' },
  { value: 'choimory' },
  { value: '.', className: 'text-accent-green' },
  { value: 'dev' },
  { value: '(', className: 'text-accent-orange' },
  { value: ')', className: 'text-accent-orange' },
  { value: '}', className: 'text-primary' },
];

/** 브랜드 로고 애니메이션 CSS 변수 */
const BRAND_LOGO_STYLE = {
  '--brand-logo-character-count': BRAND_LOGO_TEXT.length,
} as CSSProperties;

/**
 * choimory.dev 브랜드를 개발자 감성의 텍스트 로고로 표시합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 브랜드 로고
 */
export function BrandLogo({ size = 'md' }: BrandLogoProps) {
  return (
    <span
      className={`brand-logo-typewriter inline-block font-mono font-black tracking-normal text-foreground ${BRAND_LOGO_SIZE_CLASS_NAME[size]}`}
      style={BRAND_LOGO_STYLE}
      aria-label="choimory.dev"
    >
      <span className="inline-flex">
        {BRAND_LOGO_SEGMENTS.map((segment, index) => (
          <span key={`${segment.value}-${index}`} className={segment.className}>
            {segment.value}
          </span>
        ))}
      </span>
    </span>
  );
}
