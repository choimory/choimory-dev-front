# 목차

- [개요](#개요)
- [다크모드 토글 및 globals.css 정리 사전 분석](#다크모드-토글-및-globalscss-정리-사전-분석)
  - [답변](#답변)
  - [globals.css 현황](#globalscss-현황)
    - [정의된 토큰이 사용되지 않음](#정의된-토큰이-사용되지-않음)
    - [죽은 셀렉터 __next](#죽은-셀렉터-__next)
    - [body의 position fixed](#body의-position-fixed)
  - [다크모드 현황](#다크모드-현황)
  - [토글 구현 방식](#토글-구현-방식)
  - [FOUC 문제](#fouc-문제)
  - [제안하는 작업 범위](#제안하는-작업-범위)
    - [A. 테마 토글](#a-테마-토글)
    - [B. globals.css 정리](#b-globalscss-정리)
  - [결정 필요 사항](#결정-필요-사항)
- [결정 2번의 의미 - 토큰 전환 범위](#결정-2번의-의미---토큰-전환-범위)
  - [답변](#답변-1)
  - [토글 동작과는 무관하다](#토글-동작과는-무관하다)
  - [현재 어긋나 있는 지점](#현재-어긋나-있는-지점)
  - [선택지](#선택지)
  - [권장안](#권장안)

---

# 개요

- `plan1.md`에서 정한 전체 3단계 중 **3단계인 디자인 정돈**의 일부 작업에 대한 사전 분석이다.
- 1단계 버전 정비는 `task1.md`, 2단계 구조 재편은 `task2.md`로 완료되었다.
- 3단계 전체가 아니라 **다크모드 토글 추가**와 **`globals.css` 정리** 두 가지만 대상으로 한다.
- 색상 팔레트, 타이포, 레이아웃 등 시각적 톤에 대한 상세 논의는 화면을 직접 보면서 별도로 진행하기로 하였으므로 이번 범위에서 제외한다.
- 다크모드 토글은 `plan3.md` 단계에서 이미 "토글 추가"로 결정된 사항이다.
- 분석 단계이므로 코드는 수정하지 않았다.

---

# 다크모드 토글 및 globals.css 정리 사전 분석

> 화면 상세논의는 다음에 하자. 다크모드 토글이랑 globals.css만 진행하자 분석 시작

## 답변

`globals.css`에서 문제 3가지를 확인했고, 다크모드 토글은 Tailwind v4의 `@custom-variant`로 기존 `dark:` 클래스를 수정하지 않고 전환할 수 있음을 확인했다.

가장 주의할 지점은 테마 적용 시점으로 인한 FOUC(첫 페인트에 잘못된 테마가 그려지는 현상)다.

## globals.css 현황

### 정의된 토큰이 사용되지 않음

`globals.css`는 아래와 같이 토큰을 정의하고 있다.

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```

이 정의가 생성하는 `bg-background` / `text-foreground` 유틸리티의 **실제 사용은 0건**이다.

대신 컴포넌트들이 배경색을 직접 하드코딩하고 있다.

```
src/shared/ui/ScreenLayout.tsx:18                    bg-white dark:bg-black
src/shared/ui/AppHeader.tsx:30                       bg-white dark:bg-black
src/shared/ui/BottomNav.tsx:11                       bg-white dark:bg-black
src/features/auth/components/SocialLoginButtons.tsx:19  bg-white dark:bg-black
```

토큰이 실제로 사용되는 곳은 `body { background: var(--background) }` 한 줄뿐이다.

### 죽은 셀렉터 __next

```css
#__next {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
```

렌더링된 HTML을 확인한 결과 해당 요소가 존재하지 않는다.

```
렌더된 HTML의 __next 개수: 0
```

Pages Router 시절의 셀렉터이며 App Router에는 해당 DOM이 없다. `height`, `overflow-y`, `overflow-x` 지정이 모두 무효 상태다.

### body의 position fixed

```css
body {
  position: fixed;
  width: 100%;
  height: 100%;
}
```

원래는 `#__next`가 스크롤을 담당하는 구조였으나 해당 셀렉터가 동작하지 않으므로, 현재 스크롤은 각 화면의 `main`에 지정된 `overflow-y-auto`가 담당하고 있다.

결과적으로 `position: fixed`는 body 자체의 스크롤을 막는 역할만 수행하고 있다.

## 다크모드 현황

`dark:` 클래스가 15개 파일에 총 48개 사용되고 있다.

| 클래스 | 사용 횟수 |
|---|---|
| `dark:text-gray-300` | 11 |
| `dark:text-gray-400` | 7 |
| `dark:text-white` | 6 |
| `dark:border-gray-600` | 4 |
| `dark:bg-black` | 4 |
| 기타 | 16 |

현재는 `prefers-color-scheme` 기반이므로 **OS 설정만 따르며 사용자가 직접 변경할 수 없다.**

## 토글 구현 방식

설치된 Tailwind 버전은 `4.1.11`이며 `@custom-variant` 지원이 포함되어 있음을 확인했다.

공식 문서 기준 data 속성 방식은 다음과 같다.

```css
@import "tailwindcss";
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

이 한 줄을 추가하면 **기존 `dark:` 클래스 48개를 수정하지 않고** `<html data-theme="dark">` 속성으로 테마가 전환된다. 이번 작업의 핵심이다.

## FOUC 문제

현재 루트 요소에는 아무 속성이 없다.

```html
<html lang="en">
```

테마를 JavaScript로 결정하면 첫 페인트에서 라이트 테마로 그려진 뒤 다크로 전환되어 화면이 깜빡인다.

해결 방법은 `<head>`에 인라인 스크립트를 배치하여 **React 하이드레이션 이전에** `data-theme` 속성을 지정하는 것이다.

```js
// 저장된 선택이 있으면 그것을, 없으면 OS 설정을 따른다
const stored = localStorage.getItem('theme');
const isDark = stored ? stored === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
```

Next.js에서는 `layout.tsx`에 `<script dangerouslySetInnerHTML>`로 삽입한다.

## 제안하는 작업 범위

### A. 테마 토글

```
shared/model/theme.ts          저장소 접근 및 구독
shared/hooks/useTheme.ts       useSyncExternalStore 기반 hook
shared/ui/ThemeToggle.tsx      테마 전환 버튼
app/layout.tsx                 FOUC 방지 인라인 스크립트, suppressHydrationWarning
globals.css                    @custom-variant 추가
```

`features/auth/model/authSession.ts`에서 이미 검증한 `useSyncExternalStore` 패턴을 그대로 적용한다. `localStorage` 접근과 다른 탭 동기화가 필요하다는 점에서 구조가 동일하다.

### B. globals.css 정리

- `#__next` 블록 삭제 (죽은 코드)
- `body { position: fixed }` 제거 및 스크롤 구조를 정상 흐름으로 복원
- 정의된 토큰이 실제로 사용되도록 정리

## 결정 필요 사항

### 1. 토글 단계 수

- **2단계** : 라이트 ↔ 다크. 구현이 단순하고 버튼 상태가 명확하다.
- **3단계** : 시스템 → 라이트 → 다크. OS 설정 따르기로 되돌릴 수 있으나 버튼이 3가지 상태를 표현해야 하므로 UI가 복잡해진다.

### 2. 하드코딩된 배경색의 토큰 전환 여부

`bg-white dark:bg-black` 4곳을 `bg-background`로 전환할지 결정이 필요하다.

전환하지 않아도 토글은 정상 동작한다. 다만 이후 배경색을 변경할 때 다시 4곳을 찾아야 한다. 전환하면 `globals.css` 한 곳에서 제어할 수 있다.

이 항목은 **화면 상세 논의와 범위가 겹친다.** 색상 팔레트를 새로 정할 예정이라면 그 시점에 함께 진행하는 편이 나을 수 있으므로, 이번에는 `#__next`와 `position: fixed`만 제거하고 토큰 정리는 이월하는 방안도 가능하다.

---

# 결정 2번의 의미 - 토큰 전환 범위

> 2는 토글에 따른 토큰형태로 바꾼다는건가?

## 답변

맞다. 색상 값을 컴포넌트에 직접 작성할지, CSS 변수(토큰)로 분리할지에 대한 결정이다.

```tsx
// 현재
<div className="bg-white dark:bg-black">

// 토큰 형태
<div className="bg-background">
```

```css
/* globals.css - 색상은 이곳에만 정의한다 */
:root               { --background: #ffffff; }
[data-theme="dark"] { --background: #0a0a0a; }
```

## 토글 동작과는 무관하다

중요한 전제는 **이 결정이 토글 동작 여부와 관계없다**는 점이다.

`@custom-variant` 한 줄만 추가하면 기존 `bg-white dark:bg-black` 클래스가 그대로 `data-theme` 속성에 반응한다. 즉 토큰 전환은 토글을 동작시키기 위한 작업이 아니다.

## 현재 어긋나 있는 지점

토큰 전환을 검토하는 실질적 이유는 이미 발생해 있는 불일치 때문이다.

```css
body { background: var(--background); }   /* 토큰 사용 */
```

```tsx
<div className="bg-white dark:bg-black">  /* 하드코딩 */
```

두 곳이 같은 흰색을 표현하고 있으나 값의 출처가 다르다. 현재는 값이 우연히 일치하여 문제가 드러나지 않는다.

`--background` 값을 변경하면 **body만 변경되고 `ScreenLayout`은 변경되지 않는다.** 앞선 분석에서 "정의된 토큰이 사용되지 않음"으로 기록한 항목과 같은 사안이다.

## 선택지

| 구분 | 작업 범위 | 결과 |
|---|---|---|
| A | `@custom-variant` 추가만 | 토글 동작. 색상 코드는 수정하지 않음 |
| B | A + `bg-white dark:bg-black` 4곳을 `bg-background`로 전환 | body와의 불일치 해소 |
| C | `dark:` 클래스 48개 전부 토큰화 | 팔레트 전체 일관성 확보 |

**C는 이번 범위에서 수행할 수 없다.**

`dark:text-gray-300`(11개), `dark:border-gray-600`(4개) 등을 토큰으로 전환하려면 `surface`, `border`, `text-muted` 같은 토큰 이름 체계를 새로 설계해야 한다. 이는 이번에 제외하기로 한 화면 상세 논의에 해당한다.

## 권장안

**B를 권장한다.**

근거는 `globals.css`가 토큰을 정의해 두고 실제 사용은 0건인 상태라는 점이다. B를 수행하면 해당 토큰이 실제로 사용되며, 최소한 배경색은 한 곳에서 관리된다.

대상이 4곳뿐이므로 작업량도 크지 않다.

A를 선택해도 토글은 동일하게 동작한다. 다만 "토큰을 정의해 두고 사용하지 않는" 상태가 그대로 유지된다.
