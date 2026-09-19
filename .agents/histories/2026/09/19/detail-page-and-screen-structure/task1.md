# 목차

- [개요](#개요)
- [구현사항](#구현사항)
  - [플랫폼 메뉴 화면 추가](#플랫폼-메뉴-화면-추가)
  - [블로그 메뉴와 게시글 상세 화면 추가](#블로그-메뉴와-게시글-상세-화면-추가)
  - [피드 메뉴와 상세 화면 추가](#피드-메뉴와-상세-화면-추가)
  - [기존 화면 연결](#기존-화면-연결)
  - [피드 용어 정리](#피드-용어-정리)
  - [README 갱신](#readme-갱신)
- [주요 변경 파일](#주요-변경-파일)
- [검증 결과](#검증-결과)
- [남은 범위](#남은-범위)

---

# 개요

- 상세페이지와 화면구조 디테일 작업의 1차 구현을 진행했다.
- 플랫폼, 블로그, 피드의 하단 메뉴와 주요 카드 요소가 실제 라우트로 이동하도록 연결했다.
- 실제 API 연동 없이 기존 mock/view data 기반으로 메뉴 화면과 상세 화면을 구성했다.
- 피드 서비스의 화면 표시 용어를 `추적`에서 `관찰`로 정리했다.

---

# 구현사항

## 플랫폼 메뉴 화면 추가

플랫폼 하단 메뉴에서 진입할 수 있는 화면을 추가했다.

- `/services`
  - 전체 서비스 메뉴 화면
  - 활성 서비스는 실제 서비스 경로로 이동
  - 준비 중 서비스는 준비 중 상태로 표시
- `/notice`
  - 플랫폼 공지사항 화면
  - 화면 구조 확장과 상세 화면 준비 상태를 mock 공지로 표시

추가한 주요 파일은 다음과 같다.

- `src/app/services/page.tsx`
- `src/app/notice/page.tsx`
- `src/features/platform/container/PlatformServicesContainer.tsx`
- `src/features/platform/container/PlatformNoticeContainer.tsx`
- `src/features/platform/components/PlatformServicesView.tsx`
- `src/features/platform/components/PlatformNoticeView.tsx`

## 블로그 메뉴와 게시글 상세 화면 추가

블로그 하단 메뉴와 게시글 상세 화면을 추가했다.

- `/blog/popular`
  - 인기 글 메뉴 화면
- `/blog/following`
  - 팔로잉 피드 메뉴 화면
- `/blog/me`
  - 내 blog 메뉴 화면
- `/blog/posts/[postId]`
  - 게시글 상세 화면
  - 게시글 본문, 이미지 영역, 좋아요/댓글 지표, mock 댓글 목록 표시

추가한 주요 파일은 다음과 같다.

- `src/app/blog/popular/page.tsx`
- `src/app/blog/following/page.tsx`
- `src/app/blog/me/page.tsx`
- `src/app/blog/posts/[postId]/page.tsx`
- `src/features/blog/container/BlogMenuContainer.tsx`
- `src/features/blog/container/BlogPostDetailContainer.tsx`
- `src/features/blog/components/BlogMenuView.tsx`
- `src/features/blog/components/BlogPostDetailView.tsx`

## 피드 메뉴와 상세 화면 추가

피드 하단 메뉴와 상세 화면을 추가했다.

- `/feed/popular`
  - 인기 알림 메뉴 화면
- `/feed/observations`
  - 관찰 목록 화면
- `/feed/observations/[observationId]`
  - 관찰 상세 화면
  - 관찰 상태, 최근 알림 수, 관찰 조건 영역 표시
- `/feed/activities/[activityId]`
  - 알림 상세 화면
  - 알림 출처, 알림 제목, 발생 시간, 알림 내용 영역 표시
- `/feed/me`
  - 내 feed 메뉴 화면

추가한 주요 파일은 다음과 같다.

- `src/app/feed/popular/page.tsx`
- `src/app/feed/observations/page.tsx`
- `src/app/feed/observations/[observationId]/page.tsx`
- `src/app/feed/activities/[activityId]/page.tsx`
- `src/app/feed/me/page.tsx`
- `src/features/feed/container/FeedMenuContainer.tsx`
- `src/features/feed/container/FeedObservationDetailContainer.tsx`
- `src/features/feed/container/FeedActivityDetailContainer.tsx`
- `src/features/feed/components/FeedMenuView.tsx`
- `src/features/feed/components/FeedObservationDetailView.tsx`
- `src/features/feed/components/FeedActivityDetailView.tsx`

## 기존 화면 연결

기존 `#` 링크와 hover만 있던 카드 요소들을 실제 라우트로 연결했다.

플랫폼 홈:

- 하단 메뉴 `공지사항`을 `/notice`로 연결
- 하단 메뉴 `서비스`를 `/services`로 연결
- 서비스별 대형 카드 내부 지표를 관련 메뉴 화면으로 연결
- 서비스별 대형 카드 내부 알림을 관련 메뉴 또는 상세 화면으로 연결
- 준비 중 서비스의 href를 `/services`로 정리

블로그:

- 하단 메뉴 `인기`를 `/blog/popular`로 연결
- 하단 메뉴 `팔로잉`을 `/blog/following`으로 연결
- 하단 메뉴 `내 블로그`를 `/blog/me`로 연결
- 게시글 카드의 작성자/본문/이미지/댓글 보기 영역을 `/blog/posts/[postId]`로 연결

피드:

- 하단 메뉴 `인기`를 `/feed/popular`로 연결
- 하단 메뉴 `관찰`을 `/feed/observations`로 연결
- 하단 메뉴 `내 피드`를 `/feed/me`로 연결
- 관찰 항목 카드를 `/feed/observations/[observationId]`로 연결
- 최근 알림 카드를 `/feed/activities/[activityId]`로 연결

마이페이지:

- 하단 메뉴의 `서비스`, `알림` placeholder 링크를 제거했다.
- 마이페이지 하단 메뉴는 `홈`, `공지사항`, `서비스`, `내 공간` 구조로 정리했다.

## 피드 용어 정리

피드 서비스의 화면 표시 용어를 `추적`에서 `관찰`로 변경했다.

변경한 대표 항목:

- `추적 중` → `관찰 중`
- `추적 중인 항목` → `관찰 중인 항목`
- 하단 탭 `추적` → `관찰`
- `FeedTrackingItem` → `FeedObservationItem`
- `trackingItems` → `observations`
- 동적 라우트도 `/feed/observations` 기준으로 구성

## README 갱신

새로 추가한 화면 구조를 `README.md`에 반영했다.

반영 내용:

- 현재 화면 상태 설명 갱신
- `src/app` 라우트 구조 갱신
- 현재 라우트 목록 갱신
- 플랫폼, blog, feed 주요 화면 요소 설명 갱신

---

# 주요 변경 파일

- `README.md`
- `src/features/platform/components/PlatformHomeView.tsx`
- `src/features/platform/components/MemberServiceFeedSection.tsx`
- `src/features/platform/model/platformHomeTypes.ts`
- `src/features/blog/components/BlogView.tsx`
- `src/features/blog/components/BlogPostCard.tsx`
- `src/features/blog/model/blogTypes.ts`
- `src/features/feed/components/FeedView.tsx`
- `src/features/feed/model/feedTypes.ts`
- `src/features/me/components/MeView.tsx`

새로 추가한 화면 파일:

- `src/app/services/page.tsx`
- `src/app/notice/page.tsx`
- `src/app/blog/popular/page.tsx`
- `src/app/blog/following/page.tsx`
- `src/app/blog/me/page.tsx`
- `src/app/blog/posts/[postId]/page.tsx`
- `src/app/feed/popular/page.tsx`
- `src/app/feed/observations/page.tsx`
- `src/app/feed/observations/[observationId]/page.tsx`
- `src/app/feed/activities/[activityId]/page.tsx`
- `src/app/feed/me/page.tsx`

---

# 검증 결과

다음 검증을 모두 통과했다.

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- `git diff --check`

`npm run build` 결과 새 라우트들이 정상적으로 등록되었다.

---

# 남은 범위

- 실제 API 연동
- 실제 인증 상태 연동
- 실제 검색 API 연동
- 실제 알림 API 연동
- 블로그 게시글 작성 화면
- 블로그 댓글 작성/좋아요/저장 동작
- 피드 관찰 조건 등록/수정/삭제 화면
- 피드 알림 상세의 실제 원본 대상 연결
- 준비 중 서비스인 메모, 일정, 가계부의 실제 화면 구현
