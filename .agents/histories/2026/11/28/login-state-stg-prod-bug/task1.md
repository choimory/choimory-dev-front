# 목차

- [개요](#개요)
- [구현 계약](#구현-계약)
- [작업 분담](#작업-분담)
- [검증](#검증)
- [구현 결과: 목업 제거와 실제 인증 연동](#구현-결과-목업-제거와-실제-인증-연동)
  - [답변](#답변)
  - [에이전트 진행](#에이전트-진행)
  - [변경 내용](#변경-내용)
  - [검증 결과](#검증-결과)
  - [남은 것](#남은-것)

---

# 개요

- plan1에서 확정한 결정(1-가, 2-가, 3-가)에 따라 `?auth=member` 목업을 제거하고 실제 로그인과 토큰으로 상단바 버튼과 페이지 내용을 전환한다.
- `isLoggedIn` prop 전달 구조는 유지한다. Container가 `useAuth()`로 실제 상태를 만들어 View와 상단바에 넘긴다.
- 복원 중(`loading`)은 guest로 취급한다.
- 하위 에이전트(`codex/gpt-6.2-sol`)를 영역별로 병렬 투입한다. 파일이 겹치지 않게 나눈다.

---

# 구현 계약

공통 기반은 메인이 먼저 만들었고, 에이전트는 이 API만 사용한다.

- `src/features/auth/context/AuthContext.tsx`: `AuthProvider`, `useAuth()`, `AuthContext`
  - `useAuth()`는 `{ state, authStatus, isLoggedIn, markLoggedIn, logout }`을 돌려준다.
  - `authStatus`는 `'member' | 'guest'`이며 복원 중(`loading`)은 `guest`다.
  - `AuthProvider` 밖에서는 항상 guest다.
- `src/app/layout.tsx`: `{children}`을 `AuthProvider`로 감싼다.
- `tests/fixtures/auth.tsx`: 테스트용 `createAuthWrapper(authStatus)`, `createAuthValue(...)`

Container 변경 규칙:

- 파일 맨 위에 `'use client';`를 추가한다.
- `authStatus` prop을 제거하고 `const { authStatus } = useAuth();`로 읽어 기존처럼 viewModel에 넣는다. 다른 prop(`postId`, `nickname` 등)은 그대로 둔다.
- `page.tsx`에서 `searchParams`, `getMockAuthStatus`, `PageSearchParams` import와 `authStatus` 전달을 제거한다. 다른 params(`params`)는 유지한다.
- Container 테스트는 `authStatus` prop 대신 `render(<Container />, { wrapper: createAuthWrapper('member') })`로 바꾼다.

---

# 작업 분담

| 담당 | 범위 |
|---|---|
| 메인 | `AuthContext`, `layout.tsx`, `tests/fixtures/auth.tsx`, `useLogin`, `TopBarActions`, `AppTopBar` 테스트, `AuthContext` 테스트, `mockAuth.ts`와 테스트 삭제, 최종 lint, test, 브라우저 확인 |
| 에이전트 A (platform) | `features/platform/container/*` 3개, `app/page.tsx`, `app/notice/page.tsx`, `app/services/page.tsx`, 관련 container 테스트 |
| 에이전트 B (blog) | `features/blog/container/*` 5개, `app/blog/**/page.tsx` 6개, 관련 container 테스트 |
| 에이전트 C (feed) | `features/feed/container/*` 6개, `app/feed/**/page.tsx` 8개, 관련 container 테스트 |

---

# 검증

- 에이전트: 자기 범위 테스트만 `npx vitest run <경로>`로 실행한다. 전체 lint와 test는 동시에 돌리면 겹치므로 메인이 한다.
- 메인: `npm run lint`, `npm run test:run`, `npx tsc --noEmit`
- local에서 paseo 브라우저로 로그인, 새로고침 후 유지, 로그아웃을 확인한다.


---

# 구현 결과: 목업 제거와 실제 인증 연동

> 추천대로 해주고 니가 필요한만큼 하위 에이전트 gpt sol 6.2 불러서 병렬 진행해줘

## 답변

plan1에서 확정한 추천안(1-가, 2-가, 3-가)대로 `?auth=member` 목업을 제거하고, 로그인 상태와 토큰으로 상단바 버튼과 페이지 내용을 전환했다. local에서 로그인, 새로고침 유지, 로그아웃이 모두 동작하는 것을 확인했다. stg와 prod는 배포 전이라 확인하지 못했다.

## 에이전트 진행

- 투입 모델: `codex/gpt-6.2-sol` (모드 `full-access`, 생각 수준 `medium`)
- blog 에이전트: Container 5개, `page.tsx` 6개, 테스트 5개 (파일 16개). 블로그 테스트 111건 통과.
- feed 에이전트: Container 6개, `page.tsx` 8개, 테스트 6개 (파일 20개). 피드 테스트 199건 통과.
- platform 에이전트: 생성 호출을 자동 권한 분류기가 거부했다. 거부된 호출은 우회하지 않았고, 범위가 작아 메인이 직접 처리했다. 같은 설정의 blog, feed 호출은 통과했다.
- 파일이 겹치지 않게 영역별로 나눴고, 에이전트에는 자기 범위의 테스트만 실행하게 했다. 전체 lint와 테스트는 메인이 마지막에 실행했다.
- 에이전트 결과는 보고만 믿지 않고, 남은 목업 참조(`getMockAuthStatus`, `PageSearchParams`, `mockAuth`)가 없는지와 범위 밖 파일 변경이 없는지를 `grep`과 `git status`로 직접 확인했다.

## 변경 내용

### 신규

- `src/features/auth/context/AuthContext.tsx`
  - `AuthProvider`, `useAuth()`, `AuthContext`
  - 상태는 `loading`, `member`, `guest`다. 마운트 때 `authApi.restoreSession()`으로 복원한다.
  - `authStatus`는 `loading`을 `guest`로 취급한다. `AuthProvider` 밖에서는 항상 `guest`다.
  - 복원 중에 로그인이 먼저 반영되면 복원 실패가 그 상태를 덮어쓰지 않는다.
  - `logout()`은 서버 처리가 실패해도 `guest`로 바꾼다.
- `tests/fixtures/auth.tsx`: `createAuthValue`, `createAuthWrapper`
- `tests/unit/features/auth/context/AuthContext.test.tsx`: 7개 케이스 (복원 성공, 복원 실패, 복원 중 guest, 복원 중 로그인 반영, 로그아웃, 로그아웃 실패, Provider 밖)

### 수정

- `src/app/layout.tsx`: `{children}`을 `AuthProvider`로 감쌌다.
- `src/features/auth/hooks/useLogin.ts`: 로그인 성공 시 `markLoggedIn()`을 호출한다.
- `src/shared/ui/TopBarActions.tsx`
  - 로그아웃을 링크에서 버튼으로 바꿨다. 클릭하면 `logout()`을 기다린 뒤 `router.push('/')`로 이동한다.
  - 로그인은 기존대로 `/login` 링크다.
- Container 14개 (platform 3, blog 5, feed 6): `'use client'`를 추가하고 `authStatus` prop을 없앴다. `useAuth()`로 읽어서 View에 넘긴다. `isLoggedIn` prop 전달 구조는 유지했다.
- `page.tsx` 17개: `searchParams`, `getMockAuthStatus`, `PageSearchParams`를 제거했다. 동적 라우트의 `params` 처리는 그대로 두었다.
- `vitest.setup.ts`: 라우터가 마운트되지 않은 테스트에서도 `useRouter`를 쓸 수 있게 `next/navigation`을 공통으로 대체했다. 개별 테스트가 다시 mock하면 그 값이 우선한다.

### 삭제

- `src/shared/model/mockAuth.ts`
- `tests/unit/shared/model/mockAuth.test.ts`

### 테스트 수정

- Container 테스트 14개: `authStatus` prop 대신 `createAuthWrapper('member')` 방식으로 바꿨다.
- `link '로그아웃'` 조회를 `button '로그아웃'`으로 일괄 변경했다. (View와 Container 테스트 다수)
- `TopBarActions.test.tsx`: 로그아웃 클릭 시 홈으로 이동하는지, 서버 로그아웃이 오래 걸려도 완료 뒤에 이동하는지 추가했다.
- `LoginContainer.test.tsx`: 로그인 성공 시 `markLoggedIn`이 호출되는지 추가했다.

## 검증 결과

- `npx tsc --noEmit`: 통과
- `npx vitest run`: 97개 파일, 578건 모두 통과
- `npm run lint`: 에러 15건이 남아 있지만 모두 `.agents/skills/design-taste-frontend/assets/`의 외부 스킬 파일(`fx.js`, `photo.js`)에서 나온다. `src`와 `tests`는 에러가 없다.
- local 브라우저 확인 (paseo, `localhost:3000`, 테스트 계정)

| 시나리오 | 결과 |
|---|---|
| 로그인 직후 (새로고침 없음) | `/`로 이동, `로그아웃` 버튼, `내 서비스 피드` 표시 |
| 새로고침 | 쿠키로 복원되어 `로그아웃`과 회원 피드 유지 |
| 로그아웃 클릭 | `로그인` 버튼으로 복귀, 회원 피드 사라짐, `/api/auth/reissue`가 401 |

## 남은 것

- stg 확인: 배포(`stg` 브랜치 수동 실행) 후 같은 흐름을 확인한다. 배포는 메인이 진행하지 않는다.
- `README.md:239`의 목업(`?auth=member`) 설명을 실제 동작에 맞게 고친다. (마무리할 때)
- 후속 작업 후보
  - `isLoggedIn` prop 제거 (TopBarActions가 `useAuth()`를 직접 읽도록)
  - 복원 중 guest 화면 깜빡임을 스켈레톤으로 개선
  - 로그인 사용자 정보 표시, 보호 페이지 접근 제한
- 테스트 계정 `tokentest01@example.com`이 local과 stg DB에 남아 있다. (비밀번호는 문서에 적지 않음)
- `done1.md`와 calendar의 `DONE` 전환은 마무리를 요청받았을 때 한다.
