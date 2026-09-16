# 목차

- [개요](#개요)
- [다크모드 토글 및 globals.css 정리 구현](#다크모드-토글-및-globalscss-정리-구현)
  - [답변](#답변)
  - [확정된 결정 사항](#확정된-결정-사항)
  - [생성 및 수정한 파일](#생성-및-수정한-파일)
  - [검증 결과](#검증-결과)
  - [생성된 CSS 확인](#생성된-css-확인)
  - [설계 판단 사항](#설계-판단-사항)
    - [테마 상태를 저장소가 아닌 document에서 읽는 이유](#테마-상태를-저장소가-아닌-document에서-읽는-이유)
    - [authSession 패턴 재사용](#authsession-패턴-재사용)
    - [토글 버튼의 배치 위치](#토글-버튼의-배치-위치)
    - [html lang 속성 변경](#html-lang-속성-변경)
  - [globals.css 정리 내용](#globalscss-정리-내용)
  - [범위에서 제외한 것](#범위에서-제외한-것)
  - [검증하지 못한 항목](#검증하지-못한-항목)

---

# 개요

- `plan4.md`에서 분석한 **다크모드 토글 추가**와 **`globals.css` 정리** 작업의 실행 기록이다.
- `plan1.md`에서 정한 전체 3단계 중 3단계(디자인 정돈)의 일부에 해당한다.
- 1단계 버전 정비는 `task1.md`, 2단계 구조 재편은 `task2.md`로 완료되었다.
- 색상 팔레트, 타이포, 레이아웃 등 시각적 톤에 대한 상세 논의는 화면을 직접 보면서 별도로 진행하기로 하였으므로 이번 범위에서 제외했다.
- 커밋과 푸시는 `.agents/rules/git.md` 규칙에 따라 진행하지 않았다.

---

# 다크모드 토글 및 globals.css 정리 구현

> 1,2 모두 진행하자. 1은 2가지 토글로

## 답변

테마 토글과 `globals.css` 정리를 모두 완료했다.

핵심은 Tailwind v4의 `@custom-variant` 한 줄로 **기존 `dark:` 클래스 48개를 전혀 수정하지 않고** `data-theme` 속성 기반 전환으로 바꾼 것이다.

## 확정된 결정 사항

`plan4.md`의 결정 필요 사항 2건이 아래와 같이 확정되었다.

| 항목 | 결정 |
|---|---|
| 토글 단계 수 | **2단계** (라이트 ↔ 다크) |
| 토큰 전환 범위 | **B안** — `@custom-variant` + `bg-white dark:bg-black` 4곳을 `bg-background`로 전환 |

## 생성 및 수정한 파일

| 구분 | 파일 | 내용 |
|---|---|---|
| 신규 | `src/shared/model/theme.ts` | 저장소 및 문서 속성 접근, 구독 |
| 신규 | `src/shared/hooks/useTheme.ts` | `useSyncExternalStore` 기반 hook |
| 신규 | `src/shared/ui/ThemeToggle.tsx` | 전환 버튼 (해/달 아이콘) |
| 수정 | `src/app/globals.css` | 47줄 → 39줄. 아래 정리 내용 참고 |
| 수정 | `src/app/layout.tsx` | FOUC 방지 인라인 스크립트, `suppressHydrationWarning` |
| 수정 | `src/shared/ui/AppHeader.tsx` | 토글 배치, `bg-background` 전환 |
| 수정 | `src/shared/ui/ScreenLayout.tsx` | `bg-background` 전환 |
| 수정 | `src/shared/ui/BottomNav.tsx` | `bg-background` 전환 |
| 수정 | `src/features/auth/components/SocialLoginButtons.tsx` | `bg-background` 전환 |

## 검증 결과

| 검증 항목 | 결과 |
|---|---|
| `npx tsc --noEmit` | 통과 (exit 0) |
| `npx eslint .` | 통과 (exit 0) |
| `npm run build` | 통과, 7개 라우트 생성 |
| 6개 라우트 응답 | 전부 200 |
| 5개 화면의 토글 버튼 | 각 1개 존재 확인 |

## 생성된 CSS 확인

빌드 산출물에서 의도한 규칙이 실제로 생성되었는지 확인했다.

```css
.bg-background {
  background-color: var(--background);
}

.dark\:bg-gray-800:where([data-theme="dark"], [data-theme="dark"] *) {
  background-color: var(--color-gray-800);
}
```

| 확인 항목 | 결과 |
|---|---|
| `data-theme` 포함 규칙 수 | 43개 |
| `prefers-color-scheme` 잔존 | 0건 (완전히 전환됨) |
| `--background` 토큰 | 라이트 `#fff`, 다크 `#0a0a0a` 양쪽 정의 |

기존 `dark:` 클래스는 한 줄도 수정하지 않았으며, `@custom-variant` 한 줄로 전부 `data-theme` 기반으로 동작한다.

## 설계 판단 사항

### 테마 상태를 저장소가 아닌 document에서 읽는 이유

```ts
export function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}
```

`localStorage`를 직접 읽으면 "저장된 값이 없는 경우"(첫 방문, OS 설정을 따르는 상태)를 hook에서 다시 계산해야 한다.

인라인 스크립트가 첫 페인트 이전에 `data-theme`을 이미 확정하므로, **실제로 적용된 값**을 읽는 것이 정확하고 중복 계산도 발생하지 않는다.

### authSession 패턴 재사용

`features/auth/model/authSession.ts`와 구조가 동일하다. `localStorage` 접근과 다른 탭 동기화가 필요하다는 점이 같기 때문이다.

- `useSyncExternalStore`로 구독하므로 `react-hooks/set-state-in-effect` 규칙에 걸리지 않는다.
- `storage` 이벤트를 함께 구독하므로 **다른 탭에서 테마를 변경하면 현재 탭에도 반영된다.**
- 서버 렌더링 시점에는 `light`를 반환한다.

### 토글 버튼의 배치 위치

`AppHeader`에 포함시켜 모든 화면에 노출되도록 했다. 로그인 이전에도 테마를 변경할 수 있어야 하기 때문이다.

중앙 정렬 헤더(`signup`, `signup/verify`, `signup/welcome`)는 서비스명이 가운데 유지되어야 하므로, 헤더에 `relative`를 지정하고 액션 영역을 `absolute right-6`으로 겹쳐 배치했다.

```html
<header class="relative flex items-center justify-center px-6 py-4 border-b ... bg-background">
```

### html lang 속성 변경

`lang="en"`을 `lang="ko"`로 변경했다.

전체가 한국어 서비스임에도 영어로 선언되어 있었다. 스크린 리더의 발음 처리와 브라우저의 번역 제안 동작에 영향을 준다.

## globals.css 정리 내용

**추가**

```css
/* 다크 테마는 prefers-color-scheme 대신 data-theme 속성으로 전환한다. */
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

[data-theme="dark"] {
  --background: #0a0a0a;
  --foreground: #ededed;
}
```

**제거**

| 대상 | 사유 |
|---|---|
| `#__next` 블록 | App Router에 존재하지 않는 셀렉터. 렌더된 HTML에서 0개 확인 |
| `body { position: fixed }` 및 `width` / `height` | `#__next`가 스크롤을 담당하는 구조를 전제한 설정이었음 |
| `-webkit-overflow-scrolling: touch` | 현대 iOS에서 무의미 |
| `@media (prefers-color-scheme: dark)` | `[data-theme="dark"]`로 대체 |

스크롤 동작에는 영향이 없다. 스크롤은 기존에도 각 화면 `main`의 `overflow-y-auto`가 담당하고 있었으며, `ScreenLayout`이 `h-screen`이므로 body 스크롤이 발생하지 않는다.

## 범위에서 제외한 것

**`dark:` 클래스 44개는 그대로 유지했다.**

`dark:text-gray-300`(11개), `dark:text-gray-400`(7개), `dark:border-gray-600`(4개) 등이며, 확정된 B안의 범위(배경색 4곳)를 지켰다.

이를 토큰화하려면 `surface`, `border`, `text-muted` 같은 토큰 이름 체계를 새로 설계해야 하므로, 화면 상세 논의 시점에 함께 진행한다.

## 검증하지 못한 항목

**브라우저에서 토글을 직접 조작하지 못했다.**

`curl`로는 JavaScript가 실행되지 않으므로 마크업 생성과 CSS 규칙 생성까지만 확인했다. 실제 클릭 동작, 테마 전환 시 화면 변화, FOUC 발생 여부는 브라우저에서 직접 확인이 필요하다.
