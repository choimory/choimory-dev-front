# 목차

- [개요](#개요)
- [1단계 디자인 시스템 적용](#1단계-디자인-시스템-적용)
  - [답변](#답변)
  - [바꾼 파일](#바꾼-파일)
  - [검증](#검증)
  - [계획과 달라진 점](#계획과-달라진-점)
    - [Tailwind 글자 크기 이름 유지](#tailwind-글자-크기-이름-유지)
    - [한글 조판 보정 추가](#한글-조판-보정-추가)
    - [dev 서버 캐시 문제](#dev-서버-캐시-문제)
  - [지금 화면 상태](#지금-화면-상태)
  - [참고](#참고)

---

# 개요

- plan2에서 정한 방향대로 1단계(디자인 시스템)를 적용한 기록.
- hallmark Cobalt 테마를 기존 토큰 이름에 연결하고, 다크(기본)·라이트 값을 정하고, 로고 전용 토큰으로 로고를 고정하고, `design.md`로 시스템을 고정함.
- 0단계 기록은 task1.md 참고.

---

# 1단계 디자인 시스템 적용

> 시작

## 답변

1단계(디자인 시스템) 완료. 앱 전체 색과 폰트가 Cobalt로 바뀌었고, 로고는 리디자인 전 모습 그대로.

## 바꾼 파일

| 구분 | 파일 | 내용 |
|---|---|---|
| 새로 만듦 | `src/app/tokens.css` | Cobalt 라이트 토큰이 원본. 상태색(성공·주의·오류·보라)과 연한 배경색, 폰트 연결 추가 |
| 새로 만듦 | `src/app/base.css` | hallmark 기본 규칙(포커스 링, `overflow-x: clip`, 제목 서체, 모션 줄이기 설정 대응 등) |
| 새로 만듦 | `design.md` (루트) | 고정한 디자인 시스템. 2·3단계와 GPT 작업자 모두 이 문서를 기준으로 작업 |
| 수정 | `src/app/globals.css` | 다크 기본값 계산, 기존 토큰 이름을 Cobalt 역할로 연결, 로고 전용 토큰, 한글 조판 보정 |
| 수정 | `src/app/layout.tsx` | 폰트 교체: IBM Plex Sans KR, Familjen Grotesk, JetBrains Mono. 로고용 Geist Mono는 유지 |
| 수정 | `src/shared/ui/BrandLogo.tsx` | 클래스명만 로고 전용 토큰으로 교체 |

세부 구성.

- **다크 모드**: `tokens.css`의 Cobalt 라이트 값을 기본으로 두고, `globals.css`의 `:root:not([data-theme="light"])`에서 다크에서 바뀌는 토큰만 덮어씀. 다크는 그림자 없이 밝기로 층을 나눔.
- **토큰 연결**: `globals.css`의 `@theme inline`에서 기존 이름을 Cobalt 역할로 연결.
  - `background` → paper
  - `shell`·`surface` → paper-2
  - `surface-strong` → paper-3
  - `foreground` → ink
  - `border` → rule
  - `primary` → accent
  - `primary-foreground` → accent-ink
  - `primary-soft` → accent-wash
  - `accent-green` → success
  - `accent-orange` → warning
  - `accent-red` → error
  - `accent-purple` → violet
  - `muted`는 이름이 같아 Cobalt 값을 그대로 씀
- **폰트 연결**: next/font 변수가 `:root`에서 읽히도록 폰트 클래스를 `body`가 아닌 `<html>`에 붙임.
- **로고 전용 토큰**: `--logo-ink`, `--logo-brace`, `--logo-dot`, `--logo-paren`(다크·라이트 각각 리디자인 전 값), `--font-logo`(Geist Mono). Tailwind 유틸리티로 `text-logo-*`, `font-logo`를 씀.

## 검증

- **테스트**: 97개 파일, 574개 모두 통과. 테스트는 하나도 고치지 않음.
- **타입 체크**: 통과.
- **린트**: `src` 폴더는 깨끗함. 전체 린트에서 오류 15개가 나오는데, 전부 `.agents/skills/design-taste-frontend` 스킬 파일에 원래 있던 것으로 이번 작업과는 상관없음.
- **hallmark 정적 검사**: FAIL 0개(작업 전엔 `globals.css`에 FAIL이 있었음). REFLEX 1개(버튼 눌림 상태 없음)는 2단계에서 컴포넌트를 바꾸면서 해결됨.
- **로고**: 브라우저에서 실제 계산된 값으로 확인. 다크·라이트 모두 글자별 색, Geist Mono 폰트, 크기가 리디자인 전과 같음.

| 조각 | 다크 | 라이트 |
|---|---|---|
| `{ }` | `#7aa2ff` | `#2563eb` |
| `choimory`, `dev` | `#ecf2f8` | `#17202a` |
| `.` | `#60d7b2` | `#0f8b6d` |
| `( )` | `#ffb26f` | `#cf6d17` |

## 계획과 달라진 점

### Tailwind 글자 크기 이름 유지

Cobalt는 Tailwind의 `text-xs`~`text-3xl` 크기를 자기 값으로 바꾸려고 함. 그런데 이걸 따르면 로고 크기(`text-xl`, `text-3xl`)가 바뀌고, 기존 화면 300여 곳의 글자 크기도 같이 흔들림. 그래서 Tailwind 원래 값은 그대로 두고, Cobalt 글자 크기는 `text-md`, `text-title`, `text-section`, `text-display` 같은 새 이름으로만 추가함. `design.md`에도 기록.

### 한글 조판 보정 추가

hallmark 기본 규칙의 제목 폭 제한(20ch)은 라틴 문자 기준. 그대로 두면 한글 제목이 "로/그인하면"처럼 단어 중간에서 끊기고, 홈의 큰 로고가 가운데에서 왼쪽으로 밀려남. 그래서 한글은 어절 단위로 줄을 바꾸게 하고(`word-break: keep-all`), 제목 폭 제한은 풂(`globals.css`의 `@layer base`).

### dev 서버 캐시 문제

개발 서버(Turbopack)가 예전 `globals.css`를 계속 보내고 있어서, `.next/dev` 빌드 캐시를 지우고 다시 띄움. 소스 코드와는 상관없는 문제.

## 지금 화면 상태

색·폰트·포커스 링만 바뀐 상태. 카드 안 카드, 알약 모양 버튼, 경로형 라벨 같은 구성 문제는 그대로이고, 2단계(공용 UI)와 3단계(도메인 화면)에서 바꿈. 다크 배경은 이전보다 조금 더 어두워짐.

## 참고

- 변경 사항은 아직 커밋하지 않음.
- 3100 포트 dev 서버는 백그라운드 실행 시간 한도에 걸려 자동으로 꺼짐. 2단계 시작 때 다시 띄움.
- 테마 적용 명령: `node .agents/skills/hallmark/scripts/theme.mjs scaffold cobalt --dealt "3/3, seed personal-developer-platform-hub-a772·f695c75a·2026-11-27·r0" --redesign full --scope app --dir src/app`

---
