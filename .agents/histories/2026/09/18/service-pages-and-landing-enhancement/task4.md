# 목차

- [개요](#개요)
- [상단바 로그아웃 액션 구현](#상단바-로그아웃-액션-구현)
- [피드 툴바 추적 아이콘 구현](#피드-툴바-추적-아이콘-구현)
- [로그인 플랫폼 홈 서비스별 피드 카드 구현](#로그인-플랫폼-홈-서비스별-피드-카드-구현)
- [로그인 플랫폼 홈 서비스별 대형 피드 카드 구현](#로그인-플랫폼-홈-서비스별-대형-피드-카드-구현)
- [서비스별 대형 피드 카드 hover 범위 조정 구현](#서비스별-대형-피드-카드-hover-범위-조정-구현)
- [로그인 플랫폼 홈 내정보 프로필 카드 구현](#로그인-플랫폼-홈-내정보-프로필-카드-구현)
- [로그인 플랫폼 홈 섹션 문구 정리와 최종 검증](#로그인-플랫폼-홈-섹션-문구-정리와-최종-검증)

---

# 개요

- `plan4.md`의 상단바 로그인 액션 변경과 피드 툴바 추적 탭 아이콘 검토 내용을 구현했다.
- 실제 로그아웃 API, 세션 삭제, 추적 화면 라우팅은 아직 구현하지 않았다.

---

# 상단바 로그아웃 액션 구현

> 구현 시작

## 답변

로그인 상태 상단바 액션을 `내 정보`에서 `로그아웃`으로 변경했다.

## 작업 내용

수정함:

- `src/shared/ui/TopBarActions.tsx`

변경 내용:

- 로그인 상태 라벨을 `내 정보`에서 `로그아웃`으로 변경함.
- 로그인 상태 링크를 `/me`에서 `/`로 변경함.
- 비로그인 상태의 `로그인` 라벨과 `/login` 링크는 유지함.

## 검증 상태

아직 테스트는 실행하지 않았다.

---

# 로그인 플랫폼 홈 섹션 문구 정리와 최종 검증

> 테스트하고 작업마무리

## 답변

로그인 플랫폼 홈의 섹션 문구를 정리하고 최종 검증을 수행했다.

## 작업 내용

수정함:

- `src/features/platform/components/MemberServiceFeedSection.tsx`

변경 내용:

- 내정보 섹션 라벨을 `/me`로 변경함.
- 내정보 섹션 제목을 `나를 소개하세요`로 변경함.
- 서비스별 피드 섹션 라벨을 `/services`로 변경함.
- 서비스별 피드 섹션 제목을 `나의 현황을 서비스별로 확인하세요`로 변경함.

## 검증 상태

실행함:

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- `git diff --check`

검증 결과:

- 타입 검사 통과
- ESLint 통과
- 프로덕션 빌드 통과
- diff 공백 검사 통과

빌드 결과 라우트:

- `/` 동적 렌더링
- `/_not-found` 정적 렌더링
- `/blog` 동적 렌더링
- `/feed` 동적 렌더링
- `/login` 정적 렌더링
- `/me` 정적 렌더링
- `/signup` 정적 렌더링

---

# 로그인 플랫폼 홈 내정보 프로필 카드 구현

> 지금 내용들 plan4랑 구현사항 task4에 추가

## 답변

로그인 상태 플랫폼 홈에서 서비스 런처 아래에 표시되던 오늘 요약 카운팅과 `내 피드` 카드를 제거하고, 같은 위치에 내정보 프로필 카드를 추가했다.

## 작업 내용

수정함:

- `src/features/platform/components/MemberServiceFeedSection.tsx`
- `src/features/platform/components/PlatformHomeView.tsx`

변경 내용:

- `MemberServiceFeedSection`에서 `todaySummaries` props를 제거함.
- `MemberServiceFeedSection`에서 `recentActivities` props를 제거함.
- 오늘 요약 카운팅 카드 렌더링을 제거함.
- 기존 `내 피드` 카드 렌더링을 제거함.
- 서비스 런처 아래 첫 카드로 `내정보` 프로필 카드를 추가함.
- 프로필 카드에 임시 사용자 정보를 표시함.
  - 아바타
  - 닉네임
  - 이메일
  - 설명
- 프로필 카드 우측에 `/me`로 이동하는 `내 정보 관리` 링크를 추가함.
- 서비스별 대형 피드 카드 구조는 유지함.
- `PlatformHomeView`에서 `MemberServiceFeedSection`에 `services`만 전달하도록 정리함.

## 검증 상태

아직 테스트는 실행하지 않았다.

---

# 서비스별 대형 피드 카드 hover 범위 조정 구현

> 구현내용 task4에 추가

## 답변

서비스별 대형 피드 카드 전체에 걸려 있던 hover 효과를 제거하고, 카드 내부 요소별 카드에 hover 효과를 적용했다.

## 작업 내용

수정함:

- `src/features/platform/components/MemberServiceFeedSection.tsx`

변경 내용:

- 활성 서비스도 최상위 대형 카드는 `Link`가 아니라 `article`로 렌더링하도록 변경함.
- 대형 서비스 카드 최상위의 `hover:border-primary/40`, `hover:bg-surface-strong` 효과를 제거함.
- 활성 서비스의 이동은 상단 우측 `바로가기` 링크로 제공함.
- 준비 중 서비스는 상단 우측 `준비 중` badge를 유지함.
- 내부 지표 카드에 `hover:bg-primary-soft` 효과를 추가함.
- 내부 알림 카드에 `hover:bg-primary-soft` 효과를 추가함.

## 검증 상태

아직 테스트는 실행하지 않았다.

---

# 로그인 플랫폼 홈 서비스별 대형 피드 카드 구현

> task4에 구현사항 추가

## 답변

로그인 플랫폼 홈의 서비스별 카드를 작은 런처형 카드에서 대형 피드 카드 구조로 변경했다.

## 작업 내용

수정함:

- `src/features/platform/components/MemberServiceFeedSection.tsx`

변경 내용:

- 기존 작은 서비스 카드 grid를 대형 서비스별 피드 카드 구조로 교체함.
- `MemberServiceFeedSection` 내부에 서비스별 피드 임시 데이터를 추가함.
- 블로그 카드에 지표 4개를 추가함.
  - 내가 쓴 글
  - 내가 쓴 댓글
  - 팔로워 수
  - 팔로잉 수
- 블로그 카드 하단에 알림 카드 4개를 추가함.
- 피드 카드에 지표 2개를 추가함.
  - 관찰 중인 아이템
  - 관찰 중인 스트리머
- 피드 카드 하단에 알림 카드 4개를 추가함.
- 메모, 일정, 가계부는 준비 중 대형 카드로 표시함.
- 내부 지표와 알림은 `bg-surface-strong` 기반의 낮은 대비 카드로 구성함.
- 활성 서비스는 `Link` 카드로 유지하고, 준비 중 서비스는 비활성 `article` 카드로 유지함.

## 검증 상태

아직 테스트는 실행하지 않았다.

---

# 로그인 플랫폼 홈 서비스별 피드 카드 구현

> 구현사항 task4에 추가

## 답변

로그인 상태 플랫폼 홈에서 `내 피드` 카드와 같은 레벨로 서비스별 피드 카드들을 추가했다.

## 작업 내용

수정함:

- `src/features/platform/components/PlatformHomeView.tsx`
- `src/features/platform/components/MemberServiceFeedSection.tsx`

변경 내용:

- `PlatformHomeView`에서 `MemberServiceFeedSection`으로 `services={viewModel.services}`를 전달함.
- `MemberServiceFeedSection` Props에 `services: PlatformService[]`를 추가함.
- 기존 `내 피드` 카드는 유지함.
- `내 피드` 카드 아래 같은 sibling 레벨에 `서비스별 피드` 카드 grid를 추가함.
- 서비스 카드는 기존 view model 순서인 `블로그 / 피드 / 메모 / 일정 / 가계부` 순서로 표시함.
- 활성 서비스는 `Link` 카드로 표시함.
- 준비 중 서비스는 비활성 `article` 카드로 표시함.
- 서비스별 색상 톤과 아이콘은 기존 `PlatformService` 데이터를 사용함.

## 검증 상태

아직 테스트는 실행하지 않았다.

---

# 피드 툴바 추적 아이콘 구현

> 구현 시작

## 답변

피드 하단 툴바의 추적 탭 라벨과 아이콘 변경을 구현했다.

## 작업 내용

수정함:

- `src/features/feed/components/FeedView.tsx`
- `src/shared/ui/Icon.tsx`

변경 과정:

- `추적` 라벨과 `telescope` 아이콘을 `관찰` 라벨과 `eye` 아이콘으로 변경함.
- 이후 `eye` 아이콘을 제거하고 `binoculars` 아이콘으로 변경함.
- 최종적으로 라벨을 `추적`으로 되돌리고 아이콘을 `barChart`로 변경함.

최종 상태:

- 피드 하단 툴바 세 번째 항목은 `추적`으로 표시됨.
- 피드 하단 툴바 세 번째 항목은 `barChart` 아이콘을 사용함.
- 더 이상 사용하지 않는 `binoculars` 아이콘은 제거함.
- 이전에 제거했던 `telescope` 아이콘도 다시 추가하지 않음.

## 검증 상태

아직 테스트는 실행하지 않았다.
