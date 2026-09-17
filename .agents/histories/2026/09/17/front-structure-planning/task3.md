# 목차

- [개요](#개요)
- [plan3 기반 화면 구조 조정](#plan3-기반-화면-구조-조정)
  - [작업 내용](#작업-내용)
  - [blog 전환](#blog-전환)
  - [플랫폼 홈 조정](#플랫폼-홈-조정)
  - [검증 상태](#검증-상태)
- [서비스 런처 추가 조정](#서비스-런처-추가-조정)
  - [작업 내용](#작업-내용-1)
  - [현재 홈 구성](#현재-홈-구성)
  - [검증 상태](#검증-상태-1)
- [검색바와 런처 조작 개선](#검색바와-런처-조작-개선)
  - [작업 내용](#작업-내용-2)
  - [현재 홈 구성](#현재-홈-구성-1)
  - [검증 상태](#검증-상태-2)

---

# 개요

- `plan3.md`에서 정리한 화면 조정 방향을 코드에 반영한다.
- `community`로 남아 있던 서비스 명칭과 경로를 모두 `blog` 기준으로 변경한다.
- 플랫폼 홈은 `768px` 태블릿 폭에 맞추고, 비회원 기준 화면으로 정리한다.

---

# plan3 기반 화면 구조 조정

## 작업 내용

- `/community` 라우트를 제거하고 `/blog` 라우트를 생성함.
- `features/community` 디렉토리를 제거하고 `features/blog` 디렉토리로 대체함.
- 커뮤니티 관련 컴포넌트, 컨테이너, 타입 이름을 blog 기준으로 변경함.
- 플랫폼 홈의 서비스 런처를 `blog`, `memo`, `feed` 3개 고정 서비스 중심으로 정리함.
- 플랫폼 홈의 PC 기준 폭을 `1040px`에서 `768px`로 줄임.
- 상단바와 하단 툴바도 플랫폼 홈에서는 `768px` 기준으로 맞춤.
- 검색바 안의 `N`, `AI` 요소를 제거함.
- 서비스 런처의 `편집`, `더보기`를 제거함.
- 로그인 사용자 전용처럼 보이던 홈 영역을 줄이고, 비회원 기준 로그인 CTA를 표시함.

## blog 전환

- 삭제함
  - `src/app/community/page.tsx`
  - `src/features/community/model/communityTypes.ts`
  - `src/features/community/components/CommunityPostCard.tsx`
  - `src/features/community/components/CommunityView.tsx`
  - `src/features/community/container/CommunityContainer.tsx`
- 추가함
  - `src/app/blog/page.tsx`
  - `src/features/blog/model/blogTypes.ts`
  - `src/features/blog/components/BlogPostCard.tsx`
  - `src/features/blog/components/BlogView.tsx`
  - `src/features/blog/container/BlogContainer.tsx`
- `src` 기준 `community`, `Community`, `커뮤니티`, `/community` 잔여 문자열이 없음을 확인함.

## 플랫폼 홈 조정

- `WideContent`의 최대 폭을 `768px`로 변경함.
- `AppTopBar`의 `wide` 폭을 `768px`로 변경함.
- `BottomNavigation`에 `size` 옵션을 추가하고, 플랫폼 홈에서는 `wide`를 사용하도록 함.
- `platformHomeTypes.ts`의 서비스 목록을 `blog`, `memo`, `feed` 중심으로 정리함.
- `PlatformHomeView`에서 최근 활동/오늘 요약 중심 배치를 줄이고, 비회원 로그인 CTA와 고정 서비스 안내를 표시함.
- `ServiceLauncherCard`에서 편집 버튼을 제거하고, 3개 고정 서비스 아이콘을 표시하도록 조정함.

## 검증 상태

- `npx tsc --noEmit`, `npm run lint`, `npm run build`는 아직 실행하지 않음.

---

# 서비스 런처 추가 조정

## 작업 내용

- `plan3.md`의 추가사항을 반영하여 플랫폼 홈을 서비스 런처 중심으로 더 단순화함.
- 서비스 런처 카드 상단의 `서비스`, `choimory.dev에서 사용할 도구들` 문구를 제거함.
- 서비스 표시명을 한글로 변경함.
  - `blog` → `블로그`
  - `memo` → `메모`
  - `feed` → `피드`
- 서비스가 많아졌을 때의 동작을 확인하기 위해 총 10개 서비스를 표시함.
  - 블로그
  - 메모
  - 피드
  - 캘린더
  - 북마크
  - 파일
  - 할 일
  - 링크
  - 지갑
  - 설정
- 서비스 런처를 가로 스크롤 구조로 변경함.
- 이후 carousel 좌우 화살표를 붙이기 쉽도록 각 서비스 아이템을 고정 폭으로 구성함.
- 서비스 카드 아래에 있던 로그인 CTA 카드와 고정 서비스 안내 카드를 제거함.

## 현재 홈 구성

- 상단바
- `choimory.dev` 타이틀
- 검색바
- 서비스 아이콘 런처 카드
- 하단 툴바

## 검증 상태

- `npx tsc --noEmit`, `npm run lint`, `npm run build`는 아직 실행하지 않음.

---

# 검색바와 런처 조작 개선

## 작업 내용

- `plan3.md`의 추가사항을 반영하여 서비스 런처에 좌우 화살표 버튼을 추가함.
- `ServiceLauncherCard`를 클라이언트 컴포넌트로 변경함.
- 좌우 화살표 버튼 클릭 시 내부 서비스 목록이 `scrollBy`로 이동하도록 구현함.
- 서비스 목록의 하단 스크롤바는 노출하지 않고, 버튼으로 넘기는 형태로 변경함.
- 검색바를 `PlatformSearchBar` 컴포넌트로 분리함.
- 검색바를 실제 `<form>` 구조로 만들고, 왼쪽에 돋보기 아이콘, 오른쪽에 `검색` 버튼을 추가함.
- 검색 기능은 아직 연결하지 않고, submit 기본 동작만 막도록 처리함.
- 비회원 사용자용 소개 섹션 `GuestLandingSection`을 추가함.
- `GuestLandingSection`에는 로그인/회원가입 CTA와 `blog`, `memo`, `feed` 소개 문구를 배치함.

## 현재 홈 구성

- 상단바
- `choimory.dev` 타이틀
- 돋보기 아이콘, 입력창, 검색 버튼이 있는 검색바
- 좌우 화살표로 넘기는 서비스 아이콘 런처 카드
- 비회원 사용자용 서비스 소개 섹션
- 하단 툴바

## 검증 상태

- `npx tsc --noEmit`, `npm run lint`, `npm run build`는 아직 실행하지 않음.
