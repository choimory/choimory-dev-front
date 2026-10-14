# 목차

- [개요](#개요)
- [현황 조사 결과](#현황-조사-결과)
  - [테스트 환경](#테스트-환경)
  - [공용화 후보](#공용화-후보)
  - [구조 위반 후보](#구조-위반-후보)
  - [이미 공용화된 것](#이미-공용화된-것)
  - [결정이 필요한 사항](#결정이-필요한-사항)
- [추가1](#추가1)
- [작업계획 수립](#작업계획-수립)
  - [진행 원칙](#진행-원칙)
  - [단계별 계획](#단계별-계획)
  - [파일 분리 대상](#파일-분리-대상)
  - [테스트 계획](#테스트-계획)
  - [확인이 필요한 사항](#확인이-필요한-사항)
- [작업계획 확인사항 결정](#작업계획-확인사항-결정)
  - [진행 방식](#진행-방식)
  - [테스트 파일 위치](#테스트-파일-위치)
  - [미세한 시각 차이 처리](#미세한-시각-차이-처리)
  - [Button variant 조사](#button-variant-조사)

---

# 개요

- 이 프로젝트에서 규칙적으로 쓰이는 컴포넌트나 요소들이 page나 도메인별로 개별 적용된 사항들이 많을거임. 이걸 컴포넌트로 공용화한다
- 이 프로젝트에 테스트코드가 하나도 쓰여있지 않을거임. 테스트코드를 모두 작성한다

---

# 현황 조사 결과

> plan1 확인
>
> ㄱㄱ

## 답변

코드를 읽기 전용으로 조사했다. 테스트 환경은 전무하고, 공용화 후보와 한 파일에 여러 컴포넌트가 든 구조 위반 후보가 확인되었다.

## 테스트 환경

### 현재 상태

- 테스트 파일(`*.test.*`, `*.spec.*`)이 0개다.
- 테스트 설정(vitest, jest, playwright)도 0개다.
- `package.json`에는 `lint`만 있고 테스트 관련 패키지와 스크립트가 없다.

### 규칙 (`front-end/test.md`)

- Vitest: 커스텀 훅, 함수, 유틸 단위 테스트
- React Testing Library: 컴포넌트 테스트
- MSW: API 모킹 통합 테스트
- Playwright: E2E 테스트
- ESLint: 정적 테스트

### 설치 필요 패키지 (대략)

- `vitest`, `@vitejs/plugin-react`, `jsdom`
- `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- `msw`, `@playwright/test`

### 참고

- 지금은 API 호출이 없고 `shared/model/mockAuth.ts` 같은 목 데이터 기반이다.
- MSW 통합 테스트는 대상 API가 아직 없어서 이번 범위에 넣을지 정해야 한다.

## 공용화 후보

| 후보 | 근거 | 비고 |
|---|---|---|
| 기본 카드 컨테이너 | `rounded-2xl border border-border bg-surface p-4`가 25회 반복 | 가장 큰 후보. 변형인 `p-3` 카드, `bg-surface-strong` 카드, 3열 grid 카드도 5~11회씩 있음 |
| 세그먼트 탭(토글 그룹) | `grid grid-cols-3/4 gap-1 rounded-2xl bg-surface-strong p-1` 반복 | 탭 전환 UI |
| 칩/태그 | `rounded-full bg-surface-strong px-2.5 py-1 text-xs font-bold text-muted`와 크기 변형 반복 | |
| 원형 아이콘/아바타 | `grid size-10 place-items-center rounded-full ...` 반복 | |
| 모달/오버레이 | `fixed inset`이 5개 feature 파일에 각각 있고, `shared/ui`에도 2곳 있음 | 공용 `Modal` 없음 |
| 버튼 | `<button`이 16개 파일에 분산 | 공용 `Button` 없음. 스타일 변형을 먼저 확인해야 함 |
| 목록 행(grid 3열) | `grid-cols-[auto_minmax(0,1fr)_auto] ... p-3`이 4~6회 | |

## 구조 위반 후보

- 한 파일에 여러 컴포넌트: `FeedMenuView` 8개, `FeedTargetDetailView` 8개, `BlogMeSettingsView` 3개, `BlogMenuView` 2개. README의 "하나의 파일에는 하나의 주요 컴포넌트만 작성한다" 규칙 위반.
- 대형 파일: `FeedTargetDetailView` 660줄, `FeedMenuView` 474줄, `BlogMeSettingsView` 432줄, `BlogMenuView` 423줄.
- hooks 디렉토리 없음: 모든 feature에 `hooks`가 없다. 상태 로직이 container나 component 안에 있을 가능성이 높다.

## 이미 공용화된 것

- `shared/ui`: `AppContent`, `AppFrame`, `AppTopBar`, `BottomNavigation`, `BrandLogo`, `Icon`, `PageIntroCard`, `SectionHeader`, `StatCard`, `TopBarActions`

## 결정이 필요한 사항

1. 작업 순서: "공용 컴포넌트 추출 → 그 컴포넌트에 테스트" 순서 vs 테스트 환경부터 구축한 뒤 리팩토링 중에 테스트를 붙이는 순서. 후자(규칙의 TDD, 안전성)를 제안.
2. 공용화 범위: 후보 전부 vs 카드, 모달, 버튼 같은 큰 것부터.
3. 큰 파일 분리: 여러 컴포넌트가 든 파일의 분리를 이번 리팩토링에 포함할지.
4. 테스트 범위: Vitest와 RTL만 vs Playwright E2E까지. MSW는 API가 생길 때로 미룰지.
5. "테스트 모두 작성"의 의미: 모든 컴포넌트 vs 공용 컴포넌트와 유틸 우선.

---

# 추가1

- 공용 컴포넌트 추출 후, 컴포넌트 테스트 진행
- 공용화 범위는 후보 전부
- 큰 파일 분리
- vitest, rtl 진행하고 playwright e2e는 이후 상황보고. msw는 api 연동 후 진행
- 테스트 모두 작성: 모든 컴포넌트

---

# 작업계획 수립

> 목차갱신하고 작업계획 수립

## 답변

추가1의 결정(추출 후 테스트, 후보 전부 공용화, 큰 파일 분리, Vitest·RTL, 모든 컴포넌트 테스트)을 바탕으로 단계별 계획을 세웠다.

## 진행 원칙

- 리팩토링 단계에는 테스트 안전망이 없으므로 단계를 작게 나누고, 단계마다 `npm run lint`와 `npm run build`로 확인한다.
- 화면 동작과 디자인은 바꾸지 않는다. 공용화로 인한 클래스 차이는 variant prop으로 흡수하고, 시각적 결과가 달라지는 경우는 별도로 보고한다.
- 공용 컴포넌트는 `shared/ui`에 두고, 한 파일에 하나의 주요 컴포넌트, Doc Comment, 해요체 규칙을 지킨다.
- 테스트 파일은 대상 파일과 같은 위치에 `*.test.tsx`(또는 `*.test.ts`)로 둔다.
- 단계가 끝날 때마다 변경 내용을 설명하고 다음 단계 진행 여부를 확인한다.

## 단계별 계획

### 1단계. 공용 컴포넌트 추출

반복 횟수가 많고 의존이 적은 것부터 진행한다.

| 순서 | 컴포넌트 | 근거 | 비고 |
|---|---|---|---|
| 1 | `Card` | `rounded-2xl border border-border bg-surface p-4` 25회 + 변형 | `padding`(p-3/p-4), `tone`(surface/strong) variant |
| 2 | `Chip` | `rounded-full bg-surface-strong ... text-xs font-bold text-muted` 반복 | `size`(xs/sm) variant |
| 3 | `IconBadge` (원형 아이콘) | `grid size-10 place-items-center rounded-full ...` 반복 | `tone`(muted/primary) variant |
| 4 | `SegmentedTabs` | `grid grid-cols-3/4 gap-1 rounded-2xl bg-surface-strong p-1` 반복 | 탭 개수와 선택 상태는 props |
| 5 | `ListRow` | `grid-cols-[auto_minmax(0,1fr)_auto] ... p-3` 4~6회 | 좌측 아이콘, 본문, 우측 영역 slot |
| 6 | `Button` / `IconButton` | `h-10 rounded-[10px] bg-primary ...` 6회, `grid size-9 place-items-center rounded-[10px]` 11회 등 | variant(primary/muted/ghost/danger)와 size 정리 필요 |
| 7 | `Modal` | `fixed inset-0 z-50` 모달 5곳(Notice, BlogMeSettings, BlogRelationModal, FeedMenu, FeedTargetDetail, MeView) | 배경 색(`bg-black/60`, `bg-background/70`)과 정렬(`place-items-end/center`) 차이를 variant로 흡수 |

- 각 컴포넌트는 만든 즉시 해당 클래스 패턴을 쓰는 곳을 교체한다.
- `Modal`은 이미 `BlogModalShell`이 있으므로, 그것을 기반으로 일반화한다.
- 교체할 때마다 `lint`와 `build`로 확인한다.

### 2단계. 큰 파일 분리

- 한 파일에 든 로컬 컴포넌트를 별도 파일로 분리한다. 위치는 해당 feature의 `components`다.
- 분리 대상은 아래 "파일 분리 대상"을 따른다.
- 분리 후 원본 파일은 조립 역할만 남긴다.
- 1단계의 공용 컴포넌트와 겹치는 부분(예: `BlogModalShell` → `Modal`)은 1단계에서 먼저 정리한다.

### 3단계. 테스트 환경 구축

- 패키지 설치: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- `vitest.config.ts`, setup 파일 작성, `package.json`에 `test` 스크립트 추가
- Next.js 환경 대응: `next/link`, `next/navigation`, `next/image` 모킹 방식 정리
- `@/` alias 등 `tsconfig` 경로 설정 반영
- 샘플 테스트 1개로 환경 검증
- Playwright와 MSW는 이번 범위에서 제외한다. (E2E는 이후 상황 보고, MSW는 API 연동 후)

### 4단계. 컴포넌트 테스트 작성

- 순서: `shared/ui` 공용 컴포넌트 → feature 컴포넌트(auth → platform → me → blog → feed).
- 순수 함수와 유틸(예: `shared/model`, 각 feature `model`의 변환 로직)은 Vitest 단위 테스트로 작성한다.
- 컴포넌트는 RTL로 렌더링, props 변화, 클릭·입력 같은 사용자 이벤트, 접근성 role/label 기준 쿼리를 확인한다.
- 모달, 포털 기반 컴포넌트(`TopBarActions` 등)는 `document.body` 렌더링을 고려한다.
- container는 현재 API가 없고 목 데이터 기반이므로 렌더링과 상태 흐름 위주로 테스트한다.
- 마지막에 전체 `lint`, `build`, `test`를 실행한다.

### 5단계. 마무리

- README.md에 공용 컴포넌트 목록, 테스트 실행 방법, 테스트 위치 규칙을 반영한다.
- `.agents/rules/front-end/test.md`와 충돌하는 부분이 있으면 보고한다.
- "작업 마무리하자" 지시가 있으면 done 문서를 작성하고 calendar를 DONE으로 바꾼다.

## 파일 분리 대상

| 파일 | 줄 수 | 분리할 컴포넌트 |
|---|---|---|
| `FeedTargetDetailView.tsx` | 660 | `ItemDetailSection`, `StreamerDetailSection`, `ArtistDetailSection`, `MiniLineChart`, `BroadcastContributionGraph`, `AlbumCarousel3d`, `AlbumDetailModal`, `ListPanel` |
| `FeedMenuView.tsx` | 474 | `PopularTargetSection`, `PopularTargetEventSection`, `ObservationTargetSection`, `MyFeedManageSection`, `TargetListLink`, `FeedTargetCreateForm`, `FormField`, `TogglePreview` |
| `BlogMeSettingsView.tsx` | 432 | `BlogModalShell`(→ 공용 `Modal`), `BlogPostCreateModal`, `BlogSettingEditModal` |
| `BlogMenuView.tsx` | 423 | `BlogPopularInsightSection`, `BlogFollowingManageSection` |

- 위 4개 파일이 전부다. 그 외 파일은 파일당 로컬 컴포넌트가 1개 이하여서 분리하지 않는다.

## 테스트 계획

| 구분 | 도구 | 대상 |
|---|---|---|
| 정적 | ESLint | 전체 (기존 `npm run lint`) |
| 단위 | Vitest | 함수, 유틸, 모델 변환 로직 |
| 컴포넌트 | Vitest + RTL | `shared/ui` 전체, feature 컴포넌트 전체 |
| 통합 | MSW | 이번 범위 제외 (API 연동 후) |
| E2E | Playwright | 이번 범위 제외 (이후 상황 보고) |

- 규칙 문서는 TDD를 기본으로 하지만, 이번 작업은 기존 코드를 대상으로 한 사후 테스트다. 이 점을 done 문서에 남긴다.

## 확인이 필요한 사항

1. 1단계에서 공용화로 인해 미세한 시각 차이가 생기면(패딩 통일 등) 통일할지, variant로 원형을 유지할지.
2. `Button` variant는 현재 사용 중인 스타일을 먼저 전수 조사한 뒤 정할지.
3. 테스트 파일 위치를 대상 파일과 같은 위치(colocation)로 할지, 별도 `__tests__` 디렉토리로 할지.
4. 각 단계가 끝날 때마다 멈춰서 확인받을지, 1~2단계(리팩토링)를 묶어서 진행할지.

---

# 작업계획 확인사항 결정

> 단계마다 멈춰서 확인받자. 테스트 파일위치는 코로케이션하고 나중에 별로다 싶으면 별도 테스트 디렉토리로 옮기자. 미세한 시각차이는 내가 확인하고 체크해줄게 페이지만 알려줘

## 답변

작업계획의 확인이 필요한 사항 중 진행 방식, 테스트 파일 위치, 시각 차이 처리를 확정했다. `Button` 조사 방식은 제안 상태다.

## 진행 방식

- 단계마다 멈춰서 확인받는다.
- 1단계(공용 컴포넌트 추출)는 컴포넌트 하나를 만들고 사용처를 교체할 때마다 멈추는 것으로 볼지, 7개를 묶어 멈출지는 시작 시 다시 확인한다.

## 테스트 파일 위치

- 대상 파일과 같은 위치에 두는 colocation으로 한다. (예: `Card.tsx` 옆에 `Card.test.tsx`)
- 나중에 별로라고 판단되면 별도 테스트 디렉토리로 옮긴다.

## 미세한 시각 차이 처리

- 시각 차이는 사용자가 직접 확인하고 체크한다.
- 각 단계가 끝날 때 "변경 가능성이 있는 페이지 경로와 달라질 수 있는 부분"을 목록으로 알려준다.
- 원형을 유지할 수 있으면 variant로 유지하고, 통일해야만 하는 경우에만 별도로 표시한다.

## Button variant 조사

- 현재 사용 중인 스타일을 전수 조사하여 분류표를 만든 뒤 variant를 정하는 방식을 제안했다. (사용자가 제안대로 진행하기로 결정)
- 조사는 `Button`을 만드는 단계 안에서 진행하고 결과를 보여준다.
- 현재 변형 예: `h-10 rounded-[10px] bg-primary`(6회), `size-9` 아이콘 버튼, `h-12 rounded-[12px]` 등.
