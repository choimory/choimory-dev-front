# 목차

- [개요](#개요)
- [3단계 작업사항과 작업 지시서](#3단계-작업사항과-작업-지시서)
  - [답변](#답변)
  - [남은 작업 순서](#남은-작업-순서)
  - [작업자 구성](#작업자-구성)
    - [실행 방식](#실행-방식)
    - [작업 단위 (5개)](#작업-단위-5개)
    - [나눈 기준](#나눈-기준)
  - [공통 지시서](#공통-지시서)
    - [0. 먼저 알아둘 것](#0-먼저-알아둘-것)
    - [1. 읽을 문서](#1-읽을-문서)
    - [2. 하는 일](#2-하는-일)
    - [3. 수정 범위](#3-수정-범위)
    - [4. 반드시 유지할 것](#4-반드시-유지할-것)
    - [5. 디자인 규칙 요약](#5-디자인-규칙-요약)
    - [6. 테스트 규칙](#6-테스트-규칙)
    - [7. 검증 방법](#7-검증-방법)
    - [8. 완료 조건](#8-완료-조건)
    - [9. 보고 양식](#9-보고-양식)
  - [작업자별 지시서](#작업자별-지시서)
    - [A. platform](#a-platform)
    - [B. auth·me](#b-authme)
    - [C. blog](#c-blog)
    - [D1. feed 목록](#d1-feed-목록)
    - [D2. feed 상세](#d2-feed-상세)
  - [결과 취합 (Claude)](#결과-취합-claude)
  - [실행 전 확인할 것](#실행-전-확인할-것)

---

# 개요

- 3단계(도메인별 화면 redesign)의 작업사항과 GPT 작업자용 지시서.
- 순차 단계(0·1·2)는 끝났고, 공용 UI와 디자인 시스템(`design.md`)이 고정된 상태에서 도메인 화면을 병렬로 재구성한다.
- 작업자는 Claude가 paseo로 띄우는 GPT Sol 6.2(`codex/gpt-6.2-sol`)이고, 작업자 수는 작업량에 맞춰 정한다.
- 1·2단계 기록은 task2.md, task3.md 참고.

---

# 3단계 작업사항과 작업 지시서

> 다음 작업사항이랑 지시서는 plan4에 작성해줘. 하위 에이전트는 너가 paseo로 띄우면 돼. 에이전트 갯수는 작업 내용에 맞게 원하는대로 해

## 답변

- 작업자는 **5개**로 나눔: platform, auth·me, blog, feed 목록, feed 상세.
- 작업자는 Claude가 paseo로 띄움. 모델은 `codex/gpt-6.2-sol` (paseo에서 사용 가능 확인).
- 아래 공통 지시서와 작업자별 지시서를 각 작업자에게 전달함.

## 남은 작업 순서

1. **3단계 실행 (병렬)**: 작업자 5개를 동시에 띄움. 각자 담당 도메인 화면을 재구성하고 보고서를 제출.
2. **결과 취합 (Claude)**: 보고서를 모아 공용 쪽 변경 요청과 테스트 수정안을 정리 → 사용자 승인 → 반영.
3. **3단계 결과 보고**: 화면 확인 후 멈춤. 커밋은 사용자가 직접.
4. **4단계 통합 검증 (Claude)**:
   - 0단계 기록(링크 61, 입력 필드 20, 핸들러 88)과 after 화면 대조 (`sloplint --kept`)
   - 빌드·테스트·타입 체크·린트·hallmark 점검
   - before/after 비교 파일(`.hallmark/compare.html`)과 최종 보고(바뀐 문구, 지운 라벨, 수정한 테스트)
5. **작업 마무리**: done1.md 작성, calendar.md DONE, README.md에 디자인 시스템 반영. `.hallmark/` 파일 git 포함 여부, `~/.cache/hallmark-tools` 유지 여부, dev 서버 종료 정리.

## 작업자 구성

### 실행 방식

| 항목 | 값 |
|---|---|
| 도구 | paseo `create_agent` (Claude의 하위 에이전트, 완료 시 Claude에게 알림) |
| 모델 | `codex/gpt-6.2-sol` |
| 추론 강도 | `high` (화면 재구성 판단이 많아서) |
| 권한 모드 | `auto` (Codex 기본: 작업 폴더 쓰기와 명령 실행) |
| 작업 위치 | 현재 작업 트리 그대로 (worktree 분리 없음). 작업자끼리 수정 파일이 겹치지 않게 나눔 |
| dev 서버 | Claude가 3100 포트로 띄워둔 것을 공유 |
| 전달 방식 | 각 작업자에게 "plan4.md의 공통 지시서 + 자기 작업자 지시서를 읽고 실행하라"는 짧은 프롬프트를 줌 |

### 작업 단위 (5개)

| 작업자 | 화면 | 담당 폴더·파일 | 규모 |
|---|---|---|---|
| A. platform | `/`, `/?auth=member`, `/services`, `/notice` | `src/features/platform/**` | 컴포넌트 7개, 약 740줄 |
| B. auth·me | `/login`, `/signup`, `/me?auth=member` | `src/features/auth/**`, `src/features/me/**` | 컴포넌트 4개, 약 570줄 |
| C. blog | `/blog`, `/blog?auth=member`, `/blog/popular`, `/blog/following`, `/blog/me`, `/blog/build.note`, `/blog/posts/post-1` | `src/features/blog/**` | 컴포넌트 14개, 약 1,700줄 |
| D1. feed 목록 | `/feed`, `/feed?auth=member`, `/feed/popular`, `/feed/observations`, `/feed/me` | `src/features/feed/components/` 중 목록 쪽 11개 | 아래 목록 참고 |
| D2. feed 상세 | `/feed/targets/target-streamer-alpha`, `/feed/targets/target-artist-nova`, `/feed/targets/target-gpu`, `/feed/me/targets/target-streamer-alpha`, `/feed/activities/activity-1`, `/feed/observations/observation-1` | `src/features/feed/components/` 중 상세 쪽 13개 | 아래 목록 참고 |

### 나눈 기준

- 도메인끼리는 서로 import하지 않아서 파일 충돌이 없음.
- feed는 컴포넌트 24개, 약 2,000줄로 가장 큼. 목록 쪽과 상세 쪽 컴포넌트가 서로 import하지 않아서 두 작업자로 나눔.
  - **D1 목록**: `FeedView`, `TargetPreviewLink`, `FeedMenuView`, `PopularTargetSection`, `PopularTargetEventSection`, `ObservationTargetSection`, `MyFeedManageSection`, `TargetListLink`, `FeedTargetCreateForm`, `FormField`, `TogglePreview`
  - **D2 상세**: `FeedTargetDetailView`, `ItemDetailSection`, `MiniLineChart`, `StreamerDetailSection`, `BroadcastContributionGraph`, `ListPanel`, `ArtistDetailSection`, `AlbumDetailModal`, `AlbumCarousel3d`, `FeedActivityDetailView`, `FeedObservationDetailView`, `FeedTargetSettingsView`, `SettingToggle`
  - `src/features/feed/model/**`과 `container/**`는 둘 다 수정하지 않음.
- auth(약 320줄)와 me(약 250줄)는 작아서 하나로 묶음.

## 공통 지시서

> 모든 작업자에게 동일하게 적용한다.

### 0. 먼저 알아둘 것

- 너는 choimory.dev 프론트엔드 디자인 리디자인 작업의 3단계를 맡은 작업자다. 전체 작업은 Claude가 조율하고, 너는 담당 도메인 화면만 재구성한다.
- **이 작업은 사용자가 이미 승인했다.** 프로젝트 `AGENTS.md`에는 "모든 행동 전에 허락을 받는다", "대화로 계획을 주고받는다"는 규칙이 있지만, 이번 작업에서는 이 지시서가 그 허락이다. 묻지 말고 끝까지 실행한 뒤 보고서를 제출한다. 진행이 불가능한 문제가 있을 때만 멈추고 보고서에 이유를 적는다.
- `.agents/histories/**` 문서와 `README.md`는 작성·수정하지 않는다. 기록은 Claude가 한다.
- git commit, stash, reset, checkout 등 git 상태를 바꾸는 명령은 쓰지 않는다. 커밋은 사용자가 직접 한다.
- 다른 작업자 4명이 같은 작업 트리에서 동시에 일한다. 담당 범위 밖의 파일은 읽기만 한다.
- 답변과 보고서는 한국어로 쓴다.

### 1. 읽을 문서

순서대로 읽는다.

1. `design.md` (루트): 고정된 디자인 시스템. 모든 판단의 기준.
2. `.agents/skills/hallmark/SKILL.md`: The Floor와 흐름.
3. `.agents/skills/hallmark/references/redesign.md`: redesign에서 유지할 것(내용, 동작, 파일).
4. `.agents/skills/hallmark/references/flow.md`의 `## App screens`와 `## Harnesses` 섹션.
5. `src/app/globals.css`, `src/app/tokens.css`: 토큰 이름과 공용 클래스(`.cut`, `.cut-sm`, `.key`, `.key-primary`, `.tray`).
6. `src/shared/ui/*.tsx`: 2단계에서 다시 만든 공용 컴포넌트. 화면은 이것들을 조합해 만든다.
7. `.hallmark/before.txt`에서 자기 담당 파일과 화면 URL이 나온 줄, `.hallmark/before/`의 자기 화면 스크린샷(작업 전 모습).

### 2. 하는 일

hallmark redesign **full** 깊이를 앱 화면(app screen) 기준으로 담당 화면에 적용한다.

- 셸(상단 바, 하단 내비, `AppFrame`, `AppContent`) 안에서 각 화면의 구성을 다시 짠다: 무엇을 앞세울지, 섹션 배치, 목록·숫자·폼의 배치.
- 화면이 직접 그린 박스를 정리한다. 카드 안 카드, 행마다 박스, 숫자마다 타일을 없애고 구분선 행(`ListRow`), 패널(`Card`), 위쪽 구분선 숫자(`StatCard`)로 바꾼다.
- 화면 안에 직접 그린 경로형 라벨(eyebrow)을 없앤다. 예: `feed / target`, `{로고} / feed`, `/ welcome`. 현재 위치는 상단 바 경로가 보여준다. 지운 라벨은 보고서 "지운 것"에 적는다.
- 공용 컴포넌트에 덧씌운 옛 스타일 클래스(`rounded-2xl`, `rounded-full`, `font-black`, `shadow-[...rgba]`, `backdrop-blur`, `bg-[linear-gradient...]` 등)를 정리한다.
- 아래 "작업자별 지시서"의 개별 과제를 처리한다.

### 3. 수정 범위

- **수정 가능**: 자기 담당 폴더·파일만 (작업자별 지시서 참고).
- **수정 금지**:
  - `src/shared/**` (공용 컴포넌트, 로고 `BrandLogo.tsx` 포함)
  - `src/app/globals.css`, `src/app/tokens.css`, `src/app/base.css`, `src/app/layout.tsx`, `src/app/**/page.tsx`
  - `design.md`
  - 다른 작업자의 담당 파일
  - `src/features/*/model/**` 와 `src/features/*/container/**` (화면 데이터와 로직)
  - `tests/**` (테스트 파일. 아래 테스트 규칙 참고)
  - `package.json`, 설정 파일
- 공용 쪽 변경이 필요하면 직접 고치지 말고, 보고서 "공용 변경 요청"에 적는다. 예: 공용 컴포넌트에 variant 추가, 새 토큰.

### 4. 반드시 유지할 것

`redesign.md` "What a redesign keeps"를 따른다.

- **내용**: 화면에 있는 모든 사실·숫자·이름·날짜·문구. 새 섹션·문구·기능·숫자를 추가하지 않는다.
- **동작**: 모든 링크(`href`), 폼, 입력 필드(`name`, `id`, `type`), 이벤트 핸들러, 라우트, `key`, `aria-*`. 로직을 옮기거나 prop 이름을 바꾸지 않는다.
- **접근성 구조**: heading 레벨, `role`, `aria-label`, `aria-labelledby`. 테스트가 대부분 이걸로 요소를 찾는다.
- **파일**: 파일을 지우거나 컴포넌트 트리를 통째로 바꾸지 않는다. 필요하면 보고서에 제안만 한다.
- **문구 수정**: hallmark 문구 규칙(19, 54, 58, 63, 69)에 걸려 고친 줄은 보고서에 전/후를 모두 적는다. 약관·안내 문구는 바꾸지 않는다.

### 5. 디자인 규칙 요약

자세한 건 `design.md`. 자주 걸리는 것만 정리.

- 색과 글꼴은 토큰 유틸리티만 쓴다 (`bg-surface`, `text-muted`, `border-border`, `bg-primary`, `font-display`, `text-ink-2` 등). `bg-[#hex]`, `rgba()` 같은 직접 값은 금지 (네이버·카카오 버튼 색만 예외).
- 강조색(코발트, `primary`)은 주요 동작, 현재 선택, 상태에만 쓴다. 화면의 5% 이하.
- 주요 버튼은 화면당 하나(`Button` primary). 나머지는 secondary.
- 컨트롤 높이 32~40px, 터치 영역 44px. 인증 화면 제출 버튼만 48px(`Button size="lg"`).
- 알약 모양(`rounded-full`) 금지. 아바타·이니셜도 `IconBadge`(사각 타일)를 쓴다.
- 제목 위 작은 라벨(eyebrow), 자간을 넓힌 대문자 라벨 금지.
- 가운데 점(·)으로 이어 붙인 메타 문구 금지. 두 개 이상의 정보는 별도 요소로 나누고 간격으로 구분한다 (문구 자체는 그대로).
- 숫자는 `tabular-nums`. 측정하지 않은 추세 화살표·지어낸 숫자 금지.
- 글꼴 굵기는 3종 이하: 400(본문), 500(라벨·보조), 600(제목·강조). `font-bold`(700), `font-black`(900)은 쓰지 않는다. 로고는 예외(건드리지 않음).
- 그림자 대신 구분선과 밝기 단계로 층을 나눈다. 카드 안에 테두리 있는 카드를 넣지 않는다. 안쪽 구분은 `Card tone="strong"` / `ListRow tone="strong"`(테두리 없는 면) 또는 구분선.
- 목록은 `ListRow`를 간격 없이 쌓는다 (`grid` + `gap-0`, 또는 `divide-y`).
- 제목 위 여백이 아래 여백의 두 배 이상.
- 모션은 상태 변화에만, `transform`·`opacity`만, `prefers-reduced-motion` 대응. `transition-all` 금지.
- 모든 인터랙티브 요소에 hover·focus-visible·active·disabled 상태. `outline-none`으로 포커스 링을 지우지 않는다.
- 데이터 영역의 로딩·빈 상태·오류 상태는 로직이 이미 있는 것만 디자인한다. 로직이 없는 상태는 만들지 말고 보고서 "주인에게 넘길 것"에 적는다.
- 한글 줄바꿈은 전역 `word-break: keep-all`이 처리한다.

### 6. 테스트 규칙

- 테스트 파일(`tests/**`)은 **수정하지 않는다.**
- 작업 후 자기 도메인 테스트를 돌린다: `npx vitest run tests/unit/features/<도메인>`.
- 깨진 테스트는 컴포넌트에서 살릴 수 있으면 살린다. 특히 역할·라벨·문구로 찾는 테스트는 내용과 접근성 구조를 지키면 깨지지 않아야 한다.
- 디자인 때문에 클래스명 확인 구문(`toHaveClass` 등)이 깨지는 것만 허용한다. 보고서 "테스트 수정안"에 `파일:줄 / 깨진 확인 / 이유 / 수정안`을 적는다. 수정은 Claude가 사용자 승인 후 한다.
- 상태 확인이 클래스에 묶여 있으면(`bg-primary`로 선택 상태 확인 등), 가능하면 클래스를 유지하고, 수정안으로는 `aria-pressed`·`aria-selected`·`aria-current` 같은 속성 확인으로 바꾸는 방안을 제안한다.

### 7. 검증 방법

- **타입 체크**: `npx tsc --noEmit`
- **린트**: `npx eslint src/features/<도메인>`
- **테스트**: `npx vitest run tests/unit/features/<도메인>`
- **hallmark 정적 검사**: `node .agents/skills/hallmark/scripts/sloplint.mjs src/features/<도메인> --genre modern-minimal --scope app`
- **hallmark 브라우저 검사** (가능하면): dev 서버가 `http://localhost:3100`에 떠 있다. 서버를 새로 띄우거나 끄지 않는다.
  - `HALLMARK_PUPPETEER=$HOME/.cache/hallmark-tools node .agents/skills/hallmark/scripts/sloplint.mjs src/features/<도메인> --genre modern-minimal --scope app --render --url 'http://localhost:3100/<화면>' ...`
  - 샌드박스 때문에 브라우저가 안 뜨면 정적 검사만 하고 보고서에 "브라우저 검사 안 됨"이라고 적는다. 통과했다고 쓰지 않는다.
- **금지**: `sloplint`의 `--before`, `--kept` 옵션 (0단계 기록을 덮어쓰고, 대조는 Claude가 4단계에서 한다). `.hallmark/before*` 파일 수정.

### 8. 완료 조건

- 담당 화면 전부에 재구성이 적용됨.
- 타입 체크·린트 통과.
- 담당 도메인 테스트는 통과하거나, 실패는 모두 "테스트 수정안"에 있는 클래스명 확인 구문뿐.
- hallmark 정적 검사의 FAIL 0개. REFLEX는 고치거나 보고서에 이유와 함께 남김.
- 유지할 것(내용·동작·접근성 구조)을 지킴.

### 9. 보고 양식

`.hallmark/stage3/<작업자 ID>.md`에 작성한다 (예: `.hallmark/stage3/A-platform.md`). 마지막 답변에도 같은 내용을 요약한다.

```markdown
# <작업자 ID> 보고서

## 요약
- 담당 화면, 바꾼 파일 수, 검증 결과 한 줄씩

## 화면별 변경
| 화면 | 이전 구성 | 새 구성 |

## 바꾼 파일
| 파일 | 변경 내용 |

## 검증
- 타입 체크 / 린트 / 테스트(통과·실패 수) / hallmark 정적(FAIL·REFLEX·WARN 수) / 브라우저 검사(실행 여부, 결과)

## 테스트 수정안
| 파일:줄 | 깨진 확인 | 이유 | 수정안 |

## 공용 변경 요청
| 대상(src/shared/... 등) | 요청 | 이유 |

## 지운 것 (dropped)
| 파일 | 지운 것 | 이유 |

## 바꾼 문구
| 파일:줄 | 전 | 후 | 걸린 규칙 |

## 남긴 REFLEX·WARN과 이유

## 주인에게 넘길 것
- 로직이 없어서 만들지 않은 상태, 확인이 필요한 사항
```

## 작업자별 지시서

### A. platform

- **담당**: `src/features/platform/**` (단, `model/**`, `container/**` 제외)
- **화면**: `/` (비회원), `/?auth=member` (회원), `/services`, `/notice`
- **테스트**: `tests/unit/features/platform`
- **개별 과제**:
  - 홈 비회원 영역(`GuestLandingSection`): 카드 안 `{로고} / welcome` 라벨 제거, 혜택 목록과 서비스 목록을 구분선 행으로.
  - 홈 회원 영역(`MemberServiceFeedSection`): 서비스 카드 안의 숫자 타일 2개·알림 행 박스(카드 안 카드) 정리. 숫자는 `StatCard`, 알림은 `ListRow`.
  - 홈 상단: 로고(`BrandLogo size="lg"`)와 위치는 그대로 둔다. 검색창(`PlatformSearchBar`)의 입력 높이 24px 문제를 고친다 (컨트롤 32~40px). 검색 버튼은 키캡.
  - 서비스 바로가기(`ServiceLauncherCard`): 이전/다음 버튼 높이 88px 문제 정리, 원형 아이콘 → 사각 타일, "예정" 표시 정리.
  - `/services`(`PlatformServicesView`), `/notice`(`PlatformNoticeView`): 행 박스 → 구분선 목록. 공지 메타의 가운데 점 분리.
  - "예정·준비 중" 서비스의 흐림 표시(`opacity-75`)는 테스트가 확인하므로 유지.

### B. auth·me

- **담당**: `src/features/auth/components/**`, `src/features/me/components/**` (`auth/api`, `auth/hooks`, `auth/server`, `auth/model`, `container`, `me/model`은 제외)
- **화면**: `/login`, `/signup`, `/me?auth=member`
- **테스트**: `tests/unit/features/auth`, `tests/unit/features/me`
- **개별 과제**:
  - 로그인·회원가입(`LoginView`, `SignupView`):
    - 입력칸 테두리 대비 부족(1.27:1) 수정: 테두리를 `border-rule-2` 이상 또는 `--color-muted` 계열로, 포커스는 코발트.
    - 카드의 `shadow-[0_18px_50px_rgba(...)]` 직접 값 제거(FAIL 48), 패널은 `Card` 또는 `.cut` 패널로.
    - 제출 버튼은 `Button size="lg"`(48px, `h-12`, `bg-primary`) 유지. 테스트가 확인함.
    - 네이버(`#03c75a`)·카카오(`#fee500`) 버튼 색은 유지. 버튼에 눌림·포커스 상태 추가(REFLEX 26b).
    - 네이버 버튼 흰 글자 대비(2.25:1): 아래 "실행 전 확인할 것" 결정을 따른다.
  - 내 정보(`MeView`, `MeSettingCard`): 프로필 카드와 설정 카드들을 패널 + 구분선 행으로 정리. 탈퇴 버튼은 `Button variant="outline-danger"`(빨간 테두리) 유지. 탈퇴 모달의 위험 안내 유지.

### C. blog

- **담당**: `src/features/blog/components/**`
- **화면**: `/blog`, `/blog?auth=member`, `/blog/popular`, `/blog/following?auth=member`, `/blog/me?auth=member`, `/blog/build.note`, `/blog/posts/post-1`
- **테스트**: `tests/unit/features/blog`
- **개별 과제**:
  - 게시글 이미지 자리(`BlogPostCard`, `BlogPostDetailView`)의 보라→파랑 그라디언트(`bg-[linear-gradient...]`) 제거. 이미지 슬롯은 hallmark `[data-slot]` 패턴(단색 면, 실제 이미지가 들어갈 자리)으로. 새 그림·사진을 넣지 않는다.
  - 상단 소개 카드의 탭(추천·팔로잉·최신·인기)은 알약 → 트레이 안 키. 가능하면 `SegmentedTabs` 사용. 선택 상태 클래스 `bg-primary`는 테스트가 확인하므로 유지.
  - `BlogPostCard`의 메타 `프론트 구성 기획 · 8분 전` 가운데 점 분리. 세 점 말줄임(`...`)은 `…`로 (F2).
  - 탑바 `/ blog` 링크 줄바꿈(REFLEX 49b)은 공용 쪽에서 처리됨. 화면 쪽에서 같은 문제가 있으면 정리.
  - 인기 랭킹(`BlogPopularInsightSection`): `blog-ranking-enter` 애니메이션과 `animationDelay` 140ms 간격 유지(테스트 확인). 순위 변동 표시 색(`text-accent-red`, `bg-primary-soft`, `bg-accent-green-soft` 등)도 테스트가 확인하므로 의미를 유지.
  - 모달들(`BlogPostCreateModal`, `BlogSettingEditModal`, `BlogRelationModal`): 공용 `Modal` 기준으로 내부 정리. 선택 버튼의 `border-primary`, `bg-primary-soft` 상태 클래스는 테스트가 확인하므로 유지.
  - 댓글(`BlogPostDetailView`의 `Card padding="sm"`)은 카드 목록 → 구분선 행 검토.

### D1. feed 목록

- **담당**: `src/features/feed/components/` 중 `FeedView.tsx`, `TargetPreviewLink.tsx`, `FeedMenuView.tsx`, `PopularTargetSection.tsx`, `PopularTargetEventSection.tsx`, `ObservationTargetSection.tsx`, `MyFeedManageSection.tsx`, `TargetListLink.tsx`, `FeedTargetCreateForm.tsx`, `FormField.tsx`, `TogglePreview.tsx`
- **화면**: `/feed`, `/feed?auth=member`, `/feed/popular`, `/feed/observations?auth=member`, `/feed/me?auth=member`
- **테스트**: 위 컴포넌트의 테스트 (`tests/unit/features/feed/components/` 해당 파일 + `container/FeedContainer`, `container/FeedMenuContainer`)
- **개별 과제**:
  - 피드 홈(`FeedView`): 소개 카드의 `{로고} / feed` 라벨 제거. 숫자 타일 4개(등록 수·관찰 중·새 알림·관심 항목)는 `StatCard` 줄로(카드 박스 제거). 관심 대상·최근 알림은 구분선 목록.
  - 관심 대상 행의 메타 `현재 128,000원 · 목표가 120,000원` 가운데 점 분리. 가격 같은 기계값은 `tabular-nums`.
  - 상승·하락 표시(`text-primary`, `text-accent-red`, `text-muted`)는 테스트가 확인하므로 의미를 유지. 측정되지 않은 추세 화살표를 새로 넣지 않는다.
  - 내 피드(`MyFeedManageSection`): 등록 버튼 라벨 "관찰할 아이템, 스트리머, 아티스트를 등록하세요"가 320px에서 두 줄로 넘어가는 문제(FAIL 49a). 문구는 유지하고 레이아웃으로 해결 (예: 버튼이 아니라 행 형태). 바꿔야 하면 보고서에 전/후.
  - 등록 폼(`FeedTargetCreateForm`, `FormField`, `TogglePreview`): 입력칸 대비·포커스, 토글 상태(`justify-end bg-primary` 테스트 확인) 유지.
  - 인기·관찰 목록(`PopularTargetSection`, `ObservationTargetSection`, `PopularTargetEventSection`, `TargetListLink`): 순차 등장 애니메이션 `animationDelay` 140ms 간격 유지(테스트 확인). 행 박스 → 구분선 행.

### D2. feed 상세

- **담당**: `src/features/feed/components/` 중 `FeedTargetDetailView.tsx`, `ItemDetailSection.tsx`, `MiniLineChart.tsx`, `StreamerDetailSection.tsx`, `BroadcastContributionGraph.tsx`, `ListPanel.tsx`, `ArtistDetailSection.tsx`, `AlbumDetailModal.tsx`, `AlbumCarousel3d.tsx`, `FeedActivityDetailView.tsx`, `FeedObservationDetailView.tsx`, `FeedTargetSettingsView.tsx`, `SettingToggle.tsx`
- **화면**: `/feed/targets/target-streamer-alpha`, `/feed/targets/target-artist-nova`, `/feed/targets/target-gpu`, `/feed/me/targets/target-streamer-alpha?auth=member`, `/feed/activities/activity-1`, `/feed/observations/observation-1?auth=member`
- **테스트**: 위 컴포넌트의 테스트 (`tests/unit/features/feed/components/` 해당 파일 + `container/FeedTargetDetailContainer`, `FeedActivityDetailContainer`, `FeedObservationDetailContainer`, `FeedTargetSettingsContainer`) + `model/feedTargetView.test.ts`는 실행만
- **개별 과제**:
  - 대상 상세(`FeedTargetDetailView`): 상단 `feed / target` 라벨 제거. 상태 타일 3개(방송 중·이벤트 12건·활동 +31%)와 "방송 관찰" 안의 타일 2개(카드 안 카드) 정리. 원본 채널 URL 같은 기계값은 `font-mono`(JetBrains Mono).
  - 차트(`MiniLineChart`, `BroadcastContributionGraph`): `.agents/skills/hallmark/references/data-viz.md`를 참고해 축·눈금선·마크를 토큰 색으로. 10px 글씨(REFLEX 75)를 11px 이상으로. 선택된 날짜 칸의 `bg-primary-soft`, 기본 칸의 `bg-surface` 클래스는 테스트가 확인하므로 유지.
  - 아티스트(`ArtistDetailSection`, `AlbumCarousel3d`, `AlbumDetailModal`): 3D 캐러셀은 동작 유지, 모션은 `prefers-reduced-motion` 대응 확인. 캐러셀 테스트의 클래스 확인 3개 주의.
  - 아이템(`ItemDetailSection`): 가격 수치 `tabular-nums`, 하락 표시 색(`text-accent-red`) 유지.
  - 설정(`FeedTargetSettingsView`, `SettingToggle`): 토글 선택 상태(`border-primary` 등) 유지, 설정 행은 구분선 목록.
  - 알림·관찰 상세(`FeedActivityDetailView`, `FeedObservationDetailView`): 상세 정보 박스 → 구분선 정의 목록.

## 결과 취합 (Claude)

1. 작업자 5명 완료 알림을 받으면 `.hallmark/stage3/*.md` 보고서를 모은다.
2. 전체 타입 체크·린트·테스트·hallmark 정적 검사를 다시 돌려 보고 내용을 확인한다.
3. 사용자에게 정리해서 올린다:
   - 테스트 수정안 목록 (승인 대상)
   - 공용 변경 요청 목록 (승인 대상, Claude가 반영)
   - 지운 것, 바꾼 문구 목록
   - 주인에게 넘길 것
4. 승인받은 것을 반영하고 다시 검증한 뒤 3단계 결과를 보고하고 멈춘다.
5. 작업자가 범위 밖 파일을 건드렸으면 보고하고 되돌릴지 사용자에게 묻는다.

## 실행 전 확인할 것

- **네이버 버튼 흰 글자 대비(2.25:1)**: 결정 필요.
  - 가: 네이버 브랜드 지침(초록 바탕 + 흰 글자)을 따르는 예외로 기록하고 그대로 둔다.
  - 나: 글자 색만 어둡게 바꿔 대비를 맞춘다.
  - 결정이 없으면 B 작업자에게는 "가"로 전달한다(색과 글자 그대로, 보고서에 예외로 기록).
- **실행 시작 시점**: 이 문서 확인 후 시작 지시를 받으면 calendar는 TASK 그대로 두고 작업자 5개를 띄운다.

---
