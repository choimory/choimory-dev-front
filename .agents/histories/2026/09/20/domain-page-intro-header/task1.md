# 목차

- [개요](#개요)
- [공용 컴포넌트 신설](#공용-컴포넌트-신설)
- [페이지 소개 카드 적용](#페이지-소개-카드-적용)
- [프로필·카운팅 카드 적용](#프로필카운팅-카드-적용)
- [README 반영](#readme-반영)
- [검증](#검증)
- [추가사항 구현](#추가사항-구현)

---

# 개요

plan1.md에서 정리한 최종 작업 범위를 구현했다. 진행 중 일부 파일은 사용자가 직접 병렬로 수정/리팩토링했으며, 해당 변경을 반영해 마무리했다.

---

# 공용 컴포넌트 신설

- `src/shared/ui/StatCard.tsx`: `label`, `value`, `size?('sm'|'lg')`, `onClick?` prop을 받는 공용 통계 카드. `onClick`이 있으면 버튼, 없으면 article로 렌더링. `lg`(기본)는 텍스트 중앙 정렬의 큰 숫자 카드, `sm`은 좌측 정렬의 상세용 보조 카드.
- `src/shared/ui/PageIntroCard.tsx`: `domainPath`, `title`, `description` prop을 받아 `BrandLogo(size sm, 애니메이션 on)` + `/ {domainPath}` + 제목 + 설명으로 구성된 공용 페이지 소개 카드.
- `src/features/blog/components/BlogRelationModal.tsx`: `BlogUserBlogView`에 있던 팔로워/팔로잉 목록 모달을 분리해 공용화.
- `src/features/blog/components/BlogProfileCard.tsx`: blog 프로필 카드(아바타, 닉네임, 소개, 작성 글/팔로워/팔로잉 카운팅)를 공용화. `BLOG_USER_PROFILE`, `BLOG_FOLLOWERS`, `BLOG_FOLLOWINGS` mock도 이 파일에서 export.

# 페이지 소개 카드 적용

`PageIntroCard`를 아래 6개 화면에 적용해 기존에 화면마다 중복 구현되어 있던 소개 카드를 통일했다.

- `PlatformNoticeView.tsx` (`domainPath="notice"`)
- `PlatformServicesView.tsx` (`domainPath="services"`)
- `BlogMenuView.tsx` (인기/팔로잉, `domainPath`는 기존 `BLOG_MENU_COPY.eyebrow` 그대로 사용)
- `FeedMenuView.tsx` (인기/관찰, `menuKind !== 'me'`일 때만 렌더링)

# 프로필·카운팅 카드 적용

- **내블로그** (`BlogMeSettingsView.tsx`, `/blog/me`): 기존에 없던 프로필+카운팅 카드를 `BlogProfileCard`로 추가. 팔로워/팔로잉 클릭 시 `BlogRelationModal` 오픈. 기존에 있던 "mory.dev 공개 블로그로 이동" 링크는 프로필 카드 아래 별도의 얇은 링크로 유지.
- **유저 blog 메인** (`BlogUserBlogView.tsx`, `/blog/[nickname]`): 기존 인라인 프로필/카운팅 카드를 `BlogProfileCard`로 교체.
- **내피드** (`FeedMenuView.tsx`의 `menuKind === 'me'`): 기존 소개 카드를 제거하고 프로필 카드(`FEED_ME_PROFILE` mock)를 추가. 요약 카운팅 카드(`SummaryCard` → `StatCard`)는 유지.
- **feed target 상세** (`FeedTargetDetailView.tsx`): 로컬 `SummaryCard`를 제거하고 `StatCard(size="sm")`로 교체.
- **feed 관찰 목록** (`FeedMenuView.tsx`의 `ObservationTargetSection`): 로컬 `SummaryCard`를 제거하고 `StatCard`로 교체.
- **내정보** (`MeView.tsx`): 이번 작업 범위에서 제외.

# README 반영

- "용어" 섹션 신설: 서비스/도메인 정의.
- "아키텍처 기준 > 공통 화면 레이아웃"에 `PageIntroCard`, `StatCard` 공용 컴포넌트 사용 기준 추가.
- "현재 화면 상태"의 플랫폼/blog/feed 화면 요소 목록을 공용 페이지 소개 카드, blog 공용 프로필 카드, 내 feed 프로필 카드 반영해 갱신. 화면별로 따로 언급되던 "애니메이션 없는 브랜드 로고" 문구는 삭제(이제 애니메이션 켜짐).

# 검증

- `npx tsc --noEmit`: 에러 없음.
- `npm run lint`: 에러 없음.
- `npm run dev` 실행 후 변경/연관 라우트 11개(`/notice`, `/services`, `/blog/popular`, `/blog/following`, `/blog/me`, `/blog/mory.dev`, `/feed/popular`, `/feed/observations`, `/feed/me`, `/feed/targets/target-keyboard`, `/me`) 모두 HTTP 200 확인, 서버 로그에 에러 없음.
- 브라우저 확장(claude-in-chrome) 미설치로 실제 화면 시각 확인은 진행하지 못함.

---

# 추가사항 구현

plan1.md "추가사항"에서 정리한 4가지를 구현했다.

- **`PageIntroCard`**: `rounded-3xl border bg-surface p-5` 카드 껍데기를 제거하고 `px-1` wrapper로 변경. `BrandLogo` + eyebrow + 타이틀 + 설명만 배경 위에 바로 배치되도록 단순화(`aria-labelledby`/`useId`도 함께 제거).
- **`BlogProfileCard`**: `profileHref?`, `extraStats?` prop 추가.
  - `profileHref`가 있으면 아바타+닉네임 영역을 `Link`로 감싸 공개 blog로 이동하도록 함.
  - `extraStats`가 있으면 기본 3개(작성 글/팔로워/팔로잉) `StatCard` 뒤에 이어서 렌더링.
  - 두 prop 모두 없으면(`BlogUserBlogView`) 기존과 동일하게 동작.
- **`BlogMeSettingsView`**: 별도로 있던 "공개 블로그 보기" 링크 행을 제거하고, `BlogProfileCard`에 `profileHref="/blog/mory.dev"`와 `BLOG_ME_ACTIVITY_STATS`(내 댓글/좋아요/북마크 mock) `extraStats`를 전달해 6분할 카운팅 카드로 확장.
- **`FeedMenuView`(`MyFeedManageSection`)**:
  - 프로필 카드와 요약(`summaries`) `StatCard` 그리드를 별도 섹션 2개에서 하나의 카드로 병합(레이아웃은 blog `BlogProfileCard`와 통일, 카운팅 항목 내용은 feed 기존 `summaries` 그대로 유지).
  - "관찰 대상 추가" 섹션을 아이콘+제목+설명+plus버튼 카드에서 blog 글쓰기 진입 영역과 동일한 구조(아바타 원형 아이콘 + placeholder 텍스트 버튼, 클릭 시 등록 모달)로 변경.

검증: `npx tsc --noEmit`, `npm run lint` 모두 통과. `npm run dev`로 연관 라우트 10개 재확인, 모두 200/에러 없음.
