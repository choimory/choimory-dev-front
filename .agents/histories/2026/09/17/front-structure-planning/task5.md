# 목차

- [개요](#개요)
- [plan5 1차 구현](#plan5-1차-구현)
  - [작업 내용](#작업-내용)
  - [플랫폼 홈 분기](#플랫폼-홈-분기)
  - [blog 화면 분기](#blog-화면-분기)
  - [서비스 목록 정리](#서비스-목록-정리)
  - [검증 상태](#검증-상태)

---

# 개요

- `plan5.md`에서 정리한 다음 작업 범위를 코드에 반영했다.
- 실제 로그인 API 연동 없이 ViewModel의 `authStatus` 값을 기준으로 게스트/멤버 화면 분기 구조를 먼저 만들었다.
- 플랫폼 홈과 blog 화면 모두 비회원은 소개와 CTA 중심, 회원은 서비스 피드 또는 작성 가능한 피드 중심으로 나뉘도록 정리했다.

---

# plan5 1차 구현

## 작업 내용

- 플랫폼 홈 ViewModel에 `authStatus: 'guest' | 'member'`를 추가함.
- 플랫폼 홈에 회원용 서비스 피드 섹션을 추가함.
- 플랫폼 홈의 비회원 소개 섹션 CTA를 실제 `/login`, `/signup` 링크로 연결함.
- 플랫폼 홈 서비스 목록을 블로그, 메모, 피드, 가계부, 일정 중심으로 정리함.
- blog ViewModel에 `authStatus: 'guest' | 'member'`를 추가함.
- blog 화면을 비회원 소개 화면과 회원 피드 화면으로 분리함.
- 기존 blog 작성/필터/피드 UI는 회원용 컴포넌트로 이동함.

## 플랫폼 홈 분기

수정함:

- `src/features/platform/model/platformHomeTypes.ts`
- `src/features/platform/components/PlatformHomeView.tsx`
- `src/features/platform/components/GuestLandingSection.tsx`

추가함:

- `src/features/platform/components/MemberServiceFeedSection.tsx`

`PlatformHomeViewModel`에 `PlatformAuthStatus` 타입과 `authStatus` 필드를 추가했다.

현재 임시 데이터는 `authStatus: 'guest'`로 설정되어 있으며, 이후 실제 인증 상태가 연결되면 이 값을 기준으로 화면을 전환할 수 있다.

비회원 상태에서는 기존 소개 섹션을 유지하되 로그인과 회원가입 CTA를 각각 `/login`, `/signup`으로 연결했다.

회원 상태에서는 `MemberServiceFeedSection`을 통해 다음 정보를 보여준다.

- 오늘 요약
- 최근 활동
- 서비스별 활동 피드

## blog 화면 분기

수정함:

- `src/features/blog/model/blogTypes.ts`
- `src/features/blog/components/BlogView.tsx`

추가함:

- `src/features/blog/components/BlogGuestSection.tsx`
- `src/features/blog/components/BlogMemberFeedSection.tsx`

`BlogViewModel`에 `BlogAuthStatus` 타입과 `authStatus` 필드를 추가했다.

현재 임시 데이터는 `authStatus: 'guest'`로 설정되어 있다.

비회원 상태에서는 `BlogGuestSection`을 보여준다.

- blog 서비스 소개
- 로그인/회원가입 CTA
- 공개 게시글 미리보기

회원 상태에서는 `BlogMemberFeedSection`을 보여준다.

- 기존 blog 소개 헤더
- 글쓰기 버튼
- 피드 필터
- 글 작성 진입 영역
- 게시글 피드

`AppTopBar`에는 `isLoggedIn={isMember}`를 전달하여 화면 인증 상태와 상단바 표시가 함께 움직이도록 했다.

## 서비스 목록 정리

플랫폼 홈 서비스 런처의 화면 확인용 더미 서비스를 줄이고, 1차 확정 후보 중심으로 정리했다.

현재 서비스 목록:

- 블로그
- 메모
- 피드
- 가계부
- 일정

블로그는 `/blog`로 연결하고, 아직 실제 화면이 없는 서비스는 `#` 링크로 유지했다.

## 검증 상태

실행함:

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

검증 결과:

- 타입 검사 통과
- ESLint 통과
- 프로덕션 빌드 통과

빌드 결과 정적 라우트:

- `/`
- `/_not-found`
- `/blog`
- `/login`
- `/me`
- `/signup`
