# 목차

- [개요](#개요)
- [Next 16 업그레이드 분석 및 작업 계획](#next-16-업그레이드-분석-및-작업-계획)
  - [답변](#답변)
  - [확정할 버전](#확정할-버전)
    - [TypeScript를 5.9로 유지하는 이유](#typescript를-59로-유지하는-이유)
    - [ESLint를 9로 유지하는 이유](#eslint를-9로-유지하는-이유)
  - [실제로 수정될 파일](#실제로-수정될-파일)
    - [eslint.config.mjs 변경 형태](#eslintconfigmjs-변경-형태)
  - [작업 계획](#작업-계획)
    - [A. 사전 기준선 확보](#a-사전-기준선-확보)
    - [B. 코드모드 실행](#b-코드모드-실행)
    - [C. 버전 확정 및 lockfile 생성](#c-버전-확정-및-lockfile-생성)
    - [D. 설정 및 잔재 정리](#d-설정-및-잔재-정리)
    - [E. 검증](#e-검증)
  - [이번 단계에서 제외할 것](#이번-단계에서-제외할-것)
  - [알아둘 것](#알아둘-것)

---

# 개요

- `plan1.md`에서 논의한 3단계 작업(버전 정비 → 구조 재편 → 디자인 정돈) 중 **1단계인 버전 정비**의 실행 계획을 작성한다.
- Next.js 버전은 **16.3.5(최신)** 로 올리는 것으로 확정되었다.
- 확정 근거는 `plan1.md`의 "Next 16 업그레이드 필요성" 항목 참고. 요약하면 breaking change 해당분이 `next lint` 하나뿐이라 지금이 마이그레이션 비용이 가장 낮은 시점이다.
- 본 문서에서는 올릴 패키지 버전을 확정하고, 실제로 수정될 파일과 작업 순서, 이번 단계에서 제외할 범위를 정리한다.
- 아직 작업 착수 전이며, 계획 확정 후 진행한다.

---

# Next 16 업그레이드 분석 및 작업 계획

> 일단 16으로 올리자 분석하고 작업계획 말해봐

## 답변

Next 16.3.5로 확정하고, 함께 올릴 패키지 버전과 수정 대상 파일을 확정했다.

breaking change 해당분이 `next lint` 하나뿐이라 소스 코드는 거의 건드리지 않으며, 실제 수정 대상은 총 6개 파일이다.

## 확정할 버전

| 패키지 | 현재 | 올릴 버전 | 판단 |
|---|---|---|---|
| next | 15.3.4 | 16.3.5 | 확정 |
| react / react-dom | 19.1.0 | 19.3.0 | 확정 |
| @types/react, @types/react-dom | 19.1.x | 19.3.0 | react와 동반 |
| @types/node | 20.19.2 | 22.x | 로컬 Node가 v22.17.0이라 맞춤 |
| eslint-config-next | 15.3.4 | 16.3.5 | next와 동반 |
| tailwindcss / @tailwindcss/postcss | 4.1.11 | 4.3.3 | 마이너 |
| typescript | 5.8.3 | 5.9.3 | 하단 사유 참고 |
| eslint | 9.30.0 | 9.x 유지 | 하단 사유 참고 |
| @eslint/eslintrc | ^3 | 제거 | FlatCompat 불필요 |

### TypeScript를 5.9로 유지하는 이유

TypeScript 최신 버전은 `7.0.2`이나 이번 작업에서는 올리지 않는다.

TS 7은 네이티브 포팅 메이저 버전이라 함께 진행하면 문제 발생 시 실패 원인이 섞인다. Next 16의 TypeScript 요구사항은 `>=5.1.0`이므로 5.9.3으로 충분하다. TS 7 전환은 별도 작업으로 다룬다.

### ESLint를 9로 유지하는 이유

ESLint 최신 버전은 `10.10.0`이고 `eslint-config-next@16.3.5`의 peerDependencies가 `eslint >=9.0.0`이므로 10도 설치 가능하다.

다만 같은 이유로 이번 작업의 변경 범위를 넓히지 않는다. Next 16에서 필요한 것은 ESLint 버전 상승이 아니라 **flat config 전환**이며, 이는 현재 설치된 9.30.0에서도 가능하다.

## 실제로 수정될 파일

`plan1.md`에서 대조한 대로 breaking change 해당분은 `next lint` 하나뿐이므로, 소스 코드 변경은 최소 수준이다.

| 파일 | 변경 내용 |
|---|---|
| `package.json` | 의존성 버전 정리, `"lint": "next lint"` → `"eslint ."` |
| `package-lock.json` | 신규 생성 |
| `eslint.config.mjs` | FlatCompat 방식 → flat config 방식 전면 교체 |
| `src/app/layout.tsx` | `metadata` 내부의 `viewport` → 별도 `export const viewport`로 분리 |
| `src/app/page.tsx` | 미사용 `Image` import 제거 |
| `src/app/globals.css` | 죽은 `#__next` 셀렉터 제거 |

### eslint.config.mjs 변경 형태

공식 문서 기준으로 아래 형태가 된다.

```js
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])
```

## 작업 계획

### A. 사전 기준선 확보

업그레이드 **전에** `npm run build`를 실행하여 현재 빌드가 통과하는지 먼저 확인한다.

이 과정이 없으면 업그레이드 후 빌드가 실패했을 때 기존에 깨져 있던 것인지 업그레이드로 인한 것인지 구분할 수 없다.

### B. 코드모드 실행

```bash
npx @next/codemod@canary upgrade latest
```

이 프로젝트에서 실제로 동작하는 것은 `next lint` → ESLint CLI 이전 한 가지다. 나머지 항목(proxy 전환, `unstable_` 접두사 제거, PPR 제거)은 해당분이 없어 통과한다.

코드모드가 생성한 diff를 먼저 검토한 후 다음 단계로 진행한다.

### C. 버전 확정 및 lockfile 생성

- 위 표대로 `package.json`을 정리하고 설치하여 `package-lock.json`을 생성한다.
- `@eslint/eslintrc`를 의존성에서 제거한다.
- `dev` / `build` 스크립트의 `--turbopack` 플래그는 Next 16에서 기본값이므로 추가하지 않는다.

### D. 설정 및 잔재 정리

- `eslint.config.mjs` 교체
- `layout.tsx`의 `viewport` 분리
- `page.tsx`의 미사용 import 제거
- `globals.css`의 `#__next` 제거

### E. 검증

아래 순서로 검증한다.

1. `npx tsc --noEmit`
2. `npx eslint .`
3. `npm run build`
4. `npm run dev` 실행 후 7개 라우트 직접 확인
   - `/`, `/login`, `/signup`, `/signup/verify`, `/signup/welcome`, `/home`, `/main`

## 이번 단계에서 제외할 것

- **`body { position: fixed }` 정리** — 죽은 코드인 `#__next`와 달리 실제 스크롤 동작에 영향을 준다. 레이아웃을 새로 잡는 3단계 디자인 작업에서 함께 처리하는 것이 안전하다.
- **`README2.md` 정리 및 `README.md` 갱신** — 구조가 변경된 이후에 작성해야 중복 작업을 피할 수 있다. 2단계 구조 재편 이후로 미룬다.
- **`layout.tsx`의 `user-scalable=no`** — 접근성 이슈이나 시각적 동작이 변경되므로 디자인 단계에서 함께 검토한다.

## 알아둘 것

- `next dev`를 처음 실행하는 시점에 `AGENTS.md`에 `nextjs-agent-rules` 관리 블록이 자동으로 삽입된다. 기존 규칙을 덮어쓰지는 않으나 파일은 수정되며, 삭제해도 재생성되므로 그대로 두는 것을 권장한다.
- 커스텀 webpack 설정이 없으므로 Turbopack 기본화로 인한 빌드 실패 가능성은 없다.
- `.gitignore`가 `/.next/`를 포함하고 있어 Next 16의 `.next/dev` 디렉토리 분리도 문제되지 않는다.
- `.agents/rules/git.md` 규칙에 따라 커밋과 푸시는 진행하지 않는다. 작업 후 diff만 보고한다.
- 현재 git tree가 clean한 상태이므로 문제 발생 시 `git checkout .`으로 되돌릴 수 있다.
