# choimory-dev-front

choimory-dev 서비스의 프론트엔드 프로젝트입니다.

모바일 앱 형태의 레이아웃을 기반으로 회원가입, 로그인, 홈 화면을 제공합니다.

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

```
src/
├── app/                        라우팅 진입점. Container 호출만 담당한다
│   ├── layout.tsx              루트 레이아웃 (폰트, metadata, viewport)
│   ├── globals.css             전역 스타일
│   ├── page.tsx                진입 게이트
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── signup/verify/page.tsx
│   ├── signup/welcome/page.tsx
│   └── home/page.tsx
│
├── features/                   도메인별 화면 로직
│   ├── auth/
│   │   ├── api/                authApi
│   │   ├── model/              authTypes, authSession
│   │   ├── hooks/              useAuthSession, useLogin, useSignUp, useVerify
│   │   ├── container/          LoginContainer, SignUpContainer, VerifyContainer,
│   │   │                       WelcomeContainer, RootGateContainer
│   │   └── components/         LoginForm, SignUpForm, VerifyForm,
│   │                           WelcomeMessage, SocialLoginButtons
│   └── user/
│       ├── api/                userApi
│       ├── model/              userTypes
│       ├── hooks/              useUserSummary
│       ├── container/          DashboardContainer
│       └── components/         UserSummaryCard, SectionCard, FeatureHighlight
│
└── shared/                     도메인에 종속되지 않는 공통 요소
    ├── ui/                     ScreenLayout, AppHeader, BottomNav,
    │                           Button, TextField, Card, ThemeToggle
    ├── model/                  theme
    ├── hooks/                  useTheme
    └── utils/                  formatTime
```

경로 별칭은 `@/*` → `./src/*` 입니다.

---

## 아키텍처

화면은 다음 4계층으로 분리합니다. 상세 규칙은 `.agents/rules/front-end/code-convention-react.md`를 따릅니다.

| 계층 | 위치 | 책임 |
|---|---|---|
| `page` | `app/**/page.tsx` | 라우팅 진입점. Container 호출만 수행하며 얇게 유지한다 |
| `container` | `features/*/container` | API 호출, 상태 관리, 이벤트 흐름 |
| `hook` | `features/*/hooks` | 복잡한 상태와 이벤트 로직. UI를 반환하지 않는다 |
| `component` | `features/*/components` | UI 렌더링만 담당. props로 데이터를 전달받는다 |

데이터 흐름은 `page → container → (hook) → component` 단방향입니다.

### 공통 UI

여러 화면에서 반복되는 요소는 `shared/ui`에 둡니다.

| 컴포넌트 | 용도 |
|---|---|
| `ScreenLayout` | 화면 전체를 감싸는 세로 배치 래퍼 |
| `AppHeader` | 상단 헤더. `isCentered`, `isLinked`로 인증 화면과 일반 화면을 구분한다 |
| `BottomNav` | 하단 네비게이션 (이동 처리는 미연결) |
| `Button` | `primary` / `social` / `ghost` 유형, `md` / `sm` 크기 |
| `TextField` | 라벨 + 입력 필드. `actionLabel`로 중복확인 버튼을 함께 렌더링한다 |
| `Card` | 콘텐츠 섹션 카드 |
| `ThemeToggle` | 라이트/다크 테마 전환 버튼. `AppHeader`에 포함되어 모든 화면에 노출된다 |

### 테마

라이트와 다크 두 가지 테마를 지원하며 사용자가 직접 전환할 수 있습니다.

테마는 `<html>`의 `data-theme` 속성으로 결정됩니다. Tailwind의 `dark:` 변형을 `prefers-color-scheme` 대신 이 속성에 연결했습니다.

