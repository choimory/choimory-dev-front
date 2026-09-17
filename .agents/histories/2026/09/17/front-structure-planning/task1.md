# 목차

- [개요](#개요)
- [레거시 화면 정리](#레거시-화면-정리)
  - [작업 내용](#작업-내용)
  - [남겨둔 것](#남겨둔-것)

---

# 개요

- `plan1.md`에서 논의한 새 화면 구조를 적용하기 위해 기존 레거시 화면을 제거한다.
- 화면은 처음부터 다시 만들 예정이므로 로그인, 회원가입, 홈 대시보드, 기존 공통 UI를 삭제한다.
- 프로젝트가 빌드 가능한 기본 Next.js App Router 구조는 유지한다.

---

# 레거시 화면 정리

## 작업 내용

- `/` 루트 화면을 빈 진입점으로 변경함.
- 기존 `/login`, `/signup`, `/signup/verify`, `/signup/welcome`, `/home` 라우트 파일을 삭제함.
- 기존 `features/auth`, `features/user` 하위 mock API, model, hook, container, component 파일을 삭제함.
- 기존 `shared/ui`, `shared/hooks`, `shared/model`, `shared/utils` 파일을 삭제함.
- `layout.tsx`에서 기존 테마 초기화 스크립트와 삭제된 `shared/model/theme` 참조를 제거함.
- `globals.css`에서 기존 다크 테마 토글 관련 설정을 제거하고 기본 전역 스타일만 남김.
- `README.md`를 현재 빈 시작 상태와 향후 화면 설계 기준에 맞게 갱신함.

## 남겨둔 것

- Next.js 기본 App Router 파일
  - `src/app/layout.tsx`
  - `src/app/page.tsx`
  - `src/app/globals.css`
  - `src/app/favicon.ico`
- 새 화면 설계를 위한 기획 문서와 목업 파일
  - `plan1.md`
  - `platform-home-mockup.html`
  - `community-service-mockup.html`
  - `community-mobile-mockup.html`
  - `community-desktop-narrow-mockup.html`
