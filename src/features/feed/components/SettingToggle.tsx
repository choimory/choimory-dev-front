'use client';

/**
 * 설정 이름과 설명, 켜짐/꺼짐 스위치를 보여주는 토글 행입니다.
 *
 * @param props 컴포넌트 Props
 * @returns 설정 토글
 */
export function SettingToggle({ description, isOn, label, onToggle }: { description: string; isOn: boolean; label: string; onToggle: () => void }) {
  return (
    <button className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4 text-left" type="button" onClick={onToggle}>
      <span>
        <span className="block text-sm font-bold text-foreground">{label}</span>
        <span className="mt-1 block text-sm leading-5 text-muted">{description}</span>
      </span>
      <span className={`grid h-7 w-12 shrink-0 items-center rounded-full p-1 transition ${isOn ? 'justify-end bg-primary' : 'justify-start bg-surface-strong'}`} aria-hidden>
        <span className="size-5 rounded-full bg-white shadow-sm" />
      </span>
    </button>
  );
}
