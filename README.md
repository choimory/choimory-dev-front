# choimory-dev-front

choimory.dev 서비스의 프론트엔드 프로젝트입니다.

현재는 여러 하위 서비스를 담는 플랫폼형 화면 구조를 기준으로 `/`, `/services`, `/notice`, `/blog`, `/feed`, `/login`, `/signup`, `/me`와 주요 메뉴/상세 화면을 구성한 상태입니다.

---

## 용어

| 용어 | 의미 |
|---|---|
| 서비스 | `choimory.dev` 플랫폼이 제공하는 개별 기능 단위. 플랫폼, blog, feed는 현재 제공 중인 서비스이며 memo, account-book, schedule은 준비 중인 서비스이다 |
| 도메인 | 하나의 서비스 안에서 하단 메뉴로 구분되는 화면 묶음. 플랫폼의 도메인은 공지사항, 커뮤니티(예정)이며 blog의 도메인은 인기, 팔로잉, feed의 도메인은 인기, 관찰이다 |

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
| 테스트 | Vitest 5 + React Testing Library + jest-dom + user-event (jsdom 환경) |
| 패키지 매니저 | npm |

- Next.js 16부터 Turbopack이 기본 번들러이므로 `--turbopack` 플래그는 사용하지 않습니다.
- `next lint`는 Next.js 16에서 제거되었으므로 ESLint CLI를 직접 사용합니다.
- Vitest 5가 `@types/node` `^22` 이상을 요구하므로 `@types/node`는 `^22`를 사용합니다.

---

## 실행 방법

```bash
npm install     # 의존성 설치
npm run dev     # 개발 서버 실행 (http://localhost:3000)
npm run build   # 프로덕션 빌드
npm run start   # 빌드 결과 실행
npm run lint    # eslint . 실행
npm run test    # Vitest 감시 모드
npm run test:run # Vitest 1회 실행
```

타입 검사는 `npx tsc --noEmit`으로 수행합니다.

> Next.js 16은 동일 프로젝트에서 개발 서버가 중복 실행되는 것을 차단합니다. 이미 실행 중인 서버가 있으면 해당 서버를 사용하거나 종료 후 다시 실행합니다.

---

## 프로젝트 구조

```text
src/
├── app/
│   ├── blog/page.tsx
│   ├── blog/following/page.tsx
│   ├── blog/me/page.tsx
│   ├── blog/popular/page.tsx
│   ├── blog/posts/[postId]/page.tsx
│   ├── blog/[nickname]/page.tsx
│   ├── blog/users/[nickname]/page.tsx
│   ├── feed/page.tsx
│   ├── feed/activities/[activityId]/page.tsx
│   ├── feed/me/page.tsx
│   ├── feed/me/targets/[targetId]/page.tsx
│   ├── feed/observations/page.tsx
│   ├── feed/observations/[observationId]/page.tsx
│   ├── feed/popular/page.tsx
│   ├── feed/targets/[targetId]/page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── login/page.tsx
│   ├── me/page.tsx
│   ├── notice/page.tsx
│   ├── page.tsx
│   ├── services/page.tsx
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

tests/
├── fixtures/          # 테스트용 데이터 (feature별 픽스처)
└── unit/              # Vitest 단위, 컴포넌트 테스트 (src/와 같은 경로로 미러링)
    ├── features/
    │   ├── auth/ blog/ feed/ me/ platform/   # components/, container/, model/
    └── shared/
        ├── model/
        └── ui/

vitest.config.mts      # Vitest 설정
vitest.setup.ts        # 테스트 공통 설정 (jest-dom 매처 등록, 렌더링 정리)
```

경로 별칭은 `@/*` → `./src/*` 입니다.

---

## 현재 화면 상태

현재 라우트는 다음과 같습니다.

