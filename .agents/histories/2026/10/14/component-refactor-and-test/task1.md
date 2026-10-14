# 목차

- [개요](#개요)
- [작업 시작과 Card 추출](#작업-시작과-card-추출)
- [Chip, IconBadge 추출](#chip-iconbadge-추출)
- [SegmentedTabs 추출](#segmentedtabs-추출)
- [ListRow 추출](#listrow-추출)
- [IconButton 추출](#iconbutton-추출)
- [Button 추출과 1단계 마무리](#button-추출과-1단계-마무리)
  - [1단계 요약](#1단계-요약)
  - [교체하지 않은 곳](#교체하지-않은-곳)

---

# 개요

- plan1의 작업계획 중 **1단계(공용 컴포넌트 추출)** 를 진행한 내용이다.
- 진행 방식: 컴포넌트를 만들고 사용처를 교체한 뒤, 단계마다 멈춰서 사용자가 시각 차이를 확인한다.
- 매 단계 `npm run lint`, `npx tsc --noEmit`, `npm run build`로 확인했고 모두 통과했다.
- 공용 컴포넌트는 `src/shared/ui`에 두고, Doc Comment와 필드 측면 주석을 작성했다.
- 사용처 교체는 클래스가 정확히 일치하는 곳만 대상으로 했다. 출력되는 클래스 구성은 이전과 같게 유지했다.
- 작업 시작 시 calendar를 `PLAN`에서 `TASK`로 변경했다.

---

# 작업 시작과 Card 추출

> 버튼은 너의 의견으로하자 작업시작

## 답변

- calendar를 `TASK:컴포넌트 리팩토링과 테스트코드 작업(component-refactor-and-test)`으로 변경했다.
- plan1의 `Button` 항목을 "사용자가 제안대로 진행하기로 결정"으로 고쳤다.
- 작업 시작 전 `npm run lint`가 깨끗한 것을 기준선으로 확인했다.

## Card

- 신규: `src/shared/ui/Card.tsx`
  - `as`(div, section, article), `padding`(sm=p-3, 기본 md=p-4), `tone`(기본 default=bg-surface, strong=bg-surface-strong), `className`을 받는다.
  - 나머지 속성(aria-*, key 등)은 그대로 전달한다.
  - 기본 클래스: `rounded-2xl border border-border`
- 교체: 클래스가 정확히 일치하는 26곳(9개 파일)
  - `BlogGuestSection`, `BlogMemberFeedSection`, `BlogPostDetailView`
  - `FeedActivityDetailView`, `FeedMenuView`, `FeedObservationDetailView`, `FeedTargetDetailView`(12곳), `FeedTargetSettingsView`(4곳), `FeedView`(2곳)
- 다른 클래스가 섞인 카드(grid, text-left, hover 등)는 이후 `ListRow`, `Button` 단계로 넘겼다.

---

# Chip, IconBadge 추출

> 확인했어 Chip이랑 IconBadge 묶어서 진행해

## 답변

### Chip

- 신규: `src/shared/ui/Chip.tsx`
  - `size`(sm=`px-2 py-0.5 text-[11px]`, 기본 md=`px-2.5 py-1 text-xs`), `tone`(기본 muted=bg-surface-strong, surface=bg-surface)을 받는다.
  - 기본 클래스: `rounded-full font-bold text-muted`
- 교체: 7곳 (`MemberServiceFeedSection`, `PlatformServicesView`, `BlogMenuView`, `FeedView`, `FeedMenuView`)

### IconBadge

- 신규: `src/shared/ui/IconBadge.tsx`
  - `as`(기본 div, span), `size`(xs 24px, sm 32px, md 36px, 기본 lg 40px, xl 48px), `tone`(primary, 기본 soft, strong, surface)을 받는다.
  - 글자 크기와 굵기는 `className`으로 전달한다.
- 교체: 12곳 (`GuestLandingSection`, `BlogMemberFeedSection`, `BlogMeSettingsView`, `BlogPostCard`, `BlogRelationModal`, `BlogMenuView`, `BlogPostDetailView`, `FeedView`, `FeedMenuView`)

### 교체하지 않은 곳

- `MeView:164` 칩: `font-bold`, `text-muted`가 없어 모양이 다르다.
- `BlogMeSettingsView:401` 칩: `px-3`과 `text-primary`로 형태가 다르다.
- `MemberServiceFeedSection`의 `Link` 칩: hover 스타일이 있는 링크다.
- 토글 스위치, 점(`size-2`), 앨범 그림자 막대: 칩이나 배지가 아니다.

---

# SegmentedTabs 추출

> 확인했어 SegmentedTabs 먼저 진행해

## 답변

- 신규: `src/shared/ui/SegmentedTabs.tsx`
  - 제네릭 컴포넌트로, 탭 id 타입이 `onChange`에 그대로 전달된다.
  - props: `items`, `activeId`, `ariaLabel`, `onChange`, `size`(기본 sm=text-xs, md=text-sm), `className`
  - 열 수는 탭 개수(2~5)로 정해진다. Tailwind가 정적으로 감지하도록 클래스 전체 문자열을 맵에 둔다.
  - `role="tablist"`, `role="tab"`, `aria-selected`, `transition`은 기존과 동일하게 유지한다.
- 교체: 5곳
  - `BlogMenuView`: 인기 랭킹(sm), 관계 목록(md)
  - `FeedMenuView`: 피드 인기 랭킹, 관찰 대상 등록
  - `FeedTargetDetailView`: 가격 추이 기간(핸들러가 상태 3개를 갱신하므로 인라인 `onChange`로 연결)

## 교체하지 않은 곳

- `BlogMeSettingsView`의 공개여부와 댓글허용여부 선택 그룹 2곳
  - 모양은 같지만 `role="tab"`, `aria-selected`, `transition`이 없는 옵션 선택 그룹이다.
  - 공용 탭에 넣으면 접근성 의미와 전환 효과가 바뀌어서 그대로 두었다. 나중에 `OptionGroup` 같은 별도 컴포넌트로 만들지 판단한다.

---

# ListRow 추출

> 확인했어 ListRow 조사 먼저 진행해

## 답변

### 조사 결과

- `grid-cols-[...]`을 쓰는 행 약 37곳을 4묶음으로 분류했다.
  - A: 링크/버튼형 3열 행(아이콘, 본문, 우측)
  - B: 랭킹 행(`bg-surface-strong`, 테두리 없음)
  - C: 2열 카드(아이콘, 본문)
  - D, E, F: 카드 없는 레이아웃 행, (본문, 우측) 2열, 예외 → 형태가 제각각이라 제외
- 제안: A, B, C만 공용화한다.

> 제안대로 진행해줘

## 답변

### ListRow

- 신규: `src/shared/ui/ListRow.tsx`
  - 슬롯: `leading`(좌측), `children`(본문), `trailing`(우측). 슬롯 유무로 열 구성이 정해진다. (둘 다 있으면 `auto/1fr/auto`, 한쪽만 있으면 2열)
  - 렌더링: `href`가 있으면 `Link`, `onClick`이 있으면 `button`, 둘 다 없으면 `as`(div, article, section)
  - props: `tone`(default=테두리+bg-surface, strong=테두리 없는 bg-surface-strong), `padding`(기본 sm=p-3, md=p-4), `isDimmed`(opacity-75), `ariaLabel`, `style`, `className`
  - 기본 톤의 클릭 가능한 행에는 `transition hover:bg-surface-strong`이 자동으로 붙는다. strong 톤은 기존 랭킹 행처럼 hover가 없다.
- 교체: 14곳
  - `FeedMenuView`(4): 최근 이벤트, 대상 목록 링크, 인기 랭킹, 관찰 대상 추가
  - `FeedView`(2): 최근 알림, 대상 미리보기
  - `BlogMenuView`(2): 인기 랭킹, 관계 목록
  - `BlogMemberFeedSection`, `BlogMeSettingsView`: 글 작성 행
  - `BlogRelationModal`: 관계 목록 행
  - `PlatformServicesView`(2): 준비 중 `article`, 이동 링크
  - `MeSettingCard`: 설정 항목 버튼
- 처리 방식: 단순 패턴 14곳 중 대부분은 변환 스크립트로 처리했고, 랭킹 행 2곳(애니메이션 `style` 포함)과 `PlatformServicesView`(`cardContent` 공유)는 직접 수정했다.
- 변환 후 슬롯 첫 줄 들여쓰기가 어긋난 것을 일괄 보정했다.
- `PlatformServicesView`의 사용하지 않는 `Link` import를 제거했다.

### 판단 사항

- `MeSettingCard`는 컴포넌트를 유지하고 내부만 `ListRow`로 바꿨다. 호출부 영향이 없는 쪽을 택했다.
- `PlatformServicesView`는 `cardContent` 하나를 `leading`, `body`, `trailing`으로 나눠 두 분기에서 공유한다.

### 교체하지 않은 곳

- `BlogMeSettingsView:237`(`rounded-xl`, `p-2`), `GuestLandingSection`, `ServiceLauncherCard`(`rounded-3xl`) 등 조사 D, E, F 항목

---

# IconButton 추출

> 확인했어 Button 조사 먼저 진행해

## 답변

### 조사 결과

- 전체 `<button>` 71개를 클래스 패턴으로 분류했다.
  - 아이콘 버튼(정사각) 약 28개, 텍스트 버튼 약 17개
  - 제외: 가짜 입력창 3개, 카드형 버튼 6개, 선택 상태가 동적인 버튼 6개, `SegmentedTabs` 내부 1개 등
- 제안: `IconButton`과 `Button`을 나누고, Secondary 글자색은 `muted`로 통일하며, `h-11`은 `h-10`으로 통일한다.

> 제안대로 진행해줘

## 답변

작업 순서는 `IconButton`을 먼저 하고 멈춘 뒤 `Button`을 진행하는 것으로 했다.

### IconButton

- 신규: `src/shared/ui/IconButton.tsx`
  - `ariaLabel`이 필수다. 아이콘만 있는 버튼이라 접근성 라벨이 없으면 타입 에러가 난다.
  - `size`(sm 32px, 기본 md 36px, lg 40px)
  - `tone`(기본 muted=`bg-surface-strong text-muted`, danger=`bg-surface-strong text-accent-red`, ghost=배경 없음, 색은 `className`)
  - `disabled:opacity-35`는 모든 톤에 공통으로 붙는다.
- 교체: 26곳
  - `BlogPostCard`(5), `BlogPostDetailView`(6): 좋아요, 댓글, 공유, 저장, 삭제, 메뉴
  - `BlogMeSettingsView`(4): 사진 순서 이동, 제거, 모달 닫기
  - `BlogMenuView`(3), `BlogRelationModal`(3): 검색, 이전/다음 목록, 닫기
  - `FeedTargetDetailView`(4), `FeedMenuView`(1): 앨범 이동, 닫기

### 교체하지 않은 곳

- `MeView`, `PlatformNoticeView`의 `size-9` "닫기" 텍스트 버튼: 정사각에 텍스트가 들어간 모양이다.
- `TopBarActions`의 `size-10` 3개: 화면 폭에 따라 숨김/표시(`hidden ... min-[380px]:grid`)다.
- `ServiceLauncherCard`의 `rounded-full` 2개: 원형이다.

---

# Button 추출과 1단계 마무리

> 확인했어 Button 진행해
>
> 버튼 글자가 좀 진해지긴 했는데 괜찮음

## 답변

### Button

- 신규: `src/shared/ui/Button.tsx`
  - `variant`(기본 primary, secondary, outline-danger), `size`(기본 md=`h-10 rounded-[10px]`, lg=`h-12 rounded-[12px]`)
  - 기본 클래스: `px-4 text-sm font-bold`
  - 일반 button 속성(`onClick`, `disabled` 등)은 그대로 받고, `type`을 지정하지 않으면 `button`이다.
- 교체: 16곳
  - `LoginView`, `SignupView`: `size="lg"`
  - `BlogMeSettingsView`(4): 모달의 취소(secondary)와 저장
  - `BlogMemberFeedSection`, `BlogPostDetailView`(2), `FeedMenuView`, `FeedTargetSettingsView`(2), `MeView`(4): 등록, 저장, 확인, 탈퇴(outline-danger) 등

### 제안과 다르게 한 점

- `isFullWidth`를 만들지 않았다. 가로 꽉 참 버튼 4개는 `grid` 안에 있어서 `px-4`가 붙어도 화면상 차이가 없었다.
- `MeView:95` 중복체크 버튼은 교체하지 않았다. 옆 입력창이 `h-11`이라 `h-10`으로 통일하면 높이가 어긋난다.

### 시각 차이 확인 결과

- Secondary 버튼의 글자색을 `muted`로 통일한 결과, 사용자가 확인한 버튼 글자가 이전보다 약간 진해졌지만 "괜찮음"으로 판단했다. 별도 조치는 하지 않는다.

## 1단계 요약

| 컴포넌트 | 위치 | 교체 수 |
|---|---|---|
| `Card` | `shared/ui/Card.tsx` | 26 |
| `Chip` | `shared/ui/Chip.tsx` | 7 |
| `IconBadge` | `shared/ui/IconBadge.tsx` | 12 |
| `SegmentedTabs` | `shared/ui/SegmentedTabs.tsx` | 5 |
| `ListRow` | `shared/ui/ListRow.tsx` | 14 |
| `IconButton` | `shared/ui/IconButton.tsx` | 26 |
| `Button` | `shared/ui/Button.tsx` | 16 |

- 7개 컴포넌트 신규, 사용처 약 106곳 교체
- 매 단계 `lint`, `tsc`, `build` 통과

## 교체하지 않은 곳

| 위치 | 이유 |
|---|---|
| `MeView:95` 중복체크 버튼 | 옆 입력창이 `h-11`이라 높이가 어긋남 |
| `MeView:79`, `PlatformNoticeView:95` "닫기" 텍스트 버튼 | 정사각에 텍스트가 들어간 모양이라 `Button`/`IconButton`과 다름 |
| `BlogPostDetailView:110`, `BlogMenuView:309` | `h-9 px-3 text-xs` 소형 버튼이고 색이 서로 다름 |
| `TopBarActions`, `PlatformSearchBar` | 반응형 `px`, `rounded-full` |
| 가짜 입력창 3개, 카드형 버튼 6개, 선택 상태가 동적인 버튼 6개 | 범위에서 제외 |
| `BlogMeSettingsView`의 옵션 선택 그룹 2곳 | 탭이 아닌 옵션 그룹이라 `SegmentedTabs`와 의미가 다름 |

## 다음 단계

- 2단계: 큰 파일 분리
  - 제안 순서: `BlogMeSettingsView`(3개) → `BlogMenuView`(2개) → `FeedMenuView`(8개) → `FeedTargetDetailView`(8개)
  - `BlogModalShell`은 공용 `Modal`로 만들어 흡수한다.
- 3단계: 테스트 환경 구축
- 4단계: 컴포넌트 테스트 작성
- 5단계: 마무리(README 반영)
