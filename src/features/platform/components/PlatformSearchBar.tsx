'use client';

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
      className="mt-5 flex h-14 items-center gap-3 rounded-full border border-primary bg-surface px-4 shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Icon className="size-5 text-muted" name="search" />
      <input
        className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted"
        placeholder="서비스나 내용을 검색하세요"
        type="search"
      />
      <button className="h-9 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground" type="submit">
        검색
      </button>
    </form>
  );
}
