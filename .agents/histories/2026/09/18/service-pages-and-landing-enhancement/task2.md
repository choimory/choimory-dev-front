# 목차

- [개요](#개요)
- [step2 구현](#step2-구현)
  - [작업 내용](#작업-내용)
  - [feed ViewModel 확장](#feed-viewmodel-확장)
  - [feed 비회원 화면 개선](#feed-비회원-화면-개선)
  - [feed 회원 화면 개선](#feed-회원-화면-개선)
  - [feed 하단 툴바 정리](#feed-하단-툴바-정리)
  - [plan2.md 갱신](#plan2md-갱신)
  - [검증 상태](#검증-상태)

---

# 개요

- `plan2.md`의 추천 step2에 따라 feed 화면 디테일 개선과 feed 하단 툴바 정책 정리를 진행했다.
- blog는 이미 guest/member 피드 구조가 있으므로 이번 단계에서는 변경하지 않았다.
- feed가 단순 안내 화면이 아니라 실제 서비스 화면처럼 보이도록 비회원/회원 화면의 정보 구조를 보강했다.

---

# step2 구현

## 작업 내용

- `FeedViewModel`에 비회원 혜택 안내와 추적 중 항목 데이터를 추가함.
- feed 비회원 화면에 로그인 후 가능한 기능 섹션을 추가함.
- feed 회원 화면에 추적 중인 항목 섹션을 추가함.
- 최근 알림 목록을 최근 이벤트 섹션으로 분리함.
- feed 하단 툴바를 `피드 / 추적 / 알림 / 홈`으로 정리함.
- `plan2.md`에 step2 구현 전 분석을 추가함.

## feed ViewModel 확장

수정함:

- `src/features/feed/model/feedTypes.ts`

추가한 타입:

- `FeedGuestBenefit`
- `FeedTrackingItem`

확장한 데이터:

- `guestBenefits`
- `trackingItems`

비회원 화면에서는 `guestBenefits`를 사용해 로그인 후 가능한 기능을 안내한다.

회원 화면에서는 `trackingItems`를 사용해 사용자가 어떤 대상을 추적 중인지 보여준다.

## feed 비회원 화면 개선

수정함:

- `src/features/feed/components/FeedView.tsx`

비회원 화면은 다음 구조로 개선했다.

- 상단 소개 카드
  - `방송 시작과 가격 하락을 한 피드에서`
  - 로그인/회원가입 CTA
- 준비 중인 피드
  - 스트리머 활동 알림
  - 가격 알림
  - 사용자 정의 피드
- 로그인하면 가능한 것
  - 관심 대상 저장
  - 목표 가격 설정
  - 알림 히스토리 확인

## feed 회원 화면 개선

수정함:

- `src/features/feed/components/FeedView.tsx`

회원 화면은 다음 구조로 개선했다.

- feed 요약 카드
  - 추적 중
  - 새 알림
  - 관심 항목
- 추적 중인 항목
  - 스트리머 샘플
  - 가격 알림 샘플
  - 콘텐츠 알림 샘플
- 최근 이벤트
  - 방송 시작
  - 가격 하락
  - 미확인 알림

아직 실제 스트리머/가격 알림 API는 연결하지 않았다.

## feed 하단 툴바 정리

수정함:

- `src/features/feed/components/FeedView.tsx`

feed 하단 툴바를 다음 항목으로 변경했다.

- 피드
- 추적
- 알림
- 홈

기존의 `blog` 항목은 제거했다.

정책상 네 번째 `홈`은 플랫폼 홈으로 돌아가는 역할을 유지한다.

## plan2.md 갱신

수정함:

- `.agents/histories/2026/09/18/service-pages-and-landing-enhancement/plan2.md`

추가한 내용:

- step2 구현 전 분석
- 현재 상태
- 문제점
- 추천 하단 툴바 정책
- feed 화면 개선 방향
- 구현 범위
- 이번 작업에서 제외할 것
- 추천 구현 순서

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
