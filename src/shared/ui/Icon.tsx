/** 서비스 화면에서 사용하는 아이콘 이름 */
export type IconName =
  | 'bell'
  | 'bookmark'
  | 'calendar'
  | 'chat'
  | 'chevronLeft'
  | 'grid'
  | 'heart'
  | 'home'
  | 'menu'
  | 'monitor'
  | 'note'
  | 'plus'
  | 'search'
  | 'share'
  | 'star'
  | 'tag'
  | 'user';

/**
 * 공통 아이콘 컴포넌트의 Props
 */
type IconProps = {
  name: IconName;      // 표시할 아이콘 이름
  className?: string;  // 아이콘에 적용할 CSS 클래스
};

/**
 * 서비스 전반에서 사용하는 SVG 아이콘 컴포넌트입니다.
 *
 * @param props 컴포넌트 Props
 * @returns SVG 아이콘
 */
export function Icon({ name, className = 'size-5' }: IconProps) {
  const commonProps = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  };

  switch (name) {
    case 'bell':
      return (
        <svg {...commonProps}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeWidth={2} />
        </svg>
      );
    case 'bookmark':
      return (
        <svg {...commonProps}>
          <path d="M6 4h12v17l-6-4-6 4z" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      );
    case 'calendar':
      return (
        <svg {...commonProps}>
          <rect height="17" rx="2" strokeWidth={2} width="18" x="3" y="4" />
          <path d="M8 2v4M16 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      );
    case 'chat':
      return (
        <svg {...commonProps}>
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      );
    case 'chevronLeft':
      return (
        <svg {...commonProps}>
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      );
    case 'grid':
      return (
        <svg {...commonProps}>
          <rect height="7" rx="1.5" strokeWidth={2} width="7" x="3" y="3" />
          <rect height="7" rx="1.5" strokeWidth={2} width="7" x="14" y="3" />
          <rect height="7" rx="1.5" strokeWidth={2} width="7" x="3" y="14" />
          <rect height="7" rx="1.5" strokeWidth={2} width="7" x="14" y="14" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...commonProps}>
          <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6z" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      );
    case 'home':
      return (
        <svg {...commonProps}>
          <path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      );
    case 'menu':
      return (
        <svg {...commonProps}>
          <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" strokeWidth={2} />
        </svg>
      );
    case 'monitor':
      return (
        <svg {...commonProps}>
          <rect height="11" rx="2" strokeWidth={2} width="16" x="4" y="5" />
          <path d="M9 21h6M12 16v5M10 9l5 2.5L10 14z" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      );
    case 'note':
      return (
        <svg {...commonProps}>
          <path d="M5 4h14v16H5z" strokeLinejoin="round" strokeWidth={2} />
          <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" strokeWidth={2} />
        </svg>
      );
    case 'plus':
      return (
        <svg {...commonProps}>
          <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeWidth={2} />
        </svg>
      );
    case 'search':
      return (
        <svg {...commonProps}>
          <path d="m21 21-4.35-4.35" strokeLinecap="round" strokeWidth={2} />
          <circle cx="11" cy="11" r="7" strokeWidth={2} />
        </svg>
      );
    case 'share':
      return (
        <svg {...commonProps}>
          <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      );
    case 'star':
      return (
        <svg {...commonProps}>
          <path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9z" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      );
    case 'tag':
      return (
        <svg {...commonProps}>
          <path d="M20 12V7H9L4 12l8 8z" strokeLinejoin="round" strokeWidth={2} />
          <circle cx="10" cy="9" fill="currentColor" r="1" stroke="none" />
        </svg>
      );
    case 'user':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="4" strokeWidth={2} />
          <path d="M4 21a8 8 0 0 1 16 0" strokeLinecap="round" strokeWidth={2} />
        </svg>
      );
  }
}
