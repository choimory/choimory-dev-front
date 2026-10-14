# 목차

- [개요](#개요)
- [plan4 1차 구현](#plan4-1차-구현)
  - [작업 내용](#작업-내용)
  - [공통 UI 정리](#공통-ui-정리)
  - [인증 화면 추가](#인증-화면-추가)
  - [마이페이지 추가](#마이페이지-추가)
  - [README.md 최신화](#readmemd-최신화)
  - [검증 상태](#검증-상태)
- [추가사항1 반영](#추가사항1-반영)
  - [작업 내용](#작업-내용-1)
  - [로고 조정](#로고-조정)
  - [로그인 화면 조정](#로그인-화면-조정)
  - [plan4.md 갱신](#plan4md-갱신)
  - [검증 상태](#검증-상태-1)
- [추가사항2 반영](#추가사항2-반영)
  - [작업 내용](#작업-내용-2)
  - [로고 애니메이션 변경](#로고-애니메이션-변경)
  - [색상 분리 제거 사유](#색상-분리-제거-사유)
  - [plan4.md 갱신](#plan4md-갱신-1)
  - [검증 상태](#검증-상태-2)
- [추가사항3 반영](#추가사항3-반영)
  - [작업 내용](#작업-내용-3)
  - [색상 분리 복구](#색상-분리-복구)
  - [plan4.md 갱신](#plan4md-갱신-2)
  - [검증 상태](#검증-상태-3)
- [추가사항4 반영](#추가사항4-반영)
  - [작업 내용](#작업-내용-4)
  - [상단바 반응형 보정](#상단바-반응형-보정)
  - [768px 여백 보정](#768px-여백-보정)
  - [plan4.md 갱신](#plan4md-갱신-3)
  - [검증 상태](#검증-상태-4)

---

# 개요

- `plan4.md`에서 정리한 추천 작업 단위 중 1차 구현 범위를 코드에 반영한다.
- 공통 브랜드 로고를 추가하고, 상단바의 로그인 진입을 실제 라우트로 연결한다.
- 로그인, 회원가입, 마이페이지 화면을 새 구조에 맞춰 추가한다.
- README.md를 현재 코드 구조와 라우트 기준으로 최신화한다.

---

# plan4 1차 구현

## 작업 내용

- `BrandLogo` 공통 컴포넌트를 추가함.
- `AppTopBar`에 `BrandLogo`를 적용함.
- `AppTopBar`의 로그인 버튼을 `/login`으로 이동하는 `Link`로 변경함.
- `AppTopBar`에 `isLoggedIn` 옵션을 추가하여 로그인 사용자일 때 `/me` 진입 버튼을 표시할 수 있게 함.
- 플랫폼 홈의 큰 `choimory.dev` 타이틀을 `BrandLogo`로 교체함.
- `/login` 라우트와 로그인 화면을 추가함.
- `/signup` 라우트와 회원가입 화면을 추가함.
- `/me` 라우트와 마이페이지 화면을 추가함.
- `README.md`의 오래된 `/community`, `features/community` 설명을 제거하고 현재 구조를 반영함.

## 공통 UI 정리

추가함:

- `src/shared/ui/BrandLogo.tsx`

수정함:

- `src/shared/ui/AppTopBar.tsx`
- `src/features/platform/components/PlatformHomeView.tsx`

`BrandLogo`는 `choimory.dev`를 `{choimory.dev/}` 형태의 개발자 느낌 텍스트 로고로 표시한다.

`AppTopBar`는 기존 텍스트 브랜드 대신 `BrandLogo`를 사용하도록 변경했다.

로그인 버튼은 단순 `button`에서 `/login` 링크로 변경했다.

`isLoggedIn`이 `true`이면 로그인 버튼 대신 `내 공간` 버튼을 표시하고 `/me`로 이동하게 했다.

## 인증 화면 추가

추가함:

- `src/app/login/page.tsx`
- `src/app/signup/page.tsx`
- `src/features/auth/model/authTypes.ts`
- `src/features/auth/container/LoginContainer.tsx`
- `src/features/auth/container/SignupContainer.tsx`
- `src/features/auth/components/LoginView.tsx`
- `src/features/auth/components/SignupView.tsx`

로그인 화면은 이메일, 비밀번호 입력 필드와 회원가입 링크를 제공한다.

회원가입 화면은 닉네임, 이메일, 비밀번호, 비밀번호 확인 입력 필드와 로그인 링크를 제공한다.

아직 실제 API 연동은 하지 않고, 화면 구조만 구성했다.

## 마이페이지 추가

추가함:

- `src/app/me/page.tsx`
- `src/features/me/model/meTypes.ts`
- `src/features/me/container/MeContainer.tsx`
- `src/features/me/components/MeView.tsx`
- `src/features/me/components/MeSettingCard.tsx`

마이페이지는 다음 항목을 표시한다.

- 프로필 요약
- 개인정보 변경
- 사이트 설정
- 2차 인증
- 회원 탈퇴

초기 구현이므로 실제 저장 기능은 연결하지 않았다.

마이페이지 하단 네비게이션에서는 `내 공간` 항목을 활성화 상태로 표시한다.

## README.md 최신화

수정함:

- `README.md`

반영 내용:

- 프로젝트 설명을 `choimory.dev` 기준으로 변경함.
- 현재 라우트에 `/blog`, `/login`, `/signup`, `/me`를 반영함.
- `features/auth`, `features/blog`, `features/me`, `features/platform` 구조를 반영함.
- 오래된 `/community`, `features/community` 설명을 제거함.
- 향후 화면 설계 기준을 `plan4.md`로 갱신함.

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
- `/blog`
- `/login`
- `/me`
- `/signup`

# 추가사항1 반영

## 작업 내용

- `plan4.md`의 `추가사항1` 내용을 코드에 반영함.
- 로고 표기를 `{choimory.dev/}`에서 `{choimory.dev()}`로 변경함.
- 로고 애니메이션을 글자별 타이핑 느낌으로 변경함.
- 로그인 화면의 회원가입 진입을 더 명확한 버튼 형태로 변경함.
- 로그인 화면에 네이버, 카카오, 구글 소셜 로그인 버튼을 추가함.
- 소셜 로그인 버튼 목록을 `LoginViewModel`에서 제공하도록 구조화함.
- `plan4.md`에 `추가사항1 구현계획`을 추가하고 목차를 갱신함.

## 로고 조정

수정함:

- `src/shared/ui/BrandLogo.tsx`
- `src/app/globals.css`

`BrandLogo`의 표시 문구를 `{choimory.dev()}` 형태로 변경했다.

기존에는 로고 일부를 고정 텍스트 덩어리로 렌더링했지만, 타이핑 애니메이션을 위해 글자 단위 배열로 렌더링하도록 변경했다.

`globals.css`에는 다음 내용을 추가했다.

- `brand-logo-type` keyframes
- `.brand-logo-letter` 애니메이션 클래스
- `prefers-reduced-motion: reduce` 대응

## 로그인 화면 조정

수정함:

- `src/features/auth/model/authTypes.ts`
- `src/features/auth/components/LoginView.tsx`

`authTypes.ts`에는 `SocialLoginProvider` 타입과 `LoginViewModel.socialProviders` 필드를 추가했다.

`loginViewModel`에는 다음 소셜 로그인 제공자를 추가했다.

- 네이버
- 카카오
- 구글

`LoginView`에서는 ViewModel의 `socialProviders`를 순회하여 소셜 로그인 버튼을 렌더링한다.

실제 OAuth 연동은 아직 하지 않고, 버튼은 화면 구성 확인용 `type="button"`으로 유지했다.

회원가입 링크는 로그인 폼 아래에서 더 잘 보이도록 보조 버튼 스타일로 변경했다.

## plan4.md 갱신

수정함:

- `.agents/histories/2026/09/17/front-structure-planning/plan4.md`

반영 내용:

- 목차에 `추가사항1`과 `추가사항1 구현계획`을 추가함.
- `추가사항1` 마지막 빈 bullet을 제거함.
- 로고, 전역 CSS, 로그인 화면, 소셜 로그인, ViewModel 확장, 검증 계획을 구현계획으로 정리함.

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
- `/blog`
- `/login`
- `/me`
- `/signup`

---

# 추가사항2 반영

## 작업 내용

- 로고 애니메이션이 글자마다 위아래로 움직여 wave처럼 보이는 문제를 수정함.
- `BrandLogo`를 글자별 `span` 렌더링에서 단일 텍스트 렌더링으로 변경함.
- 로고 애니메이션을 `steps()` 기반 타자기 방식으로 변경함.
- 오른쪽 border를 커서처럼 사용하고 깜빡임 애니메이션을 적용함.
- `plan4.md`에 `추가사항2`와 구현계획을 추가함.

## 로고 애니메이션 변경

수정함:

- `src/shared/ui/BrandLogo.tsx`
- `src/app/globals.css`

기존 방식:

- `{`, `choimory`, `.`, `dev`, `()`, `}` 등을 글자별 `span`으로 렌더링함.
- 각 글자에 지연 시간을 다르게 주고 `translateY`를 적용함.
- 결과적으로 타자기 느낌이 아니라 글자가 물결처럼 출렁이는 느낌이 났음.

변경 방식:

- `{choimory.dev()}` 전체를 하나의 텍스트로 렌더링함.
- `max-width`가 `0`에서 전체 글자 길이만큼 열리도록 `steps()` 애니메이션을 적용함.
- 오른쪽 border를 커서처럼 사용함.
- 커서 border에 깜빡임 애니메이션을 적용함.
- `prefers-reduced-motion: reduce`에서는 애니메이션과 커서를 제거함.

## 색상 분리 제거 사유

이번 변경에서 기존 `{`, `.`, `()`, `}` 색상 분리는 제거했다.

이유:

- 타자기 효과를 자연스럽게 만들려면 텍스트 전체가 하나의 줄로 잘려야 함.
- 글자별 색상 분리를 유지하려면 다시 여러 `span`을 사용해야 하는데, 이 경우 글자별 등장 타이밍과 커서 위치를 자연스럽게 맞추기 복잡함.
- 이번 요구사항의 핵심은 wave 느낌 제거와 커서가 깜빡이는 타자기 느낌이므로, 색상 분리보다 타자기 애니메이션을 우선했다.

추후 색상 분리를 다시 살리려면, 단일 텍스트 타이핑을 유지한 상태에서 배경 클리핑이나 오버레이 방식으로 별도 설계가 필요하다.

## plan4.md 갱신

수정함:

- `.agents/histories/2026/09/17/front-structure-planning/plan4.md`

반영 내용:

- 목차에 `추가사항2`와 `추가사항2 구현계획`을 추가함.
- wave 느낌 문제와 타자기 애니메이션 구현 방향을 기록함.
- 색상 분리보다 타자기 느낌을 우선한다는 계획을 기록함.

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
- `/blog`
- `/login`
- `/me`
- `/signup`

---

# 추가사항3 반영

## 작업 내용

- 로고의 타자기 애니메이션은 유지하면서 색상 분리를 다시 살림.
- `BrandLogo`의 바깥 wrapper는 타자기 마스크와 커서 역할을 유지함.
- wrapper 내부에 색상 조각 `span`을 다시 추가함.
- 내부 색상 조각에는 개별 이동 애니메이션을 적용하지 않아 wave 느낌이 다시 생기지 않도록 함.
- `plan4.md`에 `추가사항3`과 구현계획을 추가함.

## 색상 분리 복구

수정함:

- `src/shared/ui/BrandLogo.tsx`

변경 방식:

- 바깥 `brand-logo-typewriter` 요소는 `max-width`와 `steps()` 기반 타자기 애니메이션을 담당함.
- 안쪽 `inline-flex` 요소는 로고 텍스트의 색상 분리를 담당함.
- `{`, `}`는 primary 색상으로 표시함.
- `.`은 green 색상으로 표시함.
- `(`, `)`는 orange 색상으로 표시함.
- `choimory`, `dev`는 foreground 색상으로 표시함.

이 방식은 텍스트 전체가 왼쪽에서 오른쪽으로 잘리며 나타나기 때문에 타자기 느낌을 유지한다.

동시에 내부 텍스트 조각은 색상만 다르고 움직이지 않으므로, 이전처럼 wave 느낌이 생기지 않는다.

## plan4.md 갱신

수정함:

- `.agents/histories/2026/09/17/front-structure-planning/plan4.md`

반영 내용:

- 목차에 `추가사항3`과 `추가사항3 구현계획`을 추가함.
- 타자기 애니메이션과 색상 분리를 함께 유지하는 구현 방향을 기록함.
- 추가사항 순서를 `추가사항1`, `추가사항2`, `추가사항3` 순서로 정리함.

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
- `/blog`
- `/login`
- `/me`
- `/signup`

---

# 추가사항4 반영

## 작업 내용

- 플랫폼 홈 모바일S에서 상단 로그인 버튼이 깨지는 문제를 보정함.
- blog 홈 모바일S에서 로고 타이핑 애니메이션이 우측 요소를 밀어내는 문제를 보정함.
- 플랫폼 홈 태블릿 768px에서 좌우 마진이 사라지는 문제를 보정함.
- `plan4.md`에 `추가사항4 분석`과 `추가사항4 구현계획`을 추가함.

## 상단바 반응형 보정

수정함:

- `src/shared/ui/BrandLogo.tsx`
- `src/shared/ui/AppTopBar.tsx`

`BrandLogo`에 `isAnimated?: boolean` 옵션을 추가했다.

상단바에서는 `BrandLogo`를 `isAnimated={false}`로 사용하여 로고 타이핑 중 실제 레이아웃 폭이 변하지 않도록 했다.

`AppTopBar`에서는 다음 반응형 보정을 적용했다.

- 상단바 내부 gap을 줄임.
- 로고 링크에 `min-w-0`, `max-w`, `overflow-hidden`을 적용함.
- 모바일S 근처에서는 검색/알림 아이콘을 숨김.
- 로그인 버튼에 `shrink-0`과 작은 padding을 적용함.
- blog 화면처럼 뒤로가기 버튼이 있는 경우에도 leading 영역을 `shrink-0`으로 보호함.

## 768px 여백 보정

수정함:

- `src/shared/ui/AppTopBar.tsx`
- `src/shared/ui/WideContent.tsx`
- `src/shared/ui/BottomNavigation.tsx`

`AppTopBar`와 `WideContent`의 `md:px-0`을 `lg:px-0`로 변경했다.

이로 인해 768px 태블릿 폭에서는 좌우 `px-4` 여백이 유지된다.

`BottomNavigation`은 wide 기준에서도 좌우 여백이 남도록 `w-[calc(100%-2rem)]`을 적용했다.

## plan4.md 갱신

수정함:

- `.agents/histories/2026/09/17/front-structure-planning/plan4.md`

반영 내용:

- 목차에 `추가사항4`를 추가함.
- 320px 상단 로그인 버튼 깨짐 원인을 분석함.
- 320px blog 홈에서 로고 타이핑 중 우측 요소 밀림 원인을 분석함.
- 768px에서 좌우 여백이 사라지는 원인을 분석함.
- `BrandLogo` 옵션, 상단바 모바일S 대응, 768px 마진 보정 구현계획을 정리함.

## 검증 상태

아직 다음 검증은 실행하지 않음.

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
