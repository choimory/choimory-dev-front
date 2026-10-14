# 목차

- [작업 개요](#작업-개요)
- [작업 결과 요약](#작업-결과-요약)
- [1단계 공용 컴포넌트 추출](#1단계-공용-컴포넌트-추출)
- [2단계 큰 파일 분리와 후속 정리](#2단계-큰-파일-분리와-후속-정리)
- [3단계 테스트 환경 구축](#3단계-테스트-환경-구축)
- [4단계 컴포넌트 테스트 작성](#4단계-컴포넌트-테스트-작성)
- [테스트 코드 주석](#테스트-코드-주석)
- [문서 반영](#문서-반영)
- [주요 결정과 이유](#주요-결정과-이유)
- [남은 사항](#남은-사항)
- [관련 문서](#관련-문서)

---

# 작업 개요

- 화면마다 개별 적용되어 있던 반복 UI를 공용 컴포넌트로 모으고, 한 파일에 여럿이던 컴포넌트를 분리했다.
- 테스트 코드가 하나도 없던 프로젝트에 Vitest와 React Testing Library 기반 테스트 환경을 만들고 모든 컴포넌트에 테스트를 작성했다.
- 테스트 코드에 `comment.md` 규칙에 맞는 주석을 추가했다.
- 진행 방식: 단계마다 멈춰서 사용자가 시각 차이를 직접 확인했고, 매 단계 `lint`, `tsc`, `build`(테스트 도입 후에는 `test:run` 포함)로 검증했다.

---

# 작업 결과 요약

| 구분 | 결과 |
|---|---|
| 공용 UI 컴포넌트 | 8종 신규 (`Card`, `Chip`, `IconBadge`, `SegmentedTabs`, `ListRow`, `IconButton`, `Button`, `Modal`) |
| 사용처 교체 | 약 112곳 (`Card` 26, `Chip` 7, `IconBadge` 12, `SegmentedTabs` 5, `ListRow` 14, `IconButton` 26, `Button` 16, `Modal` 6) |
| 파일 분리 | 큰 파일 6개에서 컴포넌트 22개를 별도 파일로 분리. 이제 한 파일에 컴포넌트가 둘 이상인 곳이 없다 |
| 중복 제거 | 4개 파일에 똑같이 있던 `getTarget*` 함수 3개를 `features/feed/model/feedTargetView.ts`로 통합 |
| 테스트 | 86개 파일, 496건 (`tests/unit/`) |
| 테스트 환경 | Vitest 5, jsdom, React Testing Library, jest-dom, user-event |
| 검증 | `npm run test:run`, `npx tsc --noEmit`, `npm run lint`, `npm run build` 모두 통과 |

---

# 1단계 공용 컴포넌트 추출

| 컴포넌트 | 위치 | 교체 수 |
|---|---|---|
| `Card` | `shared/ui/Card.tsx` | 26 |
| `Chip` | `shared/ui/Chip.tsx` | 7 |
| `IconBadge` | `shared/ui/IconBadge.tsx` | 12 |
| `SegmentedTabs` | `shared/ui/SegmentedTabs.tsx` | 5 |
| `ListRow` | `shared/ui/ListRow.tsx` | 14 |
| `IconButton` | `shared/ui/IconButton.tsx` | 26 |
| `Button` | `shared/ui/Button.tsx` | 16 |

- 클래스가 정확히 일치하는 곳만 교체해서 화면 모양은 유지했다.
- `Button`의 secondary 글자색을 `muted`로 통일해서 일부 버튼 글자가 약간 진해졌지만 사용자가 확인하고 허용했다.
- 상세는 task1.md를 참고한다.

---

# 2단계 큰 파일 분리와 후속 정리

- 공용 `Modal` 추출: `shared/ui/Modal.tsx`, 6곳 교체 (`BlogModalShell` 흡수). 항상 `document.body` 포털로 렌더링한다.
- 파일 분리: `BlogMeSettingsView`, `BlogMenuView`, `FeedMenuView`, `FeedTargetDetailView`, `FeedView`, `FeedTargetSettingsView`
- `feedTargetView.ts` 통합: 4벌이던 `getTargetTypeLabel`, `getTargetIconName`, `getTargetToneClassName`을 한 곳으로 모았다.
- Doc Comment 추가: 분리된 컴포넌트 등 22건
- 1단계에서 `sed`로 망가뜨린 `Card` 줄 들여쓰기(22줄)를 발견해 복구했다.
- 상세는 task2.md를 참고한다.

---

# 3단계 테스트 환경 구축

- 설치: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `@testing-library/jest-dom`, `@testing-library/user-event`
- `@types/node`를 `^20`에서 `^22`로 올렸다. Vitest 5가 `^22` 이상을 요구해서 `--force` 없이 해결했다.
- `vite-tsconfig-paths` 대신 Vite 내장 `resolve.tsconfigPaths`를 사용한다.
- 설정: `vitest.config.mts`, `vitest.setup.ts`, 스크립트 `test`(감시), `test:run`(1회)
- 테스트 위치: 처음에는 대상 파일 옆(colocation)이었다가 plan2.md의 제안에 따라 루트 `tests/unit/`(`src/`와 같은 경로로 미러링)와 `tests/fixtures/`로 옮겼다.
- 상세는 task3.md, plan2.md를 참고한다.

---

# 4단계 컴포넌트 테스트 작성

| 구분 | 파일 수 |
|---|---|
| `shared` (ui 18, model 1) | 19 |
| `auth` | 4 |
| `platform` | 10 |
| `me` | 3 |
| `blog` | 19 |
| `feed` | 31 |
| 합계 | 86 (496건) |

- `src/**/components`의 컴포넌트와 `shared/ui` 전부에 테스트가 있다.
- 쿼리는 접근성 기준(`getByRole`, `getByLabelText`)을 우선했고, 사용자 이벤트는 `user-event`로 시뮬레이션했다.
- jsdom에 없는 API(`scrollBy`, `URL.createObjectURL`)는 테스트 파일에서만 대체했고, `TopBarActions` 테스트에서는 `next/link`를 이동 없는 `a`로 대체했다.
- 테스트용 데이터는 `tests/fixtures/`(`platformServices`, `meViewModel`, `blog`, `feed`)에 모았다.
- 로직 없는 임시 데이터 상수(`authTypes.ts` 등)는 테스트하지 않았다.

---

# 테스트 코드 주석

- 방식: 수준 B로 진행했다. 파일 단위 Doc Comment와 단계가 이어지는 테스트의 한글 흐름 주석을 달고, 이름만으로 충분한 단순 테스트에는 달지 않았다.
- 범위: 86개 테스트 파일 전체
- 상세는 task4.md를 참고한다.

---

# 문서 반영

- README.md: 기술 스택(테스트), 실행 방법(`test`, `test:run`), 프로젝트 구조(`tests/`), 공용 UI 컴포넌트 표, 테스트 코드 규칙을 반영했다. 테스트 파일 주석 규칙은 사용자 판단에 따라 적지 않았다.
- calendar.md: `TASK`에서 `DONE`으로 변경했다.

---

# 주요 결정과 이유

| 결정 | 이유 |
|---|---|
| 추출 후 테스트 순서 | 사용자가 선택. 리팩토링 중 안전망이 없으므로 단계를 작게 나누고 단계마다 `build`로 확인했다 |
| 시각 차이는 사용자가 직접 확인 | 단계마다 변경 가능성이 있는 페이지 목록을 제공했다 |
| 테스트를 루트 `tests/`로 분리 | Playwright E2E를 `tests/e2e/`에 같은 구조로 둘 수 있고 `src/`에는 앱 코드만 남는다 |
| `isFullWidth` 미도입 | 가로 꽉 참 버튼 4개가 `grid` 안이라 `px-4`가 붙어도 차이가 없었다 |
| `MeSettingCard` 유지 | 내부만 `ListRow`로 바꿔 호출부 영향을 없앴다 |
| 옵션 선택 그룹은 `SegmentedTabs`로 합치지 않음 | `role="tab"`이 없는 옵션 그룹이라 접근성 의미가 달라진다 |
| 이번 테스트는 TDD가 아닌 사후 테스트 | 규칙은 TDD가 기본이지만 이미 구현된 코드가 대상이었다. 이후 신규 기능은 테스트를 먼저 작성한다 |

---

# 남은 사항

- MSW(API 모킹 통합 테스트)와 Playwright(E2E): 계획대로 이번 범위에서 제외했다. API 연동 후, E2E는 상황 보고 후 도입한다.
- `npm audit` 11건(심각 2, 높음 8, 보통 1): `next`, `tar`, `sharp`, `braces` 등 기존 의존성에서 나온 것이며 이번에 다루지 않았다.
- 인라인 props 타입: 분리한 컴포넌트 일부가 props를 함수 인자에 바로 정의한다. 규칙상 별도 `type`과 필드 주석이 필요하다.
- 중복 후보: `TargetPreviewLink`(`FeedView`)와 `TargetListLink`(`FeedMenuView`)는 구조가 거의 같다.
- 미분리 영역: `BlogMeSettingsView`의 옵션 선택 그룹 2곳은 `SegmentedTabs`와 다른 의미라 별도 컴포넌트(`OptionGroup` 등) 여부를 판단해야 한다.
- 교체하지 않은 버튼과 행: `MeView` 중복체크 버튼(`h-11`), "닫기" 텍스트 버튼 2개, 소형 버튼 2개, 반응형 버튼 등
- `src/app/layout.tsx`는 Next.js 기본 코드라 Doc Comment를 달지 않았다.
- 컨테이너 테스트는 실제 임시 데이터(`feedViewModel` 등)의 id에 의존한다. 임시 데이터가 바뀌면 함께 고쳐야 한다.
- `package-lock.json`은 `.gitignore`에 포함되어 있어 커밋되지 않는다. (기존 설정)

---

# 관련 문서

- plan1.md: 작업 개요, 현황 조사, 단계별 작업계획, 확인사항 결정
- plan2.md: 테스트 코드 디렉토리 분리 제안
- task1.md: 1단계 (공용 컴포넌트 추출)
- task2.md: 2단계 (큰 파일 분리, Doc Comment)
- task3.md: 3단계 (테스트 환경 구축)와 4단계 (컴포넌트 테스트 작성)
- task4.md: 테스트 코드 주석 추가