| 경로 | 설명 |
|---|---|
| `/` | 여러 하위 서비스로 진입하는 플랫폼 홈 |
| `/services` | 플랫폼 전체 서비스 메뉴 |
| `/notice` | 플랫폼 공지사항 |
| `/blog` | 인스타그램 같은 글, 이미지, 댓글, 팔로우 중심의 blog 서비스 피드 |
| `/blog/popular` | blog 인기 글 메뉴 |
| `/blog/following` | blog 팔로잉 피드 메뉴 |
| `/blog/posts/[postId]` | blog 게시글 상세 |
| `/blog/[nickname]` | nickname 기반 공개 유저 blog 메인 |
| `/blog/me` | 내 blog 설정/관리 |
| `/blog/users/[nickname]` | `/blog/[nickname]`로 이동하는 호환 라우트 |
| `/feed` | 아이템, 스트리머, 아티스트 관찰 알림을 모아보는 feed 서비스 |
| `/feed/popular` | feed 인기 관찰 대상 랭킹 |
| `/feed/observations` | feed 관찰 대상 목록 |
| `/feed/observations/[observationId]` | feed 구버전 관찰 상세 |
| `/feed/activities/[activityId]` | feed 알림 상세 |
| `/feed/targets/[targetId]` | feed 관찰 대상 공통 상세 |
| `/feed/me` | 내 feed 관리 홈 |
| `/feed/me/targets/[targetId]` | 내 feed 관찰 대상 설정 상세 |
| `/login` | 로그인 화면 |
| `/signup` | 회원가입 화면 |
| `/me` | 개인정보와 사이트 설정을 관리하는 마이페이지 |

현재 구현된 주요 화면 요소는 다음과 같습니다.

- 플랫폼 홈
  - `choimory.dev` 브랜드 로고
  - 애니메이션 없는 브랜드 로고를 활용한 depth 라벨
  - 통합 검색바
  - 좌우 화살표로 넘기는 서비스 런처
  - 전체 서비스 메뉴
  - 상세 모달을 제공하는 공지사항 메뉴
  - 타이핑 애니메이션 브랜드 로고와 도메인 경로를 보여주는 공용 페이지 소개 영역(공지사항, 서비스, blog 인기/팔로잉, feed 인기/관찰, 프로필형 화면 공통 사용)
  - 비회원 사용자용 서비스 소개 섹션
  - 로그인 사용자용 내정보 프로필 카드
  - 로그인 사용자용 서비스별 대형 피드 카드
  - 플랫폼형 하단 네비게이션
- blog
  - 피드 필터
  - 글 작성 진입 영역
  - 게시글 카드
  - 인기, 팔로잉, 내 blog 설정/관리, 공개 유저 blog 메인 화면
  - 인기 화면 상단 검색어, 멘션, 팔로워, 태그 탭형 5개 실시간 랭킹 카드
  - 팔로잉 화면 상단 팔로워/팔로잉 탭, 검색 버튼, 화살표 paging, 관계 액션 버튼
  - 내 blog 설정/관리 화면과 유저 blog 메인 화면이 공용으로 쓰는 프로필 카드(아바타, 닉네임, 소개, 작성 글/팔로워/팔로잉 카운팅)
  - 팔로워, 팔로잉 카운트 클릭 모달과 modal paging
  - 게시글 액션, 내 글 수정 버튼, 태그 링크, 댓글 아바타, 댓글 작성, 대댓글 입력 예시를 포함한 게시글 상세 화면
  - 서비스 내부 하단 네비게이션
- feed
  - 아이템 가격 알림 소개
  - 스트리머 방송/이벤트 알림 소개
  - 아티스트 신곡/앨범/참여곡 알림 소개
  - 로그인 사용자용 관찰 대상 요약 카드
  - 아이템, 스트리머, 아티스트가 섞인 관찰 대상 목록
  - 전체, 아이템, 스트리머, 아티스트 탭과 순차 등장 애니메이션을 포함한 인기 관찰 대상 랭킹 화면
  - 가격 요약, 그래프, 원본 링크, 방송 기록, 채팅 기록, 앨범 carousel을 카드별로 분리한 관찰 대상 공통 상세 화면
  - 가격 그래프 hover/click tooltip, 방송 기록 클릭 popover와 빈 영역 닫기/긴 내용 내부 스크롤, 중앙 정렬 앨범/트랙 상세 modal
  - 프로필 카드와 관찰대상 등록 modal, 저장 버튼이 있는 내 feed 관리 홈과 대상별 알림 설정 상세
  - 기존 관찰 상세와 알림 상세 호환 화면
  - 알림 상세 화면
  - 서비스 내부 하단 네비게이션
