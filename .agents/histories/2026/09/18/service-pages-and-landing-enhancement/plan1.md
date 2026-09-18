# 목차

- [개요](#개요)
- [잔여 작업 분석](#잔여-작업-분석)
  - [작업 범위 구분](#작업-범위-구분)
  - [우선순위](#우선순위)
  - [추천 1차 작업 범위](#추천-1차-작업-범위)
  - [서비스별 화면 방향](#서비스별-화면-방향)
  - [구조 제안](#구조-제안)
  - [이번 작업에서 제외할 것](#이번-작업에서-제외할-것)
  - [결론](#결론)
- [내 계획](#내-계획)
- [내 계획 반영 후 재분석](#내-계획-반영-후-재분석)
  - [핵심 변경](#핵심-변경)
  - [새 우선순위](#새-우선순위)
  - [추천 구현 범위](#추천-구현-범위)
  - [구조 선택](#구조-선택)
  - [이번 작업에서 제외](#이번-작업에서-제외)
  - [정리](#정리)

---

# 개요

- 2026-09-17 프론트 구성 기획 작업에서 남은 잔재 작업을 이어서 진행한다.
- 주요 범위는 나머지 서비스 화면 구조와 랜딩페이지 고도화다.
- 서비스 후보는 메모, 피드, 가계부, 일정이다.
- 플랫폼 홈과 blog 비로그인 랜딩은 1차 개선이 끝났지만, 더 완성도 있는 랜딩 화면으로 고도화할 여지가 남아 있다.
- 이전 작업 문서는 `.agents/histories/2026/09/17/front-structure-planning/` 아래의 `plan*.md`, `task*.md`, `done1.md`를 참고한다.
- `.agents/histories/2026/09/17/front-structure-planning` 에서의 잔여사항
  1. `/memo`, `/feed`, `/account-book`, `/schedule` 라우트 뼈대 추가
  2. blog 하단 툴바, 검색, 글쓰기 UX 확정
  3. 회원용 플랫폼 홈의 서비스별 요약과 피드 구성 다듬기
  4. 공통 인증 상태 구조 설계
  5. 실제 로그인/회원가입 API 연동 준비

---

# 잔여 작업 분석

## 작업 범위 구분

현재 남은 작업은 크게 두 갈래다.

1. 나머지 서비스 화면 구조
   - `/memo`
   - `/feed`
   - `/account-book`
   - `/schedule`
2. 기존 플랫폼/blog 고도화
   - 플랫폼 홈 비로그인 랜딩 고도화
   - blog 하단 툴바/검색/글쓰기 UX
   - 회원용 플랫폼 홈 다듬기
   - 공통 인증 상태 구조
   - 실제 로그인/회원가입 API 준비

바로 구현으로 들어가기보다는 이번 작업에서는 범위를 잘 잘라야 한다.

## 우선순위

우선순위는 `/memo`, `/feed`, `/account-book`, `/schedule` 라우트 뼈대 추가가 가장 높다.

이유:

- 서비스 런처에는 이미 서비스가 보이지만, 실제 링크는 대부분 `#` 상태라 UX가 끊긴다.
- 실제 기능은 없어도 서비스 준비 화면 또는 비회원/회원 분기 가능한 기본 화면은 있어야 한다.
- 기존 `blog`처럼 `page -> container -> view -> model` 구조를 맞추면 이후 확장이 쉽다.

랜딩페이지 고도화는 그 다음 순서가 좋다.

- 지금 플랫폼 홈 비로그인 랜딩은 기능적으로는 충분하지만 아직 서비스 허브 소개 수준이다.
- 더 화려하게 만들려면 서비스 라우트 뼈대가 있어야 각 서비스로 자연스럽게 연결할 수 있다.
- 따라서 서비스 페이지가 먼저 생기고, 랜딩에서 그 페이지들로 연결되는 순서가 자연스럽다.

blog 하단 툴바/검색/글쓰기 UX는 별도 작업으로 분리하는 편이 좋다.

- 이 작업은 blog 내부 정책 결정에 가깝다.
- 서비스 라우트 뼈대와 같이 진행하면 범위가 커진다.

공통 인증 상태 구조와 실제 API 연동 준비는 아직 이르다.

- 현재는 화면 구조 작업 단계다.
- `/memo`, `/feed`, `/account-book`, `/schedule`까지 화면 뼈대가 생긴 뒤 공통 인증 상태를 설계하는 편이 좋다.

## 추천 1차 작업 범위

이번 `service-pages-and-landing-enhancement`의 1차 범위는 다음처럼 잡는다.

- `/memo` 라우트 뼈대 추가
- `/feed` 라우트 뼈대 추가
- `/account-book` 라우트 뼈대 추가
- `/schedule` 라우트 뼈대 추가
- 각 서비스별 ViewModel / Container / View 구성
- 플랫폼 홈 서비스 런처의 `#` 링크를 실제 라우트로 변경
- 각 서비스 화면은 `AppFrame`, `AppTopBar`, `AppContent`, `BottomNavigation` 공통 레이아웃 사용
- 각 서비스 화면은 아직 실제 기능 대신 서비스 소개, 준비 중, 로그인 시 제공될 기능 구조로 구성

## 서비스별 화면 방향

`memo`:

- 개인 메모장
- 비회원: 메모 기능 소개, 로그인 CTA
- 회원: 최근 메모 / 빠른 메모 작성 진입 뼈대

`feed`:

- 스트리머 활동 알림, 가격 알림을 모아보는 피드
- 비회원: 알림 피드 소개, 로그인 CTA
- 회원: 최근 알림 / 관심 항목 요약 뼈대

`account-book`:

- 수입/지출 기록
- 비회원: 가계부 소개, 로그인 CTA
- 회원: 이번 달 요약 / 최근 지출 뼈대

`schedule`:

- 개인 일정과 이벤트 관리
- 비회원: 일정 관리 소개, 로그인 CTA
- 회원: 오늘 일정 / 다가오는 일정 뼈대

## 구조 제안

서비스 4개는 거의 같은 구조를 가질 가능성이 높다.

따라서 서비스별 View를 완전히 따로 크게 만들기보다는 공통 소개 화면 구조를 두는 편이 좋다.

후보:

- `ServiceComingSoonView`
- `ServiceOverviewView`
- `ServiceOverviewModel`

다만 너무 빠른 추상화는 답답해질 수 있다.

이번 1차에서는 `features/service` 단일 feature로 4개 서비스 소개 화면을 처리하는 방향이 적당하다.

예상 구조:

```text
src/app/memo/page.tsx
src/app/feed/page.tsx
src/app/account-book/page.tsx
src/app/schedule/page.tsx

src/features/service/model/serviceTypes.ts
src/features/service/container/ServiceContainer.tsx
src/features/service/components/ServiceView.tsx
```

서비스별 데이터만 모델에 두고, 같은 `ServiceView`로 렌더링한다.

## 이번 작업에서 제외할 것

- 실제 메모 작성 기능
- 실제 피드 알림 기능
- 실제 가계부 입력 기능
- 실제 일정 생성 기능
- 실제 로그인 API
- 실제 검색 기능
- blog 글쓰기 구현
- OAuth 연동
- 공통 session provider

## 결론

이번 작업은 서비스 확장 뼈대를 먼저 만드는 것이 맞다.

추천 1차 구현:

1. 서비스 공통 ViewModel 정의
2. `/memo`, `/feed`, `/account-book`, `/schedule` 라우트 추가
3. 공통 서비스 소개 화면 추가
4. 플랫폼 홈 서비스 런처 링크를 실제 라우트로 변경
5. 비로그인/회원 상태별 표시 가능하도록 mock auth 연결
6. task 문서 작성 및 테스트

이렇게 하면 서비스 런처에서 보이는 항목들이 실제 화면으로 이어져서 플랫폼 구조가 더 완성돼 보인다.

---

# 내 계획

- 메모, 가계부, 일정은 좀 향후 미래의 계획임. 서비스에서 disable된 아이콘으로 보여주는게 좋을듯. 지금 당장 구현 시작할 생각은 없음
- 지금 내 개발하고 싶은 서비스는 플랫폼, 블로그, 피드임
- 그러면 지금 플랫폼이랑 블로그는 구조는 잡아놨고, 피드는 구조도 없으니 피드의 구조를 잡아야겠고, 그 다음에 각각의 화면 디테일한것들 디벨롭해가면 될듯 (랜딩페이지 고도화, 서비스별 하단 툴바 배치, 파비콘, 서비스별 홈 로고 (/text 디자인에 색상을 추가한다던가), api 연동 및 밸리데이션 등등)

---

# 내 계획 반영 후 재분석

## 핵심 변경

`내 계획` 섹션을 반영하면 이번 작업 방향은 기존 분석과 달라진다.

이전 분석에서는 `/memo`, `/feed`, `/account-book`, `/schedule` 4개 서비스 라우트를 전부 뼈대로 만들자고 했지만, 현재 계획 기준으로는 그 방향이 아니다.

지금 당장 개발 대상:

- 플랫폼
- 블로그
- 피드

미래 계획으로 남길 대상:

- 메모
- 가계부
- 일정

따라서 이번 작업은 나머지 서비스 전체 구현이 아니라, 피드 서비스 구조 추가, 미래 서비스 disabled 표시, 기존 플랫폼/blog 고도화 준비로 범위를 좁힌다.

## 새 우선순위

1. 피드 서비스 구조 잡기
   - `/feed` 라우트 추가
   - `features/feed` 구조 추가
   - 비회원/회원 화면 분기 가능하게 구성
   - 스트리머 활동 알림과 가격 알림을 하나로 모아보는 서비스로 정의
2. 서비스 런처 상태 분리
   - `blog`: 활성 서비스
   - `feed`: 활성 서비스
   - `memo`: disabled 또는 준비 중
   - `account-book`: disabled 또는 준비 중
   - `schedule`: disabled 또는 준비 중
   - disabled 서비스는 클릭되지 않거나 준비 중 상태로 보이게 처리
3. 플랫폼 홈 구조 보강
   - 플랫폼 홈에서 현재 개발 중인 핵심 서비스가 `blog`, `feed`임을 더 분명히 보여준다.
   - 미래 서비스는 준비 중 뉘앙스로 표시한다.
   - 비로그인 랜딩에서도 active/disabled 서비스의 차이를 보여준다.
4. 블로그는 당장 큰 구조 변경보다 후순위
   - 이미 guest/member 구조가 있다.
   - 레이아웃도 통일되어 있다.
   - 다음에 할 일은 하단 툴바, 검색, 글쓰기 UX 확정 정도다.
5. 랜딩페이지 고도화는 feed 구조 이후
   - 플랫폼 홈 랜딩에서 blog/feed를 중심으로 소개한다.
   - memo/account-book/schedule은 미래 서비스로 보여준다.
   - 피드가 생긴 후 랜딩에서 자연스럽게 연결할 수 있다.

## 추천 구현 범위

이번 1차 구현 범위:

- `Feed` 도메인 추가
  - `/feed/page.tsx`
  - `features/feed/model/feedTypes.ts`
  - `features/feed/container/FeedContainer.tsx`
  - `features/feed/components/FeedView.tsx`
- `feed` 화면 구성
  - `AppFrame`
  - `AppTopBar serviceName="feed" serviceHref="/feed"`
  - `AppContent`
  - `BottomNavigation`
  - 비회원 화면
    - feed 서비스 소개
    - 스트리머 활동 알림/가격 알림 설명
    - 로그인/회원가입 CTA
  - 회원 화면
    - 관심 피드 요약
    - 최근 알림
    - 추적 중인 항목 뼈대
- 플랫폼 홈 서비스 런처 수정
  - `blog` href `/blog`
  - `feed` href `/feed`
  - `memo`, `account-book`, `schedule`은 disabled/준비 중 처리
- 타입 확장
  - `PlatformService`에 `status` 또는 `isDisabled` 추가
  - 예: `status: 'active' | 'planned'`
  - `ServiceLauncherCard`에서 planned는 링크가 아니라 비활성 버튼/표시로 렌더링
- 랜딩 문구 조정
  - 비회원 랜딩에서 blog와 feed를 먼저 사용해볼 수 있음을 표현
  - memo/가계부/일정은 준비 중으로 표현

## 구조 선택

이번에는 4개 공통 서비스 View를 만들 필요가 없다.

실제 구현할 서비스는 `feed` 하나이고, `memo`, `account-book`, `schedule`은 disabled 표시만 하면 되기 때문이다.

따라서 추천 구조는 다음과 같다.

```text
src/app/feed/page.tsx

src/features/feed/model/feedTypes.ts
src/features/feed/container/FeedContainer.tsx
src/features/feed/components/FeedView.tsx
```

`features/service` 같은 공통 추상화는 아직 만들지 않는다.

지금 만들면 실제로 쓰는 서비스가 feed 하나뿐이라 과한 추상화가 될 수 있다.

## 이번 작업에서 제외

- `/memo` 실제 라우트
- `/account-book` 실제 라우트
- `/schedule` 실제 라우트
- 메모 작성 기능
- 가계부 입력 기능
- 일정 생성 기능
- 실제 스트리머/가격 알림 API
- blog 검색/글쓰기 실제 구현
- 로그인 API
- OAuth
- session provider

## 정리

새 방향은 다음과 같다.

> 플랫폼과 블로그는 기본 구조가 잡혔으니, 이제 실제로 개발할 세 번째 핵심 서비스인 feed 구조를 만들고, 나머지 서비스는 미래 계획으로 disabled 표시한다.

따라서 다음 구현은 feed 라우트/화면 추가와 서비스 런처 active/planned 상태 반영이 가장 적절하다.
