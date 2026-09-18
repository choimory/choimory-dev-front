# choimory-dev-front

choimory.dev 서비스의 프론트엔드 프로젝트입니다.

현재는 여러 하위 서비스를 담는 플랫폼형 화면 구조를 기준으로 `/`, `/blog`, `/feed`, `/login`, `/signup`, `/me` 화면을 구성한 상태입니다.

---

## 기술 스택

| 구분 | 내용 |
|---|---|
| 프레임워크 | Next.js 16.3.5 (App Router, Turbopack) |
| 언어 | TypeScript 5 (`strict: true`) |
| UI | React 19.3.0 |
| 스타일 | Tailwind CSS v4 (PostCSS 방식) |
| 폰트 | Geist Sans / Geist Mono |
| 린트 | ESLint 9 + eslint-config-next (Flat Config) |
| 패키지 매니저 | npm |

- Next.js 16부터 Turbopack이 기본 번들러이므로 `--turbopack` 플래그는 사용하지 않습니다.
- `next lint`는 Next.js 16에서 제거되었으므로 ESLint CLI를 직접 사용합니다.

---

## 실행 방법

```bash
npm install     # 의존성 설치
npm run dev     # 개발 서버 실행 (http://localhost:3000)
npm run build   # 프로덕션 빌드
npm run start   # 빌드 결과 실행
npm run lint    # eslint . 실행
```

타입 검사는 `npx tsc --noEmit`으로 수행합니다.

> Next.js 16은 동일 프로젝트에서 개발 서버가 중복 실행되는 것을 차단합니다. 이미 실행 중인 서버가 있으면 해당 서버를 사용하거나 종료 후 다시 실행합니다.

---

## 프로젝트 구조

```text
src/
├── app/
│   ├── blog/page.tsx
│   ├── feed/page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── login/page.tsx
│   ├── me/page.tsx
│   ├── page.tsx
│   └── signup/page.tsx
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── container/
│   │   └── model/
│   ├── blog/
│   │   ├── components/
│   │   ├── container/
│   │   └── model/
│   ├── feed/
│   │   ├── components/
│   │   ├── container/
│   │   └── model/
│   ├── me/
│   │   ├── components/
│   │   ├── container/
│   │   └── model/
│   └── platform/
│       ├── components/
│       ├── container/
│       └── model/
│
└── shared/
    ├── model/
    └── ui/
```

경로 별칭은 `@/*` → `./src/*` 입니다.

---

## 현재 화면 상태

현재 라우트는 다음과 같습니다.

| 경로 | 설명 |
|---|---|
| `/` | 여러 하위 서비스로 진입하는 플랫폼 홈 |
| `/blog` | 인스타그램 같은 글, 이미지, 댓글, 팔로우 중심의 blog 서비스 피드 |
| `/feed` | 스트리머 활동 알림과 가격 알림을 모아보는 feed 서비스 |
| `/login` | 로그인 화면 |
| `/signup` | 회원가입 화면 |
| `/me` | 개인정보와 사이트 설정을 관리하는 마이페이지 |

현재 구현된 주요 화면 요소는 다음과 같습니다.

- 플랫폼 홈
  - `choimory.dev` 브랜드 로고
  - 통합 검색바
  - 좌우 화살표로 넘기는 서비스 런처
  - 비회원 사용자용 서비스 소개 섹션
  - 로그인 사용자용 내정보 프로필 카드
  - 로그인 사용자용 서비스별 대형 피드 카드
  - 플랫폼형 하단 네비게이션
- blog
  - 피드 필터
  - 글 작성 진입 영역
  - 게시글 카드
  - 서비스 내부 하단 네비게이션
- feed
  - 스트리머 활동 알림 소개
  - 가격 알림 소개
  - 로그인 사용자용 관심 피드 요약 뼈대
  - 최근 알림 목록 뼈대
  - 서비스 내부 하단 네비게이션
- 인증
  - 로그인 화면
  - 회원가입 화면
- 마이페이지
  - 프로필 요약
  - 개인정보 변경
  - 사이트 설정
  - 2차 인증
  - 회원 탈퇴 진입 항목

---

## 향후 화면 설계 방향

프론트 구성 기획은 `.agents/histories/2026/09/17/front-structure-planning/plan4.md`를 기준으로 이어갑니다.

현재 구현 방향은 다음과 같습니다.

