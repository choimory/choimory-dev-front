# 목차

- [작업 완료 요약](#작업-완료-요약)
  - [시작 문제와 결론](#시작-문제와-결론)
  - [단계별 결과](#단계별-결과)
  - [최종 동작](#최종-동작)
  - [검증 현황](#검증-현황)
  - [작업 방식](#작업-방식)
  - [남은 것과 후속 후보](#남은-것과-후속-후보)
  - [참고 문서](#참고-문서)

---

# 작업 완료 요약

## 시작 문제와 결론

- 시작 문제: 로그인하면 토큰이 저장되고 로그인 버튼이 로그아웃 버튼으로 바뀌어야 하는데, 로컬에서는 되고 stg, prod에서는 안 된다고 알려졌다.
- 결론: 환경 차이가 아니라 코드 문제였다. 로그인 상태를 화면에 반영하는 코드가 없었고, 버튼은 `?auth=member` 쿼리 목업으로만 바뀌었다. 로컬에서도 같은 현상이었고, local과 stg에서 테스트 계정으로 확인했다.
- 분석 과정에서 쿠키 `secure` 옵션, API 주소 환경변수 같은 환경 차이 후보는 배제했다. (로그인 API와 쿠키 저장은 두 환경에서 모두 정상)
- 이 문제에서 출발해 비로그인 사용자의 보호 화면 접근 제한과 서버 토큰 검증까지 작업이 확장됐다.

## 단계별 결과

1. 원인 분석 (plan1)
   - 코드와 브라우저로 로그인 API, 쿠키(httpOnly라 `reissue` 200으로 확인), 화면 상태를 확인했다.
2. 목업 제거와 실제 인증 연동 (task1)
   - `AuthProvider`와 `useAuth`를 만들어 마운트 때 `restoreSession`으로 로그인 상태를 복원한다. 복원 중은 화면 구분용으로 guest 취급.
   - `?auth=member` 목업(`shared/model/mockAuth.ts`)을 제거하고 Container 14개와 `page.tsx` 17개를 실제 상태로 바꿨다.
   - 로그아웃은 링크에서 버튼으로 바꿔 `authApi.logout()` 후 홈으로 이동한다.
3. 로그인 필요 화면 접근 제한, 1단계: 클라이언트 가드 (plan2, task2)
   - `RequireAuth`로 비로그인이면 로그인 화면으로 보낸다. `/me` 상단바가 항상 `로그아웃`으로 나오던 버그도 수정했다.
   - 보호 화면에서 로그아웃하면 가드의 로그인 이동과 홈 이동이 경쟁해 결과가 불안정했고, 로그아웃 후 이동을 전체 페이지 이동(`hardNavigate`)으로 바꿔 해결했다.
4. `member-api` 연동 API (별도 저장소, Spring Boot)
   - `GET /v1/member/token/verify`(Access Token 검증), `GET /v1/member/me`(내정보 조회)를 에이전트(`claude-sonnet-5-5`)가 구현했다. JWT가 HS256(대칭키)이라 프론트는 서명을 직접 검증할 수 없고 서버 호출이 필요함을 확인했다.
   - local에서 재기동한 서버로 유효, 위조, 토큰 없음, Refresh Token, 로그아웃 후 토큰의 응답과 응답 필드(비밀번호 계열 없음)를 확인했다.
5. 로그인 필요 화면 접근 제한, 2단계: 서버 프록시 검증 (plan3, task3)
   - `src/proxy.ts`가 보호 경로 8개에서 `access_token` 쿠키를 `member-api` verify로 검증한다. 만료는 `session_hint` 쿠키로 통과시켜 클라이언트가 자동 갱신하고, 위조와 블랙리스트는 `/login`으로 보낸다. `member-api` 장애는 fail-closed.
   - BFF가 `access_token`, `session_hint` 쿠키를 로그인과 재발급에서 설정하고 로그아웃과 재발급 실패에서 지운다.
   - 로그인 후 원래 페이지로 돌아오도록 `/login?next=`를 붙이고, 서버에서 내부 경로만 허용해 오픈 리다이렉트를 막는다.
   - `codex/gpt-6.2-sol` 에이전트 3개를 병렬로 투입했다. (BFF 쿠키, 프록시, 가드 확대)
6. 로그인 후 이동 실패 수정 (task4)
   - 비로그인으로 `내 정보`를 눌러 로그인 화면으로 간 뒤 로그인하면 화면에 머무는 버그를 발견했다. 클라이언트 라우터가 프록시 리다이렉트 결과를 캐시하고 `router.push`가 그 캐시를 재사용한 것이 원인이었고, 로그인 후 이동도 `hardNavigate`로 바꿔 해결했다.

## 최종 동작

- 로그인 상태는 실제 로그인과 토큰으로 판단한다. 새로고침해도 쿠키로 복원되어 유지된다.
- 보호 경로 8개(`/me`, `/blog/me`, `/blog/following`, `/feed/me`, `/feed/me/targets/*`, `/feed/observations`, `/feed/observations/*`, `/feed/activities/*`)는 비로그인이면 `/login?next=<경로>`로 이동하고, 로그인하면 원래 페이지로 돌아온다.
- 공개 페이지의 `로그인` 버튼으로 로그인해도 그 페이지로 돌아온다.
- Access Token 만료는 자동 갱신되고, Refresh Token(14일)이 만료되면 서버가 로그인 화면으로 보낸다.
- 로그아웃은 쿠키 세 개(`refresh_token`, `access_token`, `session_hint`)를 모두 지우고 홈으로 이동한다.
- 화면 접근 제어는 UX 용도이며, 실제 데이터 보호는 API의 토큰 검증이 맡는다.

## 검증 현황

- 자동 검증: `tsc` 에러 없음, `eslint`(`src`, `tests`) 에러와 경고 0건, `vitest` 102개 파일 668건 통과
- `curl`(local 서버)로 프록시의 모든 분기(쿠키 없음, 유효, 위조, 블랙리스트, hint만 있음, 프리페치, 공개 경로)와 BFF 쿠키 설정, 삭제를 확인했다.
- 브라우저(paseo, `localhost:3000`, 테스트 계정)로 로그인과 복원, 보호 경로 접근과 이동, `next` 복귀, 외부 주소 `next` 차단, 로그아웃 이동, 로그인 후 이동 버그의 재발 여부를 확인했다.
- 확인하지 못한 것: stg와 prod(배포 전), `TOKEN_EXPIRED` 실제 서버 응답(30분 대기 필요, 단위 테스트로만 확인), 만료 후 자동 갱신의 브라우저 확인(httpOnly 쿠키), production 빌드의 프리페치 동작

## 작업 방식

- 원인 분석과 설계는 plan1~3에서 선택지와 추천안을 대화로 정하고 기록했다.
- 구현은 영역이 나뉘는 곳에서 `codex/gpt-6.2-sol` 에이전트를 병렬로 썼다. task1에서는 blog, feed(생성 호출 하나는 권한 분류기에 거부되어 메인이 직접 처리), task3에서는 BFF 쿠키, 프록시, 가드 확대 영역이다.
- `member-api`는 별도 워크스페이스에서 `claude-sonnet-5-5` 에이전트가 계획부터 세우고 구현했다.
- 에이전트의 보고를 그대로 믿지 않고 코드 diff를 읽고, 전체 `tsc`, `eslint`, 테스트와 실서버 호출로 직접 확인했다.
- 작업 중 실수와 정정은 task 문서에 남겼다. (`LoginContainer` 덮어쓰기로 `return`이 빠졌다가 복구한 것, 표시용 쿠키 방식이 위조 가능해 폐기한 것 등)

## 남은 것과 후속 후보

- stg와 prod 배포 후 같은 흐름 확인. 특히 쿠키 `secure` 속성, 서버 간 `MEMBER_API_BASE_URL` 호출 경로, production 빌드의 `내 정보` 클릭 후 로그인 흐름. (배포는 메인이 진행하지 않았다.)
- 커밋: 프론트와 `member-api` 변경이 모두 커밋되지 않았다. 사용자가 지시한다.
- 테스트 계정 `tokentest01@example.com`이 local과 stg DB에 남아 있다. (비밀번호는 문서에 적지 않음)
- 후속 후보
  - 로그인과 회원가입 사이에서 `next` 유지
  - 로그인 후 새로고침 없이 이동하는 방법 (클라이언트 이동과 캐시 무효화)
  - 프록시의 verify 호출이 부담되면 짧은 인메모리 캐시
  - `/blog/following`, `/feed/observations`, `/feed/activities/[activityId]`가 로그인 전용이 맞는지 최종 확인 (공개로 빼려면 matcher와 `RequireAuth` 수정)
  - 보호 화면에 실제 데이터를 붙일 때 `member-api`의 해당 엔드포인트에 인증이 걸려 있는지 확인
  - 프론트의 내정보 조회 연동(`GET /v1/member/me`)
- `README.md`는 목차가 없다. (`.agents/rules/readme.md`는 모든 README에 목차를 쓰라고 한다.) 이번 작업과 별개로 추가가 필요하다.

## 참고 문서

- 분석과 결정: `plan1.md`(원인 분석), `plan2.md`(접근 제한 방식과 프록시 논의), `plan3.md`(프록시 서버 검증의 선택지, 결정, 구현 계획)
- 구현 기록: `task1.md`(목업 제거와 실제 인증 연동), `task2.md`(클라이언트 가드), `task3.md`(프록시 서버 검증), `task4.md`(로그인 후 이동 수정)
- `member-api` 쪽 기록: `choimory-dev-member-api/.agents/histories/2026/11/28/member-me-token-verify/`
- 반영한 설명: `README.md`의 "API 연동과 인증 > 로그인 상태와 화면 접근 제어"
