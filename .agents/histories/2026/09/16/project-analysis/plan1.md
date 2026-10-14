# 목차

- [개요](#개요)
- [프로젝트 분석해봐](#프로젝트-분석해봐)
  - [답변](#답변)
  - [기술 스택](#기술-스택)
  - [라우팅 구조](#라우팅-구조)
  - [발견한 문제점](#발견한-문제점)
    - [규칙과 코드의 괴리](#규칙과-코드의-괴리)
    - [home과 main 완전 중복](#home과-main-완전-중복)
    - [Header 컴포넌트가 절반만 쓰임](#header-컴포넌트가-절반만-쓰임)
    - [설정 및 코드 잔재](#설정-및-코드-잔재)
    - [문서 상태](#문서-상태)
    - [기능적 미완성](#기능적-미완성)
  - [제안하는 작업 우선순위](#제안하는-작업-우선순위)
- [버전 정비, 구조 재편, 디자인 개선](#버전-정비-구조-재편-디자인-개선)
  - [답변](#답변-1)
  - [버전 현황](#버전-현황)
  - [작업 순서 제안](#작업-순서-제안)
  - [결정 사항](#결정-사항)
- [Next 16 업그레이드 필요성](#next-16-업그레이드-필요성)
  - [답변](#답변-2)
  - [Breaking Change 해당 여부 대조](#breaking-change-해당-여부-대조)
  - [업그레이드로 얻는 것](#업그레이드로-얻는-것)
  - [사전에 알아둘 리스크](#사전에-알아둘-리스크)
  - [버전 선택 비교](#버전-선택-비교)

---

# 개요

- `choimory-dev-front` 프로젝트의 현재 상태를 파악하기 위한 전체 분석 작업.
- 별도 작업 지시 없이 프로젝트 구조, 기술 스택, 코드 내용, 개발 규칙 준수 여부를 전반적으로 확인해야 함.
- 소스 코드 전체(총 1,074줄), 설정 파일, `.agents/rules` 하위 개발 규칙 문서, `README.md`, git 히스토리를 참고하여 진행.
- 분석 결과를 바탕으로 향후 진행할 작업의 우선순위를 도출하는 것이 목적.
- 코드 수정은 수행하지 않고 현황 파악과 개선 방향 제안까지만 진행.

---

# 프로젝트 분석해봐

> 프로젝트 분석해봐

## 답변

백엔드 연동이 전혀 없는 Next.js 인증 화면 프로토타입이다.

화면 골격은 잡혀 있지만 모든 API가 `TODO + console.log` 상태이고, `.agents/rules`에 정의된 개발 규칙과 실제 코드 구조가 거의 반대 방향으로 작성되어 있다.

## 기술 스택

| 항목 | 내용 |
|---|---|
| 프레임워크 | Next.js 15.3.4 (App Router) |
| 언어 | TypeScript 5 (`strict: true`) |
| UI | React 19 |
| 스타일 | Tailwind CSS v4 (PostCSS 방식), 다크모드는 `prefers-color-scheme` |
| 폰트 | Geist Sans / Geist Mono |
| 패키지 | npm, `@/*` → `./src/*` 별칭 |

의존성이 `react`, `react-dom`, `next` 3개뿐이다.

상태관리(zustand/redux), HTTP 클라이언트(axios/react-query), 폼(react-hook-form), 테스트 도구가 전혀 없다.

## 라우팅 구조

```
/                    RootPage      로그인 상태 확인 후 분기 (게이트)
├── /login           LoginPage     아이디/비번 + SNS 로그인 버튼(Google/Naver/Kakao)
├── /signup          SignUpPage    이메일·닉네임 중복체크 + 비밀번호
│   ├── /verify      VerifyPage    6자리 코드 + 180초 카운트다운 + 재전송
│   └── /welcome     WelcomePage   가입 완료 안내
├── /home            HomePage      마이페이지형 대시보드
└── /main            MainPage      ← /home과 100% 동일
```

전 페이지가 `'use client'`이며, 서버 컴포넌트/서버 액션/API Route를 하나도 사용하지 않는다.

**인증 흐름**

`localStorage.setItem('isLoggedIn', 'true')` 문자열 하나가 전부다. `/`에서만 상태를 체크하고 미들웨어 가드가 없어서, `/home`이나 `/main`으로 직접 접근하면 비로그인 상태로도 화면이 그대로 열린다.

**가입 흐름**

`signup` → `verify` → `welcome` 사이에서 email·nickname을 쿼리스트링으로 전달한다. URL에 사용자 식별 정보가 노출되고 브라우저 히스토리에 남는다.

## 발견한 문제점

### 규칙과 코드의 괴리

가장 큰 이슈다.

`.agents/rules/front-end/code-convention-react.md`가 요구하는 것:

- `features/{도메인}/{api,model,container,components,hooks}` + `shared` 구조
- `page.tsx`는 Container만 호출하고 얇게 유지
- API 호출은 도메인별 `api` 파일에 작성, URL 문자열 직접 작성 금지
- 요청/응답 타입과 ViewModel 분리, mapper 함수 작성

실제 코드:

- `features`, `shared` 디렉토리 자체가 없음
- `page.tsx` 하나에 상태·이벤트·API 자리·UI가 전부 포함됨 (`src/app/signup/page.tsx`는 197줄)
- 타입 정의 파일이 하나도 없음
- `src/components/` 안에 `Header.tsx` 단 하나

`.agents/rules/front-end/comment.md`의 Doc Comment 규칙(컴포넌트/타입/함수 전부 작성)도 전체 코드에서 단 한 건도 지켜지지 않았다.

### home과 main 완전 중복

`diff` 결과 함수명 한 줄(`HomePage` vs `MainPage`)만 다르고 161줄이 동일하다.

게다가 `/`는 `/main`으로, 로그인 성공 시엔 `/home`으로 이동시켜서 진입 경로마다 다른 URL에 같은 화면이 뜬다.

### Header 컴포넌트가 절반만 쓰임

`login`/`home`/`main`은 `<Header>`를 사용하는데, `signup`/`verify`/`welcome` 3개는 동일한 `<header>` JSX를 각자 인라인으로 복사해서 사용한다.

타이틀 문구도 일치하지 않는다. `Header`는 `choimory-dev`, signup 계열은 `choimory`로 표기되어 있다.

### 설정 및 코드 잔재

- `src/app/page.tsx:5` — `import Image from "next/image"`가 미사용 상태 (ESLint 경고 대상)
- `src/app/globals.css:43` — `#__next { ... }` 셀렉터는 Pages Router 잔재로, App Router에는 해당 DOM이 없어 완전히 죽은 코드다. `body`가 `position: fixed`라 스크롤이 각 페이지의 `overflow-y-auto`에만 의존하는 상태다.
- `src/app/layout.tsx:17` — `metadata` 객체 안의 `viewport`는 Next.js 15에서 deprecated다. 별도 `export const viewport`로 분리해야 빌드 경고가 사라진다. 또한 `maximum-scale=1, user-scalable=no`는 확대를 막아 접근성 문제가 된다.
- lockfile 없음 — `9fd9c5d fix: delete package-lock.json` 커밋으로 삭제되었다. 팀 또는 CI 환경에서 설치 버전이 달라질 수 있다.

### 문서 상태

- `README.md`는 6줄짜리 스택 나열뿐이며, `AGENTS.md`가 요구하는 "프로젝트 구조·아키텍처·도메인 설명·코드 규칙"이 없다.
- `README2.md`는 `create-next-app` 템플릿 잔재다.
- `.agents/histories/calendar.md`가 빈 파일이고, 히스토리 디렉토리도 존재하지 않았다.
- `.agents/skills/`는 빈 디렉토리다.

### 기능적 미완성

- `handleEmailCheck` / `handleNicknameCheck`가 입력값만 있으면 무조건 `alert('사용 가능합니다')` 후 통과 처리
- 비밀번호 강도 및 형식 검증 없음
- 로그인은 입력값 검사 없이 무조건 성공 처리
- `/home`, `/main`의 사용자 정보는 전부 하드코딩된 더미 객체

## 제안하는 작업 우선순위

**1순위 — 구조 정비**

`features/auth`, `features/user`, `shared/api` 구조로 재편하고 page/container/component/hook을 분리한다. 규칙 문서가 이미 명확하므로 그대로 따라가면 된다.

**2순위 — 중복 제거**

`/home` 또는 `/main` 중 하나로 통합하고, signup 계열 3개 페이지에 `Header`를 적용하며, 인증 페이지 공통 레이아웃(`(auth)/layout.tsx`)을 도입한다.

**3순위 — 인증 기반**

localStorage에서 쿠키 기반으로 전환하고 `middleware.ts`로 라우트 가드를 추가한다. verify/welcome의 쿼리스트링은 sessionStorage나 서버 세션으로 대체한다.

**4순위 — 잔재 정리**

미사용 import, `#__next` CSS, `viewport` 메타데이터, `README2.md`를 정리하고 lockfile을 복구한다.

**5순위 — API 레이어**

백엔드와 계약을 정하고 `shared/api/apiClient` 및 도메인별 api 파일을 작성한다.

---

# 버전 정비, 구조 재편, 디자인 개선

> 내가 하고싶은건 일단 next 버전같은거 다시 잡고, 구조도 규칙에 맞게 다시 잡는거랑, 디자인 좀 가다듬어볼까 싶음

## 답변

세 가지 작업을 `버전 → 구조 → 디자인` 순으로 진행한다.

버전을 먼저 올려야 빌드가 통과하는 기준선이 생기고, 구조 재편으로 파일이 전부 이동한 뒤에 디자인을 적용해야 같은 작업을 두 번 하지 않는다. 순서를 반대로 하면 디자인 작업분을 재편하면서 다시 옮겨야 한다.

## 버전 현황

| 패키지 | 현재 | 최신 | 비고 |
|---|---|---|---|
| next | 15.3.4 | 16.3.5 | 메이저 1단계 뒤 |
| react / react-dom | 19.1.0 | 19.3.0 | 마이너 |
| tailwindcss | 4.1.11 | 4.3.3 | 마이너 |
| typescript | 5.8.3 | 5.x | 무방 |
| eslint-config-next | 15.3.4 | 16.3.5 | next와 동반 |

- `package.json`에는 next만 `15.3.4`로 고정되어 있고 나머지는 `^` 범위인데, lockfile이 없어서 설치할 때마다 실제 버전이 달라진다. 이것이 "버전을 다시 잡는다"의 핵심이다.
- 로컬 Node 버전은 `v22.17.0`이고 Next 16 요구사항이 `>=20.9.0`이므로 업그레이드 가능하다.
- 코드량이 1,074줄로 적은 지금이 메이저 업그레이드 비용이 가장 낮은 시점이다.

## 작업 순서 제안

### 1단계 - 버전 및 설정 정비

- Next 16 업그레이드 및 codemod 실행
- lockfile 생성 후 커밋 대상에 포함
- `layout.tsx`의 deprecated `viewport` 를 별도 export로 분리
- 미사용 `Image` import 제거
- `globals.css`의 죽은 `#__next` 셀렉터 및 `body { position: fixed }` 정리
- `README2.md` 정리
- 빌드 및 린트 통과 확인

### 2단계 - 구조 재편

- 규칙 문서대로 `features/auth`, `features/user`, `shared/{api,ui,utils}` 구성
- page는 Container 호출만 담당, 로직은 hook, UI는 component로 분리
- 타입 파일(`model/*Types.ts`)과 api 파일 신설 (실제 호출은 mock 유지)
- Doc Comment 규칙 적용

### 3단계 - 디자인 정돈

- 현재 `px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2...` 형태의 input 클래스 문자열이 5곳에 그대로 복사되어 있고, 색상은 `blue-500`이 전역에 하드코딩되어 있다.
- `globals.css`의 `@theme`에 토큰(surface/border/text/primary)을 정의하고 `Button`, `Input`, `Field`, `Card` 공통 컴포넌트로 중복을 걷어내는 것이 우선이다.
- 그 위에 시각적 톤을 다듬는 순서로 진행한다.

## 결정 사항

| 항목 | 결정 |
|---|---|
| 구조 재편 범위 | 전면 재편 (auth/user 두 도메인 전체를 features/shared 구조로 이동) |
| 다크모드 | 토글 추가 (`data-theme` 기반으로 토큰 재정의 필요) |
| 디자인 방향 | 화면을 직접 보면서 상세 논의 (1·2단계 완료 후 `npm run dev`로 확인) |
| Next 버전 | 미정 (별도 논의) |

다크모드 토글은 `data-theme` 기반 토큰 재정의가 전제되므로, 3단계 디자인 작업에서 스타일 구조를 먼저 잡고 진행한다.

---

# Next 16 업그레이드 필요성

> next 16 장점뭐지? 메이저 업그레이드 해야하는 이유는?

## 답변

Next 16의 breaking change 목록을 현재 코드에 전수 대조한 결과, **이 프로젝트에서 실제로 걸리는 항목은 단 하나**다.

동적 라우트도, 캐시 API도, 미들웨어도 아직 없어서 부딪힐 표면 자체가 존재하지 않는다. 구조를 재편하고 페이지를 늘린 뒤에 올리면 그때는 전부 대상이 되므로, 지금이 가장 저렴한 타이밍이다.

## Breaking Change 해당 여부 대조

| Breaking change | 이 프로젝트 |
|---|---|
| 동기 `params` / `searchParams` 접근 제거 | 동적 라우트 자체가 없음 → 해당없음 |
| 동기 `cookies()` / `headers()` / `draftMode()` 제거 | 미사용 → 해당없음 |
| `middleware.ts` → `proxy.ts` | 파일 없음 → 해당없음 |
| `revalidateTag()` 시그니처 변경 | 캐시 API 미사용 → 해당없음 |
| 병렬 라우트 `default.js` 필수화 | `@slot` 디렉토리 없음 → 해당없음 |
| `next/image` 기본값 변경 (qualities, minimumCacheTTL 등) | Image 컴포넌트 미사용 → 해당없음 |
| AMP, `serverRuntimeConfig`, `experimental.ppr` 제거 | 전부 미사용 → 해당없음 |
| `next lint` 명령 제거 | `package.json:9`에 존재 → **유일한 수정 대상** |
| ESLint Flat Config 기본화 | `FlatCompat` 사용 중 → 정리 권장 |

수정 대상인 `"lint": "next lint"` 한 줄도 `npx @next/codemod@canary next-lint-to-eslint-cli .` 코드모드가 처리한다.

## 업그레이드로 얻는 것

### proxy.ts - 라우트 가드 작업과 직결

Next 16에서 `middleware.ts`는 deprecated가 되고 `proxy.ts`로 대체되었다. 계획 중인 인증 가드를 15에서 `middleware.ts`로 작성하면 이후 파일명, 함수명, config 플래그(`skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`)를 모두 다시 옮겨야 한다. 아직 작성 전인 지금 올리는 것이 맞다.

### View Transitions - 디자인 작업과 직결

Next 16은 React 19.2의 `<ViewTransition>`을 사용한다. login → signup → verify → welcome 같은 단계형 화면 전환에 애니메이션을 적용할 수 있다. 현재 앱이 모바일앱풍 레이아웃이라 체감 차이가 크다. Next 15에서는 사용할 수 없다.

### Turbopack 기본 및 안정화

프로덕션 빌드 2~5배, Fast Refresh 최대 10배 향상. 디자인 작업은 저장과 확인을 반복하는 작업이므로 바로 체감된다.

### 당장은 해당 없으나 향후 유효한 것

- Cache Components(`use cache`), `updateTag()` : 백엔드 연동 시 의미가 생긴다.
- React Compiler : stable이 되었으나 Babel 의존으로 빌드가 느려지므로 현 시점에 활성화할 이유는 없다.

## 사전에 알아둘 리스크

Next 16의 `next dev`는 `AGENTS.md`에 `<!-- BEGIN:nextjs-agent-rules -->` 관리 블록을 자동으로 기록한다.

현재 `AGENTS.md`는 직접 작성한 규칙으로 구성되어 있고 `CLAUDE.md`가 이를 참조하는 구조라, 실행 즉시 파일이 수정된다. 삭제해도 `next dev`가 다시 생성한다.

기존 내용을 덮어쓰지는 않으므로 위험하지는 않으나, git diff에 계속 노출되므로 해당 블록을 그대로 커밋하여 tree를 깨끗하게 유지하는 것이 공식 권장 사항이다.

## 버전 선택 비교

| 항목 | Next 16 | Next 15.5 |
|---|---|---|
| 지금 드는 비용 | 코드모드 1회 + `next lint` 한 줄 | 없음 |
| 나중에 드는 비용 | 없음 | 페이지·미들웨어 증가 후 전면 마이그레이션 |
| 빌드 / HMR 속도 | 2~5배 / 최대 10배 | 현행 |
| 라우트 가드 | `proxy.ts` (최신 규약) | `middleware.ts` (deprecated 예정) |
| 화면 전환 애니메이션 | View Transitions 사용 가능 | 불가 |

결론적으로 Next 16을 권장한다. 지금 올리지 않으면 동일한 작업을 이후에 훨씬 큰 비용으로 수행하게 된다.