- 인증
  - 로그인 화면
  - 회원가입 화면
- 마이페이지
  - 프로필 요약
  - 설정 카드 클릭으로 여는 개인정보 변경 모달
  - 설정 카드 클릭으로 여는 사이트 설정 모달
  - 설정 카드 클릭으로 여는 2차 인증 모달
  - 2차 인증 사용 여부와 인증 방식 선택 UI
  - 설정 카드 클릭으로 여는 회원 탈퇴 확인 모달

---

## 향후 화면 설계 방향

프론트 구성 기획은 `.agents/histories/2026/09/17/front-structure-planning/plan4.md`를 기준으로 이어갑니다.

현재 구현 방향은 다음과 같습니다.

- `choimory.dev`는 여러 하위 서비스를 담는 플랫폼으로 본다.
- 첫 화면은 특정 서비스의 피드가 아니라 서비스 포털/런처 역할을 한다.
- blog 기능은 플랫폼 자체가 아니라 하위 서비스 중 하나로 분리한다.
- feed 기능은 아이템 가격, 스트리머 활동, 아티스트 신곡 알림을 관찰 대상별로 관리하는 핵심 하위 서비스로 둔다.
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

공용 UI 컴포넌트는 다음과 같습니다. 같은 모양이 두 곳 이상 반복되면 개별 화면에서 클래스를 다시 쓰지 않고 이 컴포넌트를 사용합니다.

| 컴포넌트 | 용도 | 주요 props |
|---|---|---|
| `Card` | 테두리와 배경이 있는 기본 카드 | `as`(div, section, article), `tone`(default, strong), `padding`(sm, md) |
| `Chip` | 짧은 상태나 분류를 보여주는 알약 | `size`(sm, md), `tone`(muted, surface) |
| `IconBadge` | 아이콘이나 이니셜을 담는 원형 배지 | `as`, `size`(xs~xl), `tone`(primary, soft, strong, surface) |
| `SegmentedTabs` | 같은 영역 안의 보기 전환 탭 | `items`, `activeId`, `onChange`, `ariaLabel`, `size` |
| `ListRow` | 좌측, 본문, 우측으로 이루어진 목록 행 | `leading`, `trailing`, `href`/`onClick`(링크/버튼), `tone`, `padding`, `isDimmed` |
| `Button` | 텍스트 버튼 | `variant`(primary, secondary, outline-danger), `size`(md, lg) |
| `IconButton` | 아이콘만 있는 정사각 버튼 | `ariaLabel`(필수), `size`(sm~lg), `tone`(muted, danger, ghost) |
| `Modal` | `document.body` 포털 모달 | `labelledBy`, `onClose`, `title`, `placement`, `overlay`, `size`, `padding` |

- `ListRow`는 `href`가 있으면 링크로, `onClick`이 있으면 버튼으로, 둘 다 없으면 정적 행으로 렌더링한다.
- `strong` 톤의 `ListRow`는 테두리와 hover 효과가 없다.
- `Modal`은 배경을 누르면 `onClose`를 호출하고 패널 안쪽 클릭은 막는다. `title`을 주면 제목과 닫기 버튼 헤더를 렌더링한다.
- `feed`의 대상 종류별 라벨, 아이콘, 색상 클래스는 `features/feed/model/feedTargetView.ts`의 함수를 사용한다.

공통 화면 레이아웃은 다음 기준을 따릅니다.

