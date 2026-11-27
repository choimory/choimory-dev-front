# 목차

- [개요](#개요)
- [리뷰 수정 계획](#리뷰-수정-계획)
  - [답변](#답변)
  - [결정 사항](#결정-사항)
  - [수정 항목 (10개)](#수정-항목-10개)
    - [공용](#공용)
    - [platform](#platform)
    - [auth](#auth)
    - [blog](#blog)
    - [feed 목록](#feed-목록)
    - [feed 상세](#feed-상세)
  - [주인에게 넘길 것 (3개)](#주인에게-넘길-것-3개)
  - [건너뛰는 것 (1개)](#건너뛰는-것-1개)
  - [테스트 처리](#테스트-처리)
  - [진행 순서](#진행-순서)
  - [수정될 파일](#수정될-파일)
  - [완료 후](#완료-후)

---

# 개요

- 4단계 마무리 리뷰(Claude, GPT Sol 6.2 모두 판정 fix)에서 나온 지적 13개와 기타 의견의 처리 계획.
- 모든 항목을 task5.md의 추천 처리안대로 진행한다: 10개 수정, 3개 주인에게 넘김, 1개 건너뜀. 블로그 빈 이미지는 가안(아이콘 자리 표시).
- 4단계는 순차 단계라 Claude 단독으로 수정한다.
- 리뷰 원문과 비교표는 task5.md 참고.

---

# 리뷰 수정 계획

> 리뷰 수정사항 모두 추천방식으로 진행하는걸로 plan6 작성

## 답변

리뷰 지적 사항을 모두 추천 방식으로 처리하기로 확정. 아래 순서로 수정하고, hallmark 규칙대로 같은 스크린샷을 다시 찍어 지적마다 해결 여부를 직접 채점한 뒤 보고한다.

## 결정 사항

| 항목 | 결정 |
|---|---|
| 1. 블로그 빈 이미지 | **가**: 공용 `Icon`에 이미지 아이콘 추가, 빈 박스 대신 아이콘 자리 표시, 목록에서는 크기 축소 |
| 2~7, 9~12 | 수정 (Claude 직접) |
| 8, 13, 테마 전환 기능 | 주인에게 넘김 (새 로직이 필요해 리디자인 범위 밖) |
| "실시간 순위" 제목 | 건너뜀 (한국어 문구 유지 결정) |
| 4번으로 깨지는 테스트 2줄 | 승인된 것으로 보고 같이 수정 |

## 수정 항목 (10개)

번호는 task5.md 비교표의 번호.

### 공용

**3. 상단바 로그인/로그아웃 버튼** (`src/shared/ui/TopBarActions.tsx`)

- 지금: 모든 화면에서 코발트 주요 키(`key key-primary bg-primary`).
- 수정: 회색 보조 키(`key`)로 바꿈. 높이·위치·`href`는 그대로.
- 효과: 비회원 화면의 파란 버튼 중복이 없어지고, 회원 화면에서 "로그아웃"이 주요 버튼이 되는 문제가 사라짐. 코발트는 각 화면의 주요 동작(로그인 제출, 글쓰기 등)에만 남음.

**1번용 아이콘 추가** (`src/shared/ui/Icon.tsx`)

- `image` 아이콘 하나 추가(사각 프레임 + 산 모양 선, 기존 아이콘과 같은 2px 선).

### platform

**5. 회원 홈 준비 중 서비스** (`src/features/platform/components/MemberServiceFeedSection.tsx`)

- 지금: 준비 중 서비스 4개(커뮤니티, 메모, 일정, 가계부)가 각각 큰 패널이라 하단의 약 45%를 차지.
- 수정: 4개를 한 패널 안의 구분선 행으로 묶음. 행마다 아이콘 타일, 서비스 이름, 설명, "준비 중" 표시. 문구는 그대로이고 흐림 표시(`opacity-75`)도 유지.
- 효과: 데이터가 있는 블로그·피드 패널이 화면 앞쪽 무게를 가져감.

### auth

**12. 로그인 화면 회원가입** (`src/features/auth/components/LoginView.tsx`)

- 지금: 폼 오른쪽 끝 작은 링크.
- 수정: 리디자인 전처럼 로그인 버튼 바로 아래 전체 폭 보조 키(회색 키캡)로 되돌림. `href`는 그대로.

### blog

**1. 빈 이미지 자리** (`src/features/blog/components/BlogPostCard.tsx`, `BlogPostDetailView.tsx`)

- 지금: 이미지 주소 없이 빈 면만 그려 깨진 이미지처럼 보임. 상세에서는 화면에서 가장 큰 요소.
- 수정: 빈 면 가운데에 이미지 아이콘을 흐린 색으로 표시해 "이미지가 들어갈 자리"로 읽히게 함. 목록은 작은 정사각 썸네일로 줄이고, 상세는 높이를 제한함. `aria-label="게시글 이미지"`와 링크는 그대로라 기존 테스트 유지.
- 실제 이미지 주소가 데이터에 생기면 이 자리에 그대로 넣으면 됨(주인에게 넘길 것에 기록).

**4. 인기 순위 상태 표시** (`src/features/blog/components/BlogPopularInsightSection.tsx`)

- 지금: `↑ 12`, `NEW`에 연한 배경 칩(`bg-primary-soft`, `bg-accent-green-soft`).
- 수정: 배경을 빼고 상태 색 글자만 남김(`text-primary`, `text-accent-green`, `text-accent-red`, `text-muted`). `design.md` "상태는 글자로" 규칙에 맞춤.

### feed 목록

**2. 관찰 목록 숫자** (`src/features/feed/components/TargetPreviewLink.tsx`, 필요하면 `TargetListLink.tsx`, `FeedView.tsx`)

- 지금: 현재가·목표가가 이름 아래 작은 보조 문구에 묶여 있음.
- 수정: 행 오른쪽 열에 현재 값을 큰 표 형식 숫자(`font-display`, `tabular-nums`)로 올리고, 목표가 같은 보조 값과 변동(`7일간 -8%` 등)은 그 아래 작게 둠. 변동 색(`text-primary`, `text-accent-red`, `text-muted`)은 테스트가 확인하므로 유지.
- 디자인의 기록 줄(signature: "the watch list, figures in tabular grotesk on hairline rows")에 맞춤.

### feed 상세

**6. 대상 상세 히트맵과 반복 패널** (`src/features/feed/components/BroadcastContributionGraph.tsx`, `StreamerDetailSection.tsx`, `ListPanel.tsx`)

- 히트맵: 7칸이 패널 폭 전체를 쓰도록 칸을 늘림(최소 44px 터치 영역 유지).
- 한 줄짜리 섹션(원본 채널, 최근 방송/이벤트 목록)은 큰 패널 대신 제목 + 구분선 행으로 바꿔 패널 반복을 줄임.

**7. 375px 숫자 줄바꿈** (`src/features/feed/components/FeedTargetDetailView.tsx`, 해당 상세 섹션)

- 지금: 상단 3칸 요약이 좁은 폭에서 두세 줄로 꺾임(`이벤트 12건`, `신곡 발매 2일 전` 등).
- 수정: 좁은 폭(640px 미만)에서는 3칸을 한 줄씩 쌓는 목록(라벨 왼쪽, 값 오른쪽)으로 바꾸고, 넓은 폭에서는 지금처럼 3칸. 상세 섹션 안의 2칸 숫자도 같은 방식.

**9. 가격 그래프 점 터치 영역** (`src/features/feed/components/MiniLineChart.tsx`)

- 지금: 점 지름 약 8px.
- 수정: 보이는 점 크기는 그대로 두고, 점마다 투명한 넓은 터치 영역(44px)을 줌. `aria-label`, `tabIndex`, 포커스·호버 동작은 그대로.

**10. 스트리머 상세 순서** (`src/features/feed/components/StreamerDetailSection.tsx`)

- 지금: 방송 관찰 → 방송 기록 → 채팅 기록 → … → 원본 채널.
- 수정: 리디자인 전 순서로 되돌림: 방송 관찰 → 원본 채널 → 방송 기록 → 채팅 기록 → 최근 방송/이벤트.

**11. 아티스트 상세 순서** (`src/features/feed/components/ArtistDetailSection.tsx`)

- 지금: 최근 앨범(캐러셀)이 신곡 관찰(최근 신곡·예정 발매)보다 앞.
- 수정: 리디자인 전 순서로 되돌림: 신곡 관찰 → 최근 앨범.

## 주인에게 넘길 것 (3개)

| 번호 | 내용 | 이유 |
|---|---|---|
| 8 | 홈 서비스 목록이 넘치지 않을 때 좌우 화살표 숨기기 | 넘침을 감지하는 로직이 새로 필요 |
| 13 | 관찰 상태를 끄면 하위 알림 스위치를 비활성 표시 | 동작 변경. 리디자인 전에도 같았음 |
| - | `/me` 설정의 라이트·다크·시스템 선택에 맞는 테마 전환 기능 | 새 기능. 토큰은 두 모드 모두 준비됨 |

기존 "주인에게 넘길 것"(실데이터 연동, 로딩·오류 상태, 저장 API, `Modal` 키보드 동작, 보류한 공용 요청)과 함께 최종 보고에 넣는다.

## 건너뛰는 것 (1개)

- "실시간 순위" 제목이 흔하다는 GPT 의견: 한국어 문구는 그대로 두기로 한 결정에 따라 수정하지 않음.

## 테스트 처리

- 4번 때문에 `tests/unit/features/blog/components/BlogPopularInsightSection.test.tsx`의 61~62줄(배경 칩 클래스 확인)이 깨짐. 이번 결정으로 승인된 것으로 보고, 배경 클래스 확인만 빼고 상태 색 글자 확인은 유지하도록 고친다.
- 그 외에 깨지는 테스트가 나오면 바로 고치지 않고 목록으로 먼저 보고한다.
- 순서 변경(10, 11)과 숫자 배치(2, 7)는 역할·라벨로 찾는 테스트라 깨지지 않을 것으로 예상.

## 진행 순서

1. 공용 수정: `Icon` 이미지 아이콘, `TopBarActions` 버튼.
2. 화면 수정: platform → auth → blog → feed 목록 → feed 상세.
3. 검증: 타입 체크, 린트, 테스트, hallmark 정적 검사.
4. dev 서버를 다시 띄우고 hallmark 브라우저 검사와 유지 항목 대조(`--kept`)를 다시 돌림. 같은 스크린샷을 다시 찍음.
5. 지적마다 다시 찍은 스크린샷으로 직접 채점: 해결 / 부분 해결 / 미해결과 이유. hallmark 규칙상 판정이 fix이고 Floor 규칙 지적이 없으므로 리뷰어에게 다시 보내지 않음(채점은 두 번째 리뷰가 아님).
6. `globals.css` 기록 줄에 리뷰 결과 기록: `finish-review: subagent ×2 (Claude, GPT) · 지적 수 · 해결 수`.
7. 4단계 최종 보고 후 멈춤.

## 수정될 파일

| 구분 | 파일 |
|---|---|
| 공용 | `src/shared/ui/Icon.tsx`, `src/shared/ui/TopBarActions.tsx` |
| platform | `src/features/platform/components/MemberServiceFeedSection.tsx` |
| auth | `src/features/auth/components/LoginView.tsx` |
| blog | `src/features/blog/components/BlogPostCard.tsx`, `BlogPostDetailView.tsx`, `BlogPopularInsightSection.tsx` |
| feed 목록 | `src/features/feed/components/TargetPreviewLink.tsx` (필요하면 `TargetListLink.tsx`, `FeedView.tsx`) |
| feed 상세 | `src/features/feed/components/BroadcastContributionGraph.tsx`, `StreamerDetailSection.tsx`, `ListPanel.tsx`, `FeedTargetDetailView.tsx`, `ArtistDetailSection.tsx`, `ItemDetailSection.tsx`, `MiniLineChart.tsx` |
| 기록 | `src/app/globals.css` (기록 줄만), `tests/unit/features/blog/components/BlogPopularInsightSection.test.tsx` (61~62줄) |

## 완료 후

- 4단계 최종 보고(hallmark 형식: Before/After, Kept, Changed, Dropped, Yours, 예외, 주인에게 넘길 것, Compare).
- 이어서 작업 마무리: done1.md, calendar DONE, README.md 반영, `.hallmark/` 처리, `~/.cache/hallmark-tools`, dev 서버 종료.

---
