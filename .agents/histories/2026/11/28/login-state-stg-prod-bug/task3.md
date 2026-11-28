# 목차

- [개요](#개요)
- [구현 결과: 프록시 서버 검증 (2단계)](#구현-결과-프록시-서버-검증-2단계)
  - [답변](#답변)
  - [작업 분담과 진행](#작업-분담과-진행)
  - [변경 내용](#변경-내용)
  - [계획 대비 달라진 점](#계획-대비-달라진-점)
  - [구현 중 발생한 문제](#구현-중-발생한-문제)
  - [검증 결과](#검증-결과)
  - [확인하지 못한 것](#확인하지-못한-것)
  - [남은 것](#남은-것)

---

# 개요

- plan3에서 확정한 2단계(서버 프록시 검증)를 구현한 작업 기록이다. 계획은 plan3의 "결정 확정"과 "구현 계획"을 따른다.
- 1단계(클라이언트 가드)는 task2, 목업 제거와 실제 인증 연동은 task1에 기록했다.
- `member-api`의 토큰 검증 API(`GET /v1/member/token/verify`)와 내정보 조회 API(`GET /v1/member/me`)는 별도 저장소에서 구현되어 local에서 확인을 마친 상태다. 이 작업은 그 API를 프론트 서버(`src/proxy.ts`)에서 호출한다.
- 이 문서는 작업이 끝난 뒤에 작성했다.

---

# 구현 결과: 프록시 서버 검증 (2단계)

> task는 작업후에 쓰는거야. 하위에이전트 gpt sol 6.2 필요한만큼 시켜서 작업 병렬진행해줘

## 답변

보호 경로 8개를 서버 프록시가 토큰으로 검증하고, 비로그인이면 `/login?next=<원래 경로>`로 보내며, 로그인하면 원래 페이지로 돌아오도록 구현했다. 영역을 나눠 `codex/gpt-6.2-sol` 에이전트 3개를 병렬로 투입했다. 미결정으로 남았던 3개 항목은 plan3의 추천안으로 진행했다.

## 작업 분담과 진행

공통 계약은 메인이 먼저 만들었고, 이를 쓰는 영역을 파일이 겹치지 않게 나눠 병렬로 진행했다.

| 담당 | 범위 | 결과 |
|---|---|---|
| 메인 | 공통 계약(`cookieNames.ts`, `redirect.ts`, `LoginLink.tsx`)과 테스트, 로그인 화면의 `next`, 로그인 링크 교체, `apiClient`, 최종 검증 | 계약 테스트 24건 통과 |
| 에이전트 A (BFF 쿠키) | `sessionCookies.ts`, `authBff.ts`와 테스트 | 보고 기준 4개 파일 48건 통과 |
| 에이전트 B (프록시) | `src/proxy.ts`와 `tests/unit/proxy.test.ts` | 보고 기준 31건 통과, `tsc` 통과 |
| 에이전트 C (가드 확대) | `RequireAuth`의 `next`, 보호 Container 4곳과 테스트 | 보고 기준 16개 파일 76건 통과 |

- 에이전트 생성은 3개 모두 성공했다. (task1에서는 한 번 권한 분류기에 거부되어 메인이 직접 처리했었다.)
- 에이전트에게는 자기 범위의 테스트만 실행하게 했고, 전체 `tsc`, `eslint`, 테스트는 메인이 마지막에 실행했다.
- 에이전트의 보고를 그대로 믿지 않고 `sessionCookies.ts`, `authBff.ts` diff, `RequireAuth`와 Container 4곳 diff, `src/proxy.ts` 전체를 직접 읽어 계획과 일치하는지 확인했다.

## 변경 내용

### 신규

- `src/shared/auth/cookieNames.ts`: `ACCESS_COOKIE_NAME`(`access_token`), `SESSION_HINT_COOKIE_NAME`(`session_hint`). `next/headers`를 가져오지 않는 순수 모듈이라 프록시와 BFF가 같이 쓴다.
- `src/shared/auth/redirect.ts`
  - `sanitizeNextPath`: `/`로 시작하는 같은 사이트 내부 경로만 허용한다. 절대 주소, `//`, `/\`, 인코딩으로 우회한 값, 제어문자, 512자 초과, 파싱했을 때 다른 origin이 되는 값, `/login`과 `/signup`(루프 방지)은 `/`로 바꾼다. 허용한 경로는 정규화해서 돌려준다.
  - `buildLoginHref`: 홈, 로그인, 회원가입, 위험한 경로이면 `/login`, 그 외에는 `/login?next=<인코딩된 경로>`를 돌려준다.
- `src/shared/auth/sessionCookies.ts`: `setAccessCookie`, `setSessionHintCookie`, `clearSessionCookies`. httpOnly, `sameSite=lax`, 경로 `/`, prod에서 `secure`.
- `src/proxy.ts`: 아래 "프록시 동작" 참고.
- `src/features/auth/components/LoginLink.tsx`: `usePathname`으로 현재 경로를 읽어 `next`가 붙은 로그인 링크를 만든다.
- 테스트: `redirect.test.ts`, `sessionCookies.test.ts`, `proxy.test.ts`(Node 환경), `LoginLink.test.tsx`

### 쿠키

| 쿠키 | 값 | 수명 | 경로 |
|---|---|---|---|
| `refresh_token` (기존, 변경 없음) | Refresh Token | `refreshExpiresIn` (약 14일) | `/api/auth` |
| `access_token` (신규) | Access Token | `accessExpiresIn` (약 30분) | `/` |
| `session_hint` (신규) | `1` (토큰 아님) | `refreshExpiresIn` (약 14일) | `/` |

- 로그인과 재발급 성공 때 세 쿠키를 함께 설정하고, 재발급이 400/401로 실패할 때와 로그아웃 때 함께 지운다. 재발급 일시 오류에서는 유지한다.
- `access_token` 쿠키는 프록시의 페이지 접근 판단에만 쓴다. API 인증은 이전처럼 메모리의 토큰을 `Authorization` 헤더로 보낸다.

### 프록시 동작 (`src/proxy.ts`)

- Next.js 16 Proxy(Node.js 런타임)에서 보호 경로 8개에만 적용된다. 각 경로에는 프리페치 요청(`next-router-prefetch`, `purpose: prefetch` 헤더)을 건너뛰는 `missing` 조건이 있다.
  - `/me`, `/blog/me`, `/blog/following`, `/feed/me`, `/feed/me/targets/:targetId`, `/feed/observations`, `/feed/observations/:observationId`, `/feed/activities/:activityId`
- `access_token` 쿠키가 있으면 `GET {MEMBER_API_BASE_URL}/v1/member/token/verify`를 `Authorization: Bearer`로 호출한다. 타임아웃 2초, 캐시 없음, 리다이렉트 응답은 오류로 처리한다.
  - 200: 통과
  - 401 `TOKEN_EXPIRED`: `session_hint`가 있으면 통과, 없으면 로그인으로 이동
  - 그 외 401(`INVALID_TOKEN`, `UNAUTHORIZED`): 로그인으로 이동하고 `access_token`만 삭제
  - 타임아웃, 네트워크 오류, 5xx, 응답 파싱 실패, 환경변수 없음: 로그인으로 이동(fail-closed), 쿠키는 건드리지 않음
- `access_token`이 없으면 `session_hint`가 있을 때 통과(클라이언트가 자동 갱신)하고, 없으면 로그인으로 이동한다.
- 로그인으로 이동할 때는 `request.nextUrl.pathname`만 `next`로 넣는다. 쿼리 문자열은 넣지 않는다.

### 수정

- `src/features/auth/server/authBff.ts`: 로그인과 재발급에서 `access_token`, `session_hint` 설정, 재발급 400/401과 로그아웃에서 삭제. 함수 JSDoc 갱신.
- `src/features/auth/components/RequireAuth.tsx`: 비로그인으로 확정되면 `router.replace(buildLoginHref(pathname ?? '/'))`.
- 보호 Container 확대 (6-나)
  - `BlogMenuContainer`: `following`일 때만 가드. `popular`는 공개.
  - `FeedMenuContainer`: `me`와 `observations`일 때 가드. `popular`는 공개. (task2에서는 `observations`가 공개였다.)
  - `FeedObservationDetailContainer`, `FeedActivityDetailContainer`: 항상 가드.
- 로그인 화면
  - `src/app/login/page.tsx`: `searchParams`를 서버에서 읽어 `sanitizeNextPath`로 검증한 `redirectTo`를 넘긴다.
  - `LoginContainer`: `redirectTo`(기본 `/`) prop, 로그인 성공 후 `router.push(redirectTo)`.
- 로그인 링크를 `LoginLink`(현재 경로를 `next`로 붙임)로 교체: `TopBarActions`, `GuestLandingSection`, `BlogGuestSection`(`로그인` 링크와 `참여하기` 링크), `FeedView`. `BlogGuestSection`은 훅을 쓰므로 `'use client'`를 추가했다.
- `src/shared/api/apiClient.ts`: 토큰 갱신에 실패하면 `buildLoginHref(window.location.pathname)`으로 이동. 더 이상 필요 없어진 `eslint-disable` 주석 제거.
- `src/shared/auth/redirect.ts`: 불필요한 `eslint-disable` 주석 제거.

### 테스트 수정

- 신규 `redirect`, `sessionCookies`, `proxy`, `LoginLink` 테스트
- `authBff.test.ts`: 세 쿠키 설정과 삭제, 일시 오류에서 유지
- `RequireAuth.test.tsx`: `next` 포함 이동
- `LoginContainer.test.tsx`: `redirectTo`로 이동
- Container 테스트 7개: `BlogMenuContainer`, `FeedMenuContainer`, `FeedObservationDetailContainer`, `FeedActivityDetailContainer`는 새 보호 기준(비로그인 이동, 로그인 표시, 복원 중 대기, 공개 메뉴 유지)으로, `MeContainer`, `BlogMeSettingsContainer`, `FeedTargetSettingsContainer`는 `next/navigation` mock에 `usePathname` 추가
- `TopBarActions.test.tsx`

## 계획 대비 달라진 점

plan3의 "확정 결정 대비 계획 변경점"에 적은 그대로 진행했다.

1. 보호 경로 목록은 상수 한 곳이 아니라 `src/proxy.ts`의 `matcher` 리터럴이다. 문서가 matcher 값은 빌드 때 분석되는 상수여야 하고 변수는 무시된다고 하기 때문이다. 경로를 공개로 되돌릴 때는 matcher에서 해당 항목을 빼고 해당 Container의 `RequireAuth`를 제거한다. (`proxy.ts` 맨 위에 같은 설명이 주석으로 있다.)
2. 로그인 화면의 `next`는 Suspense 대신 `page.tsx`에서 서버가 읽고 검증한다.
3. 프리페치 요청은 프록시에서 제외했다. 프리페치된 보호 화면으로 클라이언트 이동할 때는 프록시를 거치지 않을 수 있고, 이 경우는 클라이언트 가드가 막는다.
4. 결정을 받지 못한 3개 항목(프리페치 제외, 로그인 화면 서버 검증, 회원가입 `next` 유지)은 추천안대로 진행했다. 회원가입 `next` 유지는 하지 않았다.
5. 설치된 Next.js 16.3.5는 문서의 `unstable_doesProxyMatch`를 `unstable_doesMiddlewareMatch`라는 이름으로 제공해서 프록시 테스트에서 그 이름을 썼다. (에이전트 B 보고)

## 구현 중 발생한 문제

- `LoginContainer`를 수정하려고 파일을 덮어쓰다가 아래쪽 `return` JSX가 빠져 `tsc`가 `'}' expected`를 냈다. git 원본(`git show HEAD:...`)의 해당 부분을 이어 붙여 복구했고 `tsc`와 테스트가 통과했다.
- 전체 `eslint`에서 필요 없는 `eslint-disable` 주석 경고 2건이 나왔다. (`redirect.ts`의 `no-control-regex`, `apiClient.ts`의 `no-location-assign-relative-destination`) 둘 다 주석을 제거해서 경고가 0건이 됐다.
- 브라우저 확인 중 paseo 탭이 닫혀 있어서 새 탭을 열어 진행했다.

## 검증 결과

- `npx tsc --noEmit`: 에러 없음
- `npx eslint src tests vitest.setup.ts`: 에러 0건, 경고 0건
- `npx vitest run`: 102개 파일, 668건 통과
- `curl` (local Next 서버, 테스트 계정, 토큰 값은 가려서 확인)

| 시나리오 | 결과 |
|---|---|
| 쿠키 없이 보호 경로 8개 | 모두 307, `/login?next=<인코딩된 경로>` |
| 쿠키 없이 공개 경로 10곳 (`/`, `/notice`, `/services`, `/blog`, `/blog/popular`, `/feed`, `/feed/popular`, `/feed/targets/target-keyboard`, `/login`, `/signup`) | 모두 200 |
| 유효한 `access_token`으로 보호 경로 5곳 | 모두 200 |
| `session_hint`만 있고 `access_token` 없음 | 200 (통과) |
| 위조한 `access_token` + `session_hint` | 307, `access_token` 삭제 `Set-Cookie`, `session_hint`는 삭제하지 않음 |
| 로그아웃된(블랙리스트) `access_token` | 307, `access_token` 삭제 |
| `next-router-prefetch` 헤더 요청 | 200 (프록시 건너뜀) |

- BFF 쿠키 (`curl` 쿠키 jar)

| 시나리오 | 결과 |
|---|---|
| 로그인 | `refresh_token`(`Path=/api/auth`), `access_token`(`Path=/`, `Max-Age=1799`), `session_hint=1`(`Path=/`, `Max-Age≈1209599`) 설정, 모두 HttpOnly, `SameSite=lax` |
| 재발급 | 세 쿠키 갱신 |
| 로그아웃 | 세 쿠키 `Max-Age=0`으로 삭제, 쿠키 jar에 남은 쿠키 0개 |
| 쿠키 없이 재발급 | 401 |

- 브라우저 (paseo, `localhost:3000`, 테스트 계정)

| 시나리오 | 결과 |
|---|---|
| 비로그인으로 `/feed/me/targets/target-keyboard` 진입 | `/login?next=%2Ffeed%2Fme%2Ftargets%2Ftarget-keyboard`로 이동 |
| 그 화면에서 로그인 | 원래 페이지로 돌아오고 상단바 `로그아웃` |
| 보호 페이지에서 로그아웃 | 최종 `/`, 홈의 `로그인` 링크는 `/login`(next 없음) |
| 공개 페이지 `/blog/popular`의 `로그인` 링크 | `/login?next=%2Fblog%2Fpopular`, 로그인하면 `/blog/popular`로 복귀 |
| `/login?next=https%3A%2F%2Fevil.com%2Fphish`로 로그인 | 같은 사이트의 `/`로 이동 (외부로 나가지 않음) |

## 확인하지 못한 것

- `TOKEN_EXPIRED` 실제 서버 응답: 30분을 기다려야 해서 프록시 단위 테스트(mock)로만 확인했다. 쿠키 수명이 토큰 수명과 같아 실제로는 쿠키가 먼저 사라지는 경우가 대부분이다.
- 만료 후 자동 갱신의 브라우저 확인: httpOnly 쿠키라 브라우저 스크립트로 지울 수 없어서, `session_hint`만 있는 요청이 통과하는 것까지만 `curl`로 확인했다. 갱신 자체는 앞서 확인한 로그인 상태 복원(`restoreSession`)과 같은 경로다.
- 프리페치 제외로 인한 우회: 프리페치된 보호 화면으로 클라이언트 이동할 때 클라이언트 가드가 막는 동작을 실제로 만들어 확인하지는 않았다.
- stg와 prod: 배포 후에 확인해야 한다. 배포는 메인이 진행하지 않았다. 쿠키 `secure` 속성과 서버 간 `MEMBER_API_BASE_URL` 호출 경로가 stg에서 달라질 수 있다. local에서는 `Secure`가 붙지 않는 것을 확인했다.
- 프록시가 매 요청 verify를 호출하는 성능: 프리페치를 제외했지만 부하는 측정하지 않았다. 문제가 되면 짧은 인메모리 캐시를 후속으로 검토한다. (로그아웃 반영이 최대 캐시 시간만큼 늦어지는 대가)

## 남은 것

- stg와 prod 배포 후 같은 흐름 확인 (쿠키 `secure`, `member-api` 서버 간 호출)
- 후속 후보
  - 로그인과 회원가입 사이에서 `next` 유지 (이번에는 하지 않음)
  - verify 호출이 부담되면 짧은 인메모리 캐시
  - `/blog/following`, `/feed/observations`, `/feed/activities/[activityId]`가 실제로 로그인 전용이 맞는지 최종 확인 (사용자가 나중에 공개로 뺄 수 있다고 한 항목)
  - 보호 화면에 실제 데이터를 붙일 때 `member-api`의 해당 엔드포인트에 인증이 걸려 있는지 확인
- `member-api` 쪽 변경(토큰 검증 API, 내정보 조회 API)은 해당 저장소에 커밋되지 않은 상태다. 프론트 변경도 모두 커밋되지 않았다. 커밋은 사용자가 지시한다.
- 테스트 계정 `tokentest01@example.com`이 local과 stg DB에 남아 있다. (비밀번호는 문서에 적지 않음)
- `README.md`의 `?auth=member` 설명, 보호 경로, 쿠키 설계, 프록시 설명은 마무리할 때 갱신한다. `done` 문서와 calendar `DONE` 전환도 마무리를 요청받았을 때 한다.
