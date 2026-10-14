# 목차

- [개요](#개요)
- [2단계 큰 파일 분리](#2단계-큰-파일-분리)
  - [1단계 Card 들여쓰기 복구](#1단계-card-들여쓰기-복구)
  - [공용 Modal 추출](#공용-modal-추출)
  - [파일 분리](#파일-분리)
  - [feedTargetView 모듈 추출](#feedtargetview-모듈-추출)
  - [검증](#검증)
  - [시각 동작 차이 확인 요청](#시각-동작-차이-확인-요청)
  - [남은 사항](#남은-사항)
- [남은 두 파일 분리](#남은-두-파일-분리)
  - [분리 결과](#분리-결과-1)
  - [참고](#참고)
- [Doc Comment 추가](#doc-comment-추가)
  - [추가한 곳](#추가한-곳)
  - [남겨둔 것](#남겨둔-것)

---

# 개요

- plan1의 작업계획 중 **2단계(큰 파일 분리)** 를 진행한 내용이다.
- 1단계(공용 컴포넌트 추출) 내용은 task1.md를 참고한다.
- 1단계에서 빠뜨렸던 공용 `Modal`을 이번 단계 처음에 만들고, 이후 파일을 분리했다.
- 분리 규칙은 README의 "하나의 파일에는 하나의 주요 컴포넌트만 작성한다"를 따른다.

---

# 2단계 큰 파일 분리

> 확인했어 2단계 진행해

## 답변

2단계 전체(`Modal` 추출, 4개 파일 분리)를 진행하고 멈췄다. `lint`, `tsc`, `build`가 통과했고, 빌드한 서버에서 주요 16개 경로가 모두 200으로 응답했다.

## 1단계 Card 들여쓰기 복구

- 문제: 1단계에서 이중 공백을 한 칸으로 줄이는 `sed`를 `<Card` 줄에 적용하면서 줄 앞의 들여쓰기까지 한 칸으로 줄어들었다. 동작에는 영향이 없었고 `lint`도 잡지 못했다.
- 대상: 6개 파일 22줄
  - `BlogGuestSection`, `FeedObservationDetailView`, `FeedActivityDetailView`, `FeedTargetSettingsView`, `FeedMenuView`, `FeedTargetDetailView`
- 복구: 여는 `<Card` 줄의 들여쓰기를 짝이 되는 `</Card>` 줄에 맞췄다.

## 공용 Modal 추출

### Modal

- 신규: `src/shared/ui/Modal.tsx`
  - props: `labelledBy`, `onClose`, `title`(있으면 제목과 닫기 버튼 헤더를 렌더링), `placement`(기본 center, bottom), `overlay`(기본 soft, dark), `size`(기본 sm, md 560px, lg 640px), `padding`(기본 md, lg), `className`
  - `document.body` 포털로 항상 렌더링한다. 서버 렌더링 중(`document` 없음)에는 null을 반환한다.
  - 배경 클릭 시 `onClose`를 호출하고, 패널 안쪽 클릭은 전파를 막는다.
  - 접근성: 배경 막은 `role="presentation"`, 패널은 `role="dialog"`, `aria-modal`, `aria-labelledby`
  - overlay별 클래스: soft는 `bg-background/70` + `shadow-2xl`, dark는 `bg-black/60` + `shadow-[0_24px_80px_rgba(0,0,0,0.34)]`

### 교체한 곳 (6곳)

| 위치 | 설정 |
|---|---|
| `BlogPostCreateModal` | `title`, `className="max-h-[86vh] overflow-y-auto"` (기존 `BlogModalShell` 흡수) |
| `BlogSettingEditModal` | 위와 같음 |
| `BlogRelationModal` | `title` |
| `PlatformNoticeView` | `placement="bottom"`, `overlay="dark"`, `size="lg"`, `padding="lg"` |
| `MeView` | `placement="bottom"`, `overlay="dark"`, `size="md"`, `padding="lg"` |
| `FeedMenuView`(관찰 대상 등록) | `overlay="dark"`, `size="md"`, `className="grid max-h-[calc(100vh-3rem)] overflow-y-auto"` |
| `FeedTargetDetailView`(앨범 상세) | `overlay="dark"`, `size="md"`, `className="max-h-[calc(100vh-3rem)] overflow-y-auto"` |

- `BlogModalShell` 컴포넌트와 Props 타입은 제거했다.
- `FeedMenuView`와 `FeedTargetDetailView`의 호출부 `createPortal` 래핑은 `Modal`이 포털을 처리하므로 제거했다. (`FeedTargetDetailView`는 다른 곳에서 `createPortal`을 계속 쓴다.)

## 파일 분리

### 방식

- 최상위 선언(주석 + `type`/`const`/`function`)을 블록으로 나누고, 이름 기준으로 새 파일에 배정하는 스크립트로 처리했다.
- 새 파일에는 실제로 사용하는 import만 남기고, 파일 사이에서 같이 쓰는 이름은 `export`와 `import`를 자동으로 연결했다.
- 값과 타입은 `import`와 `import type`으로 나눠서 연결했다.
- 순환 import가 생기지 않도록 공유 타입은 사용하는 쪽이 아니라 정의를 가진 파일로 배정했다.
- `'use client'`는 훅(`use...`)이나 이벤트 핸들러(`on...=`)를 쓰는 파일에만 남기고, 나머지 새 파일에서는 제거했다. 기존 코드 규칙과 같다.

### 분리 결과

| 원본 | 분리된 파일 | 줄 수(원본 → 이후) |
|---|---|---|
| `BlogMeSettingsView.tsx` | `BlogPostCreateModal`(글작성 옵션 상수 포함), `BlogSettingEditModal`(설정 항목 타입 포함) | 432 → 154 |
| `BlogMenuView.tsx` | `BlogPopularInsightSection`(랭킹 탭, mock, 트렌드 상수 포함), `BlogFollowingManageSection`(관계 탭, 팔로워/팔로잉 mock 포함) | 423 → 90 |
| `FeedMenuView.tsx` | `PopularTargetSection`, `PopularTargetEventSection`, `ObservationTargetSection`, `MyFeedManageSection`(`FEED_ME_PROFILE` 포함), `TargetListLink`, `FeedTargetCreateForm`(`FeedCreateTabId` 포함), `FormField`, `TogglePreview` | 474 → 101 |
| `FeedTargetDetailView.tsx` | `ItemDetailSection`, `StreamerDetailSection`, `ArtistDetailSection`, `MiniLineChart`, `BroadcastContributionGraph`(방송 세션, 강도 클래스 보조 함수 포함), `AlbumCarousel3d`, `AlbumDetailModal`, `ListPanel` | 660 → 110 |

- 각 컴포넌트가 쓰던 타입, 상수, 보조 함수는 해당 파일로 옮겼다.

## feedTargetView 모듈 추출

- 문제: `getTargetTypeLabel`, `getTargetIconName`, `getTargetToneClassName` 세 함수가 `FeedView`, `FeedMenuView`, `FeedTargetDetailView`, `FeedTargetSettingsView`에 똑같이 4벌씩 있었다. (내용이 모두 동일함을 확인했다.)
- 분리 과정에서 서로 import하기가 어려워서 한 곳으로 모았다.
- 신규: `src/features/feed/model/feedTargetView.ts`
  - 세 함수를 `export`하고 Doc Comment를 달았다.
  - 4개 파일에서 해당 함수를 삭제하고 import로 교체했다.
  - 더 이상 쓰지 않는 `FeedTargetType` import는 정리했다.
- 요청 범위 밖의 변경이다. 4단계에서 Vitest 단위 테스트 대상이 된다.

## 검증

- `npx tsc --noEmit`, `npm run lint`, `npm run build`가 모두 통과했다.
- 빌드한 서버(`next start`)에서 다음 16개 경로가 모두 200으로 응답했다.
  - `/`, `/notice`, `/services`, `/me`, `/login`, `/signup`
  - `/blog`, `/blog/popular`, `/blog/following`, `/blog/me`, `/blog/posts/1`
  - `/feed`, `/feed/popular`, `/feed/observations`, `/feed/me`, `/feed/targets/1`
- 분리 후 한 파일에 컴포넌트가 둘 이상인 곳은 `FeedView`와 `FeedTargetSettingsView`(각 2개)만 남았다.

## 시각 동작 차이 확인 요청

| 페이지 | 변경 |
|---|---|
| `/feed/me`, `/feed/popular` 등 관찰 대상 등록 모달 | 위쪽 정렬이던 것이 화면 가운데 정렬로 바뀐다. 그림자는 `0_24px_70px/0.35`에서 `0_24px_80px/0.34`로 바뀐다(거의 동일). |
| `/feed/targets/[targetId]`(아티스트) 앨범 모달 | 그림자만 약간 바뀐다. |
| `/blog/me` 글작성, 설정 변경, 팔로워/팔로잉 모달 | 포털로 렌더링되고 `role="dialog"`가 배경 막에서 패널로 옮겨졌다. 겉모양은 같아야 한다. |
| `/notice`, `/me` 모달 | 겉모양은 같아야 한다. |

- 모달 열기/닫기, 배경 클릭으로 닫기, 모달 안 입력과 버튼
- `/blog/me`의 사진 첨부와 순서 이동
- `/blog/popular`의 탭 전환과 랭킹 애니메이션
- `/feed/targets/[targetId]`의 그래프 hover, 방송 기여도 그래프 팝오버, 앨범 캐러셀

## 남은 사항

- `FeedView`와 `FeedTargetSettingsView`에 각각 컴포넌트가 2개 남아 있다. 분리 여부는 사용자 판단 대기.
- 다음 단계: 3단계(테스트 환경 구축), 4단계(컴포넌트 테스트 작성), 5단계(마무리, README 반영)

---

# 남은 두 파일 분리

> 3단계 진행전에 남아있는 두개 그것도 분리하자

## 답변

2단계 "남은 사항"에서 남겨 둔 `FeedView`와 `FeedTargetSettingsView`를 분리했다. 이로써 `src/features/*/components`와 `src/shared/ui`에는 한 파일에 컴포넌트가 둘 이상인 곳이 없다. `tsc`, `lint`, `build`가 모두 통과했다.

## 분리 결과

| 원본 | 분리된 파일 | 줄 수(분리 전 → 후) |
|---|---|---|
| `FeedView.tsx` | `TargetPreviewLink.tsx` | 175 → 153 |
| `FeedTargetSettingsView.tsx` | `SettingToggle.tsx`(훅/이벤트 핸들러가 있어 `'use client'` 유지) | 206 → 194 |

- 분리 방식은 2단계와 같다. 사용하는 import만 남기고, 두 파일 사이에서 같이 쓰는 이름은 자동으로 `import`를 연결했다.

## 참고

- Doc Comment: 새로 생긴 두 파일의 컴포넌트에는 아직 Doc Comment가 없다. 분리 전에도 없던 것을 그대로 옮긴 것이다. 2단계에서 분리한 `FormField`, `TogglePreview`, `ListPanel` 등도 마찬가지다. 코드 규칙상 모든 컴포넌트에 Doc Comment가 필요하므로, 정리 여부는 사용자 판단 대기.
- 중복 후보: `TargetPreviewLink`(`FeedView`)와 `TargetListLink`(`FeedMenuView`)는 구조가 거의 같고 본문 줄 수와 우측 텍스트만 다르다. 하나로 합칠 수 있어 보이지만 이번 범위 밖이라 두었다.
- 이 섹션으로 2단계 "남은 사항"의 첫 항목(두 파일 분리 여부)은 해소되었다.
- 3단계(테스트 환경 구축)는 아직 시작하지 않았다. Next.js 문서의 Vitest 가이드와 설정 파일을 읽는 것부터 재개할 예정이며, 패키지 설치는 네트워크 접근이 필요해 진행 전 확인을 받는다.

---

# Doc Comment 추가

> doc comment 추가

## 답변

코드 규칙(`comment.md`)상 모든 컴포넌트와 함수에 Doc Comment가 필요한데, 분리 과정에서 옮겨 온 컴포넌트들에 빠져 있어 일괄 추가했다. 주석만 추가했고 코드 동작은 바꾸지 않았다. `tsc`, `lint`가 통과했다.

## 추가한 곳

| 종류 | 대상 | 개수 |
|---|---|---|
| 컴포넌트 | `AlbumCarousel3d`, `AlbumDetailModal`, `ArtistDetailSection`, `BroadcastContributionGraph`, `FeedTargetCreateForm`, `FormField`, `ItemDetailSection`, `ListPanel`, `MiniLineChart`, `MyFeedManageSection`, `ObservationTargetSection`, `PopularTargetEventSection`, `PopularTargetSection`, `SettingToggle`, `StreamerDetailSection`, `TargetListLink`, `TargetPreviewLink`, `TogglePreview` | 18 |
| 함수 | `getBroadcastSessions`, `getBroadcastIntensityClassName` (`BroadcastContributionGraph.tsx`) | 2 |
| 상수 | `KEYBOARD_PRICE_RANGES`, `GPU_PRICE_RANGES` (`feedTypes.ts`, 한 줄 주석) | 2 |

- 형식은 `comment.md` 양식을 따랐다. 용도 설명, `@param props 컴포넌트 Props`, `@returns`
- 상세 섹션처럼 데이터가 없으면 아무것도 그리지 않는 컴포넌트는 그 동작도 설명에 적었다.
- `src/` 전체를 전수 조사한 결과, Doc Comment가 없는 최상위 선언은 위 22건과 아래 "남겨둔 것"뿐이었다. 이미 있던 주석은 건드리지 않았다.

## 남겨둔 것

- `src/app/layout.tsx`: Next.js 기본 레이아웃(`geistSans`, `geistMono`, `metadata`, `viewport`, `RootLayout`)이라 손대지 않았다.
- 인라인 props 타입: 분리한 컴포넌트 중 props를 함수 인자에 `{ label: string; ... }` 형태로 바로 쓴 곳이 많다. 규칙은 타입의 각 필드에 측면 주석을 요구하므로 별도 `type`으로 빼야 달 수 있다. 코드 변경이 필요해서 이번에는 하지 않았고, 정리 여부는 사용자 판단 대기.
- 3단계(테스트 환경 구축)는 아직 시작하지 않았다.
