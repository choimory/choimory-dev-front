# 목차

- [개요](#개요)
- [작업 요약](#작업-요약)
- [1단계 - 버전 정비](#1단계---버전-정비)
- [2단계 - 구조 재편](#2단계---구조-재편)
- [3단계 - 디자인 정돈 (일부)](#3단계---디자인-정돈-일부)
- [최종 결과](#최종-결과)
- [남겨둔 것](#남겨둔-것)

---

# 개요

- `plan1.md`에서 진행한 프로젝트 분석을 시작으로, 버전 정비 → 구조 재편 → 디자인 정돈(다크모드·globals.css) 순으로 진행한 작업 전체를 마무리한다.
- 상세 진행 내용은 `plan1~4.md`, `task1~3.md`에 기록되어 있다. 본 문서는 전체 작업의 최종 요약이다.
- 커밋과 푸시는 작업자가 직접 진행했다. (`.agents/rules/git.md`)

---

# 작업 요약

| 단계 | 내용 | 문서 |
|---|---|---|
| 분석 | 프로젝트 전체 구조·규칙 준수 여부 분석 | `plan1.md` |
| 1단계 | Next.js 15.3.4 → 16.3.5 버전업 | `plan2.md`, `task1.md` |
| 2단계 | `features` / `shared` 구조 재편 | `plan3.md`, `task2.md` |
| 3단계(일부) | 다크모드 토글, `globals.css` 정리 | `plan4.md`, `task3.md` |

색상 팔레트, 타이포, 레이아웃 등 시각적 톤에 대한 상세 논의는 다음 작업으로 이월한다.

---

# 1단계 - 버전 정비

Next.js를 15.3.4에서 16.3.5로 업그레이드했다. breaking change 전수 대조 결과 실제 해당분은 `next lint` 제거 하나뿐이었다.

- React 19.3.0, eslint-config-next 16.3.5로 동반 업그레이드
- ESLint는 10이 `eslint-config-next` 내부 플러그인과 호환되지 않아 9.39.5로 유지
- `package-lock.json` 신규 생성
- `viewport` 분리, `react-hooks/set-state-in-effect` 대응 등 부수 정리
- `next-env.d.ts`를 git 추적에서 제외 (Next.js 공식 권장)

---

# 2단계 - 구조 재편

`.agents/rules/front-end/code-convention-react.md` 규칙에 따라 `features` / `shared` 구조로 전면 재편했다.

- `shared/ui` 공통 컴포넌트 6종, `shared/utils` 1종
- `features/auth`, `features/user` 도메인별 api / model / hooks / container / components
- 6개 화면(`welcome`, `home`+`main` 통합, `login`, `signup`, `verify`, `/` 게이트)을 4계층으로 이관
- `/main` 삭제 (`/home`과 161줄 100% 중복이었음), `src/components/Header.tsx` 삭제
- `README.md`를 프로젝트 구조·아키텍처 기준으로 전면 재작성, `README2.md` 삭제

---

# 3단계 - 디자인 정돈 (일부)

다크모드 토글과 `globals.css` 정리만 우선 진행했다. 화면별 색상 팔레트 등 상세 논의는 다음으로 미뤘다.

- Tailwind v4의 `@custom-variant`로 `prefers-color-scheme` → `data-theme` 속성 전환. 기존 `dark:` 클래스 48개는 수정하지 않음
- 2단계 토글(라이트/다크), `AppHeader`에 배치
- `useSyncExternalStore` 기반 `useTheme` (`useAuthSession`과 동일 패턴)
- FOUC 방지를 위한 `layout.tsx` 인라인 스크립트
- `globals.css`의 죽은 셀렉터(`#__next`)와 `body { position: fixed }` 제거
- 배경색 4곳을 `bg-background` 토큰으로 전환. 나머지 44개 `dark:` 클래스는 이후 팔레트 설계 시 정리

작업자가 브라우저에서 토글 동작을 직접 확인했다.

---

# 최종 결과

| 항목 | 결과 |
|---|---|
| Next.js | 16.3.5 |
| React | 19.3.0 |
| 소스 파일 수 | 41개 (`src/**/*.ts`, `*.tsx`) |
| 소스 총 라인 수 | 2,053줄 |
| `npx tsc --noEmit` | 통과 |
| `npx eslint .` | 통과 |
| `npm run build` | 통과, 7개 라우트 |
| 라우트 응답 | 전부 200 |

---

# 남겨둔 것

- **화면별 디자인 상세 논의** — 색상 팔레트, 나머지 `dark:` 클래스 44개 토큰화, 타이포·레이아웃
- **인증 구현** — JWT + Redis 세션, `proxy.ts` 라우트 가드. `plan3.md`에 설계 방향(refresh는 httpOnly 쿠키, access는 메모리 보관)을 기록해 두었다
- **백엔드 연동** — `features/*/api`의 mock을 실제 API 호출로 교체. 교체 지점은 각 함수의 `TODO` 주석으로 표시되어 있다
- **미연결 동작** — 하단 네비게이션, 프로필 수정 버튼, 섹션 Action 버튼
