# 목차

- [개요](#개요)
- [plan6 1차 구현](#plan6-1차-구현)
  - [작업 내용](#작업-내용)
  - [mock auth 전환 구조](#mock-auth-전환-구조)
  - [플랫폼 홈 비로그인 랜딩 개선](#플랫폼-홈-비로그인-랜딩-개선)
  - [blog 비로그인 화면 개선](#blog-비로그인-화면-개선)
  - [blog 레이아웃 폭 통일](#blog-레이아웃-폭-통일)
  - [프로젝트 공통 레이아웃 통합](#프로젝트-공통-레이아웃-통합)
  - [README.md 최신화](#readmemd-최신화)
  - [plan6.md 갱신](#plan6md-갱신)
  - [검증 상태](#검증-상태)

---

# 개요

- `plan6.md`의 1차 구현계획을 코드에 반영했다.
- plan5에서 만든 비로그인/로그인 분기 구조가 화면에서 더 잘 드러나도록 비로그인 랜딩을 고도화했다.
- 실제 인증 연동 전까지 회원 화면을 쉽게 확인할 수 있도록 URL query 기반 mock auth 전환을 추가했다.

---

# plan6 1차 구현

## 작업 내용

- `/?auth=member`, `/blog?auth=member`로 회원 화면을 확인할 수 있는 mock auth helper를 추가함.
- `/`와 `/blog` page에서 Next.js 16 방식대로 `searchParams`를 `await`하여 `authStatus`를 결정하도록 변경함.
- 플랫폼 홈 Container와 blog Container가 외부에서 받은 `authStatus`를 ViewModel에 반영하도록 변경함.
- 플랫폼 홈 비로그인 랜딩을 단순 소개 카드에서 서비스 허브형 안내로 확장함.
- blog 비로그인 화면에 공개/로그인/연결 안내와 공개 글 미리보기 제목을 추가함.
- blog 화면을 플랫폼 홈과 동일한 wide 레이아웃으로 변경함.
- blog 비로그인 소개 카드 상단 문구는 로고가 아니라 `choimory.dev / blog 시작하기` 텍스트로 표시함.
- `AppContent`를 추가하여 서비스 화면 중앙 레이아웃을 프로젝트 공통으로 통합함.
- `AppTopBar`, `BottomNavigation`의 기본 폭을 wide로 변경함.
- 기존 `WideContent`, `NarrowContent`를 제거함.
- README.md의 레이아웃 설명을 현재 구조에 맞게 최신화함.

## mock auth 전환 구조

추가함:

- `src/shared/model/mockAuth.ts`

수정함:

- `src/app/page.tsx`
- `src/app/blog/page.tsx`
- `src/features/platform/container/PlatformHomeContainer.tsx`
- `src/features/blog/container/BlogContainer.tsx`

`mockAuth.ts`에는 다음 타입과 함수를 추가했다.

- `MockAuthStatus`
- `PageSearchParams`
- `getMockAuthStatus`

`getMockAuthStatus`는 URL query의 `auth` 값을 읽고, `auth=member`일 때만 `member`를 반환한다.

그 외 값은 모두 `guest`로 처리한다.

예시:

- `/?auth=member`
- `/blog?auth=member`

이 구조는 실제 인증 연동 전 화면 확인용이며, 실제 세션 처리 로직은 아니다.

`searchParams`를 사용하는 `/`와 `/blog`는 빌드 결과에서 동적 렌더링 라우트로 표시된다.

## 플랫폼 홈 비로그인 랜딩 개선

수정함:

- `src/features/platform/components/PlatformHomeView.tsx`
- `src/features/platform/components/GuestLandingSection.tsx`

`GuestLandingSection`이 `services`를 받아 비로그인 사용자에게 서비스 목록을 안내하도록 변경했다.

추가된 화면 요소:

- `choimory.dev 시작하기` 소개
- 비로그인/로그인 사용 범위 안내
- 공개 blog 피드 둘러보기 안내
- 로그인 후 메모와 개인 피드 저장 안내
- 서비스별 알림과 활동 요약 안내
- 블로그, 메모, 피드, 가계부, 일정 서비스 안내 리스트

기존 로그인/회원가입 CTA는 유지했다.

## blog 비로그인 화면 개선

수정함:

- `src/features/blog/components/BlogGuestSection.tsx`

blog 비로그인 소개 카드 상단 문구는 `choimory.dev / blog 시작하기` 텍스트로 표시한다.

추가된 화면 요소:

- 공개 피드 보기 안내
- 로그인 후 글쓰기 안내
- 댓글과 팔로우 연결 안내
- 공개 글 미리보기 제목
- 로그인 참여 CTA

기존 게시글 미리보기는 유지했다.

## blog 레이아웃 폭 통일

수정함:

- `src/features/blog/components/BlogView.tsx`

blog 화면도 플랫폼 홈과 동일한 폭 정책을 따르도록 변경했다.

변경 내용:

- `NarrowContent` 제거
- 초기에는 `WideContent`를 적용했고, 이후 프로젝트 공통 레이아웃 통합 단계에서 `AppContent`로 정리
- `AppTopBar`와 `BottomNavigation`은 기본 wide 정책을 따르도록 변경

이를 통해 `/blog`도 플랫폼 홈처럼 `max-w-[768px]` 기준의 넓은 레이아웃으로 표시된다.

추가 논의:

- 서비스별로 레이아웃을 다르게 고르는 방식보다 프로젝트 전체 기본 레이아웃을 통일해서 관리하는 방향이 더 적합하다.
- 이후 구현에서 `AppContent` 공통 레이아웃 컴포넌트로 `WideContent`, `NarrowContent`를 정리했다.

## 프로젝트 공통 레이아웃 통합

추가함:

- `src/shared/ui/AppContent.tsx`

수정함:

- `src/shared/ui/AppTopBar.tsx`
- `src/shared/ui/BottomNavigation.tsx`
- `src/features/platform/components/PlatformHomeView.tsx`
- `src/features/blog/components/BlogView.tsx`
- `src/features/me/components/MeView.tsx`

제거함:

- `src/shared/ui/WideContent.tsx`
- `src/shared/ui/NarrowContent.tsx`

서비스 화면의 중앙 콘텐츠 레이아웃을 `AppContent`로 통합했다.

`AppContent`의 기본 variant는 `wide`이며, 현재 기본 폭은 `max-w-[768px]`이다.

필요하면 `variant="narrow"`를 사용할 수 있지만, 서비스 화면은 기본적으로 wide 레이아웃을 따른다.

`AppTopBar`와 `BottomNavigation`도 기본 `size`를 `wide`로 변경했다.

이에 따라 플랫폼 홈, blog, 마이페이지는 별도 `size="wide"` 지정 없이 같은 폭 정책을 사용한다.

로그인과 회원가입 화면은 폼 중심 특수 화면이므로 기존 좁은 중앙 폼 레이아웃을 유지했다.

## README.md 최신화

수정함:

- `README.md`

반영 내용:

- `shared/model` 구조 추가
- 서비스 화면의 기본 레이아웃이 `AppContent` 기준임을 명시
- 플랫폼 홈, blog, 마이페이지 같은 서비스 화면은 `768px` 중앙 폭을 기본으로 사용한다고 정리
- 로그인, 회원가입 같은 폼 중심 화면은 예외적으로 좁은 중앙 폼 레이아웃을 사용할 수 있다고 정리
- 기존 blog 좁은 피드 폭 유지 설명을 제거

## plan6.md 갱신

수정함:

- `.agents/histories/2026/09/17/front-structure-planning/plan6.md`

추가한 내용:

- 1차 구현계획
- 구현 범위
- 권장 구현 순서
- 주의할 점
- 프로젝트 전체 레이아웃 통일 방향
- `AppContent` 기반 추가 구현계획

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
- `/login` 정적 렌더링
- `/me` 정적 렌더링
- `/signup` 정적 렌더링
