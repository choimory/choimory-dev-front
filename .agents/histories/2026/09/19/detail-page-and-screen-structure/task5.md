# 목차

- [개요](#개요)
- [구현사항](#구현사항)
  - [feed 홈 이동 흐름 보정](#feed-홈-이동-흐름-보정)
  - [feed 인기 화면 보정](#feed-인기-화면-보정)
  - [아이템 상세 그래프 고도화](#아이템-상세-그래프-고도화)
  - [스트리머 상세 고도화](#스트리머-상세-고도화)
  - [아티스트 상세 고도화](#아티스트-상세-고도화)
  - [내 feed 관찰대상 등록폼 추가](#내-feed-관찰대상-등록폼-추가)
  - [화면 용어 정리](#화면-용어-정리)
  - [README 갱신](#readme-갱신)
  - [추가사항1 구현](#추가사항1-구현)
  - [추가사항2 구현](#추가사항2-구현)
- [주요 변경 파일](#주요-변경-파일)
- [검증 결과](#검증-결과)
- [남은 범위](#남은-범위)

---

# 개요

- `plan5.md`의 feed 화면 디테일 조정과 화면구조 마무리 작업을 구현했다.
- feed 홈, 인기, 관찰 대상 상세, 내 feed 화면의 연결 흐름과 UI 디테일을 보정했다.
- 실제 API 연동 없이 mock/view data 기반으로 등록폼, 그래프, 방송 기록, 앨범/트랙 상세를 구성했다.
- 코드 타입명은 기존 target 구조를 유지하되, 사용자 화면 문구는 `대상`, `관찰 대상` 중심으로 정리했다.

---

# 구현사항

## feed 홈 이동 흐름 보정

feed 홈의 요약 카드와 최근 이벤트 이동 흐름을 보정했다.

구현 내용:

- 홈 상단 요약 카드를 클릭 가능한 링크로 변경했다.
- 요약 카드 클릭 시 `/feed/observations`로 이동하도록 연결했다.
- `FeedActivity`에 `targetId`를 추가했다.
- 홈의 최근 이벤트 클릭 시 기존 `/feed/activities/[activityId]`가 아니라 `/feed/targets/[targetId]`로 이동하도록 변경했다.
- 기존 `/feed/activities/[activityId]` 라우트는 호환 화면으로 유지했다.

## feed 인기 화면 보정

`/feed/popular` 화면의 랭킹 카드와 하단 이벤트 목록을 보정했다.

구현 내용:

- 랭킹 항목에서 description 표시를 제거했다.
- 랭킹 항목은 이름, type badge, trend badge 중심으로 압축했다.
- 랭킹 카드 아래에 `인기 대상 최근 이벤트` 섹션을 추가했다.
- 최근 이벤트 목록은 `FeedActivity` mock 데이터를 사용한다.
- 최근 이벤트 클릭 시 연결된 `/feed/targets/[targetId]`로 이동한다.

## 아이템 상세 그래프 고도화

아이템 상세 화면의 가격 그래프를 기간 선택과 축 정보가 있는 라인그래프로 고도화했다.

모델 변경:

- `FeedPriceRangeId` 타입 추가
- `FeedPricePoint` 타입 추가
- `FeedPriceRange` 타입 추가
- `FeedItemDetail`에 `priceRanges` 필드 추가

구현 내용:

- 아이템 가격 그래프에 기간 탭을 추가했다.
  - `1주`
  - `1개월`
  - `3개월`
  - `6개월`
  - `12개월`
- 기간별 mock 가격 포인트를 추가했다.
- SVG 라인그래프에 x축 날짜와 y축 가격 값을 표시했다.
- 그래프 포인트 hover/focus 시 선택된 날짜와 가격을 표시했다.
- 그래프가 카드 영역을 더 넓게 쓰도록 좌표 계산과 viewBox를 조정했다.

## 스트리머 상세 고도화

스트리머 상세 화면에 방송 기록, 채팅 기록, 원본 채널 링크를 추가했다.

모델 변경:

- `FeedBroadcastDay` 타입 추가
- `FeedChatMessage` 타입 추가
- `FeedStreamerDetail`에 다음 필드 추가
  - `channelName`
  - `channelUrl`
  - `broadcastDays`
  - `chatMessages`

구현 내용:

- 스트리머 상세에 원본 채널 링크 영역을 추가했다.
- 방송일자를 GitHub commit 잔디처럼 작은 grid로 표시했다.
- 각 방송일 칸에 hover title로 방송일, 시작 시간, 방송 제목, 방송 총 시간을 표시했다.
- 채팅 기록 섹션을 추가했다.
- 채팅 카드에는 채널명, 채팅 내용, 시간을 표시했다.

## 아티스트 상세 고도화

아티스트 상세 화면을 최근 앨범 carousel과 트랙 상세 중심으로 보정했다.

모델 변경:

- `FeedArtistAlbum` 타입 추가
- `FeedArtistTrack` 타입 추가
- `FeedArtistDetail`에 `albums` 필드 추가

구현 내용:

- 기존 신곡 발매 추이 막대그래프 대신 최근 앨범 carousel을 표시했다.
- 앨범 카드를 클릭하면 선택된 앨범 상세가 표시된다.
- 앨범 상세에는 발매일과 트랙 목록을 표시했다.
- 트랙별 재생시간을 표시했다.
- 트랙 클릭 시 작곡가, 작사가, 가사 preview를 표시했다.
- 실제 앨범 이미지는 없으므로 mock cover tone block으로 표현했다.

## 내 feed 관찰대상 등록폼 추가

`/feed/me` 화면에 관찰대상 등록폼을 추가했다.

구현 내용:

- 기존 추가 버튼 클릭 시 등록폼이 펼쳐지도록 변경했다.
- `FeedTargetCreateForm`을 추가했다.
- 하나의 등록폼 안에서 아이템, 스트리머, 아티스트 탭을 선택할 수 있게 했다.
- 공통 입력 필드를 추가했다.
  - 대상 이름
  - 설명
  - 원본 링크
  - 알림 주기
- 아이템 전용 입력 필드를 추가했다.
  - 현재 가격
  - 목표 가격
- 스트리머 전용 입력 필드를 추가했다.
  - 채널명
  - 채널 URL
  - 방송 알림
  - 채팅/이벤트 알림
- 아티스트 전용 입력 필드를 추가했다.
  - 최근 발매곡
  - 신곡/앨범 알림
  - 피처링/참여곡 알림
- 등록 버튼 클릭 시 mock `등록 준비 완료` 피드백을 표시한다.
- API 연결 전까지 실제 목록 추가는 하지 않는다.

## 화면 용어 정리

사용자 화면에 노출되는 `target` 표현을 `대상`, `관찰 대상` 중심으로 정리했다.

구현 내용:

- feed 홈의 `관찰 중인 target`을 `관찰 중인 대상`으로 변경했다.
- 인기 화면 제목을 `인기 관찰 대상 랭킹`으로 정리했다.
- 내 feed 추가 영역을 `관찰 대상 추가`로 정리했다.
- 설정 상세 설명에서 `target` 표현을 제거했다.
- 삭제 영역을 `관찰 대상 삭제`로 변경했다.

내부 코드 타입과 라우트는 기존 target 구조를 유지했다.

## README 갱신

feed 현재 화면 설명을 `plan5` 구현 내용에 맞게 갱신했다.

반영 내용:

- 인기 관찰 대상 랭킹 설명 갱신
- 관찰 대상 공통 상세 설명 갱신
- 기간 선택 가격 그래프 설명 추가
- 방송 기록, 앨범 carousel 설명 추가
- 관찰대상 등록폼 설명 추가
- 사용자 설명에서 target 표현을 관찰 대상 중심으로 변경

## 추가사항1 구현

`plan5` 추가사항1에 작성된 피드 화면 보정 사항을 구현했다.

구현 내용:

- 스트리머 상세의 방송 기록을 참고 이미지와 유사한 contribution graph 형태로 변경했다.
  - 월 라벨 영역을 추가했다.
  - 요일 라벨 영역을 추가했다.
  - 방송 강도별 작은 바둑알을 표시했다.
  - `Less` / `More` 범례를 추가했다.
- 스트리머 채팅 기록에서 채널명을 `{채널명} 에서` 형태로 표시했다.
- `/feed/me`의 관찰대상 등록폼을 본문 펼침 방식에서 모달 방식으로 변경했다.
  - 추가 버튼 클릭 시 등록 모달을 연다.
  - 배경 클릭 또는 닫기 버튼으로 모달을 닫을 수 있다.
  - 기존 아이템, 스트리머, 아티스트 등록 탭과 mock 입력 필드는 유지했다.
- 아이템 상세의 가격 변동 그래프를 보정했다.
  - 그래프 높이를 키웠다.
  - 그래프 카드 좌우 여백을 줄였다.
  - 그래프 선 두께를 줄였다.
  - 상단 가격표시 칸을 제거했다.
  - 그래프 점에 mouse hover 또는 focus 시 날짜와 가격을 표시하는 tooltip을 추가했다.
- `/feed/popular`에서 랭킹 카드와 최근 이벤트 목록을 별도 섹션으로 분리했다.
- 공통 상단바의 알림 버튼 오른쪽에 `/services`로 이동하는 서비스 버튼을 추가했다.
  - 기존 플랫폼 툴바에서 쓰는 `grid` 아이콘을 재사용했다.

## 추가사항2 구현

`plan5` 추가사항2에 작성된 상세 화면 인터랙션 고도화 사항을 구현했다.

모델 변경:

- `FeedBroadcastSession` 타입을 추가했다.
- `FeedBroadcastDay`에 `broadcasts` 필드를 추가했다.
- 하루에 여러 번 방송한 mock 데이터를 표현할 수 있게 했다.
- 기존 `startedAt`, `title`, `durationText` 필드는 대표 방송 표시와 호환을 위해 유지했다.

구현 내용:

- 스트리머 상세의 방송 기록 바둑알에 custom popover를 추가했다.
  - mouse hover 또는 keyboard focus 시 popover를 표시한다.
  - 방송일자를 표시한다.
  - 방송 제목, 방송 시작 시간, 총 방송 시간을 표시한다.
  - 하루에 방송이 여러 개 있으면 popover 안에 방송 session 목록을 모두 표시한다.
- 아이템 상세의 가격 변동 그래프 tooltip 동작을 수정했다.
  - hover 상태와 pinned 상태를 분리했다.
  - 점에 mouse hover 또는 focus가 들어왔을 때만 tooltip을 표시한다.
  - hover 해제 시 pinned 상태가 없으면 tooltip을 숨긴다.
  - 점을 클릭하면 해당 점의 tooltip을 고정한다.
  - 같은 점을 다시 클릭하면 고정을 해제한다.
  - 다른 점을 클릭하면 고정 대상을 변경한다.
  - hover 해제 후 최신 점 tooltip이 다시 표시되던 문제를 제거했다.
- 아이템 상세 가격 변동 그래프 표시를 보정했다.
  - y축 라벨을 숫자 value가 아니라 가격 텍스트로 표시했다.
  - 그래프 높이를 더 키웠다.
  - 그래프 wrapper 좌우 padding을 제거했다.
  - `viewBox`와 x축 사용 범위를 넓혀 그래프가 더 크게 보이게 했다.
- 아티스트 상세의 앨범 carousel을 3D 회전형으로 변경했다.
  - 중앙 앨범은 정면에 배치했다.
  - 좌우 앨범은 시계/반시계 방향으로 회전한 형태로 배치했다.
  - 좌우 이동 버튼으로 active album을 변경할 수 있게 했다.
  - 기존 mock cover tone을 앨범 상자처럼 보이도록 사용했다.
- 아티스트 앨범 상세 modal을 추가했다.
  - 앨범 클릭 시 앨범 상세 modal을 연다.
  - 앨범 modal에는 앨범명, 발매일, 트랙 목록을 표시한다.
  - 트랙 클릭 시 같은 modal 안에서 곡 상세 화면으로 전환한다.
  - 곡 상세 화면에는 곡명, 재생시간, 작곡가, 작사가, 가사 preview를 표시한다.
  - 곡 상세 화면의 왼쪽 위 뒤로가기 버튼으로 앨범 정보 화면에 돌아간다.
  - 닫기 버튼 또는 배경 클릭으로 modal을 닫는다.
- 공통 상단바 서비스 버튼을 링크에서 popover 버튼으로 변경했다.
  - 서비스 버튼 클릭 시 서비스 popover를 표시한다.
  - 서비스 popover에는 블로그, 피드, 메모, 일정, 가계부 아이콘을 표시한다.
  - 활성 서비스는 해당 서비스 경로로 이동한다.
  - 준비 중 서비스는 `/services`로 이동한다.
  - 서비스 popover와 알림 popover가 동시에 열리지 않도록 처리했다.
- README의 현재 화면 설명을 추가사항2 구현 내용에 맞게 갱신했다.

---

# 주요 변경 파일

- `README.md`
- `src/features/feed/model/feedTypes.ts`
- `src/features/feed/components/FeedView.tsx`
- `src/features/feed/components/FeedMenuView.tsx`
- `src/features/feed/components/FeedTargetDetailView.tsx`
- `src/features/feed/components/FeedTargetSettingsView.tsx`
- `src/shared/ui/TopBarActions.tsx`

---

# 검증 결과

다음 검증을 모두 통과했다.

- `npx tsc --noEmit`
- `npm run lint`
- `git diff --check`
- `npm run build`

`npm run build` 결과 기존 feed 라우트와 새 target 라우트가 정상 등록되었다.

- `/feed`
- `/feed/popular`
- `/feed/observations`
- `/feed/targets/[targetId]`
- `/feed/me`
- `/feed/me/targets/[targetId]`

---

# 남은 범위

- 실제 관찰대상 등록 API 연동
- 등록폼 입력값을 실제 목록에 반영하는 상태/API 정책 결정
- 실제 가격 데이터 API 연동
- 실제 방송 기록/채팅 기록 API 연동
- 실제 음원/앨범/트랙 데이터 API 연동
- 앨범 carousel에 실제 이미지 또는 외부 앨범 아트 연동
- 기존 `/feed/activities/[activityId]`와 `/feed/observations/[observationId]` 라우트의 장기 역할 정리
