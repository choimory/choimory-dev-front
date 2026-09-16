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
