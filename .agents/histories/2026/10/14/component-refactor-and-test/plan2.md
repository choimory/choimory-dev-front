# 목차

- [개요](#개요)
- [테스트 코드 디렉토리 분리](#테스트-코드-디렉토리-분리)
  - [제안 구조](#제안-구조)
  - [이 구조를 추천하는 이유](#이-구조를-추천하는-이유)
  - [바꿀 작업](#바꿀-작업)
  - [확인이 필요한 사항](#확인이-필요한-사항)

---

# 개요

- plan1의 작업계획 3단계(테스트 환경 구축)까지 진행한 뒤, 테스트 코드의 위치를 다시 정하는 내용이다.
- 앞서 plan1에서는 테스트 파일을 대상 파일 옆에 두는 colocation으로 정했고(`추가2`), "나중에 별로다 싶으면 별도 테스트 디렉토리로 옮기자"는 단서를 달았다.
- 3단계에서 샘플 테스트 2개(`Card.test.tsx`, `ListRow.test.tsx`)를 `src/shared/ui/`에 colocation으로 만들었으며, 이를 별도 디렉토리로 옮기는 계획이다.

---

# 테스트 코드 디렉토리 분리

> test코드는 별도 디렉토리로 옮기자

## 답변

위치를 정하는 것만 확인하고 진행하기로 했다. 프로젝트 루트에 `tests/`를 두고, 안쪽은 `src/`와 같은 경로로 미러링하는 구조를 제안한다.

## 제안 구조

```
tests/
  unit/                      ← Vitest (단위 + RTL 컴포넌트)
    shared/ui/Card.test.tsx
    shared/ui/ListRow.test.tsx
    features/feed/model/feedTargetView.test.ts
    features/blog/components/BlogPostCard.test.tsx
    ...
  e2e/                       ← Playwright (나중에, 지금은 만들지 않음)
```

- 테스트에서는 `@/shared/ui/Card`처럼 기존 경로 별칭으로 import한다. 상대 경로는 필요 없다.

## 이 구조를 추천하는 이유

- `src/` 안에 `__tests__`를 두는 방식보다 루트 `tests/`를 추천한다.
- 나중에 Playwright E2E를 `tests/e2e/`에 같은 위치로 둘 수 있다.
- `src/`에는 앱 코드만 남는다.
- `src/`와 같은 경로로 미러링하면 대상 파일에서 테스트 파일을 바로 찾을 수 있다.

## 바꿀 작업

1. `src/shared/ui/Card.test.tsx`, `ListRow.test.tsx`를 `tests/unit/shared/ui/`로 이동하고 import를 `./Card`에서 `@/shared/ui/Card`로 바꾼다.
2. `vitest.config.mts`의 `include`를 `tests/unit/**/*.test.{ts,tsx}`로 바꾼다. 설정 파일의 주석("대상 파일과 같은 위치에 둔다")도 함께 수정한다.
3. `tsc`, `lint`, `test:run`, `build`로 확인한다.

## 확인이 필요한 사항

- 위 구조(`tests/unit/`, 추후 `tests/e2e/`)로 진행할지, 다른 이름이나 구조로 할지 사용자 판단 대기.
- 구조가 확정되면 4단계(컴포넌트 테스트 작성)는 이 위치에 작성한다.
