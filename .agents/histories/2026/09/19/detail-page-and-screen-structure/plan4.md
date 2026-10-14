# 목차

- [개요](#개요)
- [3차 구현 범위](#3차-구현-범위)
  - [피드 target 모델 재정리](#피드-target-모델-재정리)
  - [피드 인기 화면](#피드-인기-화면)
  - [피드 관찰 화면](#피드-관찰-화면)
  - [피드 target 상세 화면](#피드-target-상세-화면)
  - [내 피드 화면](#내-피드-화면)
  - [내 피드 설정 상세](#내-피드-설정-상세)
- [추천 데이터 모델](#추천-데이터-모델)
- [추천 라우트 구조](#추천-라우트-구조)
- [화면별 상세 기획](#화면별-상세-기획)
  - [인기](#인기)
  - [관찰](#관찰)
  - [target 상세](#target-상세)
  - [내 피드](#내-피드)
  - [내 피드 설정](#내-피드-설정)
- [구현 방향](#구현-방향)
- [추천 구현 순서](#추천-구현-순서)
- [제외 범위](#제외-범위)
- [결정 포인트](#결정-포인트)

---

# 개요

`plan2.md`의 3차 구현 범위는 피드 서비스의 도메인 모델을 아이템/스트리머/아티스트 기준으로 재정리하고, 인기/관찰/내 피드 화면을 실제 사용 흐름에 맞게 고도화하는 작업이다.

현재 피드 구현은 `observations`, `activities` 중심으로 화면이 연결되어 있다. 하지만 `plan2.md`에서 정리한 피드 도메인은 관찰 대상 자체가 더 중요하다.

피드 관찰 대상은 크게 세 종류다.

- 아이템
  - 가격 정보
  - 가격 추이 그래프
  - 목표 가격
  - 가격 알림
- 스트리머
  - 방송 상태
  - 방송 추이
  - 이벤트 추이
  - 방송 알림
  - 채팅 알림
- 아티스트
  - 신곡 알림
  - 신곡 발매 추이
  - 앨범/싱글 발매 정보
  - 피처링/참여곡 알림
  - 활동 이벤트 알림

따라서 3차 구현에서는 피드를 단순 알림 목록이 아니라 `아이템/스트리머/아티스트 target을 관찰하고 설정하는 서비스`로 정리한다.

---

# 3차 구현 범위

## 피드 target 모델 재정리

기존 `FeedObservationItem`을 계속 키우기보다, 아이템, 스트리머, 아티스트를 모두 표현할 수 있는 공통 target 모델을 둔다.

구현 방향:

- `FeedWatchTarget` 같은 공통 모델을 추가한다.
- target type은 `item | streamer | artist`로 구분한다.
- 인기, 관찰, 내 피드에서 같은 target 데이터를 재사용할 수 있게 한다.
- target 상세 화면은 type에 따라 서로 다른 정보를 표시한다.

## 피드 인기 화면

`/feed/popular`는 인기 이벤트 목록보다 인기 target 랭킹을 보여주는 화면에 가깝게 정리한다.

구현 내용:

- 인기 아이템/스트리머/아티스트 랭킹 카드를 상단에 둔다.
- 아이템, 스트리머, 아티스트를 한 목록에 섞어 표시한다.
- 각 항목에는 `아이템`, `스트리머`, `아티스트` badge를 붙인다.
- 아이템은 등록 수, 가격 변동, 관심 수 같은 지표를 표시한다.
- 스트리머는 활동성, 방송 상태, 이벤트 증가 같은 지표를 표시한다.
- 아티스트는 신곡 발매 빈도, 최근 발매, 활동 이벤트 증가 같은 지표를 표시한다.
- 항목 클릭 시 공통 target 상세 화면으로 이동한다.

## 피드 관찰 화면

`/feed/observations`는 내가 관찰 등록한 target 목록으로 정리한다.

구현 내용:

- 내가 등록한 아이템/스트리머/아티스트 목록을 표시한다.
- 아이템, 스트리머, 아티스트는 일단 섞어서 보여준다.
- 각 항목에는 type badge를 표시한다.
- 항목 클릭 시 공통 target 상세 화면으로 이동한다.
- target 상세에서는 아이템/스트리머/아티스트의 추이 정보를 확인한다.

## 피드 target 상세 화면

인기 화면과 관찰 화면에서 target을 클릭했을 때 공통 상세 화면으로 이동한다.

구현 내용:

- `/feed/targets/[targetId]` 라우트를 추가한다.
- target type이 `item`이면 아이템 상세를 표시한다.
- target type이 `streamer`이면 스트리머 상세를 표시한다.
- target type이 `artist`이면 아티스트 상세를 표시한다.
- 아이템 상세에는 아이템 정보, 현재 가격, 목표 가격, 가격 추이 그래프 mock을 표시한다.
- 스트리머 상세에는 스트리머 정보, 방송 상태, 방송 추이, 이벤트 추이 mock을 표시한다.
- 아티스트 상세에는 아티스트 정보, 최근 신곡, 예정 발매, 신곡 발매 추이 mock을 표시한다.

## 내 피드 화면

`/feed/me`는 내가 관리하는 피드 설정과 관찰 대상 요약 화면으로 정리한다.

구현 내용:

- 상단 요약 카드에 등록 수, 관찰 중 수, 새 알림 수, 관심 항목 수를 표시한다.
- 추가 등록 버튼을 제공한다.
- 아래에는 내가 팔로잉 또는 관찰 중인 아이템/스트리머/아티스트 목록을 표시한다.
- 이 화면에서 target을 클릭하면 그래프 상세가 아니라 내 설정 상세로 이동한다.

## 내 피드 설정 상세

내 피드에서 target을 클릭하면 관찰 설정을 관리하는 화면으로 이동한다.

구현 내용:

- `/feed/me/targets/[targetId]` 또는 설정 모달을 고려한다.
- 아이템 설정에는 관찰 on/off, 삭제, 알림 주기, 목표 가격을 둔다.
- 스트리머 설정에는 관찰 on/off, 삭제, 방송 알림 on/off, 채팅 알림 on/off를 둔다.
- 아티스트 설정에는 관찰 on/off, 삭제, 신곡 알림 on/off, 앨범 알림 on/off, 피처링/참여곡 알림 on/off를 둔다.
- 가격 추이, 방송 추이, 발매 추이 확인보다 `내가 어떻게 알림을 받을지`를 조정하는 화면으로 본다.

---

# 추천 데이터 모델

초기 mock 기준으로는 다음 구조가 적합하다.

```ts
type FeedTargetType = 'item' | 'streamer' | 'artist';

type FeedWatchTarget = {
  id: string;
  type: FeedTargetType;
  name: string;
  summary: string;
  statusText: string;
  metricText: string;
  trendText: string;
  isWatching: boolean;
};
```

아이템 전용 상세 mock:

```ts
type FeedItemDetail = {
  currentPrice: number;
  targetPrice: number;
  priceChangeText: string;
  pricePoints: number[];
};
```

스트리머 전용 상세 mock:

```ts
type FeedStreamerDetail = {
  broadcastStatus: 'live' | 'offline';
  broadcastTrendText: string;
  eventTrendText: string;
  recentEvents: string[];
};
```

아티스트 전용 상세 mock:

```ts
type FeedArtistDetail = {
  latestReleaseTitle: string;
  upcomingReleaseText: string;
  releaseTrendText: string;
  releasePoints: number[];
  recentReleases: string[];
};
```

처음에는 하나의 mock 배열에서 type별 상세 필드를 optional로 둬도 된다. 다만 구현이 커지면 target 공통 정보와 type별 상세 정보를 분리하는 편이 좋다.

---

# 추천 라우트 구조

3차 구현에서 추천하는 라우트는 다음과 같다.

- `/feed`
  - feed 홈
- `/feed/popular`
  - 인기 target 랭킹
- `/feed/observations`
  - 내가 관찰 등록한 target 목록
- `/feed/targets/[targetId]`
  - target 공통 상세
- `/feed/me`
  - 내 피드 관리 홈
- `/feed/me/targets/[targetId]`
  - 내 target 관찰 설정 상세

기존 `/feed/activities/[activityId]`, `/feed/observations/[observationId]`는 당장 제거하지 않고 호환 또는 기존 mock 상세로 둘 수 있다. 새 구조가 안정되면 activity/observation 라우트의 역할을 다시 정리한다.

---

# 화면별 상세 기획

## 인기

`/feed/popular`는 인기 target 랭킹 화면이다.

구성:

1. 상단 title card
2. 인기 target 랭킹 카드
3. target 목록

표시 요소:

- 순위
- type badge
- target 이름
- 요약 설명
- 지표
- 등락 또는 추이 문구

아이템 예시:

- `그래픽카드 RTX 5070`
- `등록 128명`
- `가격 변동 큼`

스트리머 예시:

- `streamer.alpha`
- `방송 활동 증가`
- `이벤트 12건`

아티스트 예시:

- `artist.nova`
- `신곡 발매 증가`
- `최근 90일 3곡`

## 관찰

`/feed/observations`는 내가 관찰 중인 target 목록이다.

구성:

1. 상단 title card
2. 관찰 중 요약 카드
3. target 목록

표시 요소:

- type badge
- target 이름
- 현재 상태
- 마지막 변화
- 알림 상태

클릭 동작:

- target 클릭 시 `/feed/targets/[targetId]`로 이동한다.

## target 상세

`/feed/targets/[targetId]`는 아이템/스트리머/아티스트 공통 상세 화면이다.

공통 구성:

1. 상단 앱바
2. `feed / target` 라벨
3. target 요약 카드
4. type별 상세 섹션
5. 관련 알림 또는 이벤트 목록

아이템 상세:

- 현재 가격
- 목표 가격
- 가격 변화 문구
- 가격 추이 그래프 mock
- 최근 가격 알림

스트리머 상세:

- 방송 상태
- 방송 추이
- 이벤트 추이
- 최근 방송/이벤트 목록

아티스트 상세:

- 최근 신곡
- 예정 발매 정보
- 신곡 발매 추이
- 앨범/싱글 발매 정보
- 피처링/참여곡 알림
- 최근 활동 이벤트 목록

## 내 피드

`/feed/me`는 내가 관리하는 피드 설정 홈이다.

구성:

1. 내 피드 요약 카드
2. 추가 등록 버튼
3. 내가 관찰 중인 target 목록

요약 지표:

- 등록 수
- 관찰 중 수
- 새 알림 수
- 관심 항목 수

클릭 동작:

- target 클릭 시 `/feed/me/targets/[targetId]`로 이동한다.
- 추가 등록 버튼 클릭 시 등록 모달 또는 등록 화면으로 이동한다.

## 내 피드 설정

`/feed/me/targets/[targetId]`는 내 관찰 설정 상세 화면이다.

아이템 설정:

- 관찰 on/off
- 알림 주기
- 목표 가격
- 가격 알림 on/off
- 삭제

스트리머 설정:

- 관찰 on/off
- 방송 알림 on/off
- 채팅 알림 on/off
- 이벤트 알림 on/off
- 삭제

아티스트 설정:

- 관찰 on/off
- 신곡 알림 on/off
- 앨범 알림 on/off
- 피처링/참여곡 알림 on/off
- 활동 이벤트 알림 on/off
- 삭제

---

# 구현 방향

- 초기 구현은 mock 데이터 기반으로 한다.
- 아이템, 스트리머, 아티스트는 일단 섞은 목록으로 표현한다.
- type badge로 구분한다.
- 그래프는 실제 chart library 없이 간단한 막대/라인 mock UI로 시작한다.
- 실제 API 연동이나 실시간 데이터는 제외한다.
- 내 피드 설정은 실제 저장 없이 mock form 상태까지만 구현한다.
- 기존 feed 라우트와 큰 충돌이 없도록 새 target 라우트를 추가하는 방식으로 진행한다.

---

# 추천 구현 순서

1. `FeedWatchTarget` 모델과 mock 데이터를 추가한다.
2. `/feed/popular`를 인기 target 랭킹 화면으로 재구성한다.
3. `/feed/observations`를 관찰 중 target 목록으로 재구성한다.
4. `/feed/targets/[targetId]` 공통 상세 라우트를 추가한다.
5. target type별 상세 섹션을 구현한다.
6. `/feed/me` 상단 요약 카드와 추가 등록 버튼을 구현한다.
7. `/feed/me` target 목록을 설정 진입 목록으로 정리한다.
8. `/feed/me/targets/[targetId]` 설정 상세 라우트를 추가한다.
9. README의 feed 라우트와 현재 화면 설명을 갱신한다.
10. 타입 검사, lint, build, diff 공백 검사를 수행한다.

---

# 제외 범위

- 실제 가격 API 연동
- 실제 방송 상태 API 연동
- 실제 음원/아티스트 발매 정보 API 연동
- 실제 가격 추이 chart library 도입
- 실제 알림 등록/삭제 API 연동
- 실제 파일 또는 외부 서비스 연동
- 실시간 업데이트
- push 알림

---

# 결정 포인트

## 아이템/스트리머/아티스트 목록을 섞을지 분리할지

초기 구현에서는 섞은 목록이 좋다.

이유:

- 현재 mock 데이터 규모에 적합하다.
- 화면이 단순하다.
- type badge만으로도 구분이 가능하다.
- 나중에 탭을 추가하기 쉽다.

## target 상세 라우트를 공통으로 둘지 type별로 나눌지

초기 구현에서는 `/feed/targets/[targetId]` 공통 라우트가 좋다.

이유:

- 인기와 관찰에서 같은 상세로 이동할 수 있다.
- 아이템/스트리머/아티스트 공통 레이아웃을 재사용할 수 있다.
- type별 상세 섹션만 분기하면 된다.

## 내 피드 설정을 모달로 할지 라우트로 할지

초기 구현에서는 라우트가 더 좋다.

이유:

- 설정 항목이 아이템, 스트리머, 아티스트마다 다르다.
- 삭제, on/off, 알림 주기, 목표 가격 등 입력 요소가 많다.
- 모바일 화면에서 모달보다 독립 화면이 안정적이다.

다만 빠르게 화면 흐름만 검증하려면 설정 모달로 시작해도 된다.

---

# 구현 전 분석

> 구현 전 분석시작

## 현재 상태

현재 feed는 아직 `알림/관찰 목록 뼈대`에 가깝다.

현재 모델은 다음 중심으로 구성되어 있다.

- `FeedObservationItem`
  - 관찰 항목 제목
  - 분류
  - 관찰 상태
- `FeedActivity`
  - 알림 제목
  - 알림 출처
  - 표시 시간

현재 화면 데이터도 `observations`, `activities` 중심이다. 즉, 아직 아이템/스트리머/아티스트를 공통 target으로 다루는 구조는 아니다.

`FeedMenuView`는 `/feed/popular`, `/feed/observations`, `/feed/me`를 거의 같은 리스트 렌더링으로 처리한다.

- `observations` 메뉴는 `viewModel.observations`를 보여준다.
- `popular`, `me` 메뉴는 `viewModel.activities`를 보여준다.
- 따라서 인기 화면과 내 피드 화면이 아직 각자의 역할을 갖기보다 알림 목록 변형에 가깝다.

기존 상세 라우트는 다음처럼 이미 존재한다.

- `/feed/observations/[observationId]`
- `/feed/activities/[activityId]`

이 두 라우트는 기존 mock 상세 역할을 하므로 바로 제거하지 않고 호환 라우트로 남기는 편이 안전하다.

## 3차 구현의 성격

3차 구현은 기존 알림 리스트를 조금 꾸미는 작업이 아니라, feed 도메인을 target 관찰 중심으로 재정의하는 작업이다.

핵심 target은 다음 세 가지다.

- `item`
  - 가격
  - 목표가
  - 가격 추이
  - 가격 알림
- `streamer`
  - 방송 상태
  - 방송 추이
  - 이벤트 추이
  - 방송/채팅 알림
- `artist`
  - 신곡 알림
  - 앨범/싱글 발매
  - 신곡 발매 추이
  - 피처링/참여곡 알림

## 추천 모델 구조

`feedTypes.ts`에 기존 `FeedObservationItem`, `FeedActivity`를 바로 제거하기보다 새 target 타입을 추가하는 방향이 좋다.

추천 타입:

```ts
type FeedTargetType = 'item' | 'streamer' | 'artist';
```

추천 추가 모델:

- `FeedWatchTarget`
- `FeedItemDetail`
- `FeedStreamerDetail`
- `FeedArtistDetail`

추천 mock 데이터:

- `feedTargets`
- `feedPopularTargets`
- `feedWatchingTargets`
- `feedMyTargets`

처음에는 하나의 target 배열에서 `isPopular`, `isWatching`, `isMine` 같은 필드로 나눌 수도 있다. 다만 화면 의도가 다르기 때문에 구현이 커지면 인기/관찰/내 피드용 view data를 분리하는 편이 좋다.

## 화면별 구현 분석

### `/feed`

현재 feed 홈의 문구는 `방송 시작과 가격 하락을 한 피드에서`에 머물러 있다.

3차 구현에서는 아티스트 신곡 알림까지 포함해야 하므로 다음 방향으로 바꾸는 것이 좋다.

- 가격 알림
- 방송 알림
- 신곡 알림

비회원 안내 카드도 현재 스트리머/가격 중심이므로 아티스트 신곡 알림 카드를 추가하거나 기존 `사용자 정의 피드` 설명을 target 관찰 서비스에 맞게 바꾸는 것이 좋다.

### `/feed/popular`

현재는 활동 알림 리스트에 가깝다.

3차 구현에서는 인기 target 랭킹 화면으로 바꾼다.

표시 대상:

- 인기 아이템
- 인기 스트리머
- 인기 아티스트

표시 방식:

- 한 목록에 섞어서 표시
- `아이템`, `스트리머`, `아티스트` badge로 구분
- 순위, 이름, 요약, 지표, 추이 문구 표시

클릭 동작:

- `/feed/targets/[targetId]`로 이동

### `/feed/observations`

현재는 기존 `FeedObservationItem` 목록이다.

3차 구현에서는 내가 관찰 중인 target 목록으로 바꾼다.

표시 대상:

- 내가 관찰 중인 아이템
- 내가 관찰 중인 스트리머
- 내가 관찰 중인 아티스트

클릭 동작:

- target 클릭 시 `/feed/targets/[targetId]`로 이동
- 기존 `/feed/observations/[observationId]`는 당장 제거하지 않고 구버전 상세 또는 호환 상세로 둔다.

### `/feed/targets/[targetId]`

새로 추가해야 하는 공통 target 상세 화면이다.

공통 구성:

- 상단 앱바
- `feed / target` 라벨
- target 요약 카드
- type별 상세 섹션
- 최근 알림 또는 이벤트 목록

type별 상세:

- 아이템
  - 현재 가격
  - 목표 가격
  - 가격 변화 문구
  - 가격 추이 mock
  - 최근 가격 알림
- 스트리머
  - 방송 상태
  - 방송 추이 mock
  - 이벤트 추이 mock
  - 최근 방송/이벤트 목록
- 아티스트
  - 최근 신곡
  - 예정 발매 정보
  - 신곡 발매 추이 mock
  - 최근 발매 목록
  - 피처링/참여곡 알림

### `/feed/me`

현재는 `activities`를 보여주는 메뉴 화면에 가깝다.

3차 구현에서는 내 피드 관리 홈으로 재구성한다.

구성:

- 내 피드 요약 카드
- 추가 등록 버튼
- 내가 관리 중인 target 목록

요약 지표:

- 등록 수
- 관찰 중 수
- 새 알림 수
- 관심 항목 수

클릭 동작:

- target 클릭 시 `/feed/me/targets/[targetId]`로 이동
- 이 화면에서는 추이 상세가 아니라 알림 설정 상세로 들어가야 한다.

### `/feed/me/targets/[targetId]`

새로 추가해야 하는 내 target 설정 상세 화면이다.

아이템 설정:

- 관찰 on/off
- 알림 주기
- 목표 가격
- 가격 알림 on/off
- 삭제

스트리머 설정:

- 관찰 on/off
- 방송 알림 on/off
- 채팅 알림 on/off
- 이벤트 알림 on/off
- 삭제

아티스트 설정:

- 관찰 on/off
- 신곡 알림 on/off
- 앨범 알림 on/off
- 피처링/참여곡 알림 on/off
- 활동 이벤트 알림 on/off
- 삭제

## 영향 파일

주요 변경 예상 파일:

- `src/features/feed/model/feedTypes.ts`
- `src/features/feed/components/FeedView.tsx`
- `src/features/feed/components/FeedMenuView.tsx`
- `src/features/feed/container/FeedMenuContainer.tsx`
- `README.md`

새로 추가할 가능성이 높은 파일:

- `src/app/feed/targets/[targetId]/page.tsx`
- `src/app/feed/me/targets/[targetId]/page.tsx`
- `src/features/feed/container/FeedTargetDetailContainer.tsx`
- `src/features/feed/container/FeedTargetSettingsContainer.tsx`
- `src/features/feed/components/FeedTargetDetailView.tsx`
- `src/features/feed/components/FeedTargetSettingsView.tsx`

기존 유지 권장 파일:

- `src/app/feed/observations/[observationId]/page.tsx`
- `src/app/feed/activities/[activityId]/page.tsx`
- `src/features/feed/components/FeedObservationDetailView.tsx`
- `src/features/feed/components/FeedActivityDetailView.tsx`

## 구현 순서 추천

1. Next.js 16 동적 라우트 작성 방식을 로컬 docs에서 확인한다.
2. `FeedWatchTarget` 모델과 mock 데이터를 추가한다.
3. feed 홈 문구와 비회원 안내를 아이템/스트리머/아티스트 기준으로 정리한다.
4. `/feed/popular`를 인기 target 랭킹 화면으로 재구성한다.
5. `/feed/observations`를 관찰 중 target 목록으로 재구성한다.
6. `/feed/targets/[targetId]` 공통 상세 라우트를 추가한다.
7. target type별 상세 섹션을 구현한다.
8. `/feed/me`를 내 피드 관리 홈으로 재구성한다.
9. `/feed/me/targets/[targetId]` 설정 상세 라우트를 추가한다.
10. README의 feed 라우트와 현재 화면 설명을 갱신한다.
11. 타입 검사, lint, build, diff 공백 검사를 수행한다.

## 주의점

- 기존 observation/activity 라우트는 당장 제거하지 않는다.
- 3차 구현은 mock 기반으로 진행하고 실제 API 연동은 제외한다.
- 그래프는 chart library 없이 간단한 mock UI로 시작한다.
- `FeedMenuView`가 너무 커질 수 있으므로, 구현 중 분기 UI가 커지면 feed 전용 보조 컴포넌트 분리를 고려한다.
- README에는 작업 히스토리가 아니라 현재 구조와 라우트, 아키텍처 설명만 반영한다.

---

# 추가사항

- 피드의 랭킹도 블로그의 랭킹처럼 순위와 애니메이션 넣고 탭별로 구분 (랭킹 컴포넌트 재활용해도 되지 않나?)
- 아이템 상세의 가격추이 그래프 막대그래프가 아니라 라인그래프였음
- 아이템 상세에서 아이템 원본 링크도 표시 (사용자가 아이템 저장할때 링크로 저장하면 그걸 크롤링할거라서)
- 아이템, 스트리머, 아티스트 상세에 크롤링한 뉴스나 커뮤니티 글을 볼 수 있도록 추가
- 내 피드에서 관찰대상 설정할때 저장버튼 없는데 어케 저장됨?
- 관찰 페이지에서 위에 카운팅 카드가 아티스트는 없음

# 추가사항 분석

> 분석시작

## 전체 성격

이번 추가사항은 3차 feed target 구현 이후의 UI/UX 보정이다.

현재 3차 구현으로 아이템/스트리머/아티스트 target 구조, 인기/관찰/내 피드 화면, target 상세, target 설정 상세는 생겼다. 다만 다음 지점은 아직 1차 구현 수준이라 실제 서비스 화면처럼 느껴지려면 추가 보정이 필요하다.

- 인기 랭킹의 탭/순위/애니메이션
- 아이템 가격 추이 그래프 표현 방식
- target 원본 링크와 관련 외부 소식
- 설정 상세의 저장 액션
- 관찰 화면의 target type별 카운팅

## 피드 랭킹 탭/순위/애니메이션

현재 `FeedMenuView`의 `PopularTargetSection`은 전체 target을 하나의 목록으로 보여준다.

현재 상태:

- 전체 target을 rank 순서로 정렬한다.
- 우측에 `#rank`만 표시한다.
- target type별 탭은 없다.
- 블로그 인기 랭킹처럼 순위 박스, 등락 badge, 순차 등장 애니메이션은 없다.

블로그 랭킹 구현은 `BlogMenuView` 내부에 묶여 있다.

- `BlogPopularInsightSection`
- `BLOG_RANKING_TABS`
- `BLOG_RANKING_ITEMS`
- `blog-ranking-enter` animation

따라서 컴포넌트를 그대로 import해서 재활용하기보다는, 구조와 애니메이션 패턴을 feed에 맞게 적용하는 편이 좋다.

추천 구현:

- feed 인기 랭킹 탭을 추가한다.
  - `전체`
  - `아이템`
  - `스트리머`
  - `아티스트`
- 탭별로 target 목록을 필터링한다.
- 각 랭킹 항목에 순위 박스를 표시한다.
- target의 `trendDirection`을 이용해 등락 badge를 표시한다.
- 기존 `blog-ranking-enter` animation class를 재사용하거나, 이름을 공통화한다.

주의점:

- `FeedMenuView`가 client component가 되어야 탭 상태를 관리할 수 있다.
- 현재 `FeedMenuView`는 server component라 `useState`를 쓰지 않는다.
- 탭을 구현하려면 `FeedMenuView` 전체를 client component로 전환하거나, 랭킹 섹션만 별도 client component로 분리하는 방식이 필요하다.
- 범위가 커지는 것을 피하려면 `FeedPopularRankingSection`을 새 client component로 분리하는 편이 좋다.

## 아이템 상세 가격 추이 라인그래프

현재 아이템 상세는 `MiniBarChart`를 사용한다.

현재 상태:

- `FeedTargetDetailView`의 `ItemDetailSection`에서 `MiniBarChart`를 사용한다.
- `MiniBarChart`는 막대그래프 형태다.
- 아티스트 발매 추이도 같은 막대그래프를 사용한다.

추가사항에서는 아이템 가격 추이는 막대그래프가 아니라 라인그래프여야 한다고 했다.

추천 구현:

- `MiniLineChart`를 추가한다.
- 아이템 가격 추이에만 `MiniLineChart`를 사용한다.
- 아티스트 신곡 발매 추이는 요구가 없으므로 우선 기존 막대그래프를 유지해도 된다.
- chart library 없이 SVG `polyline` 또는 `path` 기반 mock 라인그래프로 시작한다.

주의점:

- 가격 추이 값은 현재 `pricePoints: number[]` 형태라 라인그래프로 변환하기 쉽다.
- SVG viewBox와 points 계산은 간단한 helper로 처리하면 된다.

## 아이템 원본 링크

현재 아이템 상세에는 원본 링크 정보가 없다.

추가사항 기준으로는 사용자가 아이템을 저장할 때 링크로 저장하고, 이후 그 링크를 크롤링할 예정이므로 상세 화면에 원본 링크가 보여야 한다.

추천 모델:

```ts
type FeedItemDetail = {
  currentPrice: string;
  targetPrice: string;
  priceChangeText: string;
  pricePoints: number[];
  sourceName: string;
  sourceUrl: string;
};
```

추천 UI:

- 아이템 상세 섹션 안에 `원본 링크` 영역을 추가한다.
- `sourceName`과 `sourceUrl`을 표시한다.
- 실제 외부 이동은 mock URL이라도 `target="_blank"`와 `rel="noreferrer"`를 붙인다.
- 사용자가 저장한 원본 링크라는 맥락을 짧게 보여준다.

주의점:

- 실제 크롤링 동작은 이번 범위에서 제외한다.
- 링크 표시만 구현한다.

## target 상세의 관련 뉴스/커뮤니티 글

현재 target 상세에는 `recentAlerts`만 있다.

추가사항 기준으로는 아이템, 스트리머, 아티스트 상세에서 크롤링한 뉴스나 커뮤니티 글을 볼 수 있어야 한다.

추천 모델:

```ts
type FeedRelatedArticle = {
  id: string;
  title: string;
  source: string;
  timeText: string;
  href: string;
};
```

`FeedWatchTarget`에 다음 필드를 추가한다.

```ts
relatedArticles: FeedRelatedArticle[];
```

추천 UI:

- target 상세 하단에 `관련 소식` 섹션을 추가한다.
- 뉴스/커뮤니티 글을 같은 목록에 섞어서 표시한다.
- 각 항목에는 source, title, timeText를 표시한다.
- 클릭 시 원문 링크로 이동하는 형태를 준비한다.

주의점:

- 실제 크롤링 API 연동은 제외한다.
- 이번에는 mock related article 목록만 보여준다.

## 내 피드 target 설정 저장 버튼

현재 `FeedTargetSettingsView`는 client component로 상태를 변경하지만 저장 버튼이 없다.

현재 상태:

- 관찰 on/off 변경 가능
- 알림 주기 변경 가능
- target type별 알림 설정 변경 가능
- 아이템 목표 가격 입력 가능
- 삭제 mock 버튼 있음
- 저장 버튼 없음

추가사항의 지적처럼 현재 구조에서는 사용자가 설정을 바꾼 뒤 무엇을 눌러 저장해야 하는지 알 수 없다.

추천 구현:

- 설정 화면 하단에 `취소`, `저장` 버튼을 추가한다.
- `저장` 클릭 시 mock 상태로 `저장 완료` 문구를 표시한다.
- 실제 API 연동 전까지는 화면 상태만 유지한다.

주의점:

- 저장 버튼은 삭제 영역보다 위 또는 화면 하단 고정성 영역에 두는 것이 자연스럽다.
- 지금 화면이 모바일 폭 중심이므로 sticky footer까지는 필요 없고 일반 하단 action section으로 충분하다.

## 관찰 페이지 카운팅 카드

추가사항에는 `아티스트는 없음`이라고 되어 있지만, 현재 구현 기준으로는 관찰 페이지 카운팅 카드에 `스트리머`가 없다.

현재 `ObservationTargetSection`의 카운팅 카드:

- 관찰 중
- 아이템
- 아티스트

빠진 항목:

- 스트리머

추가사항의 의도는 특정 하나가 빠졌다는 것보다, target type별 카운팅이 모두 있어야 한다는 의미로 보는 것이 맞다.

추천 구현:

- 카운팅 카드를 4개로 변경한다.
  - 관찰 중
  - 아이템
  - 스트리머
  - 아티스트
- grid도 `grid-cols-2 sm:grid-cols-4` 또는 `grid-cols-4`로 조정한다.

## 추천 구현 순서

1. 관찰 페이지 카운팅 카드를 4개로 보정한다.
2. 내 피드 target 설정 상세에 저장 버튼을 추가한다.
3. 아이템 상세에 원본 링크 모델과 UI를 추가한다.
4. target 상세에 관련 뉴스/커뮤니티 글 모델과 UI를 추가한다.
5. 아이템 가격 추이 그래프를 라인그래프로 변경한다.
6. feed 인기 랭킹을 탭/순위/애니메이션 구조로 보정한다.

## 구현 범위 추천

이번 추가사항은 전부 한 번에 구현해도 되지만, 가장 구조 변경이 큰 것은 feed 인기 랭킹 탭이다.

작업을 안정적으로 끊는다면 다음 순서가 좋다.

1. 저장 버튼, 카운팅 카드, 원본 링크, 관련 소식, 라인그래프까지 먼저 보정한다.
2. 그 다음 feed 인기 랭킹 탭을 별도 client component로 분리해서 구현한다.

다만 화면 품질 관점에서는 랭킹 탭까지 함께 구현하는 것이 `plan4` 추가사항을 온전히 닫는 범위다.
