/**
 * 라벨과 입력창을 한 묶음으로 보여주는 폼 필드입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 폼 필드
 */
export function FormField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="grid min-w-0 gap-1">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input className="h-10 min-w-0 rounded-input border border-muted bg-background px-3 text-sm tabular-nums text-foreground hover:bg-surface-strong focus:border-primary disabled:opacity-50" placeholder={placeholder} />
    </label>
  );
}
