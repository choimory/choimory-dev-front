# 목차

- [개요](#개요)
- [2단계 공용 UI와 셸 구현](#2단계-공용-ui와-셸-구현)
  - [답변](#답변)
  - [구현 결과](#구현-결과)
    - [공용 재료 추가 (globals.css)](#공용-재료-추가-globalscss)
    - [컴포넌트별 변경](#컴포넌트별-변경)
    - [경로형 라벨 제거](#경로형-라벨-제거)
    - [기타 수정](#기타-수정)
  - [검사](#검사)
  - [테스트를 고치지 않고 컴포넌트에서 살린 것](#테스트를-고치지-않고-컴포넌트에서-살린-것)
  - [테스트 수정 승인 목록 (20개)](#테스트-수정-승인-목록-20개)
    - [A. 스타일 클래스 확인 (14개)](#a-스타일-클래스-확인-14개)
    - [B. 경로형 라벨 제거로 깨진 것 (8개)](#b-경로형-라벨-제거로-깨진-것-8개)
  - [3단계로 넘기는 것](#3단계로-넘기는-것)
- [테스트 수정과 2단계 완료](#테스트-수정과-2단계-완료)
  - [답변](#답변-1)
  - [검증 결과](#검증-결과)
  - [테스트 수정 내용](#테스트-수정-내용)
  - [2단계에서 바꾼 파일](#2단계에서-바꾼-파일)
  - [다음: 3단계 준비](#다음-3단계-준비)

---

# 개요

- plan3에서 정한 계획대로 2단계(공용 UI와 셸 redesign)를 구현한 기록.
- `src/shared/ui` 컴포넌트 17개(로고 제외)를 Cobalt 시스템(`design.md`)에 맞게 다시 만듦.
- 깨진 테스트는 고치지 않고 승인 목록으로 정리함 (plan1의 테스트 규칙 "가").
- 1단계 기록은 task2.md 참고.

---

# 2단계 공용 UI와 셸 구현

> 커밋은 내가할거임 작업시작

## 답변

- 커밋은 사용자가 직접 진행. 작업 중 커밋하지 않음.
- 2단계 구현 완료. 깨진 테스트는 아직 고치지 않았고, 승인받을 목록을 정리함.

## 구현 결과

### 공용 재료 추가 (globals.css)

| 클래스 | 용도 |
|---|---|
| `.cut` / `.cut-sm` | 대각선 두 모서리를 깎은 패널·태그. `corner-shape` 미지원 브라우저는 일반 라운드(8px / 6px) |
| `.key` / `.key-primary` | 아래 모서리가 있는 키캡 버튼. hover에 1px 뜨고, 누르면 가라앉고, 비활성은 흐리게 |
| `.tray` | 탭·옵션 키가 놓이는 오목한 트레이 (`--tray`, `--shadow-tray` 토큰) |

- 입력창 placeholder 색을 `--color-muted`로 지정 (작업 전 로그인 placeholder 대비 2.25:1 문제 대응).
- `--shadow-tray` 토큰을 `tokens.css`(라이트)와 `globals.css` 다크 블록에 추가.

### 컴포넌트별 변경

| 컴포넌트 | 변경 |
|---|---|
| `Icon` | svg 하나로 감싸고 `aria-hidden="true"`, `focusable="false"` 명시. 도형은 `IconShape`로 분리 |
| `Button` | 키캡. primary는 코발트 키, secondary는 회색 키, outline-danger는 빨간 테두리·글자의 회색 키. md 40px, lg 48px, 6px 라운드, semibold |
| `IconButton` | muted·danger는 회색 키, ghost는 hover 배경만. 6px 라운드 |
| `SegmentedTabs` | 트레이 안의 탭. 선택된 탭은 `bg-primary` + 눌린 그림자. 높이 32px |
| `Card` | default는 깎은 모서리 패널 + 구분선 + `shadow-card`. strong은 테두리 없는 한 단계 진한 면 |
| `ListRow` | default는 아래쪽 구분선 행(박스 제거). strong은 테두리 없는 진한 면 |
| `Chip` | 알약 모양 대신 깎은 모서리 작은 태그 |
| `IconBadge` | 원형 대신 6px 라운드 사각 타일 |
| `StatCard` | lg는 위쪽 구분선 위의 큰 숫자(표 형식 숫자, `text-2xl`), sm은 진한 면 |
| `SectionHeader` | 경로 라벨 제거, 제목 + 선택적 액션 링크. 위 여백 확대 |
| `PageIntroCard` | 로고+경로 라벨 제거. 제목·설명이 없으면 렌더링하지 않음 |
| `AppFrame` | 파랑·초록 그라디언트 제거, 단색 배경 |
| `AppTopBar` | 블러 제거, 단색 바탕과 아래 구분선. 서비스 경로는 줄바꿈 방지 |
| `BottomNavigation` | 단색 바탕과 위 구분선. 선택 항목은 코발트 글자 + 위쪽 표시선. 모바일은 전체 폭 |
| `TopBarActions` | 아이콘 버튼 hover, 로그인 링크는 코발트 키, 팝오버는 깎은 패널. 알림 탭은 트레이, 알림 목록은 구분선 행. 검색 오버레이 블러 제거, 입력창 `outline-none` 제거(포커스 링 복구) |
| `Modal` | 블러 제거, 깎은 패널, 큰 그림자 대신 `shadow-card` |
| `AppContent` | 그대로 |

### 경로형 라벨 제거

- plan3의 가안대로 `SectionHeader`와 `PageIntroCard`에서 경로형 라벨을 화면에 표시하지 않음.
- 기존 코드가 깨지지 않도록 `domainPath` prop은 그대로 받음.
- 지운 라벨 목록은 작업 결과 보고에 "dropped"로 남김.

### 기타 수정

- **알림 메타**: `블로그 · 방금`처럼 가운데 점으로 잇는 형태는 hallmark 금지 항목이라 서비스 이름과 시간을 두 칸으로 나눔. 문구는 그대로. 알림 탭 버튼에 `aria-pressed` 추가.

## 검사

- **타입 체크**: 통과.
- **린트**: `src` 통과.
- **hallmark 정적 검사**: `src/shared/ui`와 `src/app` 기준 깨끗함(0 FAIL, 0 REFLEX, 0 WARN).
- **브라우저 검사**: `/feed?auth=member`, `/login`, `/?auth=member`에서 남은 항목은 모두 화면 쪽 코드 문제라 3단계에서 처리.
- **테스트**: 574개 중 20개 실패. 모두 아래 승인 목록에 포함.

## 테스트를 고치지 않고 컴포넌트에서 살린 것

- 탈퇴 버튼의 빨간 테두리(`border-accent-red`)
- 로그인·회원가입 버튼 48px 높이(`h-12`)
- 선택 상태를 나타내는 `bg-primary`
- 화면 폭(`max-w-[768px]` 등), 열 구성(`grid-cols-*`), `opacity-75`

## 테스트 수정 승인 목록 (20개)

### A. 스타일 클래스 확인 (14개)

`tests/unit/shared/ui` 파일들.

| 파일:줄 | 깨진 확인 | 이유 | 수정안 |
|---|---|---|---|
| `BottomNavigation:32` | `bg-primary-soft` | 선택 표시를 채운 블록에서 위쪽 선으로 바꿈 | `text-primary`만 확인 (`aria-current`는 이미 확인 중) |
| `Button:18` | `rounded-[10px]`, `font-bold` | 키캡 6px 라운드, semibold | `rounded-input`, `key`, `font-semibold`로 교체 |
| `Button:48` (secondary) | `bg-surface-strong text-muted` | 보조 버튼이 회색 키가 됨 | `key text-foreground`로 교체 |
| `Button:56` | `rounded-[12px]` | 라운드 통일 | `rounded-input`으로 교체 (`h-12`는 유지) |
| `Card:17` | `rounded-2xl` | 깎은 모서리 패널 | `cut`으로 교체 |
| `Chip:14`, `Chip:22` | `rounded-full`, 여백 값 | 알약 모양 금지 | `cut-sm`, 새 여백 값으로 교체 |
| `IconBadge:17` | `rounded-full` | 사각 타일 | `rounded-input`으로 교체 |
| `IconButton:18`, `IconButton:58` | `bg-surface-strong` | 회색 키가 됨 | `key text-muted`, `key text-accent-red`로 교체 |
| `Modal:73` | `shadow-2xl` | 큰 그림자 제거 (다크는 그림자 없음) | `shadow-card`로 교체 |
| `StatCard:34` | `text-xl` | 숫자를 키움 | `text-2xl`로 교체 |

### B. 경로형 라벨 제거로 깨진 것 (8개)

| 파일:줄 | 깨진 확인 | 수정안 |
|---|---|---|
| `shared/ui/PageIntroCard:14` | 로고와 `/ blog / me` 표시 | "제목·설명이 없으면 아무것도 렌더링하지 않는다"로 바꿈 |
| `shared/ui/SectionHeader:16` | `blog / setting` 표시 | 라벨 확인을 "표시하지 않는다"로 바꿈. 제목과 `headingId` 확인은 유지 |
| `features/blog`의 `BlogMeSettingsContainer:14`, `BlogMeSettingsView:15`, `BlogMenuView:20`, `BlogUserBlogView:17` | `/ blog / me`, `blog / popular`, `/ blog / @jin.note` | 라벨 확인 한 줄만 제거. 나머지 제목·프로필 확인은 유지 |
| `features/feed`의 `MyFeedManageSection:17`, `PopularTargetEventSection:17` | `/ feed / me`, `feed / event` | 같은 방식으로 라벨 확인만 제거 |

B의 `features` 쪽 6개는 화면 코드가 아니라 공용 컴포넌트 변경 때문에 깨진 것이라 2단계에서 같이 고침.

## 3단계로 넘기는 것

화면 쪽 코드(`features/*`) 문제라 3단계에서 처리.

- 로그인 입력칸 테두리 대비 부족(1.27:1), 네이버 버튼 흰 글자 대비(2.25:1, 네이버 브랜드 색 유지 조건)
- 홈 검색창 높이(24px), 서비스 캐러셀 버튼 높이
- 글꼴 굵기 4종 사용(400, 500, 700, 900) → 3종 이하로
- 화면 안에 직접 그린 경로형 라벨(`feed / target`, `{로고} / feed` 등)과 화면이 직접 만든 카드 박스, 숫자 타일
- 제목 위아래 간격(제목이 앞 내용보다 뒤 내용에 더 가깝게)

---

# 테스트 수정과 2단계 완료

> 테스트 수정 일단 진행

## 답변

승인 목록 20개의 테스트를 수정했고, 2단계 완료.

## 검증 결과

- **테스트**: 97개 파일, 575개 모두 통과. `PageIntroCard`의 라벨 확인 하나를 두 개로 나눠서 574개에서 1개 늘어남.
- **타입 체크**: 통과.
- **린트**: `src`와 `tests` 모두 깨끗함.

## 테스트 수정 내용

승인 목록 그대로 진행했고, 목록에 없는 확인 구문은 건드리지 않음.

- **A. 스타일 클래스 확인 14개** (`tests/unit/shared/ui`): 클래스명만 새 값으로 교체. 상태 확인(`aria-current`, `bg-primary`, `text-accent-red`)과 크기·폭 확인은 그대로.
  - `BottomNavigation`: `bg-primary-soft` 제거, `text-primary`만 확인
  - `Button`: `rounded-[10px]`·`rounded-[12px]` → `rounded-input`, `font-bold` → `font-semibold`, `key` 추가, secondary는 `key text-foreground`
  - `Card`: `rounded-2xl` → `cut`
  - `Chip`: `rounded-full` → `cut-sm`, 여백 값 교체
  - `IconBadge`: `rounded-full` → `rounded-input`
  - `IconButton`: `bg-surface-strong` → `key`
  - `Modal`: `shadow-2xl` → `shadow-card`
  - `StatCard`: `text-xl` → `text-2xl`
- **B. 경로형 라벨 확인 8개**:
  - `PageIntroCard`: "제목·설명이 없으면 렌더링하지 않는다"와 "로고·경로 라벨을 표시하지 않는다", 두 개로 나눔.
  - `SectionHeader`: 라벨이 "있다" 대신 "표시하지 않는다"를 확인.
  - `features` 쪽 6개 파일(`BlogMeSettingsContainer`, `BlogMeSettingsView`, `BlogMenuView`, `BlogUserBlogView`, `MyFeedManageSection`, `PopularTargetEventSection`): 라벨 확인 한 줄씩만 지움. 그중 `BlogMeSettingsView`, `BlogUserBlogView`, `MyFeedManageSection`은 테스트 제목과 주석에 "페이지 소개·경로" 표현이 남아 있어 같이 고침.

## 2단계에서 바꾼 파일

- 소스: `src/shared/ui` 16개, `src/app/globals.css`, `src/app/tokens.css`
- 테스트: 16개
- 커밋은 하지 않음. 1·2단계 변경이 모두 작업 트리에 남아 있음.

## 다음: 3단계 준비

GPT 작업 지시서를 쓰기 전에 정할 것.

1. **GPT 작업자 실행**: 직접 띄울지, Claude가 paseo로 띄울지.
2. **작업 단위**: 도메인 4개(platform, auth·me, blog, feed)로 갈지, 피드를 페이지별로 더 쪼갤지.
3. **네이버 버튼 대비**: 브랜드 색(`#03c75a`)에 흰 글자면 대비가 2.25:1밖에 안 나옴.
   - 가: 브랜드 지침을 따르는 예외로 기록하고 그대로 둠.
   - 나: 글자 색만 어둡게 바꿔서 대비를 맞춤.

---
