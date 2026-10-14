export function TogglePreview({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[10px] bg-surface-strong px-3 py-2">
      <span className="text-sm font-bold text-foreground">{label}</span>
      <span className="grid h-7 w-12 justify-end rounded-full bg-primary p-1" aria-hidden>
        <span className="size-5 rounded-full bg-white shadow-sm" />
      </span>
    </div>
  );
}
