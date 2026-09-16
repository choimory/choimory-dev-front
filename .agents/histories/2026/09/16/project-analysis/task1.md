# 목차

- [개요](#개요)
- [Next 16 버전업 구현](#next-16-버전업-구현)
  - [작업 결과](#작업-결과)
  - [확정된 버전](#확정된-버전)
  - [단계별 수행 내용](#단계별-수행-내용)
    - [A. 사전 기준선 확보](#a-사전-기준선-확보)
    - [B. 코드모드 실행](#b-코드모드-실행)
    - [C. ESLint 버전 조정](#c-eslint-버전-조정)
    - [D. 설정 및 잔재 정리](#d-설정-및-잔재-정리)
    - [E. 검증](#e-검증)
  - [계획과 달라진 점](#계획과-달라진-점)
    - [코드모드가 설치한 ESLint 10이 동작하지 않음](#코드모드가-설치한-eslint-10이-동작하지-않음)
    - [코드모드가 .gitignore에 package-lock.json을 추가함](#코드모드가-gitignore에-package-lockjson을-추가함)
    - [업그레이드 전 기준선 빌드가 이미 실패 상태였음](#업그레이드-전-기준선-빌드가-이미-실패-상태였음)
    - [스테일 .next 캐시로 첫 빌드 실패](#스테일-next-캐시로-첫-빌드-실패)
  - [추가 처리한 잔여 2건](#추가-처리한-잔여-2건)
    - [viewport 경고 해소](#viewport-경고-해소)
    - [react-hooks/set-state-in-effect 에러 해소](#react-hooksset-state-in-effect-에러-해소)
  - [자동으로 수정된 파일](#자동으로-수정된-파일)
  - [변경 파일 목록](#변경-파일-목록)
  - [다음 단계로 넘긴 것](#다음-단계로-넘긴-것)

---

# 개요

- `plan2.md`에서 확정한 1단계(버전 정비) 실행 작업이다.
- Next.js를 `15.3.4` → `16.3.5`로 업그레이드하고, 함께 올릴 패키지 버전을 확정하며 lockfile을 생성하는 것이 목적이다.
- 작업 착수 시 `calendar.md`의 상태를 `PLAN` → `TASK`로 변경했다.
- 최초 지시는 "버전업만" 이었으나, 검증 과정에서 남은 2건(`viewport` 경고, `react-hooks/set-state-in-effect` 에러)을 추가 지시에 따라 함께 처리했다.
- 커밋과 푸시는 `.agents/rules/git.md` 규칙에 따라 진행하지 않았다.

---

# Next 16 버전업 구현

> 일단 버전업만 구현 시작

## 작업 결과

모든 검증을 통과했다.

| 검증 항목 | 결과 |
|---|---|
| `npx tsc --noEmit` | 통과 (exit 0) |
| `npx eslint .` | 통과 (exit 0, 0 problems) |
| `npm run build` | 통과, 8개 라우트 생성 |
| `npm run dev` + 7개 라우트 | 전부 HTTP 200, 렌더링 정상 |
| 개발 서버 로그 | 경고 및 오류 없음 |

성능 측면에서는 Turbopack이 기본 적용되어 빌드 컴파일 617ms, 개발 서버 기동 410ms를 기록했다.

## 확정된 버전

| 패키지 | 변경 전 | 변경 후 |
|---|---|---|
| next | 15.3.4 | 16.3.5 |
| react | ^19.0.0 (19.1.0) | 19.3.0 (고정) |
| react-dom | ^19.0.0 (19.1.0) | 19.3.0 (고정) |
| @types/react | ^19 (19.1.8) | 19.3.0 (고정) |
| @types/react-dom | ^19 (19.1.6) | 19.3.0 (고정) |
| eslint-config-next | 15.3.4 | 16.3.5 |
| eslint | ^9 (9.30.0) | 9.39.5 (고정) |
| @eslint/eslintrc | ^3 | 제거 |
| package-lock.json | 없음 | 신규 생성 (약 230KB) |

`package.json`에 `overrides` 항목이 추가되어 `@types/react`, `@types/react-dom`이 `19.3.0`으로 고정되었다.

`typescript(^5)`, `@types/node(^20)`, `tailwindcss(^4)`는 범위 지정을 유지했다. 계획 단계에서 검토했던 TypeScript 7 및 @types/node 22 상승은 변경 범위를 넓히지 않기 위해 이번 작업에서 제외했다.

## 단계별 수행 내용

### A. 사전 기준선 확보

업그레이드 전 `npm run build`를 실행하여 현재 상태를 확인했다. 결과는 실패였다. (상세 내용은 하단 "계획과 달라진 점" 참고)

### B. 코드모드 실행

```bash
npx @next/codemod@canary upgrade latest --yes --skip-adoption
```

- `--yes` : 대화형 프롬프트를 생략하여 자동화 환경에서 멈추지 않도록 한다.
- `--skip-adoption` : Cache Components, React Compiler 등 선택적 기능 도입 코드모드를 제외하고 버전 마이그레이션만 적용한다.

소스 변환 결과는 `middleware-to-proxy`, `remove-unstable-prefix`, `remove-experimental-ppr` 세 가지 모두 `13 unmodified`였다. `plan1.md`에서 대조한 대로 해당되는 코드가 존재하지 않음을 실제로 확인한 것이다.

코드모드가 수행한 실질적 변경은 다음과 같다.

- `package.json`의 의존성 버전 갱신
- `"lint": "next lint"` → `"lint": "eslint ."`
- `eslint.config.mjs`를 flat config 방식으로 재작성
- `@eslint/eslintrc` 의존성 제거
- `package-lock.json` 생성

### C. ESLint 버전 조정

코드모드가 설치한 ESLint 10이 동작하지 않아 9.39.5로 조정했다.

```bash
npm install --save-dev --save-exact eslint@9.39.5
```

### D. 설정 및 잔재 정리

**`eslint.config.mjs`** — 코드모드 결과물에 구 FlatCompat 방식의 `__filename`, `__dirname` 선언이 사용되지 않은 채 남아 `@typescript-eslint/no-unused-vars` 경고가 발생했다. 공식 문서 형식으로 정리했다.

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
```

**`.gitignore`** — 코드모드가 추가한 `package-lock.json` 항목을 제거했다.

### E. 검증

다음 순서로 검증했다.

1. `npx tsc --noEmit` → exit 0
2. `npx eslint .` → exit 0
3. `npm run build` → 8개 라우트 정상 생성
4. `npm run dev` 후 7개 라우트 HTTP 응답 확인 → 전부 200
5. `viewport` meta 태그 및 인증 타이머 초기값 렌더링 확인

## 계획과 달라진 점

### 코드모드가 설치한 ESLint 10이 동작하지 않음

`plan2.md`에서는 ESLint 9를 유지하기로 했으나, 코드모드가 `eslint@10.10.0`을 설치했다. 실행 결과 즉시 실패했다.

```
TypeError: Error while loading rule 'react/display-name':
contextOrFilename.getFilename is not a function
  at .../eslint-config-next/node_modules/eslint-plugin-react/lib/util/version.js
```

ESLint 10에서 제거된 `context.getFilename()`을 `eslint-config-next` 내부에 번들된 `eslint-plugin-react`가 여전히 호출하는 것이 원인이다.

`eslint-config-next@16.3.5`의 peerDependencies는 `eslint >=9.0.0`이라 10 설치 자체는 허용되지만 실제로는 동작하지 않는다. 계획대로 9 계열 최신인 9.39.5로 되돌려 해결했다.

### 코드모드가 .gitignore에 package-lock.json을 추가함

코드모드가 `.gitignore`에 `package-lock.json` 항목을 추가했다.

lockfile을 생성해 놓고 버전 관리 대상에서 제외하는 동작이므로, 재현 가능한 설치 환경 확보라는 이번 작업의 목적과 정반대다. 해당 줄을 제거하여 추적 대상으로 되돌렸다.

### 업그레이드 전 기준선 빌드가 이미 실패 상태였음

업그레이드 전 `npm run build`가 실패했다.

```
./src/app/page.tsx
5:8  Error: 'Image' is defined but never used.  @typescript-eslint/no-unused-vars
```

미사용 `Image` import가 원인이다. Next 16은 `next build`에서 린트를 실행하지 않으므로 업그레이드만 해도 이 오류는 사라지지만, 그 경우 "업그레이드로 문제가 해결되었다"는 잘못된 판단을 하게 된다.

따라서 해당 import를 먼저 제거하여 기준선을 정상 상태로 만든 뒤 업그레이드를 진행했다.

### 스테일 .next 캐시로 첫 빌드 실패

Next 16 업그레이드 후 첫 빌드가 아래 오류로 실패했다.

```
Error [PageNotFoundError]: Cannot find module for page: /main
Error: Failed to collect page data for /main
```

Next 15가 생성한 기존 `.next` 디렉토리가 Next 16의 변경된 출력 구조(`next dev`와 `next build`의 출력 디렉토리 분리)와 충돌한 것이 원인이다.

`.next`는 `.gitignore` 대상(`/.next/`)인 빌드 산출물이므로 삭제 후 재빌드하여 해결했다.

## 추가 처리한 잔여 2건

> 남은 두건도 처리하고 task1에 작성

### viewport 경고 해소

빌드 및 개발 서버 실행 시 아래 경고가 8건 발생했다.

```
⚠ Unsupported metadata viewport is configured in metadata export in /login.
  Please move it to viewport export instead.
```

`src/app/layout.tsx`에서 `metadata` 객체 내부에 있던 `viewport`를 별도 `export const viewport`로 분리했다.

```tsx
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "choimory-dev-front",
  description: "choimory-dev-front project",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
```

렌더링 결과가 기존과 동일한지 확인했다. 출력되는 meta 태그는 변경 전과 같다.

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
```

경고 8건이 모두 해소되었다.

### react-hooks/set-state-in-effect 에러 해소

업그레이드된 `react-hooks` 플러그인의 신규 규칙에 기존 인증 타이머 로직이 걸렸다.

```
src/app/signup/verify/page.tsx:19:7
error  Calling setState synchronously within an effect can trigger cascading renders
       react-hooks/set-state-in-effect
```

**원인**

`isTimerRunning`을 별도 상태로 관리하면서, effect 본문에서 잔여 시간이 0이 되는 시점에 `setIsTimerRunning(false)`와 `setError(...)`를 동기적으로 호출하고 있었다. 또한 `setInterval`이 `timeLeft` 변경마다 재생성되는 구조였다.

**해결**

`isTimerRunning`과 만료 메시지를 별도 상태로 두지 않고 잔여 시간에서 파생시켰다. effect 본문에서 `setState`를 직접 호출하는 부분이 사라진다.

```tsx
/** 인증 코드 유효 시간(초) */
const VERIFY_TIMEOUT_SECONDS = 180;

/** 인증 시간이 만료되었을 때 노출할 메시지 */
const EXPIRED_MESSAGE = '인증 시간이 만료되었습니다. 코드를 다시 요청해주세요.';

// ...

const [timeLeft, setTimeLeft] = useState(VERIFY_TIMEOUT_SECONDS); // 인증 코드 잔여 유효 시간(초)

// 타이머 동작 여부와 만료 메시지는 별도 상태로 두지 않고 잔여 시간에서 파생시킨다.
const isTimerRunning = timeLeft > 0;
const displayError = isTimerRunning ? error : EXPIRED_MESSAGE;

useEffect(() => {
  // 잔여 시간이 모두 소진된 경우 다음 타이머를 예약하지 않는다.
  if (timeLeft === 0) {
    return;
  }

  // 1초 뒤 잔여 시간을 1 감소시킨다.
  const timer = setTimeout(() => {
    setTimeLeft((prevTime) => prevTime - 1);
  }, 1000);

  return () => clearTimeout(timer);
}, [timeLeft]);
```

함께 변경한 부분은 다음과 같다.

- `handleSubmit` : 만료 시 `setError` 호출 없이 `return`만 수행 (메시지는 파생되므로 불필요)
- `handleResend` : `setIsTimerRunning(true)` 제거, `setTimeLeft(VERIFY_TIMEOUT_SECONDS)`로 재시작
- JSX : `{error && ...}` → `{displayError && ...}`
- 하드코딩되어 있던 `180`과 만료 메시지 문자열을 상수로 분리

**동작 보존 확인**

| 상황 | 변경 전 | 변경 후 |
|---|---|---|
| 초기 진입 | 03:00 표시, 메시지 없음 | 동일 |
| 검증 실패 | 입력 오류 메시지 표시 | 동일 |
| 시간 만료 | 만료 메시지 표시, 입력/버튼 비활성 | 동일 |
| 재전송 | 03:00으로 초기화, 메시지 제거 | 동일 |

개발 서버에서 타이머 초기값이 `03:00`으로 렌더링되는 것을 확인했다.

## 자동으로 수정된 파일

Next.js가 실행 과정에서 직접 수정한 파일들이다.

**`tsconfig.json`** (`next build`)

- `jsx` : `"preserve"` → `"react-jsx"` (Next 16 필수 변경)
- `include` : `.next/dev/types/**/*.ts` 추가
- 배열 항목이 여러 줄로 재포맷됨

**`next-env.d.ts`** (`next build`)

- `./.next/types/routes.d.ts`, `./.next/types/root-params.d.ts` import 추가

**`AGENTS.md`** (`next dev`)

- 파일 하단에 `<!-- BEGIN:nextjs-agent-rules -->` 관리 블록이 삽입되었다.
- 기존에 작성한 규칙은 그대로 유지되었고 아래에 추가되기만 했다.
- `plan2.md`에서 사전 고지한 내용이며, 삭제해도 `next dev` 실행 시 재생성된다.
- 비활성화가 필요하면 `next.config.ts`에 `agentRules: false`를 설정하면 된다.

## 변경 파일 목록

```
 M AGENTS.md                        ← next dev 자동 삽입
 M eslint.config.mjs                ← flat config 전환
 M next-env.d.ts                    ← next build 자동
 M package.json                     ← 의존성, lint 스크립트
 M src/app/layout.tsx               ← viewport 분리
 M src/app/page.tsx                 ← 미사용 Image import 제거
 M src/app/signup/verify/page.tsx   ← 타이머 로직 개선
 M tsconfig.json                    ← next build 자동
?? package-lock.json                ← 신규 생성
```

`.gitignore`는 코드모드 변경분을 되돌려 최종적으로 변경 없음 상태다.

`.agents/histories/calendar.md`(PLAN → TASK)와 `.agents/histories/2026/` 문서는 위 목록과 별개인 히스토리 문서다.

## 다음 단계로 넘긴 것

| 항목 | 넘긴 단계 | 사유 |
|---|---|---|
| `globals.css`의 `body { position: fixed }` | 3단계 디자인 | 실제 스크롤 동작에 영향을 주므로 레이아웃 재구성과 함께 처리 |
| `globals.css`의 `#__next` 셀렉터 | 3단계 디자인 | 위 항목과 같은 파일이므로 함께 처리 |
| `viewport`의 `userScalable: false` | 3단계 디자인 | 접근성 이슈이나 시각적 동작이 변경되므로 디자인 단계에서 검토 |
| `README2.md` 정리, `README.md` 갱신 | 2단계 이후 | 구조 변경 이후에 작성해야 중복 작업을 피할 수 있음 |
| TypeScript 7, @types/node 22 상승 | 별도 작업 | 이번 작업의 변경 범위를 넓히지 않기 위해 제외 |
