# 목차

- [개요](#개요)
- [구현사항](#구현사항)
  - [feed target 모델 확장](#feed-target-모델-확장)
  - [feed 홈 화면 보정](#feed-홈-화면-보정)
  - [feed 메뉴 화면 재구성](#feed-메뉴-화면-재구성)
  - [target 공통 상세 화면 추가](#target-공통-상세-화면-추가)
  - [내 target 설정 상세 화면 추가](#내-target-설정-상세-화면-추가)
  - [README 갱신](#readme-갱신)
- [주요 변경 파일](#주요-변경-파일)
- [검증 결과](#검증-결과)
- [남은 범위](#남은-범위)

---

# 개요

- `plan4.md`의 3차 구현 범위인 feed target 관찰 서비스 구조를 구현했다.
- 기존 feed는 `observations`, `activities` 중심의 알림/관찰 목록 구조였지만, 이번 구현에서 아이템/스트리머/아티스트를 공통 target으로 다루는 구조를 추가했다.
- 실제 API 연동 없이 mock/view data 기반으로 인기 target, 관찰 target, 내 target 설정 흐름을 구성했다.
- 기존 `/feed/observations/[observationId]`, `/feed/activities/[activityId]` 라우트는 제거하지 않고 호환 화면으로 유지했다.

---

# 구현사항

## feed target 모델 확장

`feedTypes.ts`에 공통 target 모델과 type별 상세 mock 타입을 추가했다.

추가한 주요 타입:

- `FeedTargetType`
  - `item`
  - `streamer`
  - `artist`
- `FeedTargetTrendDirection`
- `FeedWatchTarget`
- `FeedItemDetail`
- `FeedStreamerDetail`
- `FeedArtistDetail`

구현 내용:

- `FeedViewModel`에 `targets` 필드를 추가했다.
- 기존 `FeedObservationItem`, `FeedActivity`는 유지했다.
- 아이템 target mock을 추가했다.
  - 현재 가격
  - 목표 가격
  - 가격 변화 문구
  - 가격 추이 mock
- 스트리머 target mock을 추가했다.
  - 방송 상태
  - 방송 추이
  - 이벤트 추이
  - 최근 방송/이벤트 목록
- 아티스트 target mock을 추가했다.
  - 최근 신곡
  - 예정 발매 정보
  - 신곡 발매 추이
  - 최근 발매 목록

## feed 홈 화면 보정

`FeedView`를 아이템/스트리머/아티스트 관찰 서비스에 맞게 보정했다.

구현 내용:

- feed 설명을 가격, 방송, 신곡 알림을 관찰하는 서비스로 변경했다.
- 홈 히어로 문구를 `가격, 방송, 신곡 알림을 한 피드에서`로 변경했다.
- 로그인 사용자 요약 카드를 4개 지표 구조로 변경했다.
  - 등록 수
  - 관찰 중
  - 새 알림
  - 관심 항목
- 로그인 사용자 관심 피드 목록을 기존 `observations`가 아니라 `targets` 기반으로 표시했다.
- 관심 target 클릭 시 `/feed/targets/[targetId]`로 이동하도록 연결했다.
- 비회원 안내에 아티스트 신곡 알림과 target 관찰 서비스 설명을 반영했다.

## feed 메뉴 화면 재구성

`FeedMenuView`를 메뉴별 전용 화면에 가깝게 재구성했다.

### `/feed/popular`

인기 알림 목록이 아니라 인기 target 랭킹 화면으로 변경했다.

구현 내용:

- 아이템, 스트리머, 아티스트를 한 목록에 섞어서 표시했다.
- target type badge를 표시했다.
- 순위, target 이름, 요약, 상태, 지표, 추이 문구를 표시했다.
- target 클릭 시 `/feed/targets/[targetId]`로 이동하도록 연결했다.

### `/feed/observations`

관찰 목록을 target 목록으로 변경했다.

구현 내용:

- 내가 관찰 중인 target만 표시했다.
- 관찰 중 요약 카드를 추가했다.
- 아이템/아티스트 수를 함께 표시했다.
- target 클릭 시 `/feed/targets/[targetId]`로 이동하도록 연결했다.

### `/feed/me`

내 feed 메뉴를 내 feed 관리 홈으로 변경했다.

구현 내용:

- 내 피드 요약 카드를 표시했다.
- 관찰 target 추가 카드와 추가 버튼을 배치했다.
- 내가 관리 중인 target 목록을 표시했다.
- target 클릭 시 `/feed/me/targets/[targetId]`로 이동하도록 연결했다.

## target 공통 상세 화면 추가

`/feed/targets/[targetId]` 라우트를 추가했다.

추가한 파일:

- `src/app/feed/targets/[targetId]/page.tsx`
- `src/features/feed/container/FeedTargetDetailContainer.tsx`
- `src/features/feed/components/FeedTargetDetailView.tsx`

구현 내용:

- 공통 target 요약 카드 표시
- 상태, 지표, 추이 요약 표시
- type별 상세 섹션 분기
- 최근 알림 목록 표시

type별 상세:

- 아이템
  - 현재 가격
  - 목표 가격
  - 가격 변화 문구
  - 가격 추이 mock bar chart
  - 최근 가격 알림
- 스트리머
  - 방송 상태
  - 방송 추이
  - 이벤트 추이
  - 최근 방송/이벤트 목록
- 아티스트
  - 최근 신곡
  - 예정 발매 정보
  - 신곡 발매 추이 mock bar chart
  - 최근 발매 목록
  - 피처링/참여곡 알림

## 내 target 설정 상세 화면 추가

`/feed/me/targets/[targetId]` 라우트를 추가했다.

추가한 파일:

- `src/app/feed/me/targets/[targetId]/page.tsx`
- `src/features/feed/container/FeedTargetSettingsContainer.tsx`
- `src/features/feed/components/FeedTargetSettingsView.tsx`

구현 내용:

- client component로 설정 상태를 mock 관리했다.
- 관찰 on/off 토글을 추가했다.
- 알림 주기 선택을 추가했다.
  - 즉시
  - 하루 요약
  - 주간 요약
- target type별 설정 UI를 분기했다.
- 삭제 mock 영역을 추가했다.

type별 설정:

- 아이템
  - 가격 알림 on/off
  - 목표 가격 입력
- 스트리머
  - 방송 알림 on/off
  - 채팅/이벤트 알림 on/off
- 아티스트
  - 신곡/앨범 알림 on/off
  - 피처링/참여곡 알림 on/off

## README 갱신

현재 feed 구조와 라우트 설명을 새 구현 내용에 맞게 갱신했다.

반영 내용:

- `/feed/targets/[targetId]` 라우트 추가
- `/feed/me/targets/[targetId]` 라우트 추가
- feed 설명을 아이템, 스트리머, 아티스트 관찰 알림 서비스로 변경
- feed 주요 화면 요소 설명 갱신
- 향후 화면 설계 방향의 feed 설명 갱신

---

# 주요 변경 파일

- `README.md`
- `src/features/feed/model/feedTypes.ts`
- `src/features/feed/components/FeedView.tsx`
- `src/features/feed/components/FeedMenuView.tsx`
- `src/features/feed/components/FeedTargetDetailView.tsx`
- `src/features/feed/components/FeedTargetSettingsView.tsx`
- `src/features/feed/container/FeedTargetDetailContainer.tsx`
- `src/features/feed/container/FeedTargetSettingsContainer.tsx`
- `src/app/feed/targets/[targetId]/page.tsx`
- `src/app/feed/me/targets/[targetId]/page.tsx`

---

# 검증 결과

다음 검증을 모두 통과했다.

- `npx tsc --noEmit`
- `npm run lint`
- `git diff --check`
- `npm run build`

`npm run build` 결과 새 라우트가 정상 등록되었다.

- `/feed/targets/[targetId]`
- `/feed/me/targets/[targetId]`

---

# 남은 범위

- 실제 target 검색/등록 화면 또는 등록 모달 구현
- 실제 target 추가 동작
- 실제 알림 설정 저장 API 연동
- 실제 가격 API 연동
- 실제 방송 상태 API 연동
- 실제 음원/아티스트 발매 정보 API 연동
- 실제 chart library 도입 여부 결정
- 기존 `/feed/observations/[observationId]`, `/feed/activities/[activityId]` 역할 재정리
- target별 empty state와 not found 처리

---

# 추가사항 구현사항

`plan4.md`의 추가사항과 추가사항 분석 내용을 기준으로 feed 랭킹, target 상세, target 설정 상세, 관찰 카운팅을 보정했다.

## feed 인기 랭킹 보정

`/feed/popular` 화면을 블로그 인기 랭킹과 비슷한 탭형 랭킹 구조로 보정했다.

구현 내용:

- `FeedMenuView`를 client component로 전환했다.
- feed 랭킹 탭을 추가했다.
  - 전체
  - 아이템
  - 스트리머
  - 아티스트
- 탭 클릭 시 target type별로 랭킹 목록을 필터링한다.
- 랭킹 항목에 순위 박스를 표시했다.
- target type badge를 표시했다.
- target의 `trendDirection`을 이용해 등락 badge를 표시했다.
- 기존 `blog-ranking-enter` animation class를 재사용해 순차 등장 애니메이션을 적용했다.

## 관찰 페이지 카운팅 카드 보정

`/feed/observations` 화면 상단 카운팅 카드를 target type별로 모두 표시하도록 보정했다.

변경 전:

- 관찰 중
- 아이템
- 아티스트

변경 후:

- 관찰 중
- 아이템
- 스트리머
- 아티스트

구현 내용:

- grid를 `grid-cols-2 sm:grid-cols-4` 구조로 변경했다.
- 스트리머 카운팅 카드를 추가했다.

## 아이템 가격 추이 라인그래프 변경

아이템 상세 화면의 가격 추이를 막대그래프에서 라인그래프로 변경했다.

구현 내용:

- `MiniLineChart`를 추가했다.
- 아이템 상세의 가격 추이에는 `MiniLineChart`를 사용하도록 변경했다.
- chart library 없이 SVG `polyline`과 `circle` 기반 mock 라인그래프로 구현했다.
- 아티스트 신곡 발매 추이는 기존 막대그래프를 유지했다.

## 아이템 원본 링크 표시

아이템 상세에 사용자가 저장한 원본 링크 정보를 표시하도록 보정했다.

모델 변경:

- `FeedItemDetail`에 `sourceName` 추가
- `FeedItemDetail`에 `sourceUrl` 추가

구현 내용:

- 아이템 mock 데이터에 원본 링크 이름과 URL을 추가했다.
- 아이템 상세의 가격 관찰 섹션 안에 `원본 링크` 영역을 추가했다.
- 원본 링크는 새 창으로 열리도록 `target="_blank"`와 `rel="noreferrer"`를 적용했다.

## 관련 뉴스/커뮤니티 글 추가

아이템, 스트리머, 아티스트 target 상세에서 관련 뉴스나 커뮤니티 글을 볼 수 있도록 공통 섹션을 추가했다.

모델 변경:

- `FeedRelatedArticle` 타입을 추가했다.
- `FeedWatchTarget`에 `relatedArticles` 필드를 추가했다.

구현 내용:

- 모든 target mock 데이터에 관련 소식 목록을 추가했다.
- target 상세 하단에 `관련 소식` 섹션을 추가했다.
- 각 항목에는 제목, 출처, 시간, 원문 링크를 표시했다.
- 실제 크롤링 연동 전까지는 mock 목록을 표시한다.

## 내 target 설정 저장 버튼 추가

`/feed/me/targets/[targetId]` 설정 상세 화면에 저장 액션을 추가했다.

구현 내용:

- `isSaved` 상태를 추가했다.
- 설정 변경 시 저장 상태를 다시 미저장 상태로 돌리도록 처리했다.
- 설정 화면 하단에 `취소`, `저장` 버튼을 추가했다.
- `저장` 버튼 클릭 시 mock 저장 완료 문구를 표시한다.
- 저장 후 버튼 텍스트를 `저장 완료`로 변경한다.

## README 갱신

feed 현재 화면 설명을 추가사항 구현 내용에 맞게 갱신했다.

반영 내용:

- 인기 target 랭킹이 탭과 애니메이션을 포함한다는 설명 추가
- target 상세가 가격 라인그래프, 원본 링크, 관련 뉴스/커뮤니티 글을 포함한다는 설명 추가
- 내 feed target 설정 상세에 저장 버튼이 있다는 설명 추가

## 추가 검증 결과

다음 검증을 모두 통과했다.

- `npx tsc --noEmit`
- `npm run lint`
- `git diff --check`
- `npm run build`
