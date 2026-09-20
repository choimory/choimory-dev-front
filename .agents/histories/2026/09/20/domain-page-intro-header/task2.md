# 목차

- [개요](#개요)
- [공용 컴포넌트 변경](#공용-컴포넌트-변경)
- [페이지소개 티어로 승격](#페이지소개-티어로-승격)
- [섹션구분 티어(SectionHeader)로 통일](#섹션구분-티어sectionheader로-통일)
- [heading 톤 정리](#heading-톤-정리)
- [검증](#검증)
- [문구 톤 전면 변경 및 게시글 제목 추가](#문구-톤-전면-변경-및-게시글-제목-추가)

---

# 개요

plan2.md에서 정리한 규칙(eyebrow 2티어 구분, heading 간결화, description은 페이지소개에만)을 구현했다.

---

# 공용 컴포넌트 변경

- **`PageIntroCard`**: `title`, `description`을 선택 prop으로 변경. `title`/`description`이 없으면 로고+eyebrow만 표시(프로필형 페이지용). eyebrow 줄에 `flex-wrap` 추가해 320px 이하 좁은 화면에서 로고 아래로 "/ 도메인 경로"가 줄바꿈되도록 함.
- **`SectionHeader`(신규, `src/shared/ui/SectionHeader.tsx`)**: 로고 없이 `domainPath`(eyebrow) + `title`(h2) + 선택적 `action`(우측 링크) + 선택적 `headingId`를 받는 섹션구분용 공용 컴포넌트.

# 페이지소개 티어로 승격

기존에 로고 없이 eyebrow만 있던 곳(A그룹)과 페이지 최상단인데 로고가 없던 곳(C그룹)을 `PageIntroCard`로 승격했다. title/description은 생략(프로필 카드가 대신함), `blog / post`(게시글 상세)만 title "포스트"를 유지.

- `BlogMeSettingsView.tsx` — `blog / me`
- `BlogUserBlogView.tsx` — `blog / @{nickname}`
- `FeedMenuView.tsx`(`MyFeedManageSection`) — `feed / me`
- `BlogPostDetailView.tsx` 최상단 — `blog / post` + title "포스트"

# 섹션구분 티어(SectionHeader)로 통일

기존 B그룹(eyebrow+h2, `<div className="px-1">`)과 E그룹(우측 액션링크 변형)을 모두 `SectionHeader`로 교체했다. 이 과정에서 eyebrow가 자유 한글 문구이거나 서비스명이 빠져 있던 곳을 `{서비스} / {도메인}` 슬래시 포맷으로 통일했다.

| 파일 | 위치 | domainPath | title |
|---|---|---|---|
| `BlogMeSettingsView.tsx` | 설정 | `blog / setting` | 설정 |
| `BlogUserBlogView.tsx` | 포스트 목록 | `blog / post` | 포스트 |
| `BlogPostDetailView.tsx` | 댓글 | `blog / comments` | 댓글 |
| `BlogGuestSection.tsx` | 미리보기(+ "참여하기" action) | `blog / preview`(기존 "공개 글 미리보기") | 둘러보는 글(기존 "지금 둘러볼 수 있는 글") |
| `FeedMenuView.tsx` | 인기 대상 최근 이벤트 | `feed / event` | 최근 이벤트(기존 "인기 대상 최근 이벤트") |
| `FeedMenuView.tsx` | 내가 관찰 중인 대상 | `feed / target` | 관찰 중인 대상(기존 "내가 관찰 중인 대상") |
| `FeedMenuView.tsx` | 내 알림 설정 | `feed / settings` | 내 알림 설정 |
| `FeedView.tsx` | 관찰 대상 미리보기 | `feed / target`(기존 "관찰 중인 대상") | 관심 대상(기존 "지금 지켜보는 관심 대상") |
| `FeedView.tsx` | 최근 알림 | `feed / activity`(기존 "최근 이벤트") | 최근 알림(기존 "방금 들어온 알림") |
| `FeedView.tsx` | 비회원 안내 | `feed / preview`(기존 "준비 중인 피드") | 준비 중인 알림(기존 문장형 제목) |
| `FeedView.tsx` | 로그인 혜택 | `feed / benefits`(기존 "로그인하면 가능한 것") | 맞춤 피드(기존 "내 관심사로 피드를 만들기") |
| `MemberServiceFeedSection.tsx` | 내 프로필 | `platform / me`(기존 "/me") | 내 프로필(기존 "나를 소개하세요") |
| `MemberServiceFeedSection.tsx` | 서비스 현황 | `platform / services`(기존 "/services") | 서비스 현황(기존 "나의 현황을 서비스별로 확인하세요") |

# heading 톤 정리

`PageIntroCard`를 쓰는 도메인 목록 페이지 중 문장형이던 타이틀을 명사형으로 축약했다.

- `PlatformServicesView.tsx`: "사용할 서비스를 선택하세요" → "서비스"
- `BlogMenuView.tsx`(인기): "지금 인기 있는 글" → "인기 글"

# 검증

- `npx tsc --noEmit`, `npm run lint` 모두 통과.
- `grep`으로 `className="px-1"` 잔존 여부 확인 — `PageIntroCard.tsx` 한 곳만 남고 나머지는 모두 `SectionHeader`/`PageIntroCard`로 대체됨을 확인.
- `npm run dev`로 관련 라우트 15개(`/`, `/services`, `/notice`, `/blog`, `/blog/popular`, `/blog/following`, `/blog/me`, `/blog/mory.dev`, `/blog/posts/post-1`, `/feed`, `/feed/popular`, `/feed/observations`, `/feed/me`, `/feed/targets/target-keyboard`, `/me`) 모두 HTTP 200, 서버 로그 에러 없음 확인.

---

# 문구 톤 전면 변경 및 게시글 제목 추가

plan2.md "문구 톤 범위 및 게시글 제목 확인"에서 정리한 5가지를 구현했다.

## 사이트 전체 문구 톤 변경

코드 주석(JSDoc)을 제외한 `~합니다`/`~입니다` 종결형 50곳(17개 파일)을 성격별로 나눠 변경했다.

- **(a) 안내/설명 문구**: "~해요/~예요/~이에요/~해보세요" 해요체로 변경. `PageIntroCard`/`SectionHeader` description, 설정 항목 설명(`MeSettingItem`, `BlogSettingItem`), feed 소개(`signals`, `guestBenefits`), 서비스/계정 소개 문구 등.
- **(b) 시스템 알림/이벤트 로그**: "~했어요/~됐어요" 완료형으로 변경. `recentAlerts`, 알림 제목(`MemberServiceFeedSection`의 `notifications`) 등.
- **(c) 댓글/대화 내용**: 변경 대상에서 제외. `BlogPostDetailView`의 mock 댓글 `content`는 원문 유지.

일괄 치환은 스크립트(`(파일, 원문, 변경문)` 매핑)로 처리했고, 50곳 모두 정상 매칭되어 누락 없이 적용됨을 확인함.

## 게시글 title 필드 추가

- `blogTypes.ts`의 `BlogPost` 타입에 `title: string` 필드 추가, mock 게시글 2개(`post-1`, `post-2`)에 제목 채움. `BlogPost` mock의 유일한 소스라 다른 파일 수정은 불필요했음(전부 `blogViewModel.posts`를 재사용).
- `BlogPostCard.tsx`: 목록 카드에 제목(`h3`) 노출, 기존 본문(`content`) 위에 배치.
- `BlogPostDetailView.tsx`: 상세 화면 `PageIntroCard` 타이틀을 고정 문자열 `"포스트"`에서 `post.title`로 교체.

## 서비스 목록에 커뮤니티 추가

`platformHomeTypes.ts`의 `services` 배열에 `커뮤니티`(status: `planned`, meta: `준비 중`)를 `feed`와 `memo` 사이에 추가. 기존 memo/schedule/account-book과 동일한 "준비 중" 패턴을 따름.

## 블로그/피드 인기, 팔로잉 heading 정리

- `BlogMenuView.tsx`(인기), `FeedMenuView.tsx`(인기): 타이틀을 모두 `"실시간 순위"`로 통일 (블로그 인기는 이전 라운드에서 "지금 인기 있는 글" → "인기 글"로 한 번 바뀌었다가, 이번에 "실시간 순위"로 재변경).
- `BlogMenuView.tsx`(팔로잉): `"팔로잉 피드"` → `"팔로잉"`.

## 검증

- `npx tsc --noEmit`, `npm run lint` 모두 통과.
- `npm run dev`로 라우트 19개(`/`, `/services`, `/notice`, `/blog`, `/blog/popular`, `/blog/following`, `/blog/me`, `/blog/mory.dev`, `/blog/posts/post-1`, `/blog/posts/post-2`, `/feed`, `/feed/popular`, `/feed/observations`, `/feed/me`, `/feed/targets/target-keyboard`, `/feed/targets/target-streamer-mory`, `/feed/me/targets/target-keyboard`, `/me`, `/login`, `/signup`) 모두 HTTP 200, 서버 로그 에러 없음 확인.
