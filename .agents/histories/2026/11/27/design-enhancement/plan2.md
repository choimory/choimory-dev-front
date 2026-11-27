# 목차

- [개요](#개요)
- [1단계 디자인 시스템 방향](#1단계-디자인-시스템-방향)
  - [답변](#답변)
  - [테마 후보와 선택](#테마-후보와-선택)
  - [이 앱에 맞게 조정하는 점](#이-앱에-맞게-조정하는-점)
  - [폰트 (한글 대응)](#폰트-한글-대응)
  - [색 체계](#색-체계)
    - [다크·라이트 구성](#다크라이트-구성)
    - [기존 토큰 매핑](#기존-토큰-매핑)
    - [새로 추가하는 토큰](#새로-추가하는-토큰)
    - [로고 전용 토큰 (B안)](#로고-전용-토큰-b안)
  - [1단계에서 수정할 파일](#1단계에서-수정할-파일)

---

# 개요

- 1단계(디자인 시스템)를 적용하기 전에 정한 방향을 기록한다.
- hallmark 테마 선택, 한글 폰트 대응, 다크·라이트 색 체계, 토큰 매핑, 로고 전용 토큰, 수정할 파일 범위를 다룬다.
- 0단계 결과는 task1.md, 전체 작업계획은 plan1.md 참고.

---

# 1단계 디자인 시스템 방향

> 다음작업

## 답변

hallmark가 테마 후보 3개를 뽑았고, 셋을 비교해서 **Cobalt**를 선택. 적용하기 전에 방향을 먼저 공유함. 아직 코드는 바꾸지 않음.

- 테마 뽑기 명령: `node .agents/skills/hallmark/scripts/theme.mjs deal --genre modern-minimal --prompt "personal developer platform hub: ..." --log .hallmark/log.json`
- seed: `personal-developer-platform-hub-a772·f695c75a·2026-11-27·r0` (Cobalt는 3/3)

## 테마 후보와 선택

| 후보 | 성격 | 판단 |
|---|---|---|
| Wayfind | 지하철 출발 안내판 느낌. 모노 폰트만 쓰고, 2px 잉크 테두리, 앰버색 숫자 | 피드와는 잘 맞지만, 본문까지 모노 폰트라 한글 본문을 감당하기 어려움 |
| Ultraviolet | 보라 한 가지 색, 소문자 Outfit 폰트, 알약 모양 | 소문자 콘셉트가 한글에선 의미가 없고, 보라색이 기존 로고 톤과 충돌 |
| **Cobalt (선택)** | 개발자 플랫폼 계열. 얇은 구분선, 키캡 모양 버튼, 모서리를 깎은 패널, 코드는 짙은 회색(graphite) 바탕, 코발트 블루 한 가지 강조색 | 아래 이유로 선택 |

Cobalt를 고른 이유.

- `{choimory.dev()}`라는 코드 형태의 로고와 결이 같음.
- 강조색이 파란 계열이라 고정할 로고 색과 부딪히지 않음.
- 카드를 남발하는 대신 얇은 구분선과 행으로 정보를 나누는 테마라서, 진단에서 나온 "카드 안 카드" 문제를 정면으로 고칠 수 있음.

## 이 앱에 맞게 조정하는 점

앱 화면에는 hallmark 규칙상 마케팅용 요소가 들어가지 않음. 그래서 테마에서는 색, 폰트, 라운드, 표면만 가져오고, 배치는 가져오지 않음.

- **ASCII 패턴 배경**: Cobalt의 대표 요소지만 앱 화면에는 히어로가 없어서 쓰지 않음. 필요하면 나중에 홈 한 곳 정도만 검토.
- **알약 모양 금지**: 지금의 둥근 탭(추천·팔로잉 등)과 칩은 키캡 버튼과 패널 안에 들어간 탭 형태로 바뀜.
- **컨트롤 크기**: 앱 기준인 32~40px로 맞추고, 터치 영역은 44px.
- **강조색 사용량**: 코발트는 주요 행동, 현재 선택, 상태 표시에만 씀.

## 폰트 (한글 대응)

Cobalt의 원래 폰트(Familjen Grotesk, IBM Plex Sans)에는 한글이 없음. 그래서 아래처럼 구성.

| 역할 | 폰트 |
|---|---|
| 본문 + 한글 전체 | IBM Plex Sans KR (Cobalt 본문 폰트의 한글판) |
| 제목·숫자의 라틴 문자 | Familjen Grotesk (한글은 Plex Sans KR로 자동 대체) |
| 코드·기계값(URL, ID, 가격 수치 등) | JetBrains Mono |
| 로고 | Geist Mono 그대로 (로고 전용 토큰으로 고정) |

## 색 체계

### 다크·라이트 구성

- 지금처럼 `:root`를 다크(기본), `[data-theme="light"]`를 라이트로 둠.
- 라이트는 Cobalt 원래 값을 씀.
- 다크는 hallmark 다크 모드 규칙(`references/dark-mode.md`)에 따라 Cobalt에서 다시 계산함. 그림자 없이 밝기로 층을 구분하고, 카드가 배경보다 밝게 보이게 함. 색상(hue)은 두 모드에서 같게 유지.

### 기존 토큰 매핑

기존 토큰 이름은 유지하고 값만 교체.

| 기존 토큰 | Cobalt 역할 |
|---|---|
| `background` / `shell` / `surface` / `surface-strong` | paper / paper-2 / paper-2 / paper-3 계열 |
| `foreground` / `muted` / `border` | ink / muted / rule |
| `primary` / `primary-foreground` / `primary-soft` | accent(코발트) / accent-ink / accent-wash |
| `accent-green` / `orange` / `red` | 상승·주의·하락 같은 상태색. 채도를 낮춰 차분하게 |
| `accent-purple` | 서비스 아이콘 톤 등에 쓰이는 보조색. 채도를 낮춰 유지 |

### 새로 추가하는 토큰

`ink-2`, `rule-2`, graphite 계열, 키캡 면·모서리, 폰트 3종, 라운드·깎은 모서리 값.

### 로고 전용 토큰 (B안)

- `--logo-ink`, `--logo-brace`, `--logo-dot`, `--logo-paren`, `--font-logo`를 지금 값 그대로(다크·라이트 각각) 만듦.
- `BrandLogo.tsx`는 클래스명만 이 토큰으로 바꿈. 겉모습은 바뀌지 않음.

## 1단계에서 수정할 파일

| 구분 | 파일 |
|---|---|
| 새로 만들기 | `src/app/tokens.css`, `src/app/base.css` (hallmark scaffold가 생성하고, 위 매핑으로 조정), `design.md` (루트, 시스템 고정) |
| 수정 | `src/app/globals.css` (토큰 값 교체, import 추가, `overflow-x: hidden`을 `clip`으로), `src/app/layout.tsx` (폰트 교체, Geist Mono는 로고용으로 유지), `src/shared/ui/BrandLogo.tsx` (클래스명만 교체) |
| 삭제 | 없음 |

- 토큰 값만 바뀌어도 앱 전체 색과 폰트가 즉시 바뀜. 화면 구성(카드 정리 등)은 2단계와 3단계에서 진행.
- 토큰 이름을 유지하므로 1단계 후에도 테스트는 모두 통과해야 함. 끝나면 테스트로 확인.

---
