'use client';

import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';

/**
 * 플랫폼 검색바 컴포넌트입니다.
 *
 * 실제 검색 기능이 연결되기 전까지는 제출 기본 동작만 막습니다.
 *
 * @returns 플랫폼 검색바
 */
export function PlatformSearchBar() {
  return (
    <form
      className="mt-5 flex min-h-11 items-center gap-3"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <label className="relative flex min-h-11 min-w-0 flex-1 items-center">
        <Icon className="pointer-events-none absolute inset-y-0 left-3 my-auto size-4 text-muted" name="search" />
        <input
          className="cut-sm h-10 w-full border border-muted bg-surface pr-3 pl-9 text-sm text-foreground hover:bg-surface-strong focus-visible:border-focus"
          aria-label="서비스나 내용을 검색하세요"
          placeholder="서비스나 내용을 검색하세요"
          type="search"
        />
      </label>
      <Button className="relative shrink-0 after:absolute after:inset-x-0 after:-inset-y-0.5" type="submit" variant="secondary">
        검색
      </Button>
    </form>
  );
}
