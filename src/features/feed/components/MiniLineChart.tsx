'use client';

import type { FeedPricePoint } from '../model/feedTypes';

/**
 * 가격 변동을 작은 꺾은선 그래프로 보여줍니다. 지점에 마우스를 올리면 값을 안내하고, 지점을 누르면 고정/해제합니다.
 *
 * @param props 컴포넌트 Props
 * @returns 가격 변동 꺾은선 그래프
 */
export function MiniLineChart({
  activePoint,
  label,
  onClearPinnedPoint,
  onHoverPoint,
  onTogglePinPoint,
  pinnedPointId,
  points,
}: {
  activePoint?: FeedPricePoint;
  label: string;
  onClearPinnedPoint: () => void;
  onHoverPoint: (pointId: string | null) => void;
  onTogglePinPoint: (pointId: string) => void;
  pinnedPointId: string | null;
  points: FeedPricePoint[];
}) {
  const maxValue = Math.max(...points.map((point) => point.value));
  const minValue = Math.min(...points.map((point) => point.value));
  const range = Math.max(1, maxValue - minValue);
  const chartPoints = points.map((point, index) => {
    const x = points.length === 1 ? 170 : 28 + (index / (points.length - 1)) * 284;
    const y = 124 - ((point.value - minValue) / range) * 96;

    return { ...point, x, y };
  });
  const polylinePoints = chartPoints.map((point) => `${point.x},${point.y}`).join(' ');
  const activeChartPoint = chartPoints.find((point) => point.id === activePoint?.id);
  const maxPriceText = points.find((point) => point.value === maxValue)?.priceText;
  const minPriceText = points.find((point) => point.value === minValue)?.priceText;

  return (
    <div className="mt-4" aria-label={label}>
      <p className="text-xs font-medium text-muted">{label}</p>
      <div className="cut-sm relative mt-2 bg-surface-strong px-2 py-3 tabular-nums sm:px-4">
        <div className="relative mx-auto max-w-[560px] pb-5">
          <svg className="block w-full overflow-visible" viewBox="0 0 340 154" role="img" aria-label={`${label} 라인그래프`} onClick={onClearPinnedPoint}>
            {[28, 76, 124].map((y) => (
              <line key={y} className="stroke-border" vectorEffect="non-scaling-stroke" x1="28" x2="312" y1={y} y2={y} />
            ))}
            <polyline fill="none" points={polylinePoints} className="stroke-primary" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            {chartPoints.map((point) => (
              <g
                key={point.id}
                className="group cursor-pointer"
                onClick={(event) => {
                  event.stopPropagation();
                  onTogglePinPoint(point.id);
                }}
                onMouseEnter={() => onHoverPoint(point.id)}
                onMouseLeave={() => onHoverPoint(null)}
              >
                <path
                  d={`M${point.x} ${point.y}h0.01`}
                  stroke="transparent"
                  strokeWidth={44}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  pointerEvents="stroke"
                  aria-hidden="true"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={pinnedPointId === point.id ? '6' : '4.5'}
                  className={`fill-primary focus-visible:stroke-foreground group-hover:stroke-foreground group-active:fill-foreground ${pinnedPointId === point.id ? 'stroke-primary-foreground' : ''}`}
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  aria-label={`${point.dateText} ${point.priceText}`}
                  onFocus={() => onHoverPoint(point.id)}
                  onBlur={() => onHoverPoint(null)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onTogglePinPoint(point.id);
                    }
                  }}
                  tabIndex={0}
                />
              </g>
            ))}
          </svg>
          <div className="pointer-events-none absolute inset-x-0 top-0 aspect-[340/154] text-[11px] leading-4 text-muted">
            <span className="absolute left-[8.24%] top-0">{maxPriceText}</span>
            <span className="absolute bottom-0 left-[8.24%]">{minPriceText}</span>
            {activeChartPoint && (
              <div
                className="cut-sm absolute z-10 -translate-x-1/2 -translate-y-full border border-border bg-surface px-2 py-1 text-center whitespace-nowrap"
                style={{
                  left: `clamp(44px, ${(activeChartPoint.x / 340) * 100}%, calc(100% - 44px))`,
                  top: `max(32px, ${((activeChartPoint.y - 8) / 154) * 100}%)`,
                }}
              >
                <span className="block font-medium text-foreground">{activeChartPoint.dateText}</span>
                <span>{activeChartPoint.priceText}</span>
              </div>
            )}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 text-[11px] leading-4 text-muted">
            {chartPoints.map((point) => (
              <span key={point.id} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${(point.x / 340) * 100}%` }}>
                {point.dateText}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
