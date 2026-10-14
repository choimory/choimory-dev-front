# 목차

- [개요](#개요)
- [구조 재편 사전 분석](#구조-재편-사전-분석)
  - [답변](#답변)
  - [현재 상태 요약](#현재-상태-요약)
  - [도메인 식별](#도메인-식별)
  - [화면별 로직 인벤토리](#화면별-로직-인벤토리)
  - [중복 정량 측정](#중복-정량-측정)
  - [인증 상태 산재 현황](#인증-상태-산재-현황)
  - [목표 구조 매핑](#목표-구조-매핑)
  - [시작 전 결정 필요 사항](#시작-전-결정-필요-사항)
- [구조 리팩터 계획](#구조-리팩터-계획)
  - [답변](#답변-1)
  - [결정 사항 제안](#결정-사항-제안)
    - [home 라우트 유지 및 main 제거](#home-라우트-유지-및-main-제거)
    - [헤더 타이틀 통일](#헤더-타이틀-통일)
    - [인증 저장소 유지](#인증-저장소-유지)
  - [리팩터 단계](#리팩터-단계)
    - [1단계 - shared 토대 구성](#1단계---shared-토대-구성)
    - [2단계 - 타입 및 API 레이어 신설](#2단계---타입-및-api-레이어-신설)
    - [3단계 - 화면 단위 이관](#3단계---화면-단위-이관)
    - [4단계 - 잔재 제거](#4단계---잔재-제거)
    - [5단계 - 문서 갱신](#5단계---문서-갱신)
  - [단계별 검증 방법](#단계별-검증-방법)
  - [함께 적용할 규칙](#함께-적용할-규칙)
  - [범위에서 제외할 것](#범위에서-제외할-것)
  - [디자인 단계와의 작업 중복에 대한 판단](#디자인-단계와의-작업-중복에-대한-판단)
- [결정 사항 확정과 인증 구현 현황](#결정-사항-확정과-인증-구현-현황)
  - [답변](#답변-2)
  - [확정된 결정 사항](#확정된-결정-사항)
  - [인증 구현 현황](#인증-구현-현황)
  - [인증 저장소 방향](#인증-저장소-방향)
  - [쿠키 전환의 실익](#쿠키-전환의-실익)
- [useAuthSession 설명](#useauthsession-설명)
  - [답변](#답변-3)
  - [현재 저장소 접근 현황](#현재-저장소-접근-현황)
  - [작성할 hook](#작성할-hook)
  - [사용처 변경 내용](#사용처-변경-내용)
  - [격리해두는 이유](#격리해두는-이유)
  - [명명에 대하여](#명명에-대하여)
- [인증 세션 설계 검토](#인증-세션-설계-검토)
  - [답변](#답변-4)
  - [적절한 부분](#적절한-부분)
  - [변경 권장 사항 - access token은 메모리로](#변경-권장-사항---access-token은-메모리로)
  - [Next.js 환경에서의 추가 근거](#nextjs-환경에서의-추가-근거)
  - [세부 권장 사항](#세부-권장-사항)
    - [쿠키 속성](#쿠키-속성)
    - [토큰 수명](#토큰-수명)
    - [refresh 로테이션과 재사용 감지](#refresh-로테이션과-재사용-감지)
    - [CORS 구성](#cors-구성)
  - [useAuthSession 최종 형태](#useauthsession-최종-형태)
- [리팩터 계획 최종 정리](#리팩터-계획-최종-정리)
  - [답변](#답변-5)
  - [세션 설계에 따른 계획 변경 사항](#세션-설계에-따른-계획-변경-사항)
    - [apiClient 설계 제약](#apiclient-설계-제약)
    - [useAuthSession의 login 시그니처](#useauthsession의-login-시그니처)
  - [확정 사항 종합](#확정-사항-종합)
  - [최종 실행 계획](#최종-실행-계획)
    - [1단계 최종 - shared 토대](#1단계-최종---shared-토대)
    - [2단계 최종 - 타입 및 API 레이어](#2단계-최종---타입-및-api-레이어)
    - [3단계 최종 - 화면 단위 이관](#3단계-최종---화면-단위-이관)
    - [4단계 최종 - 잔재 제거](#4단계-최종---잔재-제거)
    - [5단계 최종 - 문서 갱신](#5단계-최종---문서-갱신)
  - [최종 검증 방법](#최종-검증-방법)
  - [함께 적용할 사항](#함께-적용할-사항)
  - [최종 제외 범위](#최종-제외-범위)
  - [인증 구현의 작업 분리](#인증-구현의-작업-분리)

---

# 개요

- `plan1.md`에서 정한 3단계 작업 중 **2단계인 구조 재편**의 사전 분석이다.
- 1단계 버전 정비는 `task1.md`로 완료되었다. (Next 15.3.4 → 16.3.5)
- `.agents/rules/front-end/code-convention-react.md`가 요구하는 `features` / `shared` 구조와 현재 코드의 격차를 측정하고, 이동 대상과 분리 단위를 확정하는 것이 목적이다.
- 실제 재편 작업 전에 파악해야 할 것은 세 가지다. 도메인별로 무엇이 이동하는지, 중복이 실제로 몇 곳인지, 화면 로직 중 hook으로 분리할 것이 무엇인지.
- 분석 단계이므로 코드는 수정하지 않았다.

---

# 구조 재편 사전 분석

> 구조갱신 작업준비하자 먼저 분석부터 해봐

## 답변

소스 전체를 훑어 도메인, 로직 인벤토리, 중복 현황을 측정하고 목표 구조와의 매핑을 작성했다.

현재 소스는 1,002줄이며 페이지 7개와 컴포넌트 1개로 구성되어 있다. 전 페이지가 `'use client'`이고 타입 정의는 **하나도 없다**.

## 현재 상태 요약

| 파일 | 라인 수 |
|---|---|
| `src/app/signup/page.tsx` | 197 |
| `src/app/home/page.tsx` | 161 |
| `src/app/main/page.tsx` | 161 |
| `src/app/signup/verify/page.tsx` | 148 |
| `src/app/login/page.tsx` | 140 |
| `src/app/globals.css` | 47 |
| `src/app/page.tsx` | 47 |
| `src/app/layout.tsx` | 41 |
| `src/app/signup/welcome/page.tsx` | 41 |
| `src/components/Header.tsx` | 19 |
| **합계** | **1,002** |

서버 컴포넌트, 서버 액션, API Route는 사용하지 않는다.

## 도메인 식별

| 도메인 | 화면 | 비고 |
|---|---|---|
| auth | login, signup, verify, welcome | 4화면 |
| user | home, main | 1화면인데 라우트가 2개 |
| 게이트 | `/` | 인증 상태 분기만 담당 |

## 화면별 로직 인벤토리

재편 시 Container와 hook으로 분리될 대상이다.

| 화면 | 상태 | 이벤트 핸들러 | API 자리 |
|---|---|---|---|
| `/` | `isLoading` | 로그인 상태 확인 후 분기 | localStorage 조회 |
| `/login` | `loginForm{id,password}` | `handleLogin`, `handleInputChange` | 로그인 |
| `/signup` | 7개 (`email`, `nickname`, `password`, `confirmPassword`, `error`, `isEmailChecked`, `isNicknameChecked`) | `handleEmailCheck`, `handleNicknameCheck`, `handleSubmit` | 중복체크 2건, 회원가입 |
| `/signup/verify` | 3개 + 파생 2개 | 타이머 effect, `formatTime`, `handleSubmit`, `handleResend` | 인증 확인, 재발송 |
| `/signup/welcome` | 없음 | 없음 | 없음 |
| `/home`, `/main` | 없음 (더미 객체 하드코딩) | `handleLogout` | 사용자 정보 조회 |

`/signup`이 상태 7개로 가장 무겁고 `/signup/verify`가 로직이 가장 복잡하다. 두 화면이 hook 분리 효과가 가장 크다.

미구현 API 지점은 총 6곳이며 모두 `TODO` 주석과 `console.log`로 남아 있다.

## 중복 정량 측정

`shared/ui`로 추출할 대상을 실제로 계수한 결과다.

| 패턴 | 반복 횟수 | 분포 |
|---|---|---|
| 화면 래퍼 `flex flex-col h-screen bg-white dark:bg-black` | 7곳 | 전 페이지 |
| input 클래스 문자열 | 10곳 | signup 4, login 5, verify 1 |
| label 클래스 문자열 | 7곳 | signup 4, login 2, verify 1 |
| 기본 버튼 `bg-blue-500 hover:bg-blue-600` | 8곳 | 전반 |
| 헤더 | 컴포넌트 3곳 + 인라인 3곳 | 아래 참고 |
| `/home` ↔ `/main` | 161줄 100% 동일 | 함수명만 상이 |

**헤더 처리가 일관되지 않다.**

- `Header` 컴포넌트 사용: `login`, `home`, `main`
- 동일 JSX를 인라인으로 복사: `signup`, `signup/verify`, `signup/welcome`
- 타이틀 문구도 불일치: `Header`는 `choimory-dev`, 인라인 3곳은 `choimory`

## 인증 상태 산재 현황

`'isLoggedIn'` 문자열이 4개 파일에 하드코딩되어 있다.

```
src/app/page.tsx:15        localStorage.getItem('isLoggedIn')
src/app/login/page.tsx:18  localStorage.setItem('isLoggedIn', 'true')
src/app/home/page.tsx:11   localStorage.removeItem('isLoggedIn')
src/app/main/page.tsx:11   localStorage.removeItem('isLoggedIn')
```

추후 쿠키 기반으로 전환할 때 4곳을 모두 찾아 수정해야 한다.

`useAuthSession` hook 하나로 접근 지점을 단일화하는 것이 이번 재편의 실질적 이득 중 하나다. 저장 방식을 바꿀 때 hook 내부만 수정하면 된다.

## 목표 구조 매핑

```
src/
├── app/                              라우팅 진입점만 (각 1~3줄)
│   ├── layout.tsx                    유지
│   ├── page.tsx                      → RootGateContainer
│   ├── login/page.tsx                → LoginContainer
│   ├── signup/page.tsx               → SignUpContainer
│   ├── signup/verify/page.tsx        → VerifyContainer
│   ├── signup/welcome/page.tsx       → WelcomeContainer
│   └── home/page.tsx                 → DashboardContainer
│
├── features/
│   ├── auth/
│   │   ├── api/authApi.ts            login, signUp, checkEmail, checkNickname, verifyCode, resendCode
│   │   ├── model/authTypes.ts        요청/응답 타입 및 ViewModel
│   │   ├── hooks/                    useLogin, useSignUp, useVerify, useAuthSession
│   │   ├── container/                LoginContainer, SignUpContainer, VerifyContainer, WelcomeContainer
│   │   └── components/               LoginForm, SignUpForm, VerifyForm, SocialLoginButtons
│   └── user/
│       ├── api/userApi.ts            getUserSummary
│       ├── model/userTypes.ts        UserSummaryResponse → UserSummaryViewModel + mapper
│       ├── hooks/useUserSummary.ts
│       ├── container/DashboardContainer.tsx
│       └── components/               UserSummaryCard, SectionCard, FeatureHighlight
│
└── shared/
    ├── api/apiClient.ts              HTTP 클라이언트 (mock 단계)
    ├── ui/                           ScreenLayout, AppHeader, BottomNav, Button, TextField, Card
    └── utils/formatTime.ts           verify 화면의 mm:ss 포맷
```

기존 `src/components/Header.tsx`는 `shared/ui/AppHeader.tsx`로 흡수되며, 이 과정에서 인라인으로 복사된 헤더 3곳도 함께 정리된다.

## 시작 전 결정 필요 사항

### 1. `/home`과 `/main` 중 어느 쪽을 남길 것인가

161줄 중복의 해소 방향이며, 이 결정에 따라 `app/` 하위 구조가 확정된다.

현재는 `/`가 `/main`으로 보내고 로그인 성공 시에는 `/home`으로 보내고 있어, 진입 경로마다 다른 URL에서 같은 화면이 렌더링된다.

### 2. 헤더 타이틀을 무엇으로 통일할 것인가

`choimory-dev`와 `choimory` 중 선택이 필요하다.

### 3. 인증 저장소를 이번 단계에서 변경할 것인가

쿠키 기반 전환은 `proxy.ts` 라우트 가드 작업과 묶여 있으므로 별도 단계로 두는 것을 권장한다.

이번 단계에서는 `useAuthSession`으로 **접근 지점만 단일화**하고, 저장 방식 변경은 이후 해당 hook 내부만 수정하는 방식으로 진행한다.

### 결정이 불필요한 항목

아래는 규칙 문서에 이미 기준이 있으므로 그대로 따른다.

- API 호출은 mock 유지 (백엔드 미연동 상태)
- `.agents/rules/front-end/comment.md`의 Doc Comment 규칙 적용
- 요청/응답 타입과 ViewModel 분리 및 mapper 함수 작성

---

# 구조 리팩터 계획

> 구조 리팩터 계획 말해봐

## 답변

`plan3.md` 앞부분에서 정리한 결정 필요 사항 3건은 판단 근거가 코드에 있으므로 제안을 확정하고, 그 위에서 리팩터 단계를 구성했다.

계획의 핵심 원칙은 **한 번에 전체를 교체하지 않는 것**이다. 1,002줄이 모두 변경되는 작업은 문제 발생 시 원인을 추적할 수 없다. 각 단계가 끝난 시점마다 빌드가 통과하는 상태를 유지한다.

## 결정 사항 제안

### home 라우트 유지 및 main 제거

`/home`을 남기고 `/main`을 제거한다.

- `Header.tsx`의 로고 링크가 이미 `<Link href="/home">`이다.
- 로그인 성공 시 이동 목적지도 `/home`이다.
- `/main`을 참조하는 곳은 `/` 게이트 한 곳뿐이다.

`/home`이 사실상 정착된 라우트이므로 이쪽을 남기는 것이 참조 일관성에 맞다.

### 헤더 타이틀 통일

`choimory-dev`로 통일한다.

- `metadata.title`이 `choimory-dev-front`이고 프로젝트명도 동일하다.
- 정식 컴포넌트인 `Header`가 이미 `choimory-dev`를 사용한다.
- 인라인으로 복사된 3곳만 `choimory`를 사용하고 있다.

예외에 해당하는 인라인 3곳을 정식 컴포넌트 쪽에 맞춘다.

### 인증 저장소 유지

localStorage를 유지하되 `useAuthSession`으로 접근 지점만 단일화한다.

쿠키 기반 전환은 `proxy.ts` 라우트 가드 작업과 묶여 있으므로 별도 단계로 분리한다. 이번 단계에서 접근 지점을 모아두면, 이후 전환 시 hook 내부만 수정하면 된다.

## 리팩터 단계

### 1단계 - shared 토대 구성

신규 파일만 추가하며 기존 파일은 수정하지 않는다.

```
shared/ui/ScreenLayout.tsx    h-screen 래퍼 (대상 7곳)
shared/ui/AppHeader.tsx       헤더 (컴포넌트 3곳 + 인라인 3곳 대상)
shared/ui/BottomNav.tsx       하단 네비게이션 (home/main 대상)
shared/ui/Button.tsx          variant: primary | social | ghost
shared/ui/TextField.tsx       label + input (+ 중복체크 버튼 슬롯)
shared/ui/Card.tsx
shared/utils/formatTime.ts    verify 화면의 mm:ss 포맷
```

추가만 수행하므로 이 시점에는 기존 화면이 그대로 동작한다.

### 2단계 - 타입 및 API 레이어 신설

역시 신규 파일만 추가한다.

```
features/auth/model/authTypes.ts    LoginRequest/Response, SignUpRequest/Response, VerifyRequest 등
features/user/model/userTypes.ts    UserSummaryResponse → ViewModel + mapper
shared/api/apiClient.ts             mock 단계 HTTP 클라이언트
features/auth/api/authApi.ts        login, signUp, checkEmail, checkNickname, verifyCode, resendCode
features/user/api/userApi.ts        getUserSummary
```

현재 흩어져 있는 `TODO` 6곳이 이동할 위치를 먼저 확보하는 작업이다. 아직 사용하는 곳이 없으므로 기존 동작에 영향이 없다.

### 3단계 - 화면 단위 이관

화면 하나씩 `hook → component → container → page 축소 → 검증` 순환을 수행한다.

| 순서 | 화면 | 줄 수 | 선정 사유 |
|---|---|---|---|
| 1 | `welcome` | 41 | 상태가 없음. 패턴 검증용 첫 조각 |
| 2 | `home` + `main` 통합 | 161 | 중복 제거 효과가 가장 큼 |
| 3 | `login` | 140 | `useAuthSession` 첫 실사용 |
| 4 | `signup` | 197 | 상태 7개로 가장 무거움 |
| 5 | `verify` | 148 | 로직이 가장 복잡함 |
| 6 | `/` 게이트 | 47 | `useAuthSession` 확정 이후 진행 |

`welcome`을 먼저 진행하는 이유는, 가장 단순한 화면으로 page/container/component/hook 4계층 패턴이 실제로 적합한지 검증한 뒤 나머지에 적용하기 위해서다. 패턴이 부적절하면 41줄만 되돌리면 된다.

`/` 게이트를 마지막에 두는 이유는 `useAuthSession`이 login(저장)과 home(삭제)을 거치며 확정되기 때문이다.

### 4단계 - 잔재 제거

- `src/components/Header.tsx` 삭제 (`shared/ui/AppHeader`로 흡수 완료 후)
- `src/app/main/` 디렉토리 삭제
- `src/components/` 디렉토리 자체 제거

### 5단계 - 문서 갱신

`README.md`에 프로젝트 구조와 아키텍처를 반영하고 `README2.md`를 정리한다.

`AGENTS.md`가 요구하는 항목이며 1단계 버전업 작업에서 구조 변경 이후로 미뤄두었던 것이다.

## 단계별 검증 방법

각 단계 종료 시 동일하게 수행한다.

```
npx tsc --noEmit  →  npx eslint .  →  npm run build  →  7개 라우트 200 확인
```

3단계는 화면 하나를 완료할 때마다 검증한다.

## 함께 적용할 규칙

- **Doc Comment 규칙 적용** — `.agents/rules/front-end/comment.md` 기준. 현재 전체 코드에 0건이므로 신규 생성 파일부터 작성한다.
- **`any` 사용 금지** — 규칙 명시 사항이며 현재 위반 사례는 없다.
- **하드코딩 제거** — `'isLoggedIn'` 문자열, 더미 사용자 객체, 반복되는 클래스 문자열

## 범위에서 제외할 것

| 항목 | 사유 |
|---|---|
| 쿠키 전환 및 `proxy.ts` 가드 | 별도 단계 (인증 설계 작업) |
| `globals.css` 정리, 디자인 토큰 | 3단계 디자인 작업 |
| 다크모드 토글 | 3단계 디자인 작업 |
| 실제 API 연동 | 백엔드 미연동 상태 |

## 디자인 단계와의 작업 중복에 대한 판단

`shared/ui`를 구성하는 본 단계와 디자인 토큰을 적용하는 3단계가 동일한 파일을 두 번 수정하게 된다.

다만 본 단계는 "반복되는 클래스 문자열을 한 곳에 모으는" 작업이고, 3단계는 "모아둔 한 곳의 값을 토큰으로 치환하는" 작업이다. 먼저 모아두면 3단계 비용이 오히려 감소한다.

현재처럼 input 클래스가 10곳, 버튼이 8곳에 분산된 상태로 디자인 작업에 진입하는 것이 더 큰 비용이므로, 제시한 순서대로 진행하는 것이 적절하다.

---

# 결정 사항 확정과 인증 구현 현황

> 1.main 지우자 중복코드네 home을 홈으로 쓰고 main은 나중에 랜딩페이지 쓰거나 그럴때 쓰면 될듯?
> 2.헤더 타이틀은 서비스명인 choimory-dev로 가자
> 3. 인증 실제 구현된거 아직 없지 않나?

## 답변

1번과 2번은 제안대로 확정되었다.

3번의 지적은 정확하다. 현재 프로젝트에 인증이라고 부를 수 있는 구현은 존재하지 않는다.

## 확정된 결정 사항

| 항목 | 확정 내용 |
|---|---|
| 라우트 | `/home`을 홈으로 유지, `/main` 삭제 |
| 헤더 타이틀 | 서비스명인 `choimory-dev`로 통일 |
| 인증 저장소 | localStorage 유지 + `useAuthSession`으로 격리 |

`/main`은 현재의 중복 코드만 제거하면 라우트 이름이 비게 되므로, 이후 랜딩 페이지 용도로 재사용할 수 있다.

## 인증 구현 현황

로그인 처리는 localStorage에 문자열 하나를 저장하는 것이 전부다.

```tsx
// src/app/login/page.tsx:15
const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 로그인 로직은 여기에 구현
    localStorage.setItem('isLoggedIn', 'true');
    router.push('/home');
};
```

**입력값 검증이 전혀 없다.** 아이디와 비밀번호에 어떤 값을 입력해도 통과한다. input에 `required`가 지정되어 있어 빈 값만 브라우저가 차단한다.

존재하지 않는 항목은 다음과 같다.

| 항목 | 상태 |
|---|---|
| 인증 API | 없음 |
| 토큰 / 세션 | 없음 |
| 비밀번호 검증 | 없음 |
| 라우트 가드 | 없음 (`/home` 직접 접근 가능) |
| 서버 | 없음 |

`signup`의 중복체크도 `alert('사용 가능합니다')`가 전부이며, `verify`의 인증 코드 확인도 `console.log` 후 무조건 통과한다.

## 인증 저장소 방향

localStorage를 유지하고 `useAuthSession`으로 격리하는 방향을 유지한다. 다만 판단 근거는 조정되었다.

당초 논리는 "이후 쿠키로 전환할 때 4곳을 수정하지 않기 위해 모아둔다"였으나, 실제 인증이 존재하지 않으므로 어떤 저장소로 바꾸어도 동일하게 임시 구현이다. 쿠키로 옮겨도 임시 플래그를 쿠키에 저장하는 것에 불과하며 코드만 증가한다.

그럼에도 격리는 유효하다. 백엔드가 연동되는 시점에 **수정할 파일이 1개로 확정되어 있다는 점** 자체가 이득이기 때문이다. hook 내부가 현재는 단순 플래그 처리여도 무방하다.

## 쿠키 전환의 실익

실제 인증 여부와 무관하게 지금도 실익이 하나 있다.

현재 `/` 게이트의 동작 순서는 다음과 같다.

```
브라우저 → 로딩 스피너 렌더 → useEffect 실행 → localStorage 확인 → 리다이렉트
```

클라이언트에서만 판단하므로 진입할 때마다 스피너가 깜빡인다. 쿠키와 `proxy.ts`로 옮기면 서버에서 리다이렉트가 처리되어 이 깜빡임이 사라진다.

다만 이 작업도 구조 재편 이후에 진행하는 것이 맞다. 현재 `/` 게이트 로직이 페이지에 직접 작성되어 있으므로, 먼저 `useAuthSession`으로 분리한 뒤 저장소를 변경하는 순서가 된다.

---

# useAuthSession 설명

> useAuthSession이 뭐야?

## 답변

계획 단계에서 명명한 것으로, 라이브러리가 아니라 **직접 작성할 파일**이다.

현재 4곳에 분산된 `localStorage` 접근을 한 곳으로 모으는 Custom Hook이다.

## 현재 저장소 접근 현황

```
src/app/page.tsx:15        localStorage.getItem('isLoggedIn') === 'true'
src/app/login/page.tsx:18  localStorage.setItem('isLoggedIn', 'true')
src/app/home/page.tsx:11   localStorage.removeItem('isLoggedIn')
src/app/main/page.tsx:11   localStorage.removeItem('isLoggedIn')
```

`'isLoggedIn'` 문자열이 4회 반복된다. 오타가 있어도 컴파일은 통과하며, 저장 방식을 변경하려면 4곳을 모두 찾아야 한다.

## 작성할 hook

```tsx
// features/auth/hooks/useAuthSession.ts
'use client';

import { useCallback, useEffect, useState } from 'react';

/** 로그인 여부를 보관하는 스토리지 키 */
const AUTH_STORAGE_KEY = 'isLoggedIn';

/** 로그인 세션 상태 */
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

/**
 * 로그인 세션을 조회하고 변경하는 Custom Hook입니다.
 * 저장소 접근은 이 hook 내부에서만 수행합니다.
 *
 * @returns 세션 상태와 로그인/로그아웃 함수
 */
export function useAuthSession() {
  const [status, setStatus] = useState<AuthStatus>('loading');

  // 저장소는 브라우저에서만 접근 가능하므로 마운트 이후 확인한다.
  useEffect(() => {
    const isLoggedIn = localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    setStatus(isLoggedIn ? 'authenticated' : 'unauthenticated');
  }, []);

  /** 로그인 상태로 전환한다. */
  const login = useCallback(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    setStatus('authenticated');
  }, []);

  /** 로그인 상태를 해제한다. */
  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setStatus('unauthenticated');
  }, []);

  return { status, login, logout };
}
```

## 사용처 변경 내용

### 로그아웃 (home)

```tsx
// 변경 전
localStorage.removeItem('isLoggedIn');
router.push('/login');

// 변경 후
const { logout } = useAuthSession();
logout();
router.push('/login');
```

### 로그인 (login)

```tsx
// 변경 전
localStorage.setItem('isLoggedIn', 'true');

// 변경 후
const { login } = useAuthSession();
login();
```

### 게이트 (/)

효과가 가장 큰 지점이다.

```tsx
// 변경 전: isLoading 상태를 페이지가 직접 관리
const [isLoading, setIsLoading] = useState(true);
useEffect(() => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (isLoggedIn) router.push('/main');
  else router.push('/login');
  setIsLoading(false);
}, [router]);

// 변경 후: status 하나로 처리
const { status } = useAuthSession();
useEffect(() => {
  if (status === 'loading') return;
  router.push(status === 'authenticated' ? '/home' : '/login');
}, [status, router]);
```

`page.tsx`의 `isLoading` 상태와, "실제로는 렌더링되지 않지만 TypeScript를 위해 필요"라는 주석이 달린 `return null` 구문이 함께 정리된다.

## 격리해두는 이유

현재는 실제 인증이 아니지만, 이후 백엔드가 연동되면 **이 파일 하나만 수정하면 된다.**

```tsx
const login = useCallback(async (request: LoginRequest) => {
  const response = await authApi.login(request);              // 실제 API 호출
  document.cookie = `token=${response.accessToken}; path=/`;  // 쿠키 저장
  setStatus('authenticated');
}, []);
```

호출하는 4개 화면은 수정할 필요가 없다. 현 시점에 격리해두는 근거가 이것이다.

## 명명에 대하여

`.agents/rules/front-end/code-convention-react.md`의 규칙은 "hook 파일명은 `use` 접두사를 사용한다"뿐이므로 뒷부분은 자유롭게 정할 수 있다.

- `useAuthSession` — 세션(로그인 상태)을 다룬다는 의미
- `useAuth`
- `useLoginState`

`useAuthSession`으로 제안한 이유는, 이후 토큰과 만료 시간, 사용자 정보까지 포함될 위치이므로 "세션"이 범위를 더 정확히 표현한다고 보았기 때문이다.

---

# 인증 세션 설계 검토

> 세션은 jwt랑 백엔드의 redis 쓸건데 active 토큰은 localstorage에 놓고, refresh는 쿠키에 httponly, secure로 할 생각인데 이거 괜찮아?

## 답변

전반적으로 적절하나 **access token을 localStorage에 보관하는 부분은 메모리로 변경**할 것을 권장한다.

refresh token을 httpOnly + Secure 쿠키에 두는 것과 Redis를 사용하는 것은 그대로 유지한다.

## 적절한 부분

**refresh token을 httpOnly + Secure 쿠키에 보관**

정석적인 구성이다. JavaScript가 읽을 수 없으므로 XSS로 장기 토큰이 유출되는 것을 차단한다.

**Redis 사용**

JWT의 가장 큰 약점은 발급 후 만료 전까지 취소할 수 없다는 점이다. refresh token을 Redis에서 관리하면 이 문제가 해결된다.

- 로그아웃
- 강제 로그아웃
- 비밀번호 변경 시 전체 세션 무효화

JWT와 Redis를 함께 사용하는 핵심 목적이 이것이므로 방향이 적절하다.

## 변경 권장 사항 - access token은 메모리로

localStorage는 **동일 오리진의 모든 스크립트가 읽을 수 있다.** XSS가 발생하면 `localStorage.getItem('accessToken')` 한 줄로 즉시 탈취되며, 공격자 서버로 전송되면 만료 시점까지 계속 사용된다.

권장 구성은 다음과 같다.

```
access token   → 메모리 (JS 변수 또는 React state)
refresh token  → httpOnly + Secure 쿠키   (기존 계획 유지)
```

새로고침 시 메모리가 초기화되므로, **앱 부팅 시 `/auth/refresh`를 호출하여 access token을 재발급받는** 구조가 된다.

"XSS가 발생하면 메모리도 동일하게 탈취된다"는 반론이 있으며 일부는 타당하다. 다만 아래와 같은 차이가 있다.

| 구분 | localStorage | 메모리 |
|---|---|---|
| 탈취 가능 시점 | 저장된 이후 상시 | 스크립트 실행 중에만 |
| 탭 종료 시 | 잔존 | 소멸 |
| 다른 탭의 XSS | 읽기 가능 | 읽기 불가 |
| 지속적 탈취 | 가능 | 곤란 |

공격 가능 구간이 "영구"에서 "실행 중"으로 축소된다.

## Next.js 환경에서의 추가 근거

이 판단은 보안 측면만의 문제가 아니다.

**localStorage는 서버에서 읽을 수 없다.** access token을 localStorage에 보관하면 다음 제약이 발생한다.

- `proxy.ts`에서 라우트 가드를 구성할 수 없다. 앞서 언급한 `/` 게이트의 스피너 깜빡임이 그대로 남는다.
- Server Component에서 데이터를 조회할 수 없다. 전 페이지가 계속 `'use client'`로 유지되어야 한다.

반면 refresh token을 쿠키에 보관하면 **`proxy.ts`가 서버에서 쿠키 존재 여부를 확인**할 수 있다. 비로그인 사용자를 서버에서 `/login`으로 리다이렉트하므로 깜빡임이 발생하지 않는다.

즉 현재 계획의 쿠키 부분은 Next 16의 `proxy.ts` 가드와 잘 맞물린다. access token만 메모리로 옮기면 된다.

## 세부 권장 사항

### 쿠키 속성

```
Set-Cookie: __Host-refresh=...; HttpOnly; Secure; SameSite=Lax; Path=/auth/refresh
```

- `SameSite` 지정 — 누락 시 CSRF에 노출된다. `Lax`로 충분하다.
- `Path`를 refresh 엔드포인트로 한정하면 다른 요청에 쿠키가 포함되지 않아 노출 면적이 감소한다.
- `__Host-` 접두사는 서브도메인에서 쿠키를 덮어쓰는 것을 방지한다.

### 토큰 수명

- access token : 짧게 (5~15분)
- refresh token : 길게 (7~30일)

access token 수명이 짧아야 탈취되더라도 피해가 제한된다.

### refresh 로테이션과 재사용 감지

refresh token 사용 시마다 새로 발급하고 이전 토큰은 폐기한다.

**이미 사용된 refresh token이 다시 들어오면 탈취로 간주하고 해당 사용자의 전체 세션을 무효화한다.**

Redis를 사용하는 실질적 이유가 이 지점이다. 이 처리를 하지 않으면 Redis 도입 근거가 약해진다.

Redis의 TTL은 refresh token 만료 시간과 일치시킨다. 그렇지 않으면 만료된 토큰 데이터가 계속 누적된다.

### CORS 구성

백엔드가 다른 오리진인 경우 쿠키 관련 설정이 필요하다.

- 프론트엔드 : `credentials: 'include'`
- 백엔드 : `Access-Control-Allow-Credentials: true`, `Access-Control-Allow-Origin`에 와일드카드 사용 불가 (정확한 오리진 지정)
- 크로스 사이트인 경우 `SameSite=None; Secure`가 강제되어 CSRF 방어가 약화된다.

가능하면 **동일 사이트로 배치**하는 것이 낫다. `app.choimory.dev` / `api.choimory.dev` 형태로 서브도메인을 분리하면 same-site로 취급되어 `SameSite=Lax`를 유지할 수 있다. 또는 Next.js에서 `/api/*`를 백엔드로 프록시하는 방법도 있다.

## useAuthSession 최종 형태

이 설계가 확정되면 `useAuthSession`은 다음과 같은 형태가 된다.

```tsx
// 메모리 보관 (모듈 스코프 또는 Context)
let accessToken: string | null = null;

export function useAuthSession() {
  // 부팅 시 refresh 쿠키로 access token을 복구한다.
  useEffect(() => {
    authApi.refresh()   // 쿠키는 브라우저가 자동 전송
      .then((res) => {
        accessToken = res.accessToken;
        setStatus('authenticated');
      })
      .catch(() => setStatus('unauthenticated'));
  }, []);
  // ...
}
```

현 시점에 작성할 `useAuthSession`이 localStorage 플래그를 다루는 단순한 형태여도, **교체 지점이 이 파일 하나로 한정된다는 점**에서 의미가 있다.

---

# 리팩터 계획 최종 정리

> 그럼 이제 세션 관리 계획도 말해줬으니까 리팩터 계획 다 정해진거지? 계획 얘기해봐

## 답변

계획은 확정되었다. 다만 **세션 설계 논의가 2단계 계획의 두 지점을 변경한다.**

두 항목 모두 "지금 구현하는 것"이 아니라 "나중에 갈아끼울 자리를 올바른 모양으로 만들어두는 것"에 해당한다.

## 세션 설계에 따른 계획 변경 사항

### apiClient 설계 제약

access token이 메모리에 있고 refresh token이 쿠키에 있으므로, `apiClient`에는 최종적으로 다음 세 가지가 포함된다.

- 메모리에 보관된 토큰을 `Authorization` 헤더에 주입
- `credentials: 'include'` 설정 (refresh 쿠키 전송)
- 401 응답 시 `/auth/refresh` 호출 후 원요청 재시도

현 시점에는 mock이므로 실제 구현은 하지 않는다. 다만 **토큰 공급자를 주입받는 형태로 구조를 잡아둔다.** 그렇지 않으면 이후 `apiClient`를 다시 작성해야 한다.

### useAuthSession의 login 시그니처

앞서 제시한 `useAuthSession` 예시는 `login`이 동기 함수였다.

```tsx
const login = useCallback(() => { ... }, []);                 // 기존 제안
const login = useCallback(async (request) => { ... }, []);    // 수정안
```

실제 로그인은 API 호출이므로 비동기다. 현 시점에 동기로 작성하면 이후 변경 시 **호출하는 Container까지 함께 수정**해야 한다.

mock이 즉시 resolve하더라도 시그니처는 미리 비동기로 맞춰둔다.

## 확정 사항 종합

| 항목 | 결정 |
|---|---|
| 라우트 | `/home` 유지, `/main` 삭제 (추후 랜딩 페이지로 재사용) |
| 헤더 타이틀 | `choimory-dev` |
| 인증 저장소 | localStorage 유지 + `useAuthSession` 격리 |
| 공통 UI 위치 | `shared/ui` (규칙상 `components/common`과 택일 가능) |
| API | mock 유지, 실제 연동 없음 |

## 최종 실행 계획

원칙은 **각 단계 종료 시점마다 빌드가 통과하는 상태를 유지**하는 것이다.

### 1단계 최종 - shared 토대

신규 파일만 추가하며 기존 파일은 수정하지 않는다.

```
shared/ui/ScreenLayout.tsx    h-screen 래퍼          대상 7곳
shared/ui/AppHeader.tsx       헤더                   대상 6곳 (컴포넌트 3 + 인라인 3)
shared/ui/BottomNav.tsx       하단 네비게이션        대상 2곳
shared/ui/Button.tsx          primary|social|ghost   대상 8곳
shared/ui/TextField.tsx       label + input          대상 10곳
shared/ui/Card.tsx
shared/utils/formatTime.ts    mm:ss 포맷
```

기존 화면을 건드리지 않으므로 이 시점에 동작이 깨지지 않는다.

### 2단계 최종 - 타입 및 API 레이어

역시 신규 파일만 추가한다.

```
features/auth/model/authTypes.ts    LoginRequest/Response, SignUpRequest, VerifyRequest 등
features/user/model/userTypes.ts    UserSummaryResponse → ViewModel + mapper
shared/api/apiClient.ts             토큰 공급자 주입 형태 (변경 사항 1 반영)
features/auth/api/authApi.ts        login, signUp, checkEmail, checkNickname, verifyCode, resendCode
features/user/api/userApi.ts        getUserSummary
```

현재 분산된 `TODO` 6곳이 이동할 위치를 먼저 확보한다. 사용처가 없으므로 기존 동작에 영향이 없다.

### 3단계 최종 - 화면 단위 이관

화면마다 `hook → component → container → page 축소 → 검증` 순환을 수행한다.

| 순서 | 화면 | 줄 수 | 사유 |
|---|---|---|---|
| 1 | `welcome` | 41 | 상태 없음. 4계층 패턴 검증용 |
| 2 | `home` + `main` 통합 | 161 | 중복 제거 효과 최대 |
| 3 | `login` | 140 | `useAuthSession` 첫 실사용 (async 시그니처 확정) |
| 4 | `signup` | 197 | 상태 7개 |
| 5 | `verify` | 148 | 로직 최다 |
| 6 | `/` 게이트 | 47 | `useAuthSession` 확정 이후 |

`welcome`을 먼저 진행하는 이유는 가장 단순한 화면으로 계층 구조의 적합성을 검증하기 위해서다. 부적절하면 41줄만 되돌리면 된다.

### 4단계 최종 - 잔재 제거

- `src/components/Header.tsx` 삭제
- `src/app/main/` 디렉토리 삭제
- `src/components/` 디렉토리 자체 제거

### 5단계 최종 - 문서 갱신

`README.md`에 구조와 아키텍처를 반영하고 `README2.md`를 정리한다. 1단계 버전업 작업에서 미뤄둔 항목이다.

## 최종 검증 방법

각 단계 종료 시, 그리고 3단계는 화면 하나를 완료할 때마다 수행한다.

```
npx tsc --noEmit  →  npx eslint .  →  npm run build  →  7개 라우트 200 확인
```

## 함께 적용할 사항

- Doc Comment 규칙 (`.agents/rules/front-end/comment.md`)
- `any` 사용 금지
- 하드코딩 제거 : `'isLoggedIn'` 문자열, 더미 사용자 객체, 반복 클래스 문자열

## 최종 제외 범위

| 항목 | 사유 |
|---|---|
| 실제 JWT / Redis 연동, `proxy.ts` 가드 | 별도 인증 작업 (백엔드 필요) |
| access token 메모리 전환 | 위와 동일 |
| 디자인 토큰, `globals.css` 정리, 다크모드 토글 | 3단계 디자인 작업 |

## 인증 구현의 작업 분리

인증 설계 내용은 본 문서에 기록되어 있으나 **실행은 2단계 구조 재편의 범위가 아니다.**

백엔드가 필요하고 프론트엔드 구조 재편과는 별개 작업이므로, 실제 착수 시에는 별도 디렉토리(예: `auth-session`)로 분리하는 것을 권장한다.

이번 2단계에서 수행하는 것은 **이후 교체할 지점을 정확한 형태로 만들어두는 것**까지다.
