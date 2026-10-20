# 목차

- [개요](#개요)
- [작업 마무리](#작업-마무리)
  - [작업 요약](#작업-요약)
  - [주요 결정](#주요-결정)
  - [구현 결과](#구현-결과)
  - [검증 결과](#검증-결과)
  - [남은 일](#남은-일)

---

# 개요

- member-api(`choimory-dev-member-api`) 1차 연동 작업(로그인, 회원가입, 로그아웃, 토큰 재발급)을 마무리함
- 분석과 결정은 plan1.md, 구현 내용과 대화 기록은 task1.md 참고

---

# 작업 마무리

> 작업 마무리 해줘

## (답변)

## 작업 요약

- 환경변수를 local, dev, prod 세 가지로 나누는 구성(`APP_ENV` + `env/.env.*`)을 만들었음
- fetch 기반 공통 API 모듈과 Access Token 갱신 로직을 만들었음
- Refresh Token을 다루는 로그인, 로그아웃, 재발급만 Next 서버(BFF)로 처리하고, 나머지는 브라우저가 member-api를 직접 호출하는 구조를 적용함
- 로그인, 회원가입 화면을 실제 API에 연결함
- README.md에 환경 구성, 프로젝트 구조, API 연동과 인증, 테스트 규칙을 반영함

## 주요 결정

| 항목 | 결정 |
|---|---|
| 호출 구조 | 안 A. Refresh Token은 httpOnly 쿠키(BFF만 접근), Access Token은 브라우저 메모리. BFF는 로그인, 로그아웃, 재발급만 담당 |
| JWT secret | 프론트에서 제거. 서명 검증은 member-api만 수행 |
| 환경 분리 | `APP_ENV` + `env/.env.{local,dev,prod}`. 스크립트는 `dev`(local), `dev:dev`, `build:dev`, `build:prod`를 유지 |
| HTTP 클라이언트 | 새 의존성 없이 fetch 래퍼 |
| 토큰 갱신 | 호출 전 만료 임박 선갱신, `TOKEN_EXPIRED` 401 시 갱신 후 1회 재시도, 동시 갱신 직렬화 |
| CORS | 사용자가 member-api에 직접 추가 |
| 1차 범위 | 로그인, 회원가입, 로그아웃, 재발급. `/me` 연동은 회원 조회 API가 생긴 뒤로 미룸 |

## 구현 결과

- 환경 구성: `env/.env.*`(git 제외), `.env.example`, `next.config.ts`의 `APP_ENV` 로더, `shared/config/env.ts`
- 공통 API 모듈(`shared/api`): `apiTypes`, `httpClient`, `tokenStore`, `tokenRefresher`, `apiClient`, `bffResponse`
- BFF: `shared/auth/refreshCookie.ts`, `features/auth/server/authBff.ts`, `app/api/auth/{login,logout,reissue}/route.ts`
- auth 도메인: `authApi`, `useLogin`, `useSignup`, 로그인·회원가입 View와 Container 변경, 타입 추가
- 테스트: 새 테스트와 기존 테스트 수정, 공용 fixture `tests/fixtures/api.ts`

## 검증 결과

- Vitest 97개 파일 574개 테스트 통과, `tsc`와 `eslint` 오류 없음, `next build` 통과
- `APP_ENV=local`로 dev 서버를 띄워 실서버(8080)에 재발급(쿠키 없음) 401, 로그인(본문 오류) 400, 로그인(없는 계정) 401 전달, 로그아웃(쿠키 없음) 200을 확인함
- 로그인, 재발급, 로그아웃의 성공 경로는 실서버로 확인하지 못함 (로컬 DB에 테스트 회원이 필요). 단위 테스트에서는 member-api 응답을 모킹해 검증함

## 남은 일

- 테스트 계정을 만들어 실서버로 로그인, 재발급, 로그아웃 성공 경로 확인
- 브라우저 직접 호출(회원가입)은 member-api의 CORS 추가 후 확인
- `env/.env.dev`, `env/.env.prod`의 member-api 주소 입력
- `env/.env.*`를 git에서 푸는 문제는 저장소 공개 여부 확인 후 결정 (task1.md 참고)
- 상단바와 `/me`의 로그인 상태 표시를 `mockAuth`에서 실제 세션으로 교체 (회원 조회 API 필요)
- 보호 경로가 정해지면 `proxy.ts`로 낙관적 리다이렉트 추가
- Playwright(E2E)와 MSW(API 모킹 통합 테스트) 도입
- 커밋은 하지 않은 상태
