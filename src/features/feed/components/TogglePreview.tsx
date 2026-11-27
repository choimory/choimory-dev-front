/**
 * 켜진 상태의 스위치를 보여주는 미리보기 행입니다. 실제 동작 없이 설정 형태만 보여줍니다.
 *
 * @param props 컴포넌트 Props
 * @returns 토글 미리보기
 */
export function TogglePreview({ label }: { label: string }) {
  return (
    <div className="flex min-h-10 items-center justify-between gap-3 border-b border-border py-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="grid h-6 w-10 shrink-0 justify-end rounded-input bg-primary p-1" aria-hidden>
        <span className="size-4 rounded-sm bg-primary-foreground" />
      </span>
    </div>
  );
}
