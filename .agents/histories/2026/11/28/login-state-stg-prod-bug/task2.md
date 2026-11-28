# 목차

- [개요](#개요)
- [변경 계획](#변경-계획)
- [검증](#검증)
- [구현 결과: 프론트 로그인 가드 (1단계)](#구현-결과-프론트-로그인-가드-1단계)
  - [답변](#답변)
  - [변경 내용](#변경-내용)
  - [구현 중 발견한 문제](#구현-중-발견한-문제)
  - [검증 결과](#검증-결과)
  - [member-api 병행 작업 현황](#member-api-병행-작업-현황)
  - [남은 것](#남은-것)

---

# 개요

- plan2에서 확정한 1단계(프론트 클라이언트 가드)를 구현한다.
- 비로그인 사용자가 내 정보, 내 블로그, 내 피드 화면에 진입하면 `/login`으로 이동시키고, `/me` 상단바가 항상 `로그아웃`으로 나오는 버그를 고친다.
- 2단계(프록시 서버 검증)는 `member-api`에 검증용 엔드포인트가 생긴 뒤 task3에서 진행한다.
- 규모가 작아(컴포넌트 1개, Container 4개, View 1곳) 메인이 직접 구현한다.

---

# 변경 계획

1. `RequireAuth` 신규 (`src/features/auth/components/RequireAuth.tsx`)
   - `useAuth()`의 `state`가 `loading`이면 `null`, `guest`이면 `router.replace('/login')`을 한 번 호출하고 `null`, `member`이면 `children`을 보여준다.
2. `MeView`: `<AppTopBar isLoggedIn />` 하드코딩을 `isLoggedIn` prop으로 바꾼다.
3. 보호 Container 적용
   - `MeContainer`: `'use client'`, `useAuth()`로 `isLoggedIn`을 읽어 `MeView`에 넘기고 `RequireAuth`로 감싼다.
   - `BlogMeSettingsContainer`, `FeedTargetSettingsContainer`: `RequireAuth`로 감싼다.
   - `FeedMenuContainer`: `menuKind === 'me'`일 때만 `RequireAuth`로 감싼다. (`popular`, `observations`는 공개)
4. 테스트
   - 신규: `tests/unit/features/auth/components/RequireAuth.test.tsx`
   - 수정: `MeView`, `MeContainer`, `BlogMeSettingsContainer`, `FeedTargetSettingsContainer`, `FeedMenuContainer` 테스트 (guest는 `/login`으로 이동하고 내용이 안 보이는지, member는 보이는지)

---

# 검증

- `npx tsc --noEmit`, `npm run lint`, `npm run test:run`
- local에서 paseo 브라우저로 확인한다.
  - 비로그인으로 `/me`, `/blog/me`, `/feed/me`, `/feed/me/targets/*` 진입 시 `/login`으로 이동
  - 로그인 후 4개 경로 접근, 새로고침해도 `/login`으로 쫓겨나지 않는지
  - 보호 페이지에서 로그아웃하면 최종 도착지가 `/`인지
  - 공개 경로(`/feed/popular`, `/feed/observations`)는 비로그인으로도 열리는지


---

# 구현 결과: 프론트 로그인 가드 (1단계)

> 너도 해야할작업 시작해줘. 필요하면 gpt sol 6.2 에이전트 필요한만큼 생성해서 병렬작업해줘

## 답변

plan2에서 확정한 1단계(클라이언트 가드)를 구현했다. 비로그인 사용자가 내 정보, 내 블로그, 내 피드에 진입하면 `/login`으로 이동하고, `/me` 상단바가 항상 `로그아웃`으로 나오던 버그도 고쳤다. 규모가 작아(컴포넌트 1개, Container 4개, View 1곳) 프론트는 에이전트 없이 메인이 직접 구현했다. 병렬 에이전트는 `member-api` 작업에 투입했다.

## 변경 내용

### 신규

- `src/features/auth/components/RequireAuth.tsx`
  - `useAuth()`의 `state`가 `loading`이면 `null`(이동 없이 대기), `guest`이면 `router.replace('/login')` 호출 후 `null`, `member`이면 `children`을 보여준다.
  - 화면 접근을 막는 UX용 가드이며, 실제 데이터 보호는 API의 토큰 검증이 맡는다.
- `src/shared/navigation/hardNavigate.ts`: `window.location.assign(path)`를 감싼 전체 이동 함수
- `tests/unit/features/auth/components/RequireAuth.test.tsx`: member, loading, guest, Provider 밖, 복원 후 member 전환 5개 케이스

### 수정

- `MeView`: `<AppTopBar isLoggedIn />` 하드코딩을 `isLoggedIn` prop으로 바꿨다.
- `MeContainer`: `'use client'`, `useAuth()`로 `isLoggedIn`을 읽어 `MeView`에 넘기고 `RequireAuth`로 감쌌다.
- `BlogMeSettingsContainer`, `FeedTargetSettingsContainer`: `RequireAuth`로 감쌌다.
- `FeedMenuContainer`: `menuKind === 'me'`일 때만 `RequireAuth`로 감쌌다. `popular`, `observations`는 공개 화면이라 그대로 둔다.
- `TopBarActions`: 로그아웃 후 `router.push('/')` 대신 `hardNavigate('/')`로 전체 이동한다.

### 테스트 수정

- `MeView.test.tsx`: 모든 호출에 `isLoggedIn` prop 추가, 로그인 여부에 따른 상단바 버튼 케이스 추가
- `MeContainer`, `BlogMeSettingsContainer`, `FeedTargetSettingsContainer`, `FeedMenuContainer` 테스트: 비로그인이면 화면이 숨겨지고 `replace('/login')`이 호출되는지, 로그인이면 화면이 보이는지, 복원 중이면 이동하지 않는지, 공개 메뉴는 비로그인으로도 열리는지 확인
- `TopBarActions.test.tsx`: `hardNavigate`를 mock해서 로그아웃 뒤 `hardNavigate('/')`가 호출되는지 확인

## 구현 중 발견한 문제

- 현상: 보호 페이지에서 로그아웃하면 최종 도착지가 `/login`이 됐다.
- 원인: `logout()`이 상태를 `guest`로 바꾸면 가드가 `router.replace('/login')`을 호출하고, 이어서 `TopBarActions`가 `router.push('/')`를 호출해 두 클라이언트 이동이 경쟁했다. 결과가 호출 순서와 타이밍에 따라 달라질 수 있다.
- 해결: 로그아웃 후 이동을 `window.location.assign('/')` 전체 이동으로 바꿨다. 진행 중인 클라이언트 이동을 덮어쓰고, 메모리의 인증 상태도 함께 초기화된다. `apiClient`의 로그인 화면 이동(`redirectToLogin`)이 이미 같은 이유로 같은 방식을 쓴다.
- 대가: 로그아웃할 때 페이지가 한 번 새로고침된다.
- 한계: 수정 후 로그아웃을 브라우저에서 한 번만 확인했다. 경쟁이 완전히 사라졌는지를 반복 테스트로 확인한 것은 아니다.

## 검증 결과

- `npx tsc --noEmit`: 에러 없음
- `npx eslint src tests`: 에러 없음 (전체 `npm run lint`의 에러는 `.agents/skills/design-taste-frontend`의 외부 스킬 에셋에서만 나온다.)
- `npx vitest run`: 98개 파일, 589건 통과
- local 브라우저 확인 (paseo, `localhost:3000`, 테스트 계정)

| 시나리오 | 결과 |
|---|---|
| 비로그인으로 `/me`, `/blog/me`, `/feed/me`, `/feed/me/targets/target-keyboard` 진입 | 모두 `/login`으로 이동 |
| 비로그인으로 `/feed/popular`, `/feed/observations` 진입 | 이동 없이 열림, 상단바는 `로그인` |
| 로그인 후 위 4개 경로 새로고침 | 모두 유지, 상단바 `로그아웃`, `/me` 포함 |
| 보호 페이지(`/feed/me/targets/target-keyboard`)에서 로그아웃 | 최종 `/`, 상단바 `로그인`, `/api/auth/reissue` 401 |

## member-api 병행 작업 현황

- 에이전트: `claude-sonnet-5-5`, 워크스페이스 `choimory-dev-member-api`
- 계획 수립 단계(plan 모드)에서 확인된 사실
  - JWT 서명은 HS256(대칭키)이라 프론트가 서명을 직접 검증할 수 없다. 서버 호출 방식이 맞다.
  - 인증 필터가 서명, 만료, 종류, 블랙리스트를 모두 검증하고 `SecurityConfig`가 `anyRequest().authenticated()`라서 새 API 2개는 Security 설정 변경 없이 보호된다.
  - Access Token 30분, Refresh Token 14일. 실패 응답은 `401 TOKEN_EXPIRED`, `401 INVALID_TOKEN`, `401 UNAUTHORIZED`다.
- 제안된 API: `GET /v1/member/token/verify`(응답 `valid`, `memberId`, `expiresAt`, `expiresIn`), `GET /v1/member/me`(비밀번호 등 제외)
- 사용자 결정 5가지(응답 필드, 프로필 이미지 포함 여부, 삭제와 정지 회원 처리, OpenAPI 파일, 경로)와 Docker 사용 여부는 모두 에이전트의 추천안 기준으로 진행 중이며, 메인은 사용자에게서 별도 선택을 받지 못했다.
- 구현 승인은 메인이 하지 않았고 Paseo 화면에서 이뤄진 것으로 보인다. 에이전트는 `acceptEdits` 모드로 전환되어 histories 문서와 calendar(`TASK`)를 만들었고, 응답 DTO를 만드는 명령의 권한 승인을 기다리는 중이다.
- 메인이 그 권한을 승인하려 했으나 자동 권한 분류기가 거부했다. 우회하지 않았고 사용자가 Paseo 화면에서 직접 승인해야 한다.

## 남은 것

- `member-api` 쪽: 대기 중인 권한 승인, 결정 5가지와 Docker 사용 여부 확인, 구현과 테스트 완료 후 결과 확인
- 프론트 2단계(task3): `member-api` API가 완성된 뒤 진행한다.
  - Access Token을 쿠키에도 저장하고 `proxy.ts`에서 `member-api`에 검증을 요청한다.
  - 설계 이슈: Access Token은 30분이면 만료되는데 프록시는 Refresh Token 쿠키를 볼 수 없다(경로 `/api/auth`). 만료된 토큰(`401 TOKEN_EXPIRED`)을 프록시가 거부하면 로그인 후 30분이 지나 새로고침한 사용자도 `/login`으로 쫓겨난다. 프록시는 `TOKEN_EXPIRED`를 통과시켜 클라이언트 가드가 재발급하게 하는 방식 등을 plan으로 먼저 정리한다.
- stg와 prod는 배포 후 같은 흐름을 확인한다. (배포는 메인이 진행하지 않는다.)
- 테스트 계정 `tokentest01@example.com`이 local과 stg DB에 남아 있다. (비밀번호는 문서에 적지 않음)
- `/blog/following`, `/feed/observations`, `/feed/activities/[activityId]`를 보호 대상에 넣을지는 미정(기본 제외)이다.
- `README.md`의 `?auth=member` 설명과 보호 경로 안내는 마무리할 때 갱신한다. `done1.md`, `done2.md`와 calendar `DONE`도 마무리를 요청받았을 때 한다.
