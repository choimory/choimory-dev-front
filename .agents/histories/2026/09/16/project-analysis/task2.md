# 목차

- [개요](#개요)
- [1단계 - shared 토대 구성](#1단계---shared-토대-구성)
  - [답변](#답변)
  - [생성한 파일](#생성한-파일)
  - [검증 결과](#검증-결과)
  - [설계 판단 사항](#설계-판단-사항)
    - [AppHeader의 Props 구성](#appheader의-props-구성)
    - [Button의 유형과 크기](#button의-유형과-크기)
    - [중복확인 버튼을 TextField에 포함한 이유](#중복확인-버튼을-textfield에-포함한-이유)
    - [Card의 적용 범위](#card의-적용-범위)
    - [BottomNav의 Props 미정의](#bottomnav의-props-미정의)
    - [formatTime의 음수 보정](#formattime의-음수-보정)
  - [적용한 규칙](#적용한-규칙)
  - [다음 단계](#다음-단계)
- [2단계 - 타입 및 API 레이어 신설](#2단계---타입-및-api-레이어-신설)
  - [답변](#답변-1)
  - [apiClient를 생성하지 않은 이유](#apiclient를-생성하지-않은-이유)
  - [생성한 파일 목록](#생성한-파일-목록)
  - [검증 결과 확인](#검증-결과-확인)
  - [설계 판단 내용](#설계-판단-내용)
    - [타입 도출 기준](#타입-도출-기준)
    - [응답 타입을 최소한으로 정의한 이유](#응답-타입을-최소한으로-정의한-이유)
    - [userTypes만 ViewModel을 분리한 이유](#usertypes만-viewmodel을-분리한-이유)
    - [mock 데이터 구성](#mock-데이터-구성)
    - [TODO 주석의 집약](#todo-주석의-집약)
  - [진행 상황](#진행-상황)
  - [이후 단계](#이후-단계)
- [3단계 - 화면 단위 이관](#3단계---화면-단위-이관)
  - [답변](#답변-2)
  - [이관한 화면](#이관한-화면)
  - [화면별 설계 판단](#화면별-설계-판단)
    - [welcome - 4계층 패턴 검증](#welcome---4계층-패턴-검증)
    - [useAuthSession을 useSyncExternalStore로 변경](#useauthsession을-usesyncexternalstore로-변경)
    - [home 통합과 사용자 정보 조회 전환](#home-통합과-사용자-정보-조회-전환)
    - [login의 내부 링크 처리](#login의-내부-링크-처리)
    - [signup의 중복확인 실패 분기 추가](#signup의-중복확인-실패-분기-추가)
    - [verify의 기존 로직 이관](#verify의-기존-로직-이관)
    - [루트 게이트의 로딩 상태 제거](#루트-게이트의-로딩-상태-제거)
  - [진행 중 발생한 문제](#진행-중-발생한-문제)
- [4단계 - 잔재 제거](#4단계---잔재-제거)
  - [답변](#답변-3)
  - [삭제 대상](#삭제-대상)
  - [최종 구조](#최종-구조)
  - [최종 검증 결과](#최종-검증-결과)
  - [남은 단계](#남은-단계)

---

# 개요

- `plan3.md`의 "리팩터 계획 최종 정리"에서 확정한 **2단계 구조 재편**의 실행 기록이다.
- 1단계 버전 정비는 `task1.md`로 완료되었다. (Next 15.3.4 → 16.3.5)
- 전체 5단계로 구성되며 본 문서에는 진행한 단계를 순차적으로 기록한다.
  - 1단계 : shared 토대 구성
  - 2단계 : 타입 및 API 레이어 신설
  - 3단계 : 화면 단위 이관
  - 4단계 : 잔재 제거
  - 5단계 : 문서 갱신
- 각 단계 종료 시점마다 빌드가 통과하는 상태를 유지하는 것이 원칙이다.
- 커밋과 푸시는 `.agents/rules/git.md` 규칙에 따라 진행하지 않는다.

---

# 1단계 - shared 토대 구성

> 구현 시작

## 답변

공통 UI 컴포넌트 6개와 유틸 함수 1개를 신규 생성했다.

계획대로 **기존 파일은 한 줄도 수정하지 않았다.** 추가만 수행했으므로 기존 화면의 동작에 영향이 없다.

## 생성한 파일

총 7개 파일, 305줄이다.

| 파일 | 줄 수 | 역할 | 기존 중복 대상 |
|---|---|---|---|
| `src/shared/ui/ScreenLayout.tsx` | 19 | 화면 전체 세로 배치 래퍼 | 7곳 |
| `src/shared/ui/AppHeader.tsx` | 36 | 상단 헤더 | 6곳 (컴포넌트 3 + 인라인 3) |
| `src/shared/ui/BottomNav.tsx` | 51 | 하단 네비게이션 | 2곳 |
| `src/shared/ui/Button.tsx` | 75 | 공통 버튼 | 8곳 |
| `src/shared/ui/Card.tsx` | 22 | 중립 섹션 카드 | - |
| `src/shared/ui/TextField.tsx` | 87 | 라벨 + 입력 필드 | 10곳 |
| `src/shared/utils/formatTime.ts` | 15 | mm:ss 포맷 | 1곳 |

## 검증 결과

| 검증 항목 | 결과 |
|---|---|
| `npx tsc --noEmit` | 통과 (exit 0) |
| `npx eslint .` | 통과 (exit 0) |
| `npm run build` | 통과, 8개 라우트 생성 |
| `npm run dev` + 7개 라우트 | 전부 HTTP 200 |
| 개발 서버 로그 | 경고 및 오류 없음 |

## 설계 판단 사항

### AppHeader의 Props 구성

기존 헤더는 두 가지 형태로 존재했다.

- `login`, `home`, `main` : 좌측 서비스명 + 우측 액션, `justify-between`, `/home` 링크 포함
- `signup`, `signup/verify`, `signup/welcome` : 중앙 정렬, 링크 없음

두 형태를 모두 수용하도록 Props를 구성했다.

```tsx
type AppHeaderProps = {
  actions?: ReactNode;  // 헤더 우측에 배치할 액션 영역
  isCentered?: boolean; // 서비스명을 중앙 정렬할지 여부
  isLinked?: boolean;   // 서비스명을 홈 링크로 렌더링할지 여부
};
```

`isCentered`와 `isLinked`를 하나의 Prop으로 묶는 방안도 검토했으나, "중앙 정렬이면 링크가 없다"는 암묵적 결합이 발생하므로 분리했다. 인증 화면에서는 `isCentered isLinked={false}`로 명시한다.

서비스명은 `SERVICE_NAME` 상수로 분리하여 `choimory-dev`로 통일했다. `plan3.md`에서 확정한 결정 사항이 이 지점에 반영된다.

### Button의 유형과 크기

기존 8곳의 버튼을 확인한 결과 세 가지 유형으로 분류되었다.

- `primary` : 파란색 주요 동작 버튼
- `social` : SNS 로그인 버튼
- `ghost` : 로그아웃 등 텍스트 버튼

크기는 `md`(`px-4 py-3`)와 `sm`(`px-4 py-2 text-sm`) 두 가지다.

`verify` 화면의 비활성 상태 스타일(`bg-gray-300 text-gray-500 cursor-not-allowed`)은 `isDisabled` Prop으로 흡수했다.

### 중복확인 버튼을 TextField에 포함한 이유

`signup` 화면의 중복확인 버튼은 `rounded-r-lg`와 `border-t border-b border-r`로 구성되어 **입력 필드와 모서리가 맞닿는 구조**다.

이를 독립된 `Button`으로 분리하면 인접한 input과 border radius를 맞추는 책임이 호출부로 넘어간다. 따라서 `TextField`의 `actionLabel` / `onAction` Props로 컴포넌트 내부에서 처리하도록 했다.

### Card의 적용 범위

`Card`는 회색 섹션 카드 용도로만 정의했다.

`home` 화면의 그라데이션 사용자 정보 카드와 Feature Highlight 영역은 형태가 특수하여 공통 컴포넌트로 추출하지 않았다. 3단계에서 `UserSummaryCard`, `FeatureHighlight` 도메인 컴포넌트로 작성하는 것이 적절하다.

### BottomNav의 Props 미정의

하단 네비게이션의 5개 버튼은 현재 모두 동작하지 않는다.

존재하지 않는 동작을 예상하여 Props를 미리 정의하지 않고, 기존 마크업을 그대로 옮기면서 Doc Comment에 "각 항목의 이동 처리는 아직 연결되어 있지 않습니다"를 명시했다.

### formatTime의 음수 보정

기존 `verify` 화면의 구현은 음수가 전달되면 `-1:-1` 형태의 값을 반환한다.

`Math.max(0, Math.floor(seconds))`로 0 이상의 정수로 보정하도록 수정했다.

## 적용한 규칙

`.agents/rules/front-end/comment.md` 기준을 신규 파일 전체에 적용했다.

- 모든 컴포넌트에 용도를 설명하는 Doc Comment 작성
- 모든 타입에 Doc Comment 작성 및 각 필드에 측면 주석 작성
- 모든 함수에 용도, 파라미터, 리턴 값을 설명하는 Doc Comment 작성
- 로직 흐름 단위로 한글 주석 작성

`.agents/rules/front-end/code-convention-react.md` 기준도 함께 적용했다.

- 컴포넌트 파일명 PascalCase
- 하나의 파일에 하나의 주요 컴포넌트
- boolean Props에 `is` 접두사 사용
- Props 타입을 해당 컴포넌트 파일 내부에 작성
- `any` 미사용

## 다음 단계

2단계는 타입 및 API 레이어 신설이다. 역시 신규 파일만 추가하므로 기존 동작에 영향이 없다.

```
features/auth/model/authTypes.ts    LoginRequest/Response, SignUpRequest, VerifyRequest 등
features/user/model/userTypes.ts    UserSummaryResponse → ViewModel + mapper
shared/api/apiClient.ts             토큰 공급자 주입 형태
features/auth/api/authApi.ts        login, signUp, checkEmail, checkNickname, verifyCode, resendCode
features/user/api/userApi.ts        getUserSummary
```

---

# 2단계 - 타입 및 API 레이어 신설

> 어차피 백엔드 구현된거 연동할때 자세히 짚을거니까 그런건 지금 깊게 생각할 필요 없어

## 답변

도메인 타입과 mock API 함수를 신규 생성했다.

당초 계획에 포함되어 있던 `shared/api/apiClient.ts`는 위 지시에 따라 생성하지 않았다.

1단계와 마찬가지로 **기존 파일은 수정하지 않았다.**

## apiClient를 생성하지 않은 이유

`plan3.md`의 계획에는 `apiClient`를 토큰 공급자 주입 형태로 미리 작성하는 내용이 포함되어 있었다.

그러나 백엔드 연동 전에는 이를 호출하는 곳이 없어 실행되지 않는 코드가 된다. 한 번도 실행되지 않은 코드는 실제 사용 시점에 오류가 발견되기 쉽다.

실제 연동 시점에 상세히 검토하기로 하였으므로, 현 단계에서는 API 함수의 시그니처만 확정하고 HTTP 클라이언트 작성은 연동 작업으로 이월한다.

## 생성한 파일 목록

총 4개 파일, 209줄이다.

| 파일 | 줄 수 | 역할 |
|---|---|---|
| `src/features/auth/model/authTypes.ts` | 40 | 인증 도메인 요청/응답 타입 |
| `src/features/auth/api/authApi.ts` | 84 | 인증 API (mock) |
| `src/features/user/model/userTypes.ts` | 55 | 사용자 응답 타입, ViewModel, mapper |
| `src/features/user/api/userApi.ts` | 30 | 사용자 API (mock) |

## 검증 결과 확인

| 검증 항목 | 결과 |
|---|---|
| `npx tsc --noEmit` | 통과 (exit 0) |
| `npx eslint .` | 통과 (exit 0) |
| `npm run build` | 통과, 8개 라우트 생성 |

## 설계 판단 내용

### 타입 도출 기준

타입은 임의로 설계하지 않고 현재 화면이 실제로 사용하는 값에서 도출했다.

```ts
export type LoginRequest = { id: string; password: string };
export type SignUpRequest = { email: string; nickname: string; password: string };
export type DuplicateCheckResponse = { isAvailable: boolean };
export type VerifyCodeRequest = { email: string; code: string };
export type ResendCodeRequest = { email: string };
```

`confirmPassword`는 클라이언트 검증에만 사용되므로 `SignUpRequest`에서 제외했으며, 해당 사유를 타입 주석에 명시했다.

### 응답 타입을 최소한으로 정의한 이유

`login`, `signUp`, `verifyCode`, `resendCode`는 반환 타입을 `Promise<void>`로 지정했다.

현재 화면이 이들 API의 응답을 소비하지 않으므로, 확정되지 않은 응답 형태를 미리 정의하는 것보다 연동 시점에 결정하는 것이 적절하다.

중복 확인 API만 `isAvailable` 값이 실제로 필요하므로 `DuplicateCheckResponse`를 정의했다.

### userTypes만 ViewModel을 분리한 이유

사용자 요약 정보는 실제로 화면에 렌더링되며 mapper가 수행할 변환 작업이 존재한다.

```
joinedAt: '2024-01-15T...'  →  joinDate: '2024-01-15'
nickname: 'choimory'        →  initial: 'C'
```

기존 `home` 화면에 인라인으로 작성되어 있던 `nickname.charAt(0).toUpperCase()` 연산이 mapper로 이동했다.

`.agents/rules/front-end/code-convention-react.md`가 요구하는 "응답 객체를 ViewModel로 변환하는 함수는 별도 mapper 함수로 작성한다" 규칙에 해당한다.

### mock 데이터 구성

`userApi`의 mock 응답은 기존 `home` 화면에 하드코딩되어 있던 더미 값을 그대로 사용한다.

```
글 15, 댓글 42, 팔로잉 128, 팔로워 256, 가입일 2024-01-15, 최근 접속일 2024-12-19
```

3단계에서 화면을 이관하더라도 표시되는 내용이 변경되지 않도록 하기 위함이다.

### TODO 주석의 집약

교체가 필요한 지점을 `TODO` 주석으로 명시했다.

```ts
login: async (request: LoginRequest): Promise<void> => {
  // TODO: 실제 로그인 API 호출로 교체한다.
  console.log('[mock] login', request.id);
},
```

기존에 화면 6곳에 분산되어 있던 `TODO` 주석이 API 파일 2개로 집약되었다. 연동 작업 시 해당 파일만 확인하면 된다.

## 진행 상황

```
완료  1/5  shared 토대        (7개 파일, 305줄)
완료  2/5  타입·API 레이어    (4개 파일, 209줄)
대기  3/5  화면 단위 이관
대기  4/5  잔재 제거
대기  5/5  문서 갱신
```

2단계까지는 신규 파일 추가만 수행하여 기존 동작에 영향이 없었다.

## 이후 단계

3단계부터는 기존 화면을 실제로 수정한다.

`welcome`(41줄, 상태 없음)부터 시작하여 page / container / component / hook 4계층 패턴의 적합성을 확인한 뒤 나머지 화면에 적용한다.

| 순서 | 화면 | 줄 수 |
|---|---|---|
| 1 | `welcome` | 41 |
| 2 | `home` + `main` 통합 | 161 |
| 3 | `login` | 140 |
| 4 | `signup` | 197 |
| 5 | `verify` | 148 |
| 6 | `/` 게이트 | 47 |

---

# 3단계 - 화면 단위 이관

> 오케이 3단계 계속 진행하자

## 답변

6개 화면을 모두 `page` / `container` / `component` / `hook` 4계층으로 이관했다.

이 단계부터는 신규 파일 추가가 아니라 **기존 화면을 실제로 수정**했다. 화면 하나를 완료할 때마다 검증을 수행했다.

`page.tsx`는 전부 10~18줄로 축소되었다. 규칙 문서의 "page는 Container를 호출하고 얇게 유지한다"가 실제로 적용된 결과다.

## 이관한 화면

| 순서 | 화면 | 기존 | 이관 결과 |
|---|---|---|---|
| 1 | `welcome` | 41줄 | page 18 + container 27 + component 42 |
| 2 | `home` + `main` | 161줄 × 2 | page 10 + container 101 + 컴포넌트 3개 + hook 45 |
| 3 | `login` | 140줄 | page 10 + container 33 + form 88 + SNS 62 + hook 47 |
| 4 | `signup` | 197줄 | page 10 + container 50 + form 118 + hook 137 |
| 5 | `verify` | 148줄 | page 18 + container 38 + form 96 + hook 92 |
| 6 | `/` 게이트 | 47줄 | page 12 + container 42 |

## 화면별 설계 판단

### welcome - 4계층 패턴 검증

가장 단순한 화면으로 계층 구조의 적합성을 먼저 확인했다.

확인된 사항은 **상태가 없는 화면에는 hook을 생성하지 않는다**는 점이다. 규칙 문서도 "복잡한 상태와 이벤트 로직은 custom hook으로 분리한다"이므로, 비어 있는 hook을 만들 이유가 없다.

렌더링 결과를 기존과 대조한 결과 헤더 마크업은 클래스까지 동일했다. 버튼은 클래스 순서만 다르고 구성이 같다.

기존 `searchParams.get('nickname')`은 `null`이 화면에 표시될 수 있었으므로 Container에서 `?? ''`로 처리했다.

### useAuthSession을 useSyncExternalStore로 변경

`plan3.md`에 기록한 `useState` + `useEffect` 방식으로 작성했으나 린트 규칙에 차단되었다.

```
react-hooks/set-state-in-effect
Calling setState synchronously within an effect can trigger cascading renders
```

린트 메시지가 "외부 시스템을 구독하고 콜백에서 setState하라"는 해법을 제시하고 있으며, `localStorage`가 정확히 그 외부 저장소에 해당하므로 **`useSyncExternalStore`** 방식으로 변경했다.

저장소 접근은 `features/auth/model/authSession.ts`로 분리했다. 계획 대비 변경되었으나 결과적으로 구조가 개선되었다.

- 저장소 접근이 단일 파일로 격리됨 (원래 목표)
- `storage` 이벤트를 구독하므로 **다른 탭에서 로그아웃하면 현재 탭도 자동 반영**된다. 기존 코드에는 없던 동작이다.
- 서버 렌더링 시 `'loading'`을 반환하여 루트 게이트가 성급하게 판단하지 않는다.

### home 통합과 사용자 정보 조회 전환

`/home`과 `/main`의 161줄 중복을 하나로 통합하고 `/main`을 삭제했다.

사용자 정보를 하드코딩에서 `userApi` 조회로 전환하면서 서버 렌더링 HTML에 사용자 카드가 포함되지 않게 되었다. 데이터가 effect 이후에 채워지므로 예상된 변화다.

이 과정에서 `useUserSummary`의 `isLoading`을 반환만 하고 사용하지 않아, 조회 중 화면이 밀리는 문제가 있었다. 조회 중 자리를 확보하도록 수정했다.

mock은 즉시 응답하므로 실제로는 한 프레임이지만, 실제 API 연동 시 의미가 생긴다.

### login의 내부 링크 처리

기존 `<a href="/signup">`를 `next/link`의 `Link`로 변경했다.

Next.js의 `@next/next/no-html-link-for-pages` 규칙 대상이며, 전체 페이지 리로드 대신 클라이언트 네비게이션으로 동작한다.

비밀번호 찾기 링크는 `href="#"`으로 실제 페이지가 없으므로 일반 앵커를 유지했다.

### signup의 중복확인 실패 분기 추가

기존 구현은 입력값만 존재하면 무조건 `alert('사용 가능합니다')`를 표시했다.

`authApi.checkEmail` / `checkNickname`의 `isAvailable` 값을 확인하여 사용 불가인 경우 오류 메시지를 표시하도록 변경했다.

mock이 항상 `true`를 반환하므로 현재 동작은 동일하나, 백엔드가 `false`를 반환하면 즉시 동작한다.

### verify의 기존 로직 이관

1단계 버전업 작업에서 수정했던 타이머 로직을 그대로 hook으로 이관했다.

`VERIFY_TIMEOUT_SECONDS`, `EXPIRED_MESSAGE` 상수와 잔여 시간에서 파생시키는 방식이 유지되었다.

`formatTime`은 `shared/utils`의 공통 함수를 사용하도록 교체했다.

### 루트 게이트의 로딩 상태 제거

`useAuthSession`이 `'loading'` 상태를 반환하므로 페이지가 별도로 `isLoading` 상태를 관리할 필요가 없어졌다.

"실제로는 렌더링되지 않지만 TypeScript를 위해 필요"라는 주석이 달려 있던 `return null` 구문도 함께 제거되었다.

## 진행 중 발생한 문제

**개발 서버 중복 실행 차단**

작업 중 개발 서버를 기동하려 했으나 실패했다.

```
⨯ Another next dev server is already running.
- PID: 31109  (port 3000)
```

Next 16의 중복 실행 방지 기능이다. 이미 실행 중인 서버가 있었으므로 종료하지 않고 해당 서버로 검증을 진행했다.

**스테일 타입 파일로 인한 tsc 실패**

`/main` 삭제 직후 `tsc`가 실패했다.

```
.next/types/validator.ts(60,39): error TS2307:
Cannot find module '../../src/app/main/page.js'
```

Next.js가 생성한 라우트 타입 파일이 삭제된 페이지를 참조하고 있었기 때문이다. 빌드를 수행하면 타입이 재생성되며, 이후 `tsc`는 정상 통과했다.

**Button의 중복 클래스 정리**

`welcome` 이관 중 `Button`을 실제로 사용하면서, `rounded-lg`가 템플릿과 variant 양쪽에 지정되어 있고 그로 인해 배경이 없는 `ghost` 유형에도 모서리 스타일이 적용되는 문제를 발견했다.

템플릿 쪽을 제거하고 variant에서만 관리하도록 수정했다. 1단계에서 만든 공통 컴포넌트를 3단계에서 실사용하며 다듬게 될 것이라고 예상했던 사례에 해당한다.

---

# 4단계 - 잔재 제거

> 계속 진행해줘

## 답변

이관이 완료되어 더 이상 참조되지 않는 파일과 디렉토리를 제거했다.

## 삭제 대상

| 대상 | 확인 내용 |
|---|---|
| `src/app/main/` | `/main` 라우트가 404로 응답하는 것을 확인 |
| `src/components/Header.tsx` | `shared/ui/AppHeader`로 흡수 완료. 참조 0건 확인 후 제거 |
| `src/components/` | 하위 파일이 모두 제거되어 디렉토리 자체를 제거 |

`/main`은 라우트 이름이 비게 되므로 이후 랜딩 페이지 용도로 재사용할 수 있다.

## 최종 구조

```
src/
├── app/                         라우팅 진입점 (10~18줄)
│   ├── page.tsx                 → RootGateContainer
│   ├── login/ signup/ signup/verify/ signup/welcome/ home/
│   └── layout.tsx
├── features/
│   ├── auth/  api model hooks container components   (16 파일)
│   └── user/  api model hooks container components   ( 6 파일)
└── shared/    ui utils                               ( 7 파일)
```

## 최종 검증 결과

| 검증 항목 | 결과 |
|---|---|
| `npx tsc --noEmit` | 통과 (exit 0) |
| `npx eslint .` | 통과 (exit 0) |
| `npm run build` | 통과, 7개 라우트 생성 |
| 6개 라우트 응답 | 전부 200 |
| `/main` | 404 (의도된 결과) |
| 화면별 핵심 문구 렌더링 | 전부 정상 |

## 남은 단계

```
완료  1/5  shared 토대
완료  2/5  타입·API 레이어
완료  3/5  화면 단위 이관
완료  4/5  잔재 제거
대기  5/5  문서 갱신
```

5단계는 `README.md`에 프로젝트 구조와 아키텍처를 반영하고 `README2.md`를 정리하는 작업이다. `AGENTS.md`가 요구하는 항목이며 1단계 버전업 작업부터 이월되어 왔다.
