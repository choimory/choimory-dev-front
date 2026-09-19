# 목차

- [개요](#개요)
- [상세페이지와 화면구조 디테일 분석](#상세페이지와-화면구조-디테일-분석)
  - [현재 상태](#현재-상태)
  - [연결이 필요한 지점](#연결이-필요한-지점)
  - [추천 라우트 구조](#추천-라우트-구조)
  - [피드 용어 정리](#피드-용어-정리)
  - [추천 작업 순서](#추천-작업-순서)

---

# 개요

- 피드 서비스의 추적이란 단어를 관찰로 변경
- 플랫폼/블로그/피드에서 기본 골자는 잡아놨는데 하단 툴바 눌렀을때 메뉴 화면이라던지, 화면의 요소 눌렀을때 상세 페이지라던지 그런게 없고 연결이 안되어있음
- 이런거 만들어서 연결시킨다음에 메뉴페이지랑 상세페이지도 만들면 될듯

---

# 상세페이지와 화면구조 디테일 분석

> 분석 ㄱㄱ

## 현재 상태

플랫폼, 블로그, 피드의 1차 화면은 잡혀 있지만, 하단 메뉴와 카드 내부 요소들이 아직 실제 화면으로 이어지지 않는다.

현재 라우트는 다음 정도만 존재한다.

- `/`
- `/blog`
- `/feed`
- `/login`
- `/signup`
- `/me`

즉, 사용자가 하단 툴바나 카드 내부 요소를 눌렀을 때 이동할 메뉴 화면과 상세 화면이 아직 부족하다.

## 연결이 필요한 지점

플랫폼 하단 메뉴의 `공지사항`, `서비스`가 아직 `#`이다.

- `src/features/platform/components/PlatformHomeView.tsx`

블로그 하단 메뉴의 `인기`, `팔로잉`, `내 블로그`가 아직 `#`이다.

- `src/features/blog/components/BlogView.tsx`

피드 하단 메뉴의 `인기`, `추적`, `내 피드`가 아직 `#`이다.

- `src/features/feed/components/FeedView.tsx`

블로그 게시글 카드는 카드, 댓글, 메뉴 버튼이 있지만 상세 페이지 링크가 없다.

- `src/features/blog/components/BlogPostCard.tsx`

플랫폼 홈의 서비스별 지표/알림 카드도 hover만 있고 상세 연결은 없다.

- `src/features/platform/components/MemberServiceFeedSection.tsx`

피드 화면의 관심 항목/최근 알림 카드도 상세 연결이 없다.

- `src/features/feed/components/FeedView.tsx`

## 추천 라우트 구조

플랫폼 메뉴 화면은 다음처럼 잡는 것이 좋다.

- `/services`: 전체 서비스 메뉴 화면
- `/notice`: 공지사항 메뉴 화면

블로그 화면은 다음처럼 잡는 것이 좋다.

- `/blog`: 블로그 홈
- `/blog/popular`: 인기 글
- `/blog/following`: 팔로잉 피드
- `/blog/me`: 내 블로그
- `/blog/posts/[postId]`: 게시글 상세

피드 화면은 다음처럼 잡는 것이 좋다.

- `/feed`: 피드 홈
- `/feed/popular`: 인기 알림 또는 인기 관찰 대상
- `/feed/observations`: 관찰 목록
- `/feed/me`: 내 피드
- `/feed/observations/[observationId]`: 관찰 상세
- `/feed/activities/[activityId]`: 알림 상세

## 피드 용어 정리

이번 `plan1.md`의 개요에는 `피드 서비스의 추적이란 단어를 관찰로 변경`이라고 적혀 있다.

다만 직전 히스토리에서는 한 번 `관찰`로 변경하는 방향을 검토했다가 최종적으로 `추적`으로 되돌린 기록이 있다. 이번 작업의 최신 의도는 `plan1.md` 기준으로 `관찰`로 보는 것이 맞아 보인다.

현재 남아있는 대표 문구는 다음과 같다.

- `진행 중인 추적`
- `추적 중`
- `추적 중인 항목`
- 하단 탭 `추적`
- 타입명/필드명 `FeedTrackingItem`, `trackingItems`

1차 구현에서는 화면 표시 문구와 라우트는 `관찰`, `observations`로 맞추고, 타입명 변경은 함께 진행할지 별도 리팩터링으로 둘지 정해야 한다.

## 추천 작업 순서

1. `plan1.md`에 분석 내용과 구현 계획을 정리한다.
2. Next.js 16 로컬 docs에서 App Router 동적 라우트 작성 방식을 확인한다.
3. 메뉴 라우트 뼈대를 추가한다.
   - `/services`
   - `/notice`
   - `/blog/popular`
   - `/blog/following`
   - `/blog/me`
   - `/feed/popular`
   - `/feed/observations`
   - `/feed/me`
4. 상세 라우트를 추가한다.
   - `/blog/posts/[postId]`
   - `/feed/observations/[observationId]`
   - `/feed/activities/[activityId]`
5. 기존 `#` 링크와 카드/버튼을 실제 라우트로 연결한다.
6. `추적` 문구를 `관찰`로 정리한다.
7. 타입체크, 린트, 빌드로 검증한다.
