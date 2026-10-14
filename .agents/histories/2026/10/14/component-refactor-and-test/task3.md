# 목차

- [개요](#개요)
- [3단계 테스트 환경 구축](#3단계-테스트-환경-구축)
  - [참고한 문서](#참고한-문서)
  - [패키지 설치](#패키지-설치)
  - [설정 파일](#설정-파일)
  - [샘플 테스트](#샘플-테스트)
  - [검증](#검증)
  - [확인 사항](#확인-사항)
- [테스트 코드 디렉토리 분리](#테스트-코드-디렉토리-분리)
  - [변경 내용](#변경-내용)
  - [참고](#참고)
  - [다음 단계](#다음-단계)
- [4단계 shared/ui 컴포넌트 테스트 작성](#4단계-sharedui-컴포넌트-테스트-작성)
  - [작성한 테스트](#작성한-테스트)
  - [테스트 작성 방식](#테스트-작성-방식)
  - [이슈와 해결](#이슈와-해결)
  - [검증](#검증-1)
  - [다음 단계](#다음-단계-1)
- [4단계 auth 컴포넌트 테스트 작성](#4단계-auth-컴포넌트-테스트-작성)
  - [작성한 테스트](#작성한-테스트-1)
  - [판단 사항](#판단-사항)
- [4단계 platform 컴포넌트 테스트 작성](#4단계-platform-컴포넌트-테스트-작성)
  - [작성한 테스트](#작성한-테스트-2)
  - [새로 만든 것과 판단 사항](#새로-만든-것과-판단-사항)
  - [테스트 중 고친 것](#테스트-중-고친-것)
- [4단계 me 컴포넌트 테스트 작성](#4단계-me-컴포넌트-테스트-작성)
  - [작성한 테스트](#작성한-테스트-3)
  - [새로 만든 것과 판단 사항](#새로-만든-것과-판단-사항-1)
- [4단계 blog 컴포넌트 테스트 작성 (1/2)](#4단계-blog-컴포넌트-테스트-작성-12)
  - [작성한 테스트](#작성한-테스트-4)
  - [새로 만든 것](#새로-만든-것)
- [4단계 blog 컴포넌트 테스트 작성 (2/2)](#4단계-blog-컴포넌트-테스트-작성-22)
  - [작성한 테스트](#작성한-테스트-5)
  - [테스트 중 고친 것](#테스트-중-고친-것-1)
- [4단계 feed 컴포넌트 테스트 작성 (1/2)](#4단계-feed-컴포넌트-테스트-작성-12)
  - [작성한 테스트](#작성한-테스트-6)
  - [새로 만든 것](#새로-만든-것-1)
- [4단계 feed 컴포넌트 테스트 작성 (2/3)](#4단계-feed-컴포넌트-테스트-작성-23)
  - [작성한 테스트](#작성한-테스트-7)
  - [테스트 중 고친 것](#테스트-중-고친-것-2)
- [4단계 feed 컴포넌트 테스트 작성 (3/3)와 4단계 마무리](#4단계-feed-컴포넌트-테스트-작성-33와-4단계-마무리)
  - [작성한 테스트](#작성한-테스트-8)
  - [4단계 전체 결과](#4단계-전체-결과)
  - [알려드릴 점](#알려드릴-점)

---

# 개요

- plan1의 작업계획 중 **3단계(테스트 환경 구축)** 를 진행한 내용이다.
- 1단계는 task1.md, 2단계는 task2.md를 참고한다.
- 테스트 코드 위치는 처음에 colocation으로 시작했다가, plan2.md의 제안에 따라 `tests/unit/`로 옮겼다.
- Playwright와 MSW는 계획대로 이번 범위에서 제외했다.

---

# 3단계 테스트 환경 구축

> 확인했어 3단계 진행해줘

## 답변

Next.js 문서의 Vitest 가이드를 따라 환경을 구축하고 샘플 테스트로 검증한 뒤 멈췄다.

## 참고한 문서

- `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`
- 설치 대상: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `vite-tsconfig-paths`
- 가이드에는 없지만 `front-end/test.md` 규칙(React Testing Library로 컴포넌트 테스트)에 맞춰 `@testing-library/jest-dom`, `@testing-library/user-event`도 추가했다.

## 패키지 설치

### 설치한 패키지 (devDependencies)

| 패키지 | 버전 | 용도 |
|---|---|---|
| `vitest` | ^5.0.4 | 테스트 러너 |
| `@vitejs/plugin-react` | ^6.1.2 | JSX 변환 |
| `jsdom` | ^29.1.1 | 브라우저 DOM 환경 |
| `@testing-library/react` | ^16.3.3 | 컴포넌트 렌더링과 쿼리 |
| `@testing-library/dom` | ^10.4.2 | RTL 의존 패키지 |
| `@testing-library/jest-dom` | ^7.0.1 | `toHaveClass` 등 DOM 매처 |
| `@testing-library/user-event` | ^14.6.8 | 사용자 이벤트 시뮬레이션 |

### `@types/node` 상향

- 처음 `npm install`이 실패했다. `vitest` 5가 `@types/node`를 `^22.0.0 || >=24.0.0`으로 요구하는데 프로젝트는 `^20`이었다.
- `--force`로 우회하지 않고, 현재 Node(v22.17)에 맞춰 `@types/node`를 `^20`에서 `^22.20.5`로 올려서 해결했다.

### `vite-tsconfig-paths` 제거

- 가이드대로 설치했더니 "Vite가 tsconfig 경로를 내장으로 지원한다"는 경고가 떴다.
- 플러그인을 제거하고 `resolve.tsconfigPaths: true` 옵션으로 대체했다.

## 설정 파일

### `vitest.config.mts`

- jsdom 환경, `@vitejs/plugin-react` 사용
- `resolve.tsconfigPaths: true`로 `@/*` 경로 별칭을 그대로 사용
- `setupFiles: ['./vitest.setup.ts']`
- `include`: 처음에는 `src/**/*.test.{ts,tsx}`였고, 디렉토리 분리 후 `tests/unit/**/*.test.{ts,tsx}`로 변경
- 설정 파일 상단에 Doc Comment로 설정 의도를 적었다.

### `vitest.setup.ts`

- `@testing-library/jest-dom/vitest`를 import해서 매처를 등록
- 각 테스트가 끝나면 `afterEach`에서 RTL `cleanup`을 실행
- `globals`를 켜지 않아서 테스트 파일에서 `describe`, `it`, `expect`를 `vitest`에서 직접 import한다.

### `package.json` 스크립트

| 스크립트 | 명령 | 용도 |
|---|---|---|
| `test` | `vitest` | 감시 모드 |
| `test:run` | `vitest run` | 1회 실행 |

## 샘플 테스트

환경 검증용으로 2개 파일, 3건을 작성했다.

| 파일 | 건수 | 검증 내용 |
|---|---|---|
| `Card.test.tsx` | 2 | 기본값(div, `bg-surface`, `p-4`), `as`, `tone`, `padding`, `className` 반영 |
| `ListRow.test.tsx` | 1 | `href`가 있으면 링크로 렌더링되고 hover 클래스가 붙는지 |

- `ListRow` 테스트로 `next/link`가 모킹 없이 jsdom에서 동작하는 것을 확인했다.

## 검증

- `npm run test:run`: 2개 파일, 3건 통과
- `npx tsc --noEmit`, `npm run lint`, `npm run build` 모두 통과

## 확인 사항

- `next/navigation` 모킹: 사용하는 곳이 `src/app/blog/users/[nickname]/page.tsx` 하나뿐이다. 컴포넌트가 아니라 페이지(서버 컴포넌트)여서 모킹 설정은 아직 만들지 않았다. 4단계에서 필요해지면 추가한다.
- `npm audit`: 설치 후 11건(심각 2, 높음 8, 보통 1)이 보고되었다. 내용은 `next`, `tar`, `sharp`, `braces` 등 기존 의존성이며, 이번에 추가한 테스트 도구에서 나온 것이 아니다. `--force`로 고치지 않았고 건드리지 않았다. 별도 작업으로 다룰지는 사용자 판단 대기.
- `package-lock.json`: `.gitignore`에 들어 있어 커밋되지 않는다. 프로젝트 기존 설정이라 그대로 두었다.

---

# 테스트 코드 디렉토리 분리

> test코드는 별도 디렉토리로 옮기자

## 답변

plan2.md에서 제안한 구조(`tests/unit/`, 추후 `tests/e2e/`)로 옮겼다. 제안대로 진행해도 되는지 확인을 받은 뒤 진행했다.

## 변경 내용

- 구조: 루트에 `tests/`를 두고 `src/`와 같은 경로로 미러링한다.

```
tests/
  unit/                      ← Vitest (단위 + RTL 컴포넌트)
    shared/ui/Card.test.tsx
    shared/ui/ListRow.test.tsx
  e2e/                       ← Playwright (나중에, 지금은 만들지 않음)
```

- 이동: `Card.test.tsx`, `ListRow.test.tsx`를 `src/shared/ui/`에서 `tests/unit/shared/ui/`로 옮겼다.
- import: 상대 경로(`./Card`, `./ListRow`)를 별칭 경로(`@/shared/ui/Card`, `@/shared/ui/ListRow`)로 바꿨다.
- `vitest.config.mts`: `include`를 `tests/unit/**/*.test.{ts,tsx}`로 바꾸고, 주석("대상 파일과 같은 위치에 둔다")을 새 규칙에 맞게 고쳤다.
- `src/` 안에는 `*.test.*` 파일이 남아 있지 않다.
- 검증: `tsc`, `lint`, `test:run`(2개 파일, 3건), `build` 모두 통과

## 참고

- 중단된 명령의 일부가 먼저 실행되어 있었다. 첫 번째 이동 시도가 중간에 거절되었는데, 그때 `Card.test.tsx`가 이미 `tests/`로 옮겨져 있어 두 번째 시도에서 "파일 없음" 오류가 났다. 최종 상태는 정상이고 중복 파일은 없다.
- plan1에서 colocation으로 정했던 내용(`추가2`)은 이번 결정으로 대체되었다. plan2.md에 근거를 적었다.

## 다음 단계

- 4단계: 컴포넌트 테스트 작성. `tests/unit/`에 작성한다.
  - 순서 제안: `shared/ui` 전체와 `feedTargetView.ts` 단위 테스트 → feature별(auth → platform → me → blog → feed)
  - 분량이 많아서(컴포넌트 약 70개) 단계마다 멈춰서 확인받는다.
- 5단계: 마무리(README 반영, done 문서)

---

# 4단계 shared/ui 컴포넌트 테스트 작성

> 다음단계 진행

## 답변

4단계(컴포넌트 테스트 작성)의 첫 구간으로 `shared/ui` 전체와 단위 테스트 대상 함수(`getMockAuthStatus`, `feedTargetView`)의 테스트를 작성하고 멈췄다. 테스트는 20개 파일, 116건이 모두 통과했다.

## 작성한 테스트

모두 `tests/unit/` 아래에 `src/`와 같은 경로로 두었다.

| 대상 | 파일 | 주요 검증 |
|---|---|---|
| `Card` | `shared/ui/Card.test.tsx` | 기본값, `as`, `tone`, `padding`, `className` (3단계에서 작성) |
| `ListRow` | `shared/ui/ListRow.test.tsx` | 링크, 버튼, 정적 행 렌더링, 슬롯 유무별 열 구성, 슬롯 순서, strong 톤(테두리, hover 없음), `padding`, `isDimmed`, `className`, `style` (1건에서 7건으로 확장) |
| `Chip` | `shared/ui/Chip.test.tsx` | 기본값, `size`, `tone`, `className` |
| `IconBadge` | `shared/ui/IconBadge.test.tsx` | 크기 5종, 톤 4종, `as`, `className` |
| `IconButton` | `shared/ui/IconButton.test.tsx` | 접근 가능한 이름, 클릭, `disabled`, 크기 3종, 톤 |
| `Button` | `shared/ui/Button.test.tsx` | 기본값, 클릭, `type`과 `disabled` 전달, variant 3종, `lg`와 `className` |
| `SegmentedTabs` | `shared/ui/SegmentedTabs.test.tsx` | tablist, tab 역할, 선택 표시, 클릭 시 `onChange`, 탭 수별 열 클래스, `size`, `className` |
| `Modal` | `shared/ui/Modal.test.tsx` | 포털 렌더링, `title` 헤더와 닫기 버튼, 배경 클릭만 닫힘, 기본값, 옵션 반영 |
| `StatCard` | `shared/ui/StatCard.test.tsx` | 정적, 버튼 렌더링, `size`별 글자 크기 |
| `SectionHeader` | `shared/ui/SectionHeader.test.tsx` | 제목, `headingId`, 액션 링크 유무 |
| `PageIntroCard` | `shared/ui/PageIntroCard.test.tsx` | 로고와 경로만 있을 때, 제목과 설명이 있을 때 |
| `AppContent`, `AppFrame` | 각 `.test.tsx` | 폭 variant, 자식 래핑 |
| `BrandLogo`, `Icon` | 각 `.test.tsx` | 라벨, 크기, 애니메이션, 아이콘 22종 전부 svg 렌더링 |
| `BottomNavigation`, `AppTopBar` | 각 `.test.tsx` | 링크, `aria-current`, 폭, 로그인/로그아웃, 서비스명 링크/텍스트, `leading` |
| `TopBarActions` | `shared/ui/TopBarActions.test.tsx` | 검색 오버레이 열기/닫기, 알림 탭 필터(전체, 블로그, 피드), 서비스 목록과 준비 중 구분, 패널 간 배타적 열림 |
| `getMockAuthStatus` | `shared/model/mockAuth.test.ts` | member/guest 판정, 배열 값, 잘못된 값 |
| `feedTargetView` | `features/feed/model/feedTargetView.test.ts` | 세 함수의 종류별 반환값 |

## 테스트 작성 방식

- 규칙(`front-end/test.md`)에 따라 컴포넌트는 React Testing Library로, 함수와 모델은 Vitest 단위 테스트로 작성했다.
- 쿼리는 `getByRole`, `getByLabelText` 같은 접근성 기준을 우선 사용했다.
- 사용자 이벤트는 `@testing-library/user-event`로 시뮬레이션했다.
- 열거형 값은 `it.each`로 한 번에 검증했다. (아이콘 22종, 크기, 톤, variant 등)
- `globals`를 켜지 않아 테스트 파일에서 `describe`, `it`, `expect`, `vi`를 `vitest`에서 import한다.

## 이슈와 해결

- jsdom 경고(`Not implemented: navigation to another Document`):
  - 원인: `TopBarActions`에서 서비스 링크를 눌러 패널이 닫히는지 검증할 때, Next.js `Link`가 라우터 없이 클릭되면 실제 페이지 이동을 시도한다.
  - 해결: 처음에는 `document`에 `click` 기본 동작을 막는 리스너를 달아 봤으나, Next `Link` 내부에서 이동하므로 소용이 없었다. 그 파일에서만 `next/link`를 이동 없이 `onClick`만 실행하는 `a` 태그로 대체하는 `vi.mock`을 사용했다. 다른 파일은 실제 `Link`를 그대로 쓴다.
- ESLint 오류(`@next/next/no-html-link-for-pages`): `AppTopBar` 테스트에서 `leading`으로 `<a href>`를 전달했더니 걸려서 `<button>`으로 바꿨다.

## 검증

- `npm run test:run`: 20개 파일, 116건 통과
- `npx tsc --noEmit`, `npm run lint`, `npm run build` 모두 통과
- 이 테스트들은 기존 코드에 대한 사후 테스트다. 규칙의 TDD와 다르다는 점은 done 문서에 남긴다.

## 다음 단계

- feature별 컴포넌트 테스트: auth, platform, me, blog, feed 순서
- 분량이 많아서(컴포넌트 약 50개) feature 하나를 끝낼 때마다 멈춰서 확인받는다.
- 5단계: 마무리(README 반영, done 문서)


---

# 4단계 auth 컴포넌트 테스트 작성

> 계속 진행

## 답변

feature별 컴포넌트 테스트의 첫 순서로 `auth`를 작성하고 멈췄다. 전체 24개 파일, 132건이 통과했다. (이번에 4개 파일, 16건 추가) `tsc`, `lint`도 통과했다.

## 작성한 테스트

`tests/unit/features/auth/` 아래에 두었다.

| 대상 | 파일 | 건수 | 주요 검증 |
|---|---|---|---|
| `LoginView` | `components/LoginView.test.tsx` | 8 | 제목과 설명, 홈 링크, 이메일과 비밀번호 입력창(type, 입력 가능), 큰 primary 로그인 버튼, 회원가입 링크, 소셜 버튼 3종과 제공자별 색상 클래스, 제공자 목록이 비면 소셜 버튼 없음, 안내 문구 |
| `SignupView` | `components/SignupView.test.tsx` | 6 | 제목과 설명, 홈 링크, 입력창 4종(type), 입력 가능, 큰 primary 버튼, 로그인 링크 |
| `LoginContainer` | `container/LoginContainer.test.tsx` | 1 | 임시 데이터가 화면에 전달되는지 |
| `SignupContainer` | `container/SignupContainer.test.tsx` | 1 | 위와 같음 |

## 판단 사항

- 모델 파일(`authTypes.ts`)은 테스트하지 않았다. 로직이 아니라 임시(mock) 데이터 상수라서 값을 그대로 다시 검증하는 테스트가 되어 변경에 취약하다. 컨테이너 테스트가 데이터가 화면에 연결되는지는 확인한다. 로직이 있는 모델(`feedTargetView.ts`, `getMockAuthStatus`)은 테스트했다.
- 폼 제출은 테스트하지 않았다. 로그인과 회원가입 버튼은 지금 `type="button"`이고 폼 제출 동작이 없는 화면 구성 확인용이다. 실제 인증이 연동될 때 테스트를 추가해야 한다.
- 약한 단언 1건을 고쳤다. 소셜 제공자가 비었을 때 테스트에 의미 없는 단언이 섞여 있어서, 버튼이 로그인 하나뿐인지 확인하는 단언(`getAllByRole('button')`이 1개)으로 바꿨다.

---

# 4단계 platform 컴포넌트 테스트 작성

> task3에 추가하고 진행

## 답변

auth 내용을 task3에 기록한 뒤, 이어서 `platform` feature 테스트를 작성하고 멈췄다. 전체 34개 파일, 175건이 통과했다. (이번에 10개 파일, 43건 추가) `tsc`, `lint`도 통과했다.

## 작성한 테스트

`tests/unit/features/platform/` 아래에 두었다.

| 대상 | 건수 | 주요 검증 |
|---|---|---|
| `PlatformSearchBar` | 3 | 검색 폼, 입력창, 버튼, 입력 가능, 제출 시 기본 동작(페이지 이동) 차단 |
| `ServiceLauncherCard` | 6 | 서비스 목록, 제공 중은 링크, 준비 중은 비활성 버튼과 "예정" 표시, 이전과 다음 버튼의 `scrollBy`(±240, smooth), 빈 목록 |
| `GuestLandingSection` | 5 | 제목, 로그인과 회원가입 링크, 특징 3가지, 제공 중과 준비 중 구분, 빈 목록 |
| `MemberServiceFeedSection` | 6 | 프로필, 서비스 카드(블로그 지표 4개와 알림 4개, 피드 지표 2개와 알림 4개), 준비 중 카드(흐림, 칩, 예정 알림 2개), 제공 중 카드는 흐리지 않음 |
| `PlatformNoticeView` | 7 | 목록 2건, 모달 열기와 닫기(닫기 버튼, 배경 클릭), 상단바 로그인과 로그아웃, 하단 네비게이션 활성 |
| `PlatformServicesView` | 6 | 제공 중 링크, 준비 중 흐린 `article`, 빈 목록, 로그인 여부, 네비게이션 활성 |
| `PlatformHomeView` | 4 | 로고 제목, 검색, 런처, 비회원과 회원별 섹션 전환, 네비게이션 활성 |
| `PlatformHomeContainer`, `PlatformNoticeContainer`, `PlatformServicesContainer` | 6 | `authStatus`(guest, member)에 따른 화면 분기 |

## 새로 만든 것과 판단 사항

- 픽스처 신규: `tests/fixtures/platformServices.ts`
  - 테스트용 서비스 3개(제공 중 2개, 준비 중 1개)를 모아 둔 픽스처다.
  - 실제 임시 데이터(`platformHomeViewModel`)에 의존하지 않게 하려는 것이다. 컨테이너 테스트만 실제 데이터를 쓴다.
  - 이후 feature 테스트의 픽스처도 `tests/fixtures/`에 같은 방식으로 둔다.
- `scrollBy` 대체: jsdom에는 `Element.scrollBy`가 없어서 `ServiceLauncherCard` 테스트에서 `HTMLElement.prototype.scrollBy`를 `vi.fn()`으로 대체했다.

## 테스트 중 고친 것

- `PlatformHomeView`: 비회원 홈에는 상단바와 랜딩 섹션에 로그인 링크가 2개 있어서 `getByRole`이 실패했다. 의도대로 "2개이고 둘 다 `/login`"으로 단언을 바꿨다.
- `MemberServiceFeedSection`: 아무것도 검증하지 못하는 단언(`toBeGreaterThanOrEqual(0)`) 1건을 삭제했다.

---

# 4단계 me 컴포넌트 테스트 작성

> 진행해줘

## 답변

`platform`에 이어 `me` feature 테스트를 작성하고 멈췄다. 전체 37개 파일, 195건이 통과했다. (이번에 3개 파일, 20건 추가) `tsc`, `lint`도 통과했다.

## 작성한 테스트

`tests/unit/features/me/` 아래에 두었다.

| 대상 | 건수 | 주요 검증 |
|---|---|---|
| `MeSettingCard` | 4 | 제목과 설명, 일반 항목은 "열기" 라벨과 기본 색, 위험 항목은 "탈퇴" 라벨과 위험 색, 클릭 시 해당 항목과 함께 `onSelect` 호출 |
| `MeView` | 15 | 프로필 카드(닉네임, 이메일, 소개, 홈 링크), 로그인 상태 상단바와 네비게이션 활성, 설정 카드 4개, 처음에는 모달 없음 |
| `MeView` 모달 | (위 15건에 포함) | 개인정보(이메일 읽기 전용, 닉네임과 소개 기본값, 닉네임 수정), 사이트 설정(테마 3종, system 기본, dark 선택), 2차 인증(사용 여부, 인증 방식, 모바일 앱 비활성과 "미구현"), 회원 탈퇴(위험 안내, 확인 버튼), 항목별 내용만 표시, 닫기 버튼과 배경 클릭으로 닫힘, 다른 설정으로 전환, 빈 설정 목록 |
| `MeContainer` | 1 | 임시 데이터가 화면에 전달되는지 |

## 새로 만든 것과 판단 사항

- 픽스처 신규: `tests/fixtures/meViewModel.ts`
  - 설정 항목 4종(개인정보, 테마, 2차 인증, 탈퇴)이 들어 있는 테스트용 데이터다.
  - `MeView`는 이 픽스처로, 컨테이너 테스트만 실제 임시 데이터로 검증한다.
- 모달 열기 헬퍼: `MeView` 테스트에서 "설정 카드를 눌러 해당 모달을 연다"는 반복 동작을 `openSetting(title)` 함수로 뺐다.
- 테스트 중 고친 것: 홈 링크가 프로필 카드와 하단 네비게이션에 각각 있어서 `getByRole`이 실패했다. "2개이고 둘 다 `/`"로 단언을 바꿨다.
- 테스트하지 않은 것: 모달의 "수정하기", "저장", "중복체크", "탈퇴 절차 확인" 버튼은 지금 동작이 없는 화면 구성 확인용이라 존재와 모양만 확인했다. 실제 API가 연결되면 동작 테스트를 추가해야 한다.

---

# 4단계 blog 컴포넌트 테스트 작성 (1/2)

> task3에 추가하고 다음작업 시작

## 답변

`blog`는 컴포넌트와 컨테이너가 많아서 두 번에 나눠 진행하기로 하고, 첫 구간으로 작은 컴포넌트 7개를 작성한 뒤 멈췄다. 전체 44개 파일, 241건이 통과했다. (이번에 7개 파일, 46건 추가) `tsc`, `lint`도 통과했다.

## 작성한 테스트

`tests/unit/features/blog/components/` 아래에 두었다.

| 대상 | 건수 | 주요 검증 |
|---|---|---|
| `BlogProfileCard` | 7 | 닉네임, 이니셜, 소개, 카운팅 3종, 팔로워와 팔로잉만 버튼(작성 글은 정적), 클릭 시 `onSelectRelation('followers'/'following')`, `profileHref` 유무에 따른 공개 블로그 링크, `extraStats` 이어 붙임 |
| `BlogPostCard` | 7 | 작성자와 부가 정보, 제목, 본문, 좋아요, 댓글 수, 링크가 모두 상세로 이동, 이미지 유무, 아이콘 버튼 5종 |
| `BlogRelationModal` | 6 | 첫 페이지 3명, 페이지 표시와 이전, 다음 버튼 상태, 페이지 이동, 마지막 페이지에 남은 1명, 빈 목록(1 / 1, 버튼 비활성), 닫기 버튼과 배경 클릭 |
| `BlogGuestSection` | 5 | 소개 제목, 안내 3가지, 로그인과 회원가입 링크, 게시글 카드와 참여하기 링크, 빈 게시글 |
| `BlogMemberFeedSection` | 5 | 제목과 글쓰기 버튼, 피드 탭과 선택 상태, 글 작성 행, 게시글 카드, 빈 게시글 |
| `BlogSettingEditModal` | 5 | dialog와 설명, 옵션 전체와 현재값 강조, 옵션 변경 시 강조 이동, 취소, 저장, 닫기가 `onClose` 호출, 2옵션 설정 |
| `BlogPostCreateModal` | 11 | 입력 항목, 입력, 공개여부와 댓글허용여부 기본값과 서로 독립, 사진 선택 시 미리보기와 순번, 추가 선택 시 이어 붙음, 첫 사진과 끝 사진의 이동 버튼 비활성, 순서 변경, 사진 제거(모두 제거하면 목록 사라짐), 취소, 저장, 닫기 |

## 새로 만든 것

- 픽스처 신규: `tests/fixtures/blog.ts`
  - 게시글 2개(이미지 있음과 없음), 피드 탭 2개, 관계 사용자 7명(3명씩 3페이지)을 모아 둔 픽스처다.
- `URL.createObjectURL` 대체: jsdom에는 없어서 `BlogPostCreateModal` 테스트에서 `vi.fn()`으로 대체했다.

---

# 4단계 blog 컴포넌트 테스트 작성 (2/2)

> task3에 추가하고 다음작업 시작

## 답변

`blog`의 나머지 컴포넌트와 컨테이너를 작성하고 멈췄다. 전체 56개 파일, 306건이 통과했다. (이번에 12개 파일, 65건 추가) `tsc`, `lint`도 통과했다. 이로써 `blog` feature가 모두 끝났다.

## 작성한 테스트

| 대상 | 건수 | 주요 검증 |
|---|---|---|
| `BlogPopularInsightSection` | 8 | 제목과 칩, 탭 4종과 기본 선택, 기본 탭 랭킹 5개의 순서, 멘션, 팔로워, 태그 탭 전환(`it.each`), 순위 변동(up, new, down, same)별 색상, 등장 애니메이션 클래스와 순차 지연 |
| `BlogFollowingManageSection` | 10 | 제목과 탭, 팔로잉 첫 페이지 3명과 "언팔로우", 팔로워 탭 "팔로우", 새 글 표시, 페이지 이동과 끝 비활성, 검색창 열고 닫기, 닉네임과 설명 검색(대소문자와 공백 무시), 검색 시 첫 페이지 복귀, 결과 없음 안내, 탭 변경 시 검색어와 페이지 초기화 |
| `BlogView` | 4 | 비회원과 회원 섹션 전환, 상단바 서비스명과 홈 링크, 홈 탭 활성 |
| `BlogMenuView` | 6 | popular와 following별 소개와 섹션, 게시글 카드, 메뉴별 활성 탭, 인증별 상단바, 홈 링크 |
| `BlogUserBlogView` | 7 | 경로와 프로필 닉네임, 대문자 이니셜, 포스트 섹션, 빈 목록, 팔로워와 팔로잉 모달 열기와 닫기, 로그인 여부 |
| `BlogMeSettingsView` | 8 | 소개, 프로필, 추가 카운팅, 설정 카드 3개와 현재 값, 글작성 모달 열기와 닫기, 설정 변경 모달, 모달 연속 전환, 관계 모달, 로그인 여부와 활성 탭 |
| `BlogPostDetailView` | 11 | 제목과 작성자, 좋아요와 댓글 수, 이미지 유무, 태그 링크(`?tag=`), 내 글에만 수정 버튼, 액션 버튼 4종, 댓글 입력과 목록, 대댓글 유무, "답글 달기" 열기, 닫기, 다른 댓글로 전환, 로그인 여부 |
| `BlogContainer`, `BlogMenuContainer`, `BlogMeSettingsContainer`, `BlogPostDetailContainer`, `BlogUserBlogContainer` | 11 | 화면 전달, `authStatus` 분기, 없는 `postId`는 첫 게시글, 닉네임 전달 |

## 테스트 중 고친 것

- 닉네임 추출 헬퍼가 첫 텍스트(이니셜)를 잡아서 실패했다. 행의 텍스트 순서(이니셜, 닉네임, 설명, 버튼)에 맞춰 두 번째로 바꾸고 주석을 달았다.
- 프로필 이니셜 `J`가 게시글 카드의 작성자 이니셜과 겹쳐서, 프로필 영역(`region`)으로 범위를 좁혔다.
- 정적 `StatCard`도 `article`로 렌더링돼서 "포스트 섹션에 카드 없음" 검증이 틀렸다. 포스트 섹션 안으로 범위를 좁혔다.
- `header`가 여러 개(상단바와 게시글 카드)라서 `banner` 역할이 여러 개로 잡혔다. 첫 번째(상단바)를 쓰도록 바꿨다.

---

# 4단계 feed 컴포넌트 테스트 작성 (1/2)

> task3에 추가하고 다음작업 시작

## 답변

마지막 feature인 `feed`는 컴포넌트가 많아서 두 번에 나눠 진행하기로 하고, 첫 구간으로 작은 컴포넌트 10개를 작성한 뒤 멈췄다. 전체 66개 파일, 367건이 통과했다. (이번에 10개 파일, 61건 추가) `tsc`, `lint`도 통과했다.

## 작성한 테스트

`tests/unit/features/feed/components/` 아래에 두었다.

| 대상 | 건수 | 주요 검증 |
|---|---|---|
| `FormField` | 3 | 라벨과 입력창 연결, placeholder, 입력 |
| `TogglePreview` | 2 | 라벨, 켜진 스위치는 장식 요소이고 상호작용 요소 없음 |
| `ListPanel` | 3 | 제목과 영역 이름 연결, 항목 순서, 빈 목록 |
| `SettingToggle` | 4 | 라벨과 설명, 클릭 시 `onToggle`, 켜짐(오른쪽, 강조색)과 꺼짐(왼쪽, 흐린 색) |
| `TargetListLink` | 7 | 링크 경로, 이름, 종류 칩, 요약, 상태와 지표, 우측 문구, 종류별(아이템, 스트리머, 아티스트) 라벨과 아이콘 색상 |
| `TargetPreviewLink` | 6 | 링크 경로, 요약은 숨기고 상태와 지표만 표시, 우측 추이 문구, 종류별 아이콘 색상 |
| `MiniLineChart` | 12 | 라벨과 이미지 역할, 지점별 원과 날짜, 최고가와 최저가, 선, 지점 1개 중앙 배치, 호버와 포커스 시 `onHoverPoint`, 클릭 시 고정 토글(배경 해제와 분리), 배경 클릭 시 해제, 고정 지점 강조, 활성 지점 안내 유무 |
| `BroadcastContributionGraph` | 12 | 제목, 요일, 범례, 주 단위 열 제목, 일자별 칸과 비어 있는 칸 비활성, 강도별 색, 칸 클릭 시 대표 방송 팝오버(`document.body` 포털), 여러 방송 세션, 같은 칸 재클릭 시 닫힘, 다른 칸으로 전환, 바깥 클릭 시 닫힘, 빈 칸 무시, 빈 기록 |
| `AlbumCarousel3d` | 6 | 제목과 이전, 다음 버튼, 앨범 버튼, 방향과 함께 `onMoveAlbum`, 앨범 id와 함께 `onOpenAlbum`, 가시성, 가운데 앨범 `z-index` |
| `AlbumDetailModal` | 7 | 앨범 제목 dialog와 발매일, 트랙 목록, 트랙 클릭 시 `onSelectTrack`, 닫기, 트랙 상세(재생시간, 크레딧, 가사), 돌아가기 버튼(`null`), 배경 클릭 |

## 새로 만든 것

- 픽스처 신규: `tests/fixtures/feed.ts`
  - 이후 섹션과 화면 테스트에서도 쓸 공용 픽스처다.
  - 기간별 가격 추이(1주 3지점, 1개월 2지점), 방송 기록 10일(2주 열)과 방송 세션이 있는 변형, 앨범 3개(각 트랙 2개), 아이템, 스트리머, 아티스트 관찰 대상 3종과 목록, 최근 알림, 관찰 항목, `FeedViewModel`
- 테스트 중 고친 것: 방송 기록 빈 목록 테스트의 단언이 필요 이상으로 복잡해서 "버튼이 하나도 없음"으로 단순화했다.

---

# 4단계 feed 컴포넌트 테스트 작성 (2/3)

> task3에 추가하고 다음작업 시작

## 답변

`feed`의 두 번째 구간으로 상세 섹션 3개, 목록 섹션 3개, 내 피드 섹션, 등록 폼을 작성하고 멈췄다. 전체 74개 파일, 424건이 통과했다. (이번에 8개 파일, 57건 추가) `tsc`, `lint`도 통과했다.

## 작성한 테스트

`tests/unit/features/feed/components/` 아래에 두었다.

| 대상 | 건수 | 주요 검증 |
|---|---|---|
| `ItemDetailSection` | 9 | 데이터 없으면 렌더링 안 함, 현재와 목표 가격과 변화 문구, 원본 링크(새 탭), 기간 탭과 그래프, 기간 전환 시 지점 수 변경, 호버 안내, 클릭 고정과 해제, 배경 클릭 해제, 기간 변경 시 고정 해제 |
| `StreamerDetailSection` | 7 | 데이터 없으면 렌더링 안 함, LIVE와 대기, 이벤트 지표와 추이 문구, 원본 채널 링크, 방송 기록 그래프, 채팅 기록, 최근 방송과 이벤트 |
| `ArtistDetailSection` | 7 | 데이터 없으면 렌더링 안 함, 신곡 요약, 캐러셀, 앨범 모달 열기와 닫기, 트랙 상세와 돌아가기, 모달 재오픈 시 트랙 선택 초기화, 캐러셀 순환 이동 |
| `PopularTargetSection` | 10 | 제목과 칩, 탭 4종과 기본 선택, 전체 탭의 링크와 순위, 종류별 탭 필터(`it.each` 3종), 전체 복귀, 추이별 아이콘과 색상, 종류 칩과 애니메이션 지연, 빈 목록 |
| `PopularTargetEventSection` | 4 | 제목, 알림 제목과 출처와 시간, 대상 상세 링크, 빈 목록 |
| `ObservationTargetSection` | 5 | 전체와 종류별 개수, 한쪽에 몰린 경우, 대상 링크, 추이 문구, 빈 목록 |
| `MyFeedManageSection` | 7 | 소개와 프로필, 요약 카운팅, 설정 링크, 모달 열기와 닫기(버튼과 배경) |
| `FeedTargetCreateForm` | 8 | 탭 3종과 기본 선택, 공통 입력 4개, 종류별 추가 입력(아이템, 스트리머, 아티스트)과 알림 토글, 등록 버튼 상태 전환, 탭 변경 시 완료 상태 초기화 |

## 테스트 중 고친 것

- 포인터 위치 반영: `ItemDetailSection`에서 고정을 해제해도 포인터가 아직 지점 위에 있으면 호버 안내가 남는다. 이것이 실제 동작이라서, 테스트가 "해제 후 마우스를 벗어나면 안내가 사라진다"를 단계별로 확인하도록 고쳤다.
- 픽스처 보정: 스트리머 픽스처의 `eventTrendText`와 `metricText`가 같아서 텍스트 조회가 중복됐다. 실제 데이터처럼 다르게("이번 주 이벤트 3건") 바꿨다.

---

# 4단계 feed 컴포넌트 테스트 작성 (3/3)와 4단계 마무리

> task3에 추가하고 다음작업 시작

## 답변

`feed`의 마지막 구간으로 화면 6개와 컨테이너 6개를 작성했다. 이것으로 4단계(컴포넌트 테스트 작성)가 모두 끝났다. 전체 86개 파일, 496건이 통과했다. (이번에 12개 파일, 72건 추가) `tsc`, `lint`, `build`도 모두 통과했다.

## 작성한 테스트

`tests/unit/features/feed/` 아래에 두었다.

| 대상 | 건수 | 주요 검증 |
|---|---|---|
| `FeedView` | 11 | 소개, 상단바 링크, 비회원(로그인과 회원가입 링크, 준비 중 알림과 혜택 카드, 회원 영역 없음), 회원(링크 숨김, 요약 카드, 관찰 중인 대상만 최대 3개, 최근 알림, 비회원 영역 없음), 홈 탭 활성 |
| `FeedMenuView` | 9 | popular(순위 순 정렬을 섞인 입력으로 검증), observations(관찰 중인 대상만), me(소개 카드 없이 관리 섹션, 내 대상만, 요약), 메뉴별 활성 탭, 인증별 상단바 |
| `FeedActivityDetailView` | 4 | 출처, 제목, 시간, 알림 내용 카드, 내 피드 링크와 활성 탭, 로그인 여부 |
| `FeedObservationDetailView` | 5 | 분류, 제목, 상태, 상태 요약 카드 2개, 관찰 조건 카드, 관찰 목록 링크와 활성 탭, 로그인 여부 |
| `FeedTargetDetailView` | 13 | 종류별 헤더(`it.each` 3종), 상태, 지표, 추이 카드, 종류별 상세 섹션 선택, 상세 데이터 없는 경우, 최근 알림, 관련 소식 외부 링크와 빈 경우, 링크와 활성 탭, 로그인 여부 |
| `FeedTargetSettingsView` | 13 | 헤더, 관찰 상태 토글(초기값과 전환), 알림 주기 선택, 아이템(가격 토글, 목표 가격 수정), 스트리머(토글 2개 독립), 아티스트 설정, 저장 상태 전환과 변경 시 해제, 취소 링크, 위험 작업, 링크와 활성 탭, 로그인 여부 |
| `FeedContainer`, `FeedMenuContainer`, `FeedActivityDetailContainer`, `FeedObservationDetailContainer`, `FeedTargetDetailContainer`, `FeedTargetSettingsContainer` | 17 | 화면 전달, 없는 id는 첫 항목, `authStatus` 분기 |

## 4단계 전체 결과

| 구분 | 파일 수 | 비고 |
|---|---|---|
| `shared/ui`, `shared/model` | 17 | `Modal`, `ListRow`, `TopBarActions` 등 |
| `auth` | 4 | |
| `platform` | 10 | |
| `me` | 3 | |
| `blog` | 19 | |
| `feed` | 31 | 모델 테스트 1개 포함 |
| 합계 | 86 | 496건 |

- `src/**/components`의 컴포넌트 49개와 `src/shared/ui`는 전부 테스트가 있다.
- 전체 `lint`, `tsc`, `build`, `test:run`이 모두 통과한다.

## 알려드릴 점

- 포인터 호버가 남는 동작: `ItemDetailSection`에서 고정을 해제해도 포인터가 지점 위에 있으면 안내가 남는다. 의도된 동작이라 테스트에도 그대로 적었다.
- `feedViewModel` 임시 데이터 의존: 컨테이너 테스트는 실제 임시 데이터(`target-streamer-mory`, `target-artist-nova` 등의 id)에 의존한다. 임시 데이터의 id가 바뀌면 컨테이너 테스트도 고쳐야 한다. API 연동 시점에 MSW 기반 테스트로 바꾸는 것을 계획대로 남겨둔다.
- TDD가 아닌 사후 테스트: done 문서에 남기기로 한 부분이다.
