/**
 * 라벨과 입력창을 한 묶음으로 보여주는 폼 필드입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 폼 필드
 */
export function FormField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-foreground">{label}</span>
      <input className="h-11 rounded-[10px] border border-border bg-surface-strong px-3 text-sm text-foreground outline-none focus:border-primary" placeholder={placeholder} />
    </label>
  );
}
