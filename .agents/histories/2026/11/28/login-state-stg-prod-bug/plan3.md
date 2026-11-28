# 목차

- [개요](#개요)
- [프록시 서버 검증 선택지](#프록시-서버-검증-선택지)
  - [답변](#답변)
  - [핵심 제약](#핵심-제약)
  - [1. 만료와 쿠키 없음 처리](#1-만료와-쿠키-없음-처리)
  - [2. Access Token 쿠키 설정](#2-access-token-쿠키-설정)
  - [3. 프록시의 member-api 호출](#3-프록시의-member-api-호출)
  - [4. 클라이언트 가드](#4-클라이언트-가드)
  - [5. 로그인 후 돌아갈 곳](#5-로그인-후-돌아갈-곳)
  - [6. 작업 범위](#6-작업-범위)
- [결정 검토](#결정-검토)
  - [답변](#답변-1)
  - [검토 1. 자동 갱신과 만료 시 로그아웃](#검토-1-자동-갱신과-만료-시-로그아웃)
  - [검토 2~4. 추천대로](#검토-24-추천대로)
  - [검토 5. 이전 페이지 해석](#검토-5-이전-페이지-해석)
  - [검토 6. 범위 확대](#검토-6-범위-확대)
- [결정 확정](#결정-확정)
  - [답변](#답변-2)
  - [확정 내용](#확정-내용)
  - [보호 경로와 공개 경로](#보호-경로와-공개-경로)
  - [구현 범위 (착수 전)](#구현-범위-착수-전)
  - [주의할 점](#주의할-점)
  - [후속 및 미정](#후속-및-미정)
- [구현 계획](#구현-계획)
  - [답변](#답변-3)
  - [확정 결정 대비 계획 변경점](#확정-결정-대비-계획-변경점)
  - [쿠키 설계](#쿠키-설계)
  - [프록시 동작](#프록시-동작)
  - [next 처리](#next-처리)
  - [보호 Container 확대](#보호-container-확대)
  - [변경 파일 목록](#변경-파일-목록)
  - [작업 분담](#작업-분담)
  - [테스트 계획](#테스트-계획)
  - [검증 계획](#검증-계획)
  - [위험과 대응](#위험과-대응)
  - [구현 중 확인이 필요한 선택](#구현-중-확인이-필요한-선택)

---

# 개요

- plan2에서 정한 단계 진행의 2단계다. 1단계(클라이언트 가드)는 task2에서 구현했고, 2단계는 서버(`proxy.ts`)가 토큰을 검증해서 보호 화면 자체를 비로그인 사용자에게 내려주지 않게 한다.
- 선결 조건이던 `member-api` 작업이 끝났고 local에서 확인했다.
  - `GET /v1/member/token/verify`: 유효 토큰 200 `{valid, memberId, expiresAt, expiresIn}`, 위조 토큰과 Refresh Token과 로그아웃 후 토큰은 401 `INVALID_TOKEN`, 토큰 없음은 401 `UNAUTHORIZED`
  - `GET /v1/member/me`: 유효 토큰 200, 응답 키는 `authorities, createdAt, email, id, introduce, nickname, status`이며 비밀번호 계열 키 없음
  - 만료된 토큰(`401 TOKEN_EXPIRED`)은 30분을 기다려야 해서 직접 호출로는 확인하지 못했다. 테스트 코드는 이 케이스를 다룬다고 보고됐다.
  - JWT는 HS256(대칭키)이라 프론트가 서명을 직접 검증할 수 없고 서버 호출이 필요하다. Access Token 30분, Refresh Token 14일.
- 참고: plan2의 "토큰 조작 방어와 프록시 검증", "최종 추천" 섹션

---

# 프록시 서버 검증 선택지

> 선택지 보여줘

## 답변

프록시 서버 검증의 선택지 6가지를 정리했다. 모두 추천안을 표시했다.

## 핵심 제약

프록시는 페이지 요청 때 Refresh Token 쿠키를 볼 수 없다. (경로가 `/api/auth`) 그래서 로그인 후 30분이 지나 Access Token이 만료되면, 프록시는 "로그인한 사용자의 만료"와 "비로그인"을 구분할 수 없다. 만료를 무조건 거부하면 로그인 사용자가 30분마다 쫓겨난다.

## 1. 만료와 쿠키 없음 처리

- 가 (추천): 세션 표시 쿠키를 추가한다.
  - 프록시는 Access Token 쿠키를 `member-api`로 검증한다. 위조와 블랙리스트(`INVALID_TOKEN`)는 즉시 `/login`으로 보낸다.
  - Access Token이 없거나 만료(`TOKEN_EXPIRED`)됐을 때는 `session_hint` 쿠키(값은 토큰이 아님, 경로 `/`, httpOnly, Refresh Token과 같은 14일)가 있으면 통과시킨다. 그러면 클라이언트 가드가 재발급하고, 실패하면 `/login`으로 보낸다. 표시 쿠키도 없으면 `/login`이다.
  - 한계: 사용자가 `session_hint`를 위조하고 Access Token 쿠키를 지우면 보호 화면의 껍데기까지는 볼 수 있다. 이후 클라이언트 가드가 재발급에 실패해서 `/login`으로 보낸다. 실제 데이터는 API가 막으므로 노출되는 정보는 없고, 위조한 Access Token은 서버가 서명으로 막는다.
- 나: 프록시가 Refresh Token으로 직접 재발급한다. 가장 엄격하지만 Refresh Token이 1회용인데 링크 프리페치가 프록시를 병렬로 여러 번 호출해서, 경쟁이 나면 정상 사용자가 로그아웃된다. 설계 변경도 커서 비추천.
- 다: 만료되면 무조건 `/login`으로 보낸다. 로그인 후 30분마다 다시 로그인해야 해서 쓸 수 없다.

## 2. Access Token 쿠키 설정

- 가 (추천): 로그인과 재발급 때 BFF가 `access_token` 쿠키를 설정한다. httpOnly, `sameSite=lax`, prod에서 `secure`, 경로 `/`, 수명은 `accessExpiresIn`(약 30분). 로그아웃과 재발급 실패 때 지운다. 이 쿠키는 페이지 접근 판단에만 쓰고, API 인증은 지금처럼 `Authorization` 헤더(메모리의 토큰)로 한다. `member-api`는 다른 호스트라 쿠키가 가지 않아 CSRF 위험이 늘지 않는다.
- 나: 보호 경로별로 경로를 좁힌 쿠키 여러 개를 둔다. 노출은 줄지만 쿠키 관리가 복잡해져서 비추천.

## 3. 프록시의 member-api 호출

- 가 (추천): 보호 경로에만 프록시를 적용(matcher)하고 매 요청 verify를 호출한다. 서버 환경변수 `MEMBER_API_BASE_URL`을 쓰고 타임아웃은 약 2초다. `member-api`가 응답하지 않거나 5xx이면 `/login`으로 보낸다. (fail-closed) `member-api`가 죽었을 때는 로그인도 안 되므로 이쪽이 안전하다.
- 나: 가와 같되 같은 토큰의 검증 결과를 인스턴스 메모리에 짧게(예: 30초) 캐시한다. 호출이 줄지만 로그아웃이 최대 30초 늦게 반영되고 인스턴스마다 캐시가 다르다.
- 참고: 하단 네비게이션의 `내 정보` 링크 때문에 거의 모든 페이지에서 `/me` 프리페치가 일어나 verify가 페이지마다 한 번씩 호출될 수 있다. 가로 시작해서 부하나 지연이 문제면 나로 바꾼다.

## 4. 클라이언트 가드

- 가 (추천): 1단계의 `RequireAuth`를 그대로 둔다. 만료 통과, 로그아웃 직후, 표시 쿠키 위조 상황을 보강한다.
- 나: 제거한다. 위 상황을 막을 수 없어서 비추천.

## 5. 로그인 후 돌아갈 곳

- 가 (추천이었음): 이번에도 `/login`으로만 보낸다. 로그인 후에는 지금처럼 `/`로 이동한다.
- 나: `/login?next=/me`로 원래 페이지를 기억한다. 프록시가 경로를 알고 있어 붙이기는 쉽지만, `next` 값 검증(외부 URL로 보내는 오픈 리다이렉트 방지)이 필요하다.

## 6. 작업 범위

- 가 (추천): 보호 경로 4개(`/me`, `/blog/me`, `/feed/me`, `/feed/me/targets/*`)만 한다. `/blog/following`, `/feed/observations`, `/feed/activities/[activityId]`는 제외한다.
- 나: 그 경로들도 포함한다. 로그인 전용 여부를 정해야 한다.

---

# 결정 검토

> 1. access token은 만료시 자동갱신처리, refresh token은 만료시 로그아웃 처리 가능?
> 2. 추천대로
> 3. 추천대로
> 4. 추천대로
> 5. 이전페이지
> 6. 나로 진행 (비로그인도 볼수 있도록 해야하면 나중에 빼면되니까)
>
> 작업하지말고 내 결정 어떤지 확인

## 답변

결정을 검토했다. 1은 1-가에서 그대로 가능하고, 2~4는 추천대로 이상이 없으며, 5와 6은 해석과 목록을 확인했다. 이 시점에는 코드와 문서를 수정하지 않았다.

## 검토 1. 자동 갱신과 만료 시 로그아웃

가능하다. 1-가에서 그대로 된다.

- Access Token 만료
  - 프록시는 `session_hint` 쿠키가 있으면 통과시킨다.
  - 페이지가 열리면 `AuthProvider`가 마운트될 때 `restoreSession()`으로 자동 갱신하고, BFF가 `access_token` 쿠키도 새로 설정한다.
  - API를 쓰는 중에 만료되면 이미 `apiClient`가 `TOKEN_EXPIRED`를 받아 갱신하고 재시도한다.
- Refresh Token 만료(14일)
  - 쿠키 수명이 같아서 브라우저가 자동으로 지운다. `session_hint`도 같은 수명이라 함께 사라진다.
  - 그러면 프록시가 `/login`으로 보내서 서버에서 로그아웃 처리가 된다.
  - 페이지를 열어 둔 채 만료되면 다음 API 호출에서 재발급이 401로 실패하고, 이미 있는 `onAuthExpired`가 `/login`으로 이동시킨다. BFF도 이때 쿠키를 지운다.
- 한계: 자동 갱신은 타이머가 아니라 페이지를 열 때나 API 호출 때 일어난다. 지금 보호 화면은 목업이라 API 호출이 없어서 새로고침이나 이동 때 갱신된다.

## 검토 2~4. 추천대로

- 2-가: `access_token` 쿠키는 httpOnly, `sameSite=lax`, prod에서 `secure`, 경로 `/`, 수명은 약 30분.
- 3-가: 프록시 적용 경로에서 매 요청 verify를 호출하고 타임아웃은 약 2초. `member-api`가 응답하지 않으면 `/login`으로 보낸다.
- 4-가: 클라이언트 가드를 유지한다.
- 3-가 때문에 `내 정보` 링크 프리페치마다 verify가 호출될 수 있다. 문제가 되면 짧은 캐시로 바꾸는 것을 구현 후에 판단한다.

## 검토 5. 이전 페이지 해석

"이전 페이지"의 해석 후보는 다음과 같았다.

- 가: 보호 페이지에서 쫓겨난 경우에만 그 페이지로 돌아간다.
- 나 (추천): 가에 더해, 공개 페이지에서 `로그인` 버튼을 눌렀을 때도 그 페이지로 돌아간다.
- 다: 브라우저 히스토리의 바로 직전 페이지로 돌아간다. 로그인 화면에서 새로고침하거나 외부에서 오면 의도와 다를 수 있어 비추천.

가나 나 모두 `/login?next=/me`처럼 경로를 넘기는 방식이며 다음이 같이 들어간다.

- `next`는 `/`로 시작하는 같은 사이트 내부 경로만 허용한다. `//evil.com`이나 `https://...` 같은 값은 거부하고 `/`로 보낸다. 빼먹으면 오픈 리다이렉트 취약점이 된다.
- 프록시와 클라이언트 가드(`RequireAuth`) 둘 다 `next`를 붙여 보낸다.
- 로그인 화면에서 `next`를 읽으려면 `useSearchParams`가 필요해서 로그인 화면에 Suspense 처리가 들어간다.

## 검토 6. 범위 확대

6-나로 진행하면 기존 4개에 `/blog/following`, `/feed/observations`, `/feed/observations/[observationId]`, `/feed/activities/[activityId]`가 더해져 8개가 보호된다.

- 지금 `/feed/observations`는 공개로 구현되어 있고 테스트도 그렇게 짜여 있다. 보호로 바꾸면 `FeedMenuContainer`의 조건과 해당 테스트가 바뀐다.
- 나중에 공개로 되돌리기 쉽도록 보호 경로 목록은 한 곳(상수)에서 관리해서 프록시와 가드가 같이 쓰게 한다.

---

# 결정 확정

> 1: 예
> 2: 나
> 6: 맞음
>
> 5를 2로 오타냈어

## 답변

`2: 나`는 5번(로그인 후 돌아갈 곳)의 `나`로 확인됐다. 결정이 모두 확정됐고 구현은 아직 시작하지 않았다.

## 확정 내용

| 항목 | 결정 |
|---|---|
| 1. 만료와 쿠키 없음 처리 | 가: `session_hint` 쿠키로 만료를 통과시키고 클라이언트가 자동 갱신, Refresh Token 만료 시 `/login` |
| 2. Access Token 쿠키 | 가: httpOnly, 경로 `/`, 수명 약 30분 |
| 3. 프록시의 member-api 호출 | 가: 매 요청 verify, 타임아웃 약 2초, 실패 시 `/login` |
| 4. 클라이언트 가드 | 가: 유지 |
| 5. 로그인 후 돌아갈 곳 | 나: 로그인을 시작한 페이지로 복귀, `next`는 같은 사이트 내부 경로만 허용 |
| 6. 범위 | 나: 보호 8개, 나머지 공개 (나중에 공개로 빼기 쉽도록 목록은 한 곳에서 관리) |

## 보호 경로와 공개 경로

- 보호 (8개): `/me`, `/blog/me`, `/feed/me`, `/feed/me/targets/*`, `/blog/following`, `/feed/observations`, `/feed/observations/[observationId]`, `/feed/activities/[activityId]`
- 공개: `/`, `/notice`, `/services`, `/blog`, `/blog/popular`, `/blog/[nickname]`, `/blog/posts/[postId]`, `/feed`, `/feed/popular`, `/feed/targets/[targetId]`, `/login`, `/signup`

## 구현 범위 (착수 전)

1. BFF 쿠키: 로그인과 재발급 때 `access_token`, `session_hint`를 설정하고, 로그아웃과 재발급 실패 때 지운다. (`authBff.ts`, `refreshCookie.ts` 옆에 쿠키 유틸)
2. `src/proxy.ts`: 보호 경로 matcher, `member-api` verify 호출(서버 환경변수 `MEMBER_API_BASE_URL`, 타임아웃 약 2초), 결과별 분기
   - 통과: verify 200
   - 통과: Access Token이 없거나 `TOKEN_EXPIRED`이면서 `session_hint`가 있음
   - `/login?next=...`로 이동: `INVALID_TOKEN`, 표시 쿠키도 없음, `member-api` 무응답이나 5xx
3. 보호 경로 목록을 한 곳의 상수로 두고 프록시와 가드가 같이 쓴다.
4. `next` 처리: 프록시와 `RequireAuth`가 `/login?next=<현재 경로>`를 붙이고, 로그인 후 `next`로 이동한다. `next` 검증(내부 경로만 허용)과 로그인 화면의 Suspense 처리를 넣는다. 공개 페이지의 `로그인` 링크도 현재 경로를 `next`로 붙인다.
5. 공개로 구현되어 있던 `/feed/observations`를 보호로 바꾸고, `/blog/following`, `/feed/observations/[observationId]`, `/feed/activities/[activityId]` Container에도 `RequireAuth`를 적용한다. 관련 테스트를 수정한다.
6. 테스트: 프록시 분기, 쿠키 설정과 삭제, `next` 검증, `RequireAuth`의 `next`
7. 검증: `tsc`, `eslint`, `test:run`, local에서 paseo 브라우저로 확인한다. (프록시 통과와 차단, 만료 후 자동 갱신, `next` 복귀)

## 주의할 점

- `session_hint`를 위조하면 보호 화면의 껍데기를 볼 수 있다. 실제 데이터는 API가 막는다.
- 자동 갱신은 타이머가 아니라 페이지 로드나 API 호출 때 일어난다.
- 3-가는 프리페치 때문에 verify 호출이 늘 수 있다. 필요하면 짧은 캐시로 바꾼다.
- `next`는 오픈 리다이렉트를 막는 검증이 필수다.
- 프록시 런타임과 쿠키 설정 방식은 Next.js 16 문서에서 구현 전에 확인한다.

## 후속 및 미정

- 만료된 토큰(`TOKEN_EXPIRED`)의 실제 서버 응답은 프록시 구현 후 통합 테스트로 확인한다.
- `member-api` 변경(새 API 2개)은 커밋되지 않았다. 커밋은 사용자가 지시한다.
- stg와 prod는 배포 후 확인한다. 배포는 메인이 진행하지 않는다.
- 테스트 계정 `tokentest01@example.com`이 local과 stg DB에 남아 있다. (비밀번호는 문서에 적지 않음)
- `README.md`의 `?auth=member` 설명과 보호 경로 안내는 마무리할 때 갱신한다.


---

# 구현 계획

> 구현계획

## 답변

확정한 결정(1-가, 2-가, 3-가, 4-가, 5-나, 6-나)을 구현하는 계획이다. 구현 전에 Next.js 16 문서(`proxy.md`)와 현재 코드 구조를 읽어서 확정 결정과 어긋나는 부분을 확인했고, 그 부분은 아래 "확정 결정 대비 계획 변경점"에 따로 적었다. 이 시점에는 코드를 수정하지 않았다.

## 확정 결정 대비 계획 변경점

문서 확인 결과 아래 세 가지가 이전 설명과 다르다. 구현은 이 계획대로 진행하되, 이의가 있으면 구현 전에 바꾼다.

1. 보호 경로 목록을 상수 한 곳에서 관리한다는 계획은 그대로 할 수 없다.
   - 근거: 문서에 "matcher 값은 빌드 때 정적으로 분석되는 상수여야 하고, 변수 같은 동적 값은 무시된다"고 되어 있다.
   - 변경: 보호 경로 8개를 `src/proxy.ts`의 `config.matcher`에 문자열 리터럴로 적는다. 이 matcher가 서버 쪽 보호 목록의 유일한 위치다. 클라이언트 가드(`RequireAuth`)는 지금처럼 Container마다 감싼다. 경로를 공개로 되돌릴 때는 matcher에서 한 줄을 빼고 해당 Container의 `RequireAuth`를 제거한다.
2. 로그인 화면의 `next` 전달은 Suspense 대신 서버에서 `searchParams`를 읽는 방식으로 한다.
   - 근거: `useSearchParams`는 빌드 때 Suspense 경계가 필요하다. 로그인 `page.tsx`가 `searchParams`를 읽어 서버에서 검증한 뒤 `redirectTo`를 Container에 넘기면 Suspense가 필요 없고 검증이 한 번만 일어난다.
   - 변경: plan3 "결정 확정"에 적은 "로그인 화면의 Suspense 처리"를 "로그인 `page.tsx`에서 서버 검증"으로 바꾼다.
3. 프리페치 요청은 프록시에서 제외하는 것을 제안한다. (아래 "구현 중 확인이 필요한 선택" 참고)
   - 근거: 문서가 matcher의 `missing`에 `next-router-prefetch` 헤더와 `purpose: prefetch` 헤더를 지정해서 프리페치를 건너뛰는 패턴을 안내한다. 하단 네비게이션의 `내 정보` 링크 때문에 거의 모든 페이지에서 프리페치가 일어나 verify 호출이 폭증하는 것을 막는다.
   - 대가: 프리페치된 보호 화면으로 클라이언트 이동할 때는 프록시를 거치지 않을 수 있다. 이 경우를 클라이언트 가드(`RequireAuth`)가 막는다.

## 쿠키 설계

모두 httpOnly, `sameSite=lax`, prod에서 `secure`, 경로 `/`다.

| 쿠키 | 값 | 수명 | 설정 시점 | 삭제 시점 |
|---|---|---|---|---|
| `refresh_token` (기존) | Refresh Token | `refreshExpiresIn` | 로그인, 재발급 | 로그아웃, 재발급 400/401 |
| `access_token` (신규) | Access Token | `accessExpiresIn` (약 30분) | 로그인, 재발급 | 로그아웃, 재발급 400/401 |
| `session_hint` (신규) | `1` (토큰 아님) | `refreshExpiresIn` (14일) | 로그인, 재발급 | 로그아웃, 재발급 400/401 |

- `refresh_token` 쿠키의 경로는 `/api/auth`로 그대로 둔다. Refresh Token 노출 범위를 넓히지 않는다.
- `access_token` 쿠키는 프록시의 페이지 접근 판단에만 쓴다. API 인증은 지금처럼 `Authorization` 헤더(메모리의 토큰)로 하며, `member-api`는 다른 호스트라 이 쿠키가 가지 않는다.
- 재발급에서 Refresh Token이 회전할 때마다 `refresh_token`, `access_token`, `session_hint`를 함께 갱신한다. (수명이 슬라이딩된다.)
- 쿠키 이름 상수는 프록시와 BFF가 같이 쓰도록 `next/headers`를 가져오지 않는 순수 모듈에 둔다.

## 프록시 동작

`src/proxy.ts`는 Node.js 런타임(Next.js 16 기본, `runtime` 설정은 쓸 수 없음)에서 실행된다. 요청 쿠키는 `request.cookies`로 읽고, 응답 쿠키는 `NextResponse`로 조작한다.

```mermaid
flowchart TD
    R[보호 경로 요청] --> A{access_token 쿠키}
    A -->|없음| H{session_hint 쿠키}
    H -->|있음| P[통과: 클라이언트가 자동 갱신]
    H -->|없음| L[/login?next=... 로 이동]
    A -->|있음| V[member-api verify 호출 타임아웃 2초]
    V -->|200| P
    V -->|401 TOKEN_EXPIRED| H
    V -->|401 INVALID_TOKEN, UNAUTHORIZED| D[access_token 삭제 후 /login?next=... 로 이동]
    V -->|타임아웃, 네트워크 오류, 5xx| L
```

- verify 호출: `GET {MEMBER_API_BASE_URL}/v1/member/token/verify`, 헤더 `Authorization: Bearer <access_token>`, `AbortSignal.timeout(2000)`, 캐시 없음. 기존 `getServerEnv()`를 재사용하고, 환경변수가 없어도 예외를 잡아 fail-closed로 처리한다.
- fail-closed: `member-api`가 응답하지 않으면 `/login`으로 보낸다.
- 실제로는 쿠키 만료와 토큰 만료가 같은 시각이라 `access_token`이 없는 경우가 대부분이고 `TOKEN_EXPIRED`는 시계 오차 때 드물게 온다. 그래도 두 경우를 모두 처리한다.
- `INVALID_TOKEN`이면 `access_token`만 지우고 `session_hint`는 남긴다. Refresh Token이 아직 유효할 수 있기 때문이고, 이미 폐기됐다면 클라이언트 가드가 재발급에 실패해 BFF가 모든 쿠키를 지운다.
- `/login`, `/signup`은 matcher 밖이라 리다이렉트 루프가 생기지 않는다.
- matcher: 보호 경로 8개를 리터럴 8개 객체로 적고, 각각 프리페치 헤더가 없을 때만(`missing`) 적용한다.
  - `/me`, `/blog/me`, `/blog/following`, `/feed/me`, `/feed/me/targets/:targetId`, `/feed/observations`, `/feed/observations/:observationId`, `/feed/activities/:activityId`

## next 처리

- 새 모듈 `src/shared/auth/redirect.ts` (순수 함수, 프록시와 클라이언트가 같이 씀)
  - `sanitizeNextPath(raw)`: `/`로 시작하는 내부 경로만 허용한다. `//evil.com`, `https://...`, `/\evil`, `javascript:`, 제어문자, 너무 긴 값, `/login`과 `/signup`(루프 방지)은 거부하고 `/`를 돌려준다.
  - `buildLoginHref(currentPath)`: 현재 경로가 `/`, `/login`, `/signup`이면 `/login`, 아니면 `/login?next=<인코딩된 경로>`를 돌려준다. 그래서 기존 테스트의 `href="/login"` 단언은 바뀌지 않는다.
- 로그인 화면: `src/app/login/page.tsx`가 `searchParams`를 읽어 `sanitizeNextPath`로 검증한 `redirectTo`를 `LoginContainer`에 prop으로 넘기고, 로그인 성공 후 `router.push(redirectTo)`로 이동한다.
- `next`를 붙이는 곳
  - 프록시: 보호 경로에서 쫓아낼 때 `request.nextUrl.pathname`
  - `RequireAuth`: `router.replace(buildLoginHref(pathname))` (`usePathname`)
  - `apiClient.redirectToLogin`: `buildLoginHref(window.location.pathname)`
  - 공개 페이지의 `로그인` 링크: 신규 `LoginLink` 컴포넌트(`usePathname`으로 `buildLoginHref` 적용)로 `TopBarActions`, `GuestLandingSection`, `BlogGuestSection`(2곳), `FeedView`의 링크를 교체한다.
- 쿼리 문자열은 `next`에 포함하지 않고 경로만 넘긴다. (민감한 값이 URL에 남는 것을 피하기 위함)

## 보호 Container 확대

6-나로 보호 경로가 8개가 됐으므로 `RequireAuth`를 아래에 추가한다.

- `BlogMenuContainer`: `menuKind === 'following'`일 때만 감싼다. (`popular`는 공개)
- `FeedMenuContainer`: `menuKind`가 `me` 또는 `observations`일 때 감싼다. (`popular`는 공개)
- `FeedObservationDetailContainer`, `FeedActivityDetailContainer`: 항상 감싼다.
- 이미 감싼 4곳(`MeContainer`, `BlogMeSettingsContainer`, `FeedTargetSettingsContainer`, `FeedMenuContainer`의 `me`)은 그대로 둔다.

## 변경 파일 목록

신규

- `src/shared/auth/cookieNames.ts`: 쿠키 이름 상수 (순수)
- `src/shared/auth/sessionCookies.ts`: `access_token`, `session_hint` 설정과 삭제 (`next/headers`)
- `src/shared/auth/redirect.ts`: `sanitizeNextPath`, `buildLoginHref`
- `src/proxy.ts`
- `src/features/auth/components/LoginLink.tsx`

수정

- `src/features/auth/server/authBff.ts`: 로그인, 재발급, 로그아웃에서 새 쿠키 설정과 삭제
- `src/shared/auth/refreshCookie.ts`: 쿠키 이름을 `cookieNames`에서 가져오도록 정리 (동작 변경 없음)
- `src/features/auth/components/RequireAuth.tsx`: `next` 포함 이동
- `src/app/login/page.tsx`, `src/features/auth/container/LoginContainer.tsx`: `redirectTo`
- `src/shared/api/apiClient.ts`: `redirectToLogin`에 `next`
- `src/shared/ui/TopBarActions.tsx`, `GuestLandingSection.tsx`, `BlogGuestSection.tsx`, `FeedView.tsx`: `LoginLink`로 교체
- Container 4곳: `BlogMenuContainer`, `FeedMenuContainer`, `FeedObservationDetailContainer`, `FeedActivityDetailContainer`

## 작업 분담

공통 계약(`cookieNames`, `redirect.ts`, `LoginLink`)은 메인이 먼저 만들고, 이를 쓰는 영역을 병렬로 나눈다. 파일이 겹치지 않게 나눈다.

| 담당 | 범위 |
|---|---|
| 메인 | 공통 계약(`cookieNames.ts`, `redirect.ts`, `LoginLink.tsx`)과 테스트, 로그인 화면(`page.tsx`, `LoginContainer`), `TopBarActions`와 CTA 링크 교체, `apiClient`, 최종 `tsc`, `eslint`, 전체 테스트, 브라우저와 `curl` 검증 |
| 에이전트 A (BFF 쿠키) | `sessionCookies.ts`, `authBff.ts`, `refreshCookie.ts` 정리와 `authBff`, 쿠키 테스트 |
| 에이전트 B (프록시) | `src/proxy.ts`와 프록시 테스트 (Node 환경) |
| 에이전트 C (가드 확대) | `RequireAuth`의 `next`, 보호 Container 4곳 추가와 관련 테스트 수정 |

- 에이전트는 `codex/gpt-6.2-sol`을 쓴다. 에이전트 생성이 권한 분류기에 거부될 수 있으며, 그런 영역은 메인이 직접 처리한다.
- 에이전트는 자기 범위의 테스트만 실행하고, 전체 lint와 테스트는 메인이 마지막에 실행한다.

## 테스트 계획

- `tests/unit/shared/auth/redirect.test.ts`: `sanitizeNextPath`(정상 경로, `//evil.com`, `https://`, `/\`, 제어문자, 길이 초과, `/login` 루프, 빈 값), `buildLoginHref`(`/`, `/login`, 일반 경로, 특수문자 인코딩)
- `tests/unit/shared/auth/sessionCookies.test.ts`: 쿠키 속성과 수명, 삭제
- `tests/unit/features/auth/server/authBff.test.ts`: 로그인과 재발급에서 세 쿠키 설정, 재발급 400/401과 로그아웃에서 삭제, 일시적 오류에서는 유지
- `tests/unit/proxy.test.ts` (`// @vitest-environment node`, `fetch` mock): 위 흐름도의 모든 분기, `next` 포함 리다이렉트, `access_token` 삭제, 타임아웃과 5xx fail-closed, 환경변수 없음
- `RequireAuth.test.tsx`: `next` 포함 이동
- `LoginContainer.test.tsx`: `redirectTo`로 이동, 기본값 `/`
- `LoginLink` 테스트와 `TopBarActions` 테스트: 경로별 `href`
- 보호 Container 테스트: `following`, `observations`, 관찰 상세, 활동 상세가 비로그인이면 이동하고 로그인이면 보이며, `popular`는 비로그인으로도 열리는지

## 검증 계획

1. `npx tsc --noEmit`, `npx eslint src tests`, `npx vitest run`
2. `curl`로 local Next 서버의 프록시를 직접 검증한다. (httpOnly 쿠키는 브라우저 스크립트로 만들 수 없으므로 헤더로 보낸다.)
   - 쿠키 없음, 보호 경로 8개: 리다이렉트와 `Location: /login?next=...`
   - 유효한 `access_token`: 통과
   - 위조한 `access_token`: `/login`으로 이동하고 `access_token` 삭제 `Set-Cookie`
   - `access_token` 없이 `session_hint`만: 통과
   - 공개 경로: 통과
   - 프리페치 헤더가 있는 요청: 프록시 건너뜀
3. 브라우저(paseo, `localhost:3000`, 테스트 계정)
   - 비로그인으로 보호 경로 진입, `/login?next=...`로 이동, 로그인 후 원래 페이지로 복귀
   - 공개 페이지에서 `로그인` 버튼을 누르고 로그인하면 그 페이지로 복귀
   - 로그인 상태에서 `access_token` 쿠키를 만료시킨 뒤 새로고침하면 자동 갱신되어 유지
   - 로그아웃하면 쿠키 세 개가 모두 지워짐
   - `next`에 외부 URL을 넣은 `/login?next=https://evil.com`으로 로그인하면 `/`로 이동
4. stg와 prod는 배포 후 확인한다. 배포는 메인이 진행하지 않는다. 쿠키 `secure` 속성과 `member-api` 서버 간 호출 경로(`MEMBER_API_BASE_URL`)는 stg에서 확인이 필요하다.

## 위험과 대응

- `member-api` 장애나 지연: 타임아웃 2초 후 `/login`으로 보낸다. 로그인도 같은 서버에 의존하므로 이쪽이 안전하다.
- 프록시가 verify를 매 요청 호출: 프리페치를 제외해서 줄인다. 부하나 지연이 문제면 짧은 인메모리 캐시를 후속으로 검토한다. (로그아웃 반영이 늦어지는 대가)
- 오픈 리다이렉트: `sanitizeNextPath`를 로그인 `page.tsx`에서 서버 검증하고 전용 테스트로 막는다.
- 쿠키가 하나 더 늘어 요청 헤더가 커진다: 값이 짧아(`1`, JWT 하나) 431 위험은 낮다.
- `session_hint` 위조: 보호 화면의 껍데기를 볼 수 있지만 클라이언트 가드가 재발급에 실패해 `/login`으로 보낸다. 실제 데이터는 API가 막는다.
- 프리페치 제외로 인한 우회: 프리페치된 화면으로 이동하면 프록시를 거치지 않을 수 있으나 클라이언트 가드가 막는다. 이 경우를 브라우저로 확인한다.
- 프록시 변경이 모든 보호 화면에 영향: matcher가 8개 경로만 가리키는지 테스트로 확인한다.

## 구현 중 확인이 필요한 선택

아래는 계획에 추천안을 넣어 두었고, 다르게 하고 싶으면 구현 전에 바꾼다.

1. 프리페치 요청의 프록시 제외
   - 가 (추천): 제외한다. verify 호출을 줄이고, 클라이언트 가드가 프리페치 이동을 보완한다.
   - 나: 제외하지 않는다. 프리페치도 서버에서 막지만 verify 호출이 크게 늘어난다.
2. 로그인 화면의 `next` 전달 방식
   - 가 (추천): `page.tsx`에서 `searchParams`를 서버에서 읽고 검증한다.
   - 나: 클라이언트에서 `useSearchParams`를 읽고 Suspense로 감싼다. (이전 결정 문구)
3. 로그인과 회원가입 사이에서 `next` 유지
   - 가 (추천): 이번에는 하지 않는다. 로그인 화면에서 `회원가입`으로 갔다 오면 `next`가 사라지고 로그인 후 `/`로 간다. 후속으로 둔다.
   - 나: 로그인과 회원가입 링크, 가입 완료 후 이동까지 `next`를 유지한다. 작은 작업이지만 범위가 는다.
