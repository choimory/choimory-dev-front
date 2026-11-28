# Skills

## 목차

- [스킬 목록](#스킬-목록)
- [스킬별 사용법](#스킬별-사용법)
  - [hallmark](#hallmark)
  - [harness-update](#harness-update)
  - [frontend-design](#frontend-design)
  - [design-taste-frontend](#design-taste-frontend)
  - [ui-ux-pro-max](#ui-ux-pro-max)
  - [impeccable](#impeccable)

---

- .agents/skills는 에이전트가 사용할 수 있는 스킬들을 관리하는 곳.
- 각 스킬은 `.agents/skills/{skill-name}/SKILL.md` 형식으로, 디렉토리 하나에 스킬 하나를 둔다.
- 스킬 디렉토리는 분류 없이 `.agents/skills/` 바로 하위에 평평하게 둔다. (하위 분류 디렉토리는 에이전트가 인식하지 못할 수 있음)
- 스킬의 기능별 분류는 디렉토리 대신 하단 스킬 목록의 분류 컬럼으로 관리한다.
- 스킬을 추가하거나 제거할땐 하단 스킬 목록과 스킬별 사용법도 함께 수정한다.
- 외부 스킬은 원본을 수정하지 않고 그대로 가져오며, 출처를 기록한다.
- Claude Code는 `.claude/skills`의 스킬만 인식하므로, 프로젝트 루트의 `.claude/skills`가 `.agents/skills`를 가리키는 링크로 걸려있지 않다면 프로젝트 루트에서 링크를 생성한다.
  - Windows: `cmd /c "if not exist .claude mkdir .claude & mklink /J .claude\skills .agents\skills"`
  - Mac/Linux: `mkdir -p .claude && ln -s ../.agents/skills .claude/skills`
- 프로젝트 루트의 `.claude/skills`가 실제 디렉토리로 이미 존재한다면, 기존 스킬들은 건드리지 않고 그 안에 스킬별로 `.claude/skills/{skill-name}` → `.agents/skills/{skill-name}` 링크를 생성한다.

## 스킬 목록

| 스킬 | 분류 | 설명 | 경로 | 출처 |
|---|---|---|---|---|
| hallmark | front/design | AI가 만든 것처럼 보이지 않는 웹 UI 디자인. 새 페이지 생성, redesign, audit | `.agents/skills/hallmark/SKILL.md` | [nutlope/hallmark](https://github.com/nutlope/hallmark) (MIT) |
| harness-update | common/harness | choimory-harness 기준으로 AGENTS.md, .agents 규칙/스킬 최신화. 변경 목록 확인 → 허락 → 적용 → 임시파일 정리 | `.agents/skills/harness-update/SKILL.md` | 자체 제작 |
| frontend-design | front/design | 새 UI와 기존 UI에 제품·사용자 맥락에 맞는 시각 방향, 타이포그래피, 레이아웃을 설계하고 구현 | `.agents/skills/frontend-design/SKILL.md` | [anthropics/skills](https://github.com/anthropics/skills) (Apache-2.0) |
| design-taste-frontend | front/design | 회사·제품·랜딩 페이지 제작과 리디자인. 업종별 레이아웃, 실제 사진·제품 UI, 브라우저 검증 | `.agents/skills/design-taste-frontend/SKILL.md` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (MIT) |
| ui-ux-pro-max | front/design | 스타일·팔레트·폰트·UX 가이드라인 로컬 데이터 검색으로 디자인 시스템 생성, UI 설계·리뷰·수정 (웹·모바일·데스크톱) | `.agents/skills/ui-ux-pro-max/SKILL.md` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (MIT) |
| impeccable | front/design | 프론트엔드 UI 설계·리디자인·비평·감사·다듬기. critique/audit/polish/animate 등 하위 명령어, PRODUCT.md·DESIGN.md 관리 | `.agents/skills/impeccable/SKILL.md` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) (Apache-2.0) |

### 디자인 스킬 선택 기준

새 UI 제작·기존 UI 개선에는 hallmark, frontend-design, design-taste-frontend, ui-ux-pro-max, impeccable의 자동 호출 조건이 겹친다. 원하는 스킬이 있으면 이름으로 직접 호출한다.

| 상황 | 스킬 |
|---|---|
| 새 페이지, 테마 기반, 디자인 시스템 고정 | hallmark |
| 새 UI·기존 UI의 시각 방향 설계 (범용) | frontend-design |
| 회사·제품·랜딩 페이지를 사진·에셋과 브라우저 검증까지 | design-taste-frontend |
| 업종·제품 유형에 맞는 스타일·색상·폰트를 데이터 기반으로 선정, 디자인 시스템 문서화 | ui-ux-pro-max |
| 기존 UI 비평·감사·다듬기 등 세분화된 개선 작업, 네이티브(iOS/Android) 화면 | impeccable |

## 스킬별 사용법

- 호출 방식: Claude Code는 `/{skill-name}`, Codex는 `${skill-name}`으로 직접 호출하거나, 설명에 맞는 자연어 요청으로 자동 호출된다.
- 아래 예시는 Claude Code 기준이며, Codex에서는 `/`를 `$`로 바꿔 사용한다.

### hallmark

| 명령어 | 설명 |
|---|---|
| `/hallmark <만들 페이지 설명>` | 새 페이지/컴포넌트 생성. 테마를 자동으로 골라 적용 (ex. `/hallmark 개발자 블로그 랜딩 페이지`) |
| `/hallmark <설명>, <테마명> 테마로` | 지정한 테마로 생성. 테마 목록은 `hallmark/references/themes/` 참고 |
| `/hallmark <설명>, custom` | 테마 없이 프롬프트에 맞춘 독자적인 디자인으로 생성 |
| `/hallmark redesign <경로>` | 기존 페이지/앱을 콘텐츠와 동작은 유지한 채 전면 리디자인 |
| `/hallmark audit <경로>` | 기존 디자인을 점검하고 리포트만 작성 (수정 없음) |
| `lock the system` | 생성 후 디자인 시스템을 `design.md`로 고정. 이후 페이지들이 같은 시스템을 공유 |

- 기존 디자인 수정에는 hallmark를 이름으로 지정했을 때만 사용된다. 그 외의 기존 화면 수정은 프로젝트의 기존 방식대로 진행한다.
- 생성 전 소재/대상/목적/톤을 질문하며, `go ahead`라고 답하면 알아서 추론해 진행한다.

### harness-update

| 명령어 | 설명 |
|---|---|
| `하네스 업데이트 해줘` / `규칙 업데이트 해줘` / `/harness-update` | 규칙 문서, `skills/README.md`, `harness-update` 스킬을 최신화. 변경 목록을 먼저 보여주고 허락 후 적용 |
| `하네스 업데이트 해줘, hallmark 스킬도 같이` | 지정한 상세 스킬도 함께 추가/업데이트 |
| `하네스 업데이트 해줘, 스킬 전부 포함` | 모든 상세 스킬까지 업데이트 |

스크립트 직접 실행 (프로젝트 루트에서):

```bash
# 1. 변경 목록 확인 (파일 변경 없음, 출력된 source 경로를 기억)
node .agents/skills/harness-update/scripts/harness-update.mjs plan [--skills hallmark|all]

# 2. 적용 (AGENTS.md/CLAUDE.md는 --root-docs review|apply|updated 로 처리 방식 지정, 기본 review)
node .agents/skills/harness-update/scripts/harness-update.mjs apply --source <source> [--skills hallmark|all] [--root-docs updated]

# 적용하지 않고 중단할 때 임시 디렉토리 삭제
node .agents/skills/harness-update/scripts/harness-update.mjs cleanup --source <source>
```

### frontend-design

| 명령어 | 설명 |
|---|---|
| `/frontend-design <만들 UI 설명>` | 제품과 사용자 맥락을 바탕으로 색상, 타이포그래피, 레이아웃을 계획하고 검토한 뒤 구현 (ex. `/frontend-design 독립 서점의 신간 소개 페이지`) |
| `/frontend-design <기존 UI 경로와 변경 목표>` | 기존 UI의 시각 방향을 변경 목표에 맞게 다시 설계하고 구현 |

- 제품이나 주제가 명확하지 않으면 대상 사용자와 화면의 주된 목적을 포함한 방향을 제안하고 확인한 뒤 설계한다.

### design-taste-frontend

| 명령어 | 설명 |
|---|---|
| `/design-taste-frontend <만들 사이트 설명>` | 업종과 주요 행동을 정하고, 페이지 구성·카피·사진 또는 제품 UI를 설계해 사이트를 구현 |
| `/design-taste-frontend <기존 페이지 경로> 리디자인해줘` | 기존 프로젝트의 기술 스택에서 페이지를 재설계 |
| `/design-taste-frontend <기존 페이지 경로> 디자인 검토해줘` | 기존 페이지의 카피, 시각 자료, 레이아웃, 반응형 동작을 점검 |

- 검증 도구에 Node.js 22 이상과 Chrome/Edge/Chromium이 필요하다. ffmpeg는 선택 사항.
- 제작 시 1440·1024·768·390px 너비를 브라우저로 확인하고, `scripts/gate.mjs`로 완료 조건을 검사한다.
- 사진·아이콘 등 에셋을 포함해 용량이 크다 (약 39MB).

### ui-ux-pro-max

| 명령어 | 설명 |
|---|---|
| `/ui-ux-pro-max <만들 UI 설명>` | 제품 유형·업종에 맞는 스타일, 팔레트, 폰트, UX 규칙을 검색해 디자인 시스템을 정하고 구현 (ex. `/ui-ux-pro-max 뷰티 스파 예약 랜딩 페이지`) |
| `/ui-ux-pro-max <기존 UI 경로> 리뷰해줘` | 접근성, 터치, 반응형, 타이포그래피 등 우선순위별 규칙으로 기존 UI 점검 및 수정 |
| `/ui-ux-pro-max <설명>, 디자인 시스템 저장해줘` | `design-system/<project>/MASTER.md`(+ 페이지별 override)로 디자인 시스템을 저장해 이후 페이지가 공유 |

스크립트 직접 실행 (스킬 디렉토리에서):

```bash
# 디자인 시스템 추천 (--persist로 파일 저장, --tokens css|dtcg로 토큰 출력, --preview로 미리보기 HTML)
python scripts/search.py "<제품 유형> <업종> <키워드>" --design-system [-p "프로젝트명"]

# 도메인별 검색 (style, color, typography, ux 등)
python scripts/search.py "<키워드>" --domain <domain>
```

- 검색 스크립트에 Python 3.x가 필요하다 (표준 라이브러리만 사용, 네트워크 호출 없음).

### impeccable

| 명령어 | 설명 |
|---|---|
| `/impeccable` | 프로젝트 상황에 맞는 명령어 메뉴를 보여줌 (자동 실행 없음) |
| `/impeccable <만들 UI 설명>` | 일반 디자인 작업. PRODUCT.md가 없으면 `init`으로 제품 맥락부터 정리한 뒤 진행 |
| `/impeccable init` / `/impeccable document` | 제품 맥락을 `PRODUCT.md`로 기록 / 기존 코드에서 `DESIGN.md` 생성 |
| `/impeccable shape <기능>` | 코드 작성 전 UX/UI 계획 |
| `/impeccable critique <대상>` / `/impeccable audit <대상>` | 휴리스틱 점수 기반 UX 리뷰 / 접근성·성능·반응형 기술 점검 |
| `/impeccable polish <대상>` | 출시 전 최종 다듬기 |
| `/impeccable bolder·quieter·distill·harden·onboard <대상>` | 과감하게 / 차분하게 / 단순화 / 에러·i18n·엣지케이스 보강 / 첫 실행·빈 상태 설계 |
| `/impeccable animate·colorize·typeset·layout·delight·overdrive <대상>` | 모션 / 색상 / 타이포그래피 / 간격·위계 / 개성 / 한계 돌파 |
| `/impeccable clarify·adapt·optimize <대상>` | UX 문구 / 기기·화면 크기 대응 / UI 성능 |
| `/impeccable live` / `/impeccable generate <n> <요소>` | 브라우저에서 요소를 골라 변형안 반복 / 지정 요소의 변형안 생성 |

- 세션마다 처음 한 번 `scripts/impeccable context`(Windows에서 `sh`가 없으면 `scripts/impeccable.cmd`)를 실행해 PRODUCT.md·DESIGN.md를 불러온다.
- 런처는 동봉되었거나 첫 실행 시 한 번 내려받는 자체 실행 바이너리를 사용하며, Node 등 별도 런타임이 필요 없다.
- 렌더링 결과 확인은 `scripts/impeccable shot <page>`로 한다.
