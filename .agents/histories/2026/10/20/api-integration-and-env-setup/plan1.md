# 목차

- [개요](#개요)
- [분석 ㄱㄱ](#분석-ㄱㄱ)
  - [member-api 현황 (OpenAPI v1)](#member-api-현황-openapi-v1)
  - [프론트 현황](#프론트-현황)
  - [Next.js 16에서 확인한 것](#nextjs-16에서-확인한-것)
  - [제안과 결정할 점](#제안과-결정할-점)
- [bff 쓴다는게 Next server 이용해서 프록시 한번 타고 통신 한다는거지?](#bff-쓴다는게-next-server-이용해서-프록시-한번-타고-통신-한다는거지)
  - [동작 방식](#동작-방식)
  - [호출 방식 두 가지](#호출-방식-두-가지)
- [보안이 중요한 민감한 주제에 한해서만 bff를 사용하자](#보안이-중요한-민감한-주제에-한해서만-bff를-사용하자)
  - [Access Token 보관 위치 문제](#access-token-보관-위치-문제)
  - [안 A: 토큰을 역할별로 나누기](#안-a-토큰을-역할별로-나누기)
  - [안 B: 토큰은 전부 쿠키](#안-b-토큰은-전부-쿠키-일반-api도-서버에서-호출)
  - [추천과 확인할 점](#추천과-확인할-점)
- [추가1](#추가1)
- [추가1 확인](#추가1-확인)
  - [추가1 항목 정리](#추가1-항목-정리)
  - [APP_ENV + env 폴더 구성](#app_env--env-폴더-구성)
  - [토큰 갱신 로직](#토큰-갱신-로직-api-호출-함수에-포함)
  - [남은 결정](#남은-결정)

---

# 개요

- 현재 프로젝트에 .env 구성이 안되어 있음. local, dev, prod 세가지로 구성
- .env에 적어야할건 일단 choimory-dev-member-api 주소랑 jwt secret key 정도일듯
- api 호출하는 공통 함수 있어야 할듯
- 토큰 관련된 공통 함수도 있어야 할듯
- choimory-dev-member-api의 docs/api/v1에서 openapi 문서 확인 가능

---

# 분석 ㄱㄱ

> 분석 ㄱㄱ

## (답변)

member-api OpenAPI, 프론트 현재 구조와 규칙, Next.js 16 공식 문서를 확인하고 정리한 분석 결과.

## member-api 현황 (OpenAPI v1)

| 메서드 | 경로 | 인증 | 설명 |
|---|---|---|---|
| POST | `/v1/login` | 불필요 | `{email, password}` 요청, 토큰 발급 |
| POST | `/v1/logout` | 선택 | `{refreshToken}` 요청, Authorization 헤더는 선택 |
| POST | `/v1/member/join` | 불필요 | 회원가입, 400이면 필드별 검증 결과 반환 |
| POST | `/v1/member/reissue` | 불필요 | `{refreshToken}` 요청, 토큰 재발급(rotation) |

- 공통 응답은 `{code, name, message, data}` 형태. 에러는 `data: null`이고, 가입 검증 실패(400)는 `data`가 `[{field, rejectValue, message}]` 배열.
- 토큰 응답은 `accessToken`, `refreshToken`, `tokenType("Bearer")`, `accessExpiresIn`(초), `refreshExpiresIn`(초). Access Token 30분, Refresh Token 14일.
- 재발급은 Refresh Token을 한 번 쓰면 폐기됨. 동시에 두 요청이 재발급을 시도하면 하나는 401을 받으므로, 프론트에서 재발급 요청을 한 번만 보내게 직렬화해야 함.
- 401은 `TOKEN_EXPIRED`와 `INVALID_TOKEN`으로 나뉘고, 가입 409는 `DUPLICATE_EMAIL` 등.
- CORS는 README에 언급이 없어서 member-api에 설정이 있는지 확인 필요.
- 현재 열려 있는 API는 위 4개뿐. 회원 조회 API가 없어서 로그인 후 내 정보(닉네임 등)를 가져올 방법이 없고, 토큰의 `sub`(회원 ID)와 `authorities`로만 알 수 있음.

## 프론트 현황

- Next.js 16.3.5, React 19.3. `.env`는 없고, `.gitignore`가 `.env*` 전체를 무시하고 있어서 `.env.example` 같은 템플릿도 커밋이 안 됨.
- 로그인/회원가입은 UI만 있음. `LoginContainer`는 `loginViewModel` 정적 데이터만 렌더링하고, 인증 상태는 `?auth=member` 쿼리를 쓰는 `mockAuth.ts`가 대신함.
- 규칙(`code-convention-react.md`)은 `features/{domain}/api/*.ts`, `model`, `hooks`, `shared/api/apiClient`, `shared/utils` 구조. 규칙 예시가 `apiClient.get<T>()`가 `{data}`를 반환하는 axios 스타일인데, axios는 설치돼 있지 않음.
- Playwright와 MSW는 "API 연동 후 추가"라고 README에 적혀 있음.

## Next.js 16에서 확인한 것

- Middleware가 Proxy로 이름이 바뀜. 파일은 `proxy.ts`이고, 공식 가이드는 낙관적 체크(redirect)만 하고 세션 관리나 인가 용도로는 쓰지 말라고 함.
- `.env` 로딩 순서는 `process.env` → `.env.$(NODE_ENV).local` → `.env.local` → `.env.$(NODE_ENV)` → `.env`.
- `NODE_ENV`는 `production`, `development`, `test`만 허용됨. `.env.local`, `.env.dev`, `.env.prod`처럼 파일명만으로 3환경을 나누는 건 안 되고, `.env.local`은 Next가 로컬 오버라이드 용도로 쓰고 있어서 이름 충돌 여지도 있음.

## 제안과 결정할 점

### A. 환경 구성 (local / dev / prod)

- `NODE_ENV`에 의존하지 않고 값을 직접 주입하는 방식을 추천. 예: `APP_ENV=local|dev|prod`를 두고 `env/.env.local`, `env/.env.dev`, `env/.env.prod`로 분리. 실제 배포 환경(choimory-dev-manifests)이 환경변수를 어떻게 주입하는지에 따라 달라질 수 있음.
- 필수 값은 `MEMBER_API_BASE_URL` 하나. `NEXT_PUBLIC_` 없이 서버 전용으로 둠.
- JWT secret은 프론트에 필요 없을 가능성이 큼. 만료 판단은 `accessExpiresIn`으로, 형식 확인은 payload 디코딩으로 충분하고, 서명 검증은 member-api가 요청마다 하므로 프론트가 비밀키를 가질 이유가 없음. 프론트에 키를 두면 유출 시 토큰 위조가 가능해서 오히려 위험도가 커지므로 빼는 걸 추천.
- 템플릿은 `.gitignore`에 `!.env.example` 예외를 추가해서 커밋하는 방식.

### B. 호출 구조: 브라우저 직접 호출 vs BFF(Next 서버 경유)

| | 브라우저 → member-api 직접 | 브라우저 → Next 서버(Route Handler/Server Action) → member-api |
|---|---|---|
| 토큰 저장 | JS에서 접근 가능한 곳(메모리, localStorage). XSS에 취약 | httpOnly 쿠키에 저장. JS에서 접근 불가 |
| CORS | member-api 설정 필요 | 불필요(서버 간 통신) |
| API 주소 | 공개됨 | 숨길 수 있음 |
| 구현량 | 적음 | 많음(프록시 계층 추가) |

- BFF를 추천. 토큰 보안과 CORS 부담이 사라지고, Next 공식 인증 가이드의 방향과도 맞음. Refresh Token이 14일짜리라 localStorage에 두기엔 부담이 큼.

### C. 공통 모듈 구성안 (BFF 기준)

- `shared/config/env.ts`: 환경변수를 한 곳에서 읽고 검증. 서버 전용.
- `shared/api/apiClient.ts`: `fetch` 래퍼. 새 의존성 없이 규칙 예시와 같은 사용감(`apiClient.post<T>(url, body)`)으로 만들고, 공통 응답 `{code,name,message,data}` 언래핑, 에러를 `ApiError`로 통일, 401 `TOKEN_EXPIRED` 시 1회 재발급 후 재시도를 담당.
- `shared/auth/token.ts`(서버 전용): 토큰 쿠키 저장·조회·삭제, payload 디코딩(`sub`, `authorities`, `exp`), 만료 판단, 재발급 직렬화.
- `features/auth/api/authApi.ts`, `model/authTypes.ts`: login, join, reissue, logout과 요청/응답 타입, mapper.
- `proxy.ts`: 쿠키 유무만 보고 보호 경로를 `/login`으로 리다이렉트하는 낙관적 체크.
- `mockAuth.ts`는 연동이 끝나면 실제 세션 조회로 교체.

### D. 결정이 필요한 질문

1. BFF(httpOnly 쿠키)로 갈지, 브라우저 직접 호출로 갈지. (BFF 추천)
2. JWT secret을 프론트 `.env`에서 빼도 되는지. 서버에서 서명 검증이 꼭 필요한 이유가 있는지 확인.
3. 환경 분리 방식을 `APP_ENV` + `env/` 폴더로 할지, 배포 쪽 제약이 있는지.
4. 1차 연동 범위를 로그인, 회원가입, 로그아웃, 재발급까지로 할지. 내 정보 조회 API가 없어서 `/me` 화면 연동은 백엔드 작업이 먼저 필요.
5. HTTP 클라이언트를 새 의존성 없이 `fetch` 래퍼로 갈지. (추천)

---

# bff 쓴다는게 Next server 이용해서 프록시 한번 타고 통신 한다는거지?

> bff 쓴다는게 Next server 이용해서 프론트랑 백엔드 사이에 next server로 프록시 한번 타고 통신 한다는거지?

## (답변)

맞음. 브라우저는 member-api를 직접 부르지 않고 Next 서버에만 요청하고, Next 서버가 member-api를 대신 호출해 결과를 돌려줌.

## 동작 방식

```
브라우저 → Next 서버 (Route Handler / Server Action) → member-api
         ←                                           ←
```

단순 프록시와 달리 Next 서버가 인증 처리도 맡음.

- 로그인: Next 서버가 member-api에서 받은 토큰을 응답 본문으로 브라우저에 주지 않고 httpOnly 쿠키에 넣음. 브라우저 JS에는 토큰이 노출되지 않음.
- 이후 요청: 브라우저는 쿠키만 자동으로 실어 보내고, Next 서버가 쿠키에서 토큰을 꺼내 `Authorization: Bearer ...` 헤더를 붙여 member-api를 호출.
- 토큰 만료: Next 서버가 재발급을 처리. 브라우저는 만료를 신경 쓰지 않음.

## 호출 방식 두 가지

1. 서버 컴포넌트나 Server Action에서 직접 호출: 별도 프록시 엔드포인트 없이 `apiClient`를 서버에서 바로 사용. 서버 렌더링과 폼 제출에 적합.
2. Route Handler(`app/api/...`)로 프록시 엔드포인트를 만들어 호출: 클라이언트 컴포넌트에서 `fetch('/api/...')`로 부르는 경우에 사용. 무한스크롤이나 실시간 갱신 등.

대가는 요청이 한 번 더 거친다는 점(네트워크 홉 하나, 구현 계층 하나). 같은 인프라 안의 서버 간 통신이라 지연은 미미하지만 코드량은 직접 호출보다 늘어남. 1차 범위(로그인, 회원가입, 로그아웃)는 Server Action 위주로 가고, 이후 클라이언트 조회가 필요해지면 Route Handler를 추가하는 방향을 제안함.

---

# 보안이 중요한 민감한 주제에 한해서만 bff를 사용하자

> 보안이 중요한 민감한 주제에 한해서만 bff를 사용하자. jwt, 로그인, 로그아웃 같은거

## (답변)

좋은 절충안이지만, Access Token을 어디에 두느냐를 먼저 정해야 함.

## Access Token 보관 위치 문제

httpOnly 쿠키는 브라우저 JS가 읽을 수 없음. 토큰을 쿠키에만 두면 브라우저가 member-api를 직접 부를 때 `Authorization` 헤더를 붙일 방법이 없음. 따라서 아래 두 방안 중 하나를 선택해야 함.

## 안 A: 토큰을 역할별로 나누기

| 토큰 | 보관 위치 | 이유 |
|---|---|---|
| Refresh Token (14일) | httpOnly 쿠키. BFF만 접근 | 수명이 길어서 탈취 피해가 큼 |
| Access Token (30분) | 브라우저 메모리(JS 변수) | 짧게 살고 새로고침하면 사라짐 |

- BFF로 처리하는 것: 로그인, 로그아웃, 재발급. 이 셋만 Refresh Token을 다룸.
  - 로그인: Next 서버가 member-api 응답에서 Refresh Token은 쿠키로 심고, Access Token은 본문으로 브라우저에 내려줌.
  - 새로고침이나 만료: 브라우저가 BFF의 재발급 엔드포인트를 부르면, Next 서버가 쿠키의 Refresh Token으로 member-api를 호출해서 새 Access Token을 줌.
  - 로그아웃: Next 서버가 Refresh Token을 폐기하고 쿠키를 삭제.
- 직접 호출하는 것: 그 외 일반 API(블로그, 피드 등). 브라우저가 메모리의 Access Token으로 member-api를 직접 호출.
- 제약:
  - member-api에 CORS 설정이 필요함. 현재 있는지 확인되지 않음.
  - Access Token이 JS 메모리에 있어서 XSS가 나면 30분짜리 토큰은 노출될 수 있음. 14일짜리 Refresh Token은 보호됨.
  - 새로고침 때마다 재발급 호출이 한 번 필요함.
  - 재발급이 동시에 여러 번 나가지 않게 직렬화하는 일이 브라우저와 BFF 양쪽에서 필요함.

## 안 B: 토큰은 전부 쿠키, 일반 API도 서버에서 호출

서버 컴포넌트나 Server Action에서만 member-api를 호출하면 일반 API도 서버를 경유함. 사실상 전체 BFF라서 이번에 정한 "민감한 것만 BFF" 방향과는 다름.

## 추천과 확인할 점

- 안 A를 추천. "민감한 것만 BFF" 방향과 맞음. 다만 서버 컴포넌트에서 초기 데이터를 불러와야 하는 화면이 있다면 쿠키에 Access Token도 같이 둬야 해서 안 A로는 어려움.
- 확인할 점 1: member-api에 CORS 설정을 추가할 수 있는지. 안 A의 전제 조건이며, 백엔드 작업이 필요하면 순서를 plan에 넣어야 함.
- 확인할 점 2: 블로그나 피드 같은 일반 화면이 서버 컴포넌트에서 초기 렌더링 데이터를 가져올지, 클라이언트에서 불러와 그릴지. 전자가 많다면 안 A가 불편해질 수 있음.

---

# 추가1

- cors는 내가 api에 알아서 추가할게
- jwt secret은 api만 가지고 있어도 되나? 그럼 빼도 돼
- APP_ENV + env 폴더가 어떤 구성인지 설명좀
- http client는 Fetch로 
- api 호출 함수에 access 토큰 만료시 갱신 로직 포함

---

# 추가1 확인

> 추가1 확인

## (답변)

추가1에 적힌 다섯 항목을 정리하고, `APP_ENV` + `env/` 폴더 구성을 설명함. 안 A로 확정됨.

## 추가1 항목 정리

| 항목 | 결정/상태 |
|---|---|
| CORS | 직접 member-api에 추가. 프론트 쪽 선행 조건은 해결된 것으로 봄. |
| JWT secret | 프론트에서 제거. member-api만 갖고 있으면 됨. 프론트는 서명 검증이 필요 없고 만료 시각은 응답의 `accessExpiresIn`으로 알 수 있음. `.env`에는 `MEMBER_API_BASE_URL`만 남음. |
| HTTP 클라이언트 | `fetch` 래퍼 |
| 토큰 갱신 | API 호출 함수에 Access Token 만료 시 갱신 로직 포함 |
| `APP_ENV` + `env` 폴더 | 아래에 설명 |

## APP_ENV + env 폴더 구성

Next.js는 `NODE_ENV`가 `development`, `production`, `test` 세 가지뿐이라 파일명만으로 local, dev, prod를 나눌 수 없음. 어느 환경인지는 `APP_ENV`로 직접 지정하고, 그 값에 맞는 파일을 읽는 방식.

```
choimory-dev-front/
├── env/
│   ├── .env.local     # 내 PC 개발용 (MEMBER_API_BASE_URL=http://localhost:8080)
│   ├── .env.dev       # 개발 서버용
│   └── .env.prod      # 운영 서버용
├── .env.example       # 키 목록만 있는 템플릿 (커밋)
└── ...
```

- 실행: `APP_ENV=dev next dev`처럼 환경을 지정하거나, `package.json`에 `dev:local`, `build:dev`, `build:prod` 같은 스크립트를 둠.
- 로딩: `next.config.ts`에서 `APP_ENV`를 읽고, `@next/env`의 `loadEnvConfig`로 `env/.env.{APP_ENV}`를 불러옴.
- 배포 환경: 서버나 컨테이너에서 환경변수를 직접 주입하면(`process.env`가 우선순위 1순위) 파일 없이도 동작.
- Git: `env/.env.*`는 커밋하지 않고(`.gitignore`로 제외), `.env.example`만 커밋.

더 간단한 대안은 `env/` 폴더 없이 Next 기본 규칙만 쓰는 방식. 로컬은 `.env.local`(또는 `.env.development`), 운영은 `.env.production`을 쓰고, dev 서버는 배포 시 환경변수를 직접 주입. 파일이 줄어드는 대신 dev/prod를 파일로 구분하지 못함. 배포 방식이 환경변수 주입(choimory-dev-manifests 등)이라면 이쪽이 더 단순할 수 있어서, 배포 방식 확인 후 결정.

## 토큰 갱신 로직 (API 호출 함수에 포함)

안 A 기준 동작.

1. 호출 직전에 Access Token 만료 시각을 확인. 응답의 `accessExpiresIn`으로 계산한 만료 시각을 메모리에 같이 보관하고, 만료 임박(예: 30초 전)이면 먼저 갱신.
2. 호출했는데 401 `TOKEN_EXPIRED`가 오면 갱신한 뒤 원 요청을 1회만 재시도.
3. 갱신은 BFF의 재발급 엔드포인트를 호출. Refresh Token은 쿠키에 있으므로 브라우저는 신경 쓰지 않음.
4. 동시 호출을 직렬화. 여러 요청이 동시에 만료를 만나면 갱신 요청은 하나만 보내고 나머지는 그 결과를 기다림. Refresh Token이 1회용이라 필수.
5. 갱신도 실패하면(Refresh Token 만료 등) 메모리 토큰을 비우고 로그인 화면으로 보냄.

갱신 로직이 들어가는 `apiClient`는 브라우저에서 호출하는 클라이언트용. BFF(서버 쪽)의 member-api 호출은 쿠키로 토큰을 다루는 별도 경로라서, `apiClient`를 브라우저용과 서버용으로 나눌지 한 곳에서 환경별로 분기할지는 구현 단계에서 결정.

## 남은 결정

1. 환경 분리: `env/` 폴더 방식으로 할지, Next 기본 규칙에 환경변수 주입으로 할지. (배포 방식 확인)
2. 일반 화면의 초기 데이터: 클라이언트에서 불러와 그리는 방식이 기본이고, 공개 데이터만 서버 컴포넌트에서 가져오는 걸로 갈지.
3. 1차 연동 범위: 로그인, 회원가입, 로그아웃, 재발급. 