'use client';

/**
 * 설정 이름과 설명, 켜짐/꺼짐 스위치를 보여주는 토글 행입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 설정 토글
 */
export function SettingToggle({ description, isOn, label, onToggle }: { description: string; isOn: boolean; label: string; onToggle: () => void }) {
  return (
    <button
      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-surface-strong active:bg-background"
      type="button"
      aria-pressed={isOn}
      onClick={onToggle}
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        <span className="mt-1 block text-sm leading-5 text-muted">{description}</span>
      </span>
      <span className={`grid h-8 w-13 shrink-0 items-center rounded-input border p-1 ${isOn ? 'justify-end border-primary bg-primary' : 'justify-start border-muted bg-surface-strong'}`} aria-hidden>
        <span className={`size-5 rounded-[3px] ${isOn ? 'bg-primary-foreground' : 'bg-muted'}`} />
      </span>
    </button>
  );
}