```css
/* globals.css */
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

- 최초 진입 시 저장된 선택이 있으면 그 값을, 없으면 OS 설정을 따릅니다.
- 첫 페인트 이전에 `layout.tsx`의 인라인 스크립트가 `data-theme`을 지정하여 화면 깜빡임을 방지합니다.
- 테마 상태 접근은 `shared/model/theme.ts`에서만 수행합니다. `useTheme`은 `useSyncExternalStore`로 이를 구독하므로 다른 탭에서 테마를 변경해도 반영됩니다.

배경색과 전경색은 CSS 변수로 관리합니다. 그 외 색상은 아직 `dark:` 유틸리티를 직접 사용하고 있습니다.

```css
:root               { --background: #ffffff; --foreground: #171717; }
[data-theme="dark"] { --background: #0a0a0a; --foreground: #ededed; }
```

### API 레이어

API 호출은 컴포넌트에 직접 작성하지 않고 도메인별 `api` 파일에 둡니다.

응답 타입과 화면 표시용 ViewModel은 분리하며, 변환은 mapper 함수로 작성합니다. (`toUserSummaryViewModel`)

---

## 도메인

### auth

회원가입과 로그인을 담당합니다.

| 화면 | 경로 | 설명 |
|---|---|---|
| 진입 게이트 | `/` | 로그인 여부를 확인하여 `/home` 또는 `/login`으로 이동 |
| 로그인 | `/login` | 아이디/비밀번호 입력, SNS 로그인 버튼 |
| 회원가입 | `/signup` | 이메일·닉네임 중복확인, 비밀번호 입력 |
| 이메일 인증 | `/signup/verify` | 인증 코드 입력. 유효 시간 180초 |
| 가입 완료 | `/signup/welcome` | 가입 완료 안내 |

화면 간 이동 시 `email`, `nickname`을 쿼리 파라미터로 전달합니다.

**세션 관리**

로그인 상태는 `features/auth/model/authSession.ts`에서만 접근합니다. 화면과 hook은 저장 방식을 알지 못하므로, 저장소를 변경하더라도 이 파일만 수정하면 됩니다.

`useAuthSession`은 `useSyncExternalStore`로 저장소를 구독하며 세 가지 상태를 반환합니다.

- `loading` : 서버 렌더링 시점 등 아직 확인되지 않은 상태
- `authenticated` / `unauthenticated`

`storage` 이벤트를 함께 구독하므로 다른 탭에서 로그아웃하면 현재 탭에도 반영됩니다.

### user

로그인한 사용자의 홈 화면을 담당합니다.

| 화면 | 경로 | 설명 |
|---|---|---|
| 홈 | `/home` | 사용자 요약 정보, 콘텐츠 섹션, 하단 네비게이션 |

`/main`은 과거 `/home`과 동일한 화면이었으나 중복이므로 제거되었습니다. 해당 경로는 이후 랜딩 페이지 용도로 사용할 수 있습니다.

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

## 현재 제약 사항

**백엔드가 연동되어 있지 않습니다.**

모든 API는 `features/*/api`의 mock 구현이며 `TODO` 주석으로 교체 지점을 표시해 두었습니다. 연동 시 해당 파일의 함수 내부만 수정하면 되고 호출부는 변경하지 않습니다.

**인증이 구현되어 있지 않습니다.**

로그인은 입력값 검증 없이 통과하며, 세션은 브라우저 저장소의 플래그 하나로 관리됩니다. 토큰, 라우트 가드, 비밀번호 검증이 없으므로 `/home`에 직접 접근할 수 있습니다.

향후 JWT와 Redis 기반 세션으로 전환할 예정이며, 그 시점에 `proxy.ts` 라우트 가드를 함께 도입합니다.

**기타**

- 하단 네비게이션과 일부 버튼(프로필 수정, 섹션 Action)은 동작이 연결되어 있지 않습니다.
- 다크 모드는 OS 설정(`prefers-color-scheme`)을 따르며 별도 토글이 없습니다.

---

## 작업 히스토리

작업 내역은 `.agents/histories/`에 기록합니다. 일자별 작업 목록은 `.agents/histories/calendar.md`를 참고합니다.