- 서비스 화면의 중앙 콘텐츠는 `shared/ui/AppContent.tsx`를 사용한다.
- `AppContent`의 기본 variant는 `wide`이며, 기본 폭은 `max-w-[768px]`이다.
- `AppTopBar`와 `BottomNavigation`의 기본 폭도 wide 기준이다.
- 상단바 액션은 `shared/ui/TopBarActions.tsx`에서 검색, 알림, 서비스 popover, 로그인/로그아웃 UI를 담당한다.
- 검색 오버레이는 `document.body` portal 기반으로 렌더링하여 화면 전체 기준으로 표시한다.
- 알림과 서비스 팝오버도 `document.body` portal 기반으로 렌더링하여 화면 빈 영역 클릭으로 닫히게 한다.
- 브랜드 로고는 `shared/ui/BrandLogo.tsx`를 사용하며 화면별로 애니메이션 여부를 조정한다.
- 화면 최상단 eyebrow(로고 포함)는 `shared/ui/PageIntroCard.tsx`를 공용으로 사용한다. 도메인 목록 화면은 title/description을 함께 쓰고, 프로필 카드가 뒤따르는 화면(`blog / me`, `feed / me`, `blog / @{nickname}`, 게시글 상세 등)은 eyebrow만 쓴다.
- 페이지 내부 섹션 구분용 eyebrow(로고 없음)는 `shared/ui/SectionHeader.tsx`를 공용으로 사용하며, 우측 액션 링크가 필요하면 `action` prop을 쓴다.
- eyebrow 텍스트는 `{서비스} / {도메인}` 슬래시 포맷으로 통일하고, heading은 간결한 명사형으로 쓴다. description은 `PageIntroCard`(화면 최상단)에서만 쓰고 따뜻한 안내형 문구로 작성하며, `SectionHeader`에는 description을 쓰지 않는다.
- 숫자와 라벨을 보여주는 통계 카드는 `shared/ui/StatCard.tsx`를 공용으로 사용하며, 클릭 가능 여부는 `onClick` prop으로 정한다.
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

**문구**

- 화면에 표시하는 문구는 `~합니다/~입니다` 같은 격식체 대신 `~해요/~예요` 해요체를 사용한다.
- 안내/설명 문구(description 등)는 권유형(`~해요/~해보세요`)으로 쓴다.
- 시스템 알림, 이벤트 로그 문구(알림 제목, `recentAlerts` 등)는 완료형(`~했어요/~됐어요`)으로 쓴다.
- 댓글처럼 사용자가 작성한 대화체 텍스트는 이 규칙 적용 대상에서 제외한다.

**테스트**

- 테스트 코드는 `tests/unit/` 아래에 `src/`와 같은 경로로 두고, 파일명은 `{대상파일명}.test.ts(x)`로 한다. (예: `src/shared/ui/Card.tsx` → `tests/unit/shared/ui/Card.test.tsx`)
- 테스트에서는 `@/shared/ui/Card`처럼 경로 별칭으로 import한다.
- 여러 테스트가 같이 쓰는 테스트용 데이터는 `tests/fixtures/`에 둔다. 컨테이너 테스트만 실제 임시 데이터를 쓰고, 컴포넌트 테스트는 픽스처를 쓴다.
- `globals`를 켜지 않으므로 `describe`, `it`, `expect`, `vi`는 `vitest`에서 import한다.
- 컴포넌트 테스트는 `getByRole`, `getByLabelText` 같은 접근성 기준 쿼리를 우선 사용하고, 사용자 이벤트는 `@testing-library/user-event`로 시뮬레이션한다.
- 열거형 값(크기, 톤, variant 등)은 `it.each`로 한 번에 검증한다.
- jsdom에 없는 API(`scrollBy`, `URL.createObjectURL`)는 해당 테스트 파일에서만 `vi.fn()`으로 대체한다.
- 라우터 없이 `next/link`를 클릭하면 jsdom이 페이지 이동을 시도하므로, 링크 클릭이 필요한 테스트는 파일 안에서 `vi.mock('next/link', ...)`로 대체한다.
- 현재 Playwright(E2E)와 MSW(API 모킹 통합 테스트)는 도입하지 않았다. API 연동 후 추가한다.

---

## 작업 히스토리

작업 내역은 `.agents/histories/`에 기록합니다. 일자별 작업 목록은 `.agents/histories/calendar.md`를 참고합니다.
