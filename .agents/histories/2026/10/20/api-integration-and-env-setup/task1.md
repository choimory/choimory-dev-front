# 목차

- [개요](#개요)
- [일단 추천대로 해줘 결과보고 확인할래](#일단-추천대로-해줘-결과보고-확인할래)
  - [확정한 결정](#확정한-결정)
  - [1. 환경 구성](#1-환경-구성)
  - [2. 공통 API 모듈](#2-공통-api-모듈)
  - [3. BFF](#3-bff)
  - [4. auth 도메인](#4-auth-도메인)
  - [5. 테스트와 검증](#5-테스트와-검증)
  - [계획과 달라진 점](#계획과-달라진-점)
  - [확인하지 못한 것과 남은 일](#확인하지-못한-것과-남은-일)
- [궁금한게 npm run local하면 .env.local로 실행됨?](#궁금한게-npm-run-local하면-envlocal로-실행됨)
- [README에 반영해줘](#readme에-반영해줘)
- [.env 파일 gitignore 풀어도 괜찮아?](#env-파일-gitignore-풀어도-괜찮아)
  - [괜찮은 이유](#괜찮은-이유)
  - [주의할 점](#주의할-점)
  - [추천 방식과 확인할 점](#추천-방식과-확인할-점)
- [궁금한게 app/auth/api, feature/auth/api 차이가 뭐임?](#궁금한게-appauthapi-featureauthapi-차이가-뭐임)
- [app이란 곳은 화면 놓는곳 아닌가? next server 파일 저기에 놔도 되나](#app이란-곳은-화면-놓는곳-아닌가-next-server-파일-저기에-놔도-되나)

---

# 개요

- plan1.md의 분석과 결정에 따라 member-api 1차 연동(로그인, 회원가입, 로그아웃, 재발급)을 구현함
- 토큰은 안 A로 분리: Refresh Token은 httpOnly 쿠키(BFF만 접근), Access Token은 브라우저 메모리
- BFF는 로그인, 로그아웃, 재발급만 담당하고, 그 외 API는 브라우저가 member-api를 직접 호출
- 새 의존성 없음 (fetch 래퍼 사용)
- 참고: plan1.md, `.agents/rules/front-end/code-convention-react.md`, member-api `docs/api/v1` OpenAPI

---

# 일단 추천대로 해줘 결과보고 확인할래

> 일단 추천대로 해줘 결과보고 확인할래
>
> ㄱㄱ

## (답변)

남은 결정 3개를 추천안으로 확정하고, 5단계로 나눠 구현함. 단위 테스트, 타입 검사, ESLint, 프로덕션 빌드는 통과했고 로그인 성공 경로는 실서버로 확인하지 못함.

## 확정한 결정

1. 환경 분리: `APP_ENV` + `env/.env.{local,dev,prod}`
2. 일반 화면 데이터: 클라이언트에서 불러옴. 공개 데이터만 서버 컴포넌트에서 가져옴
3. 1차 범위: 로그인, 회원가입, 로그아웃, 재발급. `/me` 연동은 회원 조회 API가 생긴 뒤로 미룸

## 1. 환경 구성

- `env/.env.local`, `env/.env.dev`, `env/.env.prod`: git 제외(`.env*` 규칙). dev, prod는 주소가 비어 있고 TODO 주석만 있음
- `.env.example`: 커밋 대상. `.gitignore`에 `!.env.example` 예외 추가
- `next.config.ts`: `APP_ENV`(local, dev, prod)에 맞는 파일을 `process.loadEnvFile`로 로드. 이미 주입된 환경변수는 덮어쓰지 않으므로 배포 환경에서 직접 주입한 값이 우선. `APP_ENV`가 없으면 파일을 읽지 않음
- `package.json` 스크립트: `dev`(`APP_ENV=local`), `dev:dev`, `build:dev`, `build:prod`
- `shared/config/env.ts`: `getServerEnv()`가 서버 전용 `MEMBER_API_BASE_URL`을 읽고 검증(없으면 오류, 끝의 `/` 제거)
- 환경변수: `MEMBER_API_BASE_URL`(서버 전용), `NEXT_PUBLIC_MEMBER_API_BASE_URL`(브라우저 직접 호출용). JWT secret은 프론트에서 제거

## 2. 공통 API 모듈

`src/shared/api/`

| 파일 | 역할 |
|---|---|
| `apiTypes.ts` | `CommonResponse`, `ValidateResult`, `AccessTokenResponse`, `ApiError`, `getValidateResults` |
| `httpClient.ts` | `httpRequest`: fetch 래퍼. 공통 응답 `{code,name,message,data}`의 data 반환, 실패는 `ApiError`로 변환 |
| `tokenStore.ts` | Access Token과 만료 시각을 메모리에 보관. 만료 30초 전부터 임박으로 판단 |
| `tokenRefresher.ts` | BFF `/api/auth/reissue` 호출. 진행 중인 갱신 Promise를 공유해 동시 호출을 한 번으로 직렬화. 실패 시 메모리 토큰 삭제 |
| `apiClient.ts` | `createApiClient`: 요청 전 만료 임박 선갱신, `TOKEN_EXPIRED` 401이면 갱신 후 원 요청 1회 재시도, 갱신 실패 시 `onAuthExpired`(기본 `/login` 이동). `auth: false` 옵션 지원 |
| `bffResponse.ts` | BFF용 공통 응답 생성(`okResponse`, `errorResponse`), `toErrorResponse`(ApiError는 그대로 전달, 그 외는 502) |

## 3. BFF

- `shared/auth/refreshCookie.ts`: Refresh Token 쿠키(`refresh_token`) 저장·조회·삭제. httpOnly, SameSite=Lax, `path=/api/auth`, `secure`는 `NODE_ENV=production`일 때, maxAge는 `refreshExpiresIn`
- `features/auth/server/authBff.ts`
  - `handleLogin`: 입력 검증(400) 후 member-api `/v1/login` 호출. Refresh Token은 쿠키로, Access Token만 본문으로 응답
  - `handleReissue`: 쿠키의 Refresh Token으로 `/v1/member/reissue` 호출 후 쿠키 교체. 쿠키가 없으면 401. 400/401로 거부되면 쿠키 삭제, 서버 오류면 쿠키 유지
  - `handleLogout`: `/v1/logout`에 Refresh Token(과 Authorization 헤더)을 전달. member-api 결과와 상관없이 쿠키는 항상 삭제
- Route Handler: `app/api/auth/login`, `logout`, `reissue`의 `route.ts`는 핸들러 호출만 하는 얇은 진입점

## 4. auth 도메인

- `model/authTypes.ts`: `LoginRequest`, `MemberJoinRequest`, `MemberJoinResponse`, `MemberStatus`, `MemberTokenResponse`, `SignupFormValues`, `FieldErrors` 추가
- `api/authApi.ts`: `login`(BFF 호출 후 메모리 저장), `logout`(실패해도 메모리 토큰 삭제), `restoreSession`(재발급으로 복원), `join`(member-api 직접 호출, 토큰 미사용)
- `hooks/useLogin.ts`, `hooks/useSignup.ts`: 입력 상태, 제출, 오류 처리. 가입 400 검증 결과는 필드별 메시지로, 409는 폼 오류로, 비밀번호 확인 불일치는 프론트에서 먼저 검사
- `components/LoginView.tsx`, `SignupView.tsx`: 입력을 `value`/`onChange`로 받는 방식으로 변경. 오류 메시지(`role="alert"`), 제출 중 버튼 비활성화 추가
- `container/LoginContainer.tsx`, `SignupContainer.tsx`: 훅 연결. 로그인 성공 시 `/`, 가입 성공 시 `/login`으로 이동

## 5. 테스트와 검증

- 새 테스트(Vitest): `env`, `apiTypes`, `httpClient`, `tokenStore`, `tokenRefresher`, `apiClient`, `bffResponse`, `refreshCookie`, `authBff`, `authApi`, 오류 메시지 변환. 공용 fixture는 `tests/fixtures/api.ts`
- 기존 테스트 수정: `LoginView`, `SignupView`, `LoginContainer`, `SignupContainer`(Props 변경과 `next/navigation`, `authApi` 모킹 반영)
- 결과: Vitest 97개 파일 574개 테스트 통과, `tsc`와 `eslint` 오류 없음, `APP_ENV=local next build` 통과, 빌드 결과물에서 `NEXT_PUBLIC_` 값 인라인 확인
- 실서버(8080) dev 서버 호출 확인: 재발급(쿠키 없음) 401, 로그인(본문 오류) 400, 로그인(없는 계정) member-api의 401 전달, 로그아웃(쿠키 없음) 200

## 계획과 달라진 점

1. `.env`에 `NEXT_PUBLIC_MEMBER_API_BASE_URL`이 추가됨. 브라우저 직접 호출에 공개 주소가 필요해서
2. 회원가입은 BFF를 거치지 않고 브라우저가 직접 호출. 토큰을 다루지 않기 때문이며 CORS 허용이 필요함
3. `proxy.ts`(보호 경로 리다이렉트)는 만들지 않음. 보호할 경로가 정해질 때 추가

## 확인하지 못한 것과 남은 일

- 로그인, 재발급, 로그아웃의 성공 경로는 실서버로 확인하지 못함 (로컬 DB에 테스트 회원이 필요). 단위 테스트에서는 member-api 응답을 모킹해 검증
- 브라우저 직접 호출(회원가입)은 member-api의 CORS 추가 후 확인 가능
- `env/.env.dev`, `env/.env.prod`의 member-api 주소 입력 필요
- 상단바와 `/me`는 아직 `?auth=member` 쿼리를 쓰는 `mockAuth`에 의존. 회원 조회 API가 생기면 실제 세션으로 교체
- `secure` 쿠키는 `NODE_ENV=production`일 때만 켜짐. 로컬에서 http로 `next start`하면 Safari에서 저장되지 않을 수 있음
- 커밋은 하지 않음
- README.md 반영과 done 문서, calendar의 DONE 전환은 작업 마무리 시점에 진행

---

# 궁금한게 npm run local하면 .env.local로 실행됨?

> 궁금한게 npm run local하면 .env.local로 실행됨?

## (답변)

`npm run local`이라는 스크립트는 없음. 로컬 개발은 `npm run dev`로 실행하고, 이는 `APP_ENV=local next dev`이므로 루트의 `.env.local`이 아니라 `env/.env.local`을 읽음.

| 명령 | APP_ENV | 읽는 파일 |
|---|---|---|
| `npm run dev` | local | `env/.env.local` |
| `npm run dev:dev` | dev | `env/.env.dev` |
| `npm run build:dev` | dev | `env/.env.dev` |
| `npm run build:prod` | prod | `env/.env.prod` |
| `npm run build` | 없음 | 파일 안 읽음 (환경변수를 직접 주입해야 함) |

- `npm run local`처럼 쓰고 싶으면 `dev`의 별칭으로 추가할 수 있음
- 루트에 `.env.local`을 만들면 안 됨. Next.js가 `next.config.ts`보다 먼저 루트 `.env.local`을 로드하고, 우리 로딩 코드는 이미 있는 값을 덮어쓰지 않으므로 같은 키가 있으면 루트 값이 이김. README에 이 경고를 적기로 함

---

# README에 반영해줘

> README에 반영해줘

## (답변)

README.md에 아래 내용을 반영함.

- 실행 방법: `dev`, `dev:dev`, `build:dev`, `build:prod`의 `APP_ENV`와 읽는 파일. 하위에 "환경 변수" 소절을 추가해 `env/` 구성, 두 환경변수 설명, 주입된 값이 파일보다 우선한다는 점, 루트 `.env.local` 금지 경고를 기록
- 프로젝트 구조: `app/api/auth/*`, `features/auth`의 `api/hooks/server`, `shared`의 `api/auth/config`, `env/`, 테스트 디렉토리
- 현재 화면 상태: 로그인·회원가입 member-api 연동, 상단바와 마이페이지는 아직 `mockAuth` 사용
- "API 연동과 인증" 섹션 신설: 연동 API와 호출 경로, 토큰 보관 위치와 수명, `apiClient`의 갱신 순서, 새 API 추가 규칙
- 테스트 규칙: 서버 전용 코드는 `// @vitest-environment node`, `next/headers` 모킹, fetch 대체 방법, `jsonResponse` 픽스처

작업 히스토리는 histories.md 규칙대로 README에 넣지 않음.

---

# .env 파일 gitignore 풀어도 괜찮아?

> .env 파일 gitignore 풀어도 괜찮아?

## (답변)

현재 구조에서는 풀어도 괜찮으나 조건이 있음. 결정은 아직 내리지 않았고, 저장소 공개 여부 확인을 기다리는 상태.

## 괜찮은 이유

- 현재 `env/.env.*`에는 member-api 주소 두 개만 있고 비밀 값이 없음. JWT secret도 프론트에서 제거함
- `NEXT_PUBLIC_MEMBER_API_BASE_URL`은 어차피 빌드 결과물(JS)에 들어가 브라우저에 공개됨
- 커밋하면 팀원이나 CI에서 별도 전달 없이 바로 `npm run dev`가 가능하고, `.env.example` 템플릿은 필요 없어짐

## 주의할 점

1. 비밀 값이 생기면 커밋하면 안 됨. 나중에 서버 전용 비밀 값이 필요해지면 이 파일들에 넣기 쉬워 사고가 날 수 있고, git 이력에 한 번 올라가면 지워도 남음
2. 저장소가 공개인지 확인해야 함. dev/prod 서버 주소(인프라 정보)가 노출됨
3. 배포 환경에서 환경변수를 직접 주입하면 그 값이 파일보다 우선하므로 충돌은 없음

## 추천 방식과 확인할 점

`.gitignore`를 아래처럼 바꾸는 방식을 추천함.

```gitignore
.env*
!.env.example
!env/
!env/.env.local
!env/.env.dev
!env/.env.prod
```

- 규칙: 비밀 값은 `env/.env.*`에 쓰지 않고 배포 환경 주입이나 git에서 제외되는 `env/.env.*.local`(예: `.env.dev.local`)에 씀. 이를 위해 로딩 코드에 `.local` 오버라이드 파일을 읽는 줄이 필요하며, 비밀 값이 생길 때 추가해도 됨
- 확인할 점: 저장소가 비공개인지, 위 방식으로 수정할지, `.env.example`을 그대로 둘지 정리할지
- 풀게 되면 README의 "git 제외" 문구도 같이 수정

---

# 궁금한게 app/auth/api, feature/auth/api 차이가 뭐임?

> 궁금한게 app/auth/api, feature/auth/api 차이가 뭐임?

## (답변)

실제 경로는 `src/app/api/auth/`와 `src/features/auth/api/`이고 하는 일이 다름.

- `src/app/api/auth/*/route.ts`: Next.js Route Handler. 파일 위치가 곧 URL(`/api/auth/login` 등)이 되고 Next 서버에서 실행됨. 쿠키 읽기·쓰기, member-api 호출, 응답 가공(Refresh Token 제거)을 하는 BFF 엔드포인트. 실제 로직은 `features/auth/server/authBff.ts`의 핸들러를 호출만 하는 얇은 진입점
- `src/features/auth/api/authApi.ts`: 컴포넌트나 hook이 부르는 함수 모음. 브라우저에서 실행되고 내부에서 `fetch('/api/auth/login')`을 보냄. 요청 주소와 본문 구성, 응답 타입 지정, 메모리에 Access Token 저장을 담당

```
LoginContainer → useLogin → authApi.login()      ← features/auth/api (브라우저 코드)
                                │
                     fetch('/api/auth/login')
                                ▼
                 app/api/auth/login/route.ts     ← app/api (Next 서버 엔드포인트)
                                │
                        authBff.handleLogin()    ← features/auth/server (서버 로직)
                                ▼
                    member-api  POST /v1/login
```

- 전자가 전화 거는 쪽(클라이언트), 후자가 전화 받는 쪽(서버)
- `authApi.join`처럼 BFF 없이 member-api를 직접 호출하는 함수도 같은 파일에 있으며, 호출하는 쪽은 BFF 경유 여부를 신경 쓰지 않아도 됨
- 필요하면 `authApi.ts`를 `authClient.ts`처럼 클라이언트임이 드러나는 이름으로 바꿀 수 있으나, 규칙(`postApi.ts` 예시)과 달라져 바꾸지 않음

---

# app이란 곳은 화면 놓는곳 아닌가? next server 파일 저기에 놔도 되나

> app이란 곳은 화면 놓는곳 아닌가? next server 파일 저기에 놔도 되나

## (답변)

놔도 됨. `app/`은 화면 폴더가 아니라 App Router의 라우팅 폴더이며, 폴더 구조가 URL이 되고 파일 이름이 역할을 정함.

| 파일 | 역할 |
|---|---|
| `page.tsx` | 화면 (그 URL로 접속하면 보이는 페이지) |
| `layout.tsx` | 공통 레이아웃 |
| `route.ts` | HTTP 엔드포인트 (화면이 아니라 요청에 응답) |

- `app/api/auth/login/route.ts`는 `/api/auth/login`에 POST 요청이 오면 응답하는 서버 코드. Next.js 공식 방식이고, 서버 엔드포인트를 만들 수 있는 위치는 `app/` 안뿐임. `features/` 등 다른 폴더의 `route.ts`는 URL로 인식되지 않음
- 로직까지 `app/`에 쌓지는 않고 역할을 나눔
  - `app/api/auth/*/route.ts`: URL 연결만 함 (핸들러 호출 한 줄)
  - `features/auth/server/authBff.ts`: 실제 서버 로직 (member-api 호출, 쿠키 처리)
  - `shared/auth/refreshCookie.ts`: 쿠키 유틸
- `page.tsx`를 얇게 두고 로직을 `features/*/container`에 두는 기존 규칙과 같은 구조
- 같은 폴더에 `page.tsx`와 `route.ts`를 함께 둘 수 없어서, API는 `app/api/` 아래로 모아 화면 경로와 분리함