- `choimory.dev`는 여러 하위 서비스를 담는 플랫폼으로 본다.
- 첫 화면은 특정 서비스의 피드가 아니라 서비스 포털/런처 역할을 한다.
- blog 기능은 플랫폼 자체가 아니라 하위 서비스 중 하나로 분리한다.
- feed 기능은 스트리머 활동 알림과 가격 알림을 모아보는 핵심 하위 서비스로 둔다.
- memo, account-book, schedule은 미래 계획 서비스로 두고 현재는 준비 중 상태로 표시한다.
- 플랫폼 홈, blog, 마이페이지 같은 서비스 화면은 `768px` 기준의 태블릿형 중앙 폭을 기본으로 사용한다.
- 로그인, 회원가입처럼 폼 중심의 특수 화면은 별도 좁은 중앙 폼 레이아웃을 사용할 수 있다.
- 로그인/비로그인 사용자에 따라 플랫폼 홈과 blog 화면을 분기할 수 있는 구조로 확장한다.

---

## 아키텍처 기준

화면을 다시 만들 때는 `.agents/rules/front-end/code-convention-react.md`를 따른다.

기본 계층은 다음과 같습니다.

| 계층 | 위치 | 책임 |
|---|---|---|
| `page` | `app/**/page.tsx` | 라우팅 진입점. Container 호출만 수행하며 얇게 유지한다 |
| `container` | `features/*/container` | API 호출, 상태 관리, 이벤트 흐름 |
| `hook` | `features/*/hooks` | 복잡한 상태와 이벤트 로직. UI를 반환하지 않는다 |
| `component` | `features/*/components` | UI 렌더링만 담당. props로 데이터를 전달받는다 |

공통 UI는 `shared/ui`에 둡니다.

공통 화면 레이아웃은 다음 기준을 따릅니다.

- 서비스 화면의 중앙 콘텐츠는 `shared/ui/AppContent.tsx`를 사용한다.
- `AppContent`의 기본 variant는 `wide`이며, 기본 폭은 `max-w-[768px]`이다.
- `AppTopBar`와 `BottomNavigation`의 기본 폭도 wide 기준이다.
- 상단바 액션은 `shared/ui/TopBarActions.tsx`에서 검색, 알림, 로그인/로그아웃 UI를 담당한다.
- 검색 오버레이는 `document.body` portal 기반으로 렌더링하여 화면 전체 기준으로 표시한다.
- 알림 팝오버도 `document.body` portal 기반으로 렌더링하여 화면 빈 영역 클릭으로 닫히게 한다.
- 브랜드 로고는 `shared/ui/BrandLogo.tsx`를 사용하며 화면별로 애니메이션 여부를 조정한다.
- 좁은 레이아웃은 로그인/회원가입 같은 예외 화면에만 제한적으로 사용한다.
- 개발 확인용 공통 모델은 `shared/model`에 둔다.

---

## 코드 규칙

전체 규칙은 `.agents/rules/` 하위 문서를 따릅니다. 프론트엔드는 아래 두 문서가 기준입니다.

- `.agents/rules/front-end/code-convention-react.md`
- `.agents/rules/front-end/comment.md`

주요 사항은 다음과 같습니다.

**구조**

- `page.tsx`에서 API 호출, 복잡한 상태 관리, 이벤트 로직을 작성하지 않는다.
- UI 컴포넌트는 API를 직접 호출하지 않고 전역 상태에 직접 의존하지 않는다.
- 하나의 파일에는 하나의 주요 컴포넌트만 작성한다.
- 상태가 없는 화면에는 hook을 생성하지 않는다.

**네이밍**

- 컴포넌트 파일명은 PascalCase, hook 파일명은 `use` 접두사를 사용한다.
- 이벤트 함수는 `handle` 접두사, 이벤트 props는 `on` 접두사를 사용한다.
- boolean props는 `is`, `has`, `can`, `should` 접두사를 사용한다.

**타입**

- `any` 사용을 금지한다. 불가피하면 `unknown` 사용 후 타입 가드를 작성한다.
- API 요청 타입과 응답 타입을 분리한다.
- 화면에서 사용하는 형태가 응답과 다르면 ViewModel 타입을 별도로 작성한다.

**주석**

- 모든 컴포넌트, 타입, 함수, Custom Hook에 Doc Comment를 작성한다.
- 타입의 각 필드에는 측면 주석을 작성한다.
- 로직은 흐름 단위로 분리하여 한글 주석을 작성한다.
- 코드 자체로 의미가 명확한 부분에는 주석을 작성하지 않는다.

---

## 작업 히스토리

작업 내역은 `.agents/histories/`에 기록합니다. 일자별 작업 목록은 `.agents/histories/calendar.md`를 참고합니다.
