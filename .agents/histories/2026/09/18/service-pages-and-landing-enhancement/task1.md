# 목차

- [개요](#개요)
- [feed 1차 구현](#feed-1차-구현)
  - [작업 내용](#작업-내용)
  - [feed 라우트와 화면 구조](#feed-라우트와-화면-구조)
  - [서비스 런처 상태 분리](#서비스-런처-상태-분리)
  - [플랫폼 비회원 랜딩 문구 조정](#플랫폼-비회원-랜딩-문구-조정)
  - [README.md 최신화](#readmemd-최신화)
  - [검증 상태](#검증-상태)

---

# 개요

- `plan1.md`의 `내 계획 반영 후 재분석` 방향에 맞춰 feed 서비스를 1차 구현했다.
- 지금 당장 개발할 핵심 서비스는 플랫폼, 블로그, 피드로 보고, 메모/가계부/일정은 미래 계획 서비스로 둔다.
- 이번 작업에서는 feed 화면 구조를 만들고, 플랫폼 홈 서비스 런처에서 활성 서비스와 준비 중 서비스를 분리했다.

---

# feed 1차 구현

## 작업 내용

- `/feed` 라우트를 추가함.
- `features/feed` 도메인 구조를 추가함.
- feed 화면도 `guest/member` 분기 구조를 갖도록 구성함.
- feed 화면은 `AppFrame`, `AppTopBar`, `AppContent`, `BottomNavigation` 공통 레이아웃을 사용함.
- 플랫폼 홈 서비스 런처에서 `blog`, `feed`는 활성 서비스로 표시함.
- `memo`, `account-book`, `schedule`은 준비 중 서비스로 표시하고 클릭되지 않게 처리함.
- 플랫폼 비회원 랜딩 문구를 blog/feed 중심으로 조정함.
- README.md에 `/feed`, `features/feed`, 서비스 상태 방향을 반영함.

## feed 라우트와 화면 구조

추가함:

- `src/app/feed/page.tsx`
- `src/features/feed/model/feedTypes.ts`
- `src/features/feed/container/FeedContainer.tsx`
- `src/features/feed/components/FeedView.tsx`

`/feed` page는 Next.js 16 방식대로 `searchParams`를 `await`하여 mock auth 상태를 읽는다.

예시:

- `/feed`
- `/feed?auth=member`

비회원 화면은 다음 내용을 표시한다.

- feed 서비스 소개
- 스트리머 활동 알림 소개
- 가격 알림 소개
- 사용자 정의 피드 소개
- 로그인/회원가입 CTA

회원 화면은 다음 내용을 표시한다.

- 추적 중 항목 요약
- 새 알림 요약
- 관심 항목 요약
- 최근 알림 목록 뼈대

아직 실제 스트리머/가격 알림 API는 연결하지 않았다.

## 서비스 런처 상태 분리

수정함:

- `src/features/platform/model/platformHomeTypes.ts`
- `src/features/platform/components/ServiceLauncherCard.tsx`

`PlatformService`에 `status: 'active' | 'planned'` 필드를 추가했다.

현재 상태:

- `blog`: active
- `feed`: active
- `memo`: planned
- `account-book`: planned
- `schedule`: planned

`ServiceLauncherCard`에서는 active 서비스만 `Link`로 렌더링하고, planned 서비스는 클릭되지 않는 `button`으로 렌더링한다.

planned 서비스에는 `예정` 배지를 표시한다.

## 플랫폼 비회원 랜딩 문구 조정

수정함:

- `src/features/platform/components/GuestLandingSection.tsx`

플랫폼 홈 비회원 랜딩을 blog/feed 중심으로 조정했다.

변경 내용:

- `blog와 feed부터 둘러보고, 로그인하면 내 서비스 허브가 열립니다` 문구 적용
- feed에서 방송과 가격 알림 흐름을 확인할 수 있다는 안내 추가
- 준비 중 서비스는 muted 상태로 표시
- active 서비스만 실제 링크로 이동하게 처리

## README.md 최신화

수정함:

- `README.md`

반영 내용:

- `/feed` 라우트 추가
- `features/feed` 구조 추가
- feed 서비스 설명 추가
- memo, account-book, schedule은 미래 계획 서비스로 표시한다는 방향 추가

## 검증 상태

실행함:

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

검증 결과:

- 타입 검사 통과
- ESLint 통과
- 프로덕션 빌드 통과

빌드 결과 라우트:

- `/` 동적 렌더링
- `/_not-found` 정적 렌더링
- `/blog` 동적 렌더링
- `/feed` 동적 렌더링
- `/login` 정적 렌더링
- `/me` 정적 렌더링
- `/signup` 정적 렌더링
