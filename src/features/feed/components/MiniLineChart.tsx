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
  const maxPriceText = points.find((point) => point.value === maxValue)?.priceText ?? `${maxValue}`;
  const minPriceText = points.find((point) => point.value === minValue)?.priceText ?? `${minValue}`;

  return (
    <div className="mt-4" aria-label={label}>
      <p className="text-xs font-bold text-muted">{label}</p>
      <div className="mt-2 rounded-2xl bg-surface-strong px-0 py-3">
        <svg className="h-64 w-full overflow-visible" viewBox="0 0 340 168" role="img" aria-label={`${label} 라인그래프`} onClick={onClearPinnedPoint}>
          <line className="text-border" stroke="currentColor" strokeWidth="1" x1="28" x2="320" y1="136" y2="136" />
          <line className="text-border" stroke="currentColor" strokeWidth="1" x1="28" x2="28" y1="18" y2="136" />
          <text className="fill-muted text-[8px]" x="2" y="22">{maxPriceText}</text>
          <text className="fill-muted text-[8px]" x="2" y="136">{minPriceText}</text>
          <polyline fill="none" points={polylinePoints} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="text-primary" />
          {chartPoints.map((point) => (
            <g key={point.id}>
              <circle
                cx={point.x}
                cy={point.y}
                r={pinnedPointId === point.id ? '6' : '4.5'}
                className={pinnedPointId === point.id ? 'fill-primary stroke-primary-foreground' : 'fill-primary'}
                strokeWidth="2"
                onClick={(event) => {
                  event.stopPropagation();
                  onTogglePinPoint(point.id);
                }}
                onMouseEnter={() => onHoverPoint(point.id)}
                onMouseLeave={() => onHoverPoint(null)}
                onFocus={() => onHoverPoint(point.id)}
                onBlur={() => onHoverPoint(null)}
                tabIndex={0}
              />
              <text className="fill-muted text-[8px]" textAnchor="middle" x={point.x} y="158">{point.dateText}</text>
            </g>
          ))}
          {activeChartPoint && (
            <g pointerEvents="none">
              <rect
                className="fill-surface stroke-border"
                height="28"
                rx="6"
                width="86"
                x={Math.min(246, Math.max(30, activeChartPoint.x - 43))}
                y={Math.max(2, activeChartPoint.y - 40)}
              />
              <text className="fill-foreground text-[8px] font-bold" textAnchor="middle" x={Math.min(289, Math.max(73, activeChartPoint.x))} y={Math.max(13, activeChartPoint.y - 26)}>
                {activeChartPoint.dateText}
              </text>
              <text className="fill-muted text-[8px]" textAnchor="middle" x={Math.min(289, Math.max(73, activeChartPoint.x))} y={Math.max(25, activeChartPoint.y - 14)}>
                {activeChartPoint.priceText}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
