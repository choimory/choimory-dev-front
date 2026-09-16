/**
 * 화면 하단 네비게이션 컴포넌트입니다.
 * 홈, 검색, 등록, 알림, 프로필 진입점을 표시합니다.
 *
 * 각 항목의 이동 처리는 아직 연결되어 있지 않습니다.
 *
 * @returns 하단 네비게이션 요소
 */
export function BottomNav() {
  return (
    <nav className="flex items-center justify-around px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-background">
      {/* 홈 */}
      <button type="button" className="p-2">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </button>

      {/* 검색 */}
      <button type="button" className="p-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* 등록 */}
      <button type="button" className="p-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* 알림 */}
      <button type="button" className="p-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* 프로필 */}
      <button type="button" className="p-2">
        <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600" />
      </button>
    </nav>
  );
}
