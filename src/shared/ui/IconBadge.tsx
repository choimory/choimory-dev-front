import type { HTMLAttributes } from 'react';

/**
 * 원형 아이콘 배지 컴포넌트의 Props
 */
type IconBadgeProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'span';                              // 렌더링할 태그 (기본 div)
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';          // 지름 (xs 24px, sm 32px, md 36px, 기본 lg 40px, xl 48px)
  tone?: 'primary' | 'soft' | 'strong' | 'surface'; // 색상 톤 (기본 soft)
};

/** 배지 크기별 클래스 */
const ICON_BADGE_SIZE_CLASS_NAME: Record<NonNullable<IconBadgeProps['size']>, string> = {
  xs: 'size-6',
  sm: 'size-8',
  md: 'size-9',
  lg: 'size-10',
  xl: 'size-12',
};

/** 배지 색상 톤별 클래스 */
const ICON_BADGE_TONE_CLASS_NAME: Record<NonNullable<IconBadgeProps['tone']>, string> = {
  primary: 'bg-primary text-primary-foreground',
  soft: 'bg-primary-soft text-primary',
  strong: 'bg-surface-strong text-primary',
  surface: 'bg-surface text-primary',
};

/**
 * 아이콘이나 이니셜을 원형 배경 안에 가운데 정렬로 보여주는 공용 배지입니다.
 * 글자 크기와 굵기가 필요하면 className으로 전달합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 원형 아이콘 배지
 */
export function IconBadge({ as: Tag = 'div', size = 'lg', tone = 'soft', className, children, ...rest }: IconBadgeProps) {
  const badgeClassName = [
    'grid place-items-center rounded-full',
    ICON_BADGE_SIZE_CLASS_NAME[size],
    ICON_BADGE_TONE_CLASS_NAME[tone],
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag className={badgeClassName} {...rest}>
      {children}
    </Tag>
  );
}
