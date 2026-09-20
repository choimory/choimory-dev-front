# 목차

- [개요](#개요)
- [완료된 작업](#완료된-작업)
  - [1차 구현](#1차-구현)
  - [2차 구현](#2차-구현)
  - [3차 구현](#3차-구현)
  - [4차 구현](#4차-구현)
  - [5차 구현](#5차-구현)
- [주요 변경 파일](#주요-변경-파일)
- [검증 결과](#검증-결과)
- [남은 범위](#남은-범위)

---

# 개요

- 2026-09-19 상세페이지와 화면구조 디테일 작업을 마무리한다.
- 상세 진행 내용은 `plan1~5.md`, `task1~5.md`에 기록되어 있다.
- 본 문서는 전체 작업의 최종 완료 요약이다.

---

# 완료된 작업

## 1차 구현

플랫폼, blog, feed의 기본 상세/메뉴 화면을 연결했다.

- `/services`, `/notice` 화면을 추가했다.
- blog 인기, 팔로잉, 내 blog, 게시글 상세 화면을 추가했다.
- feed 인기, 관찰 목록, 관찰 상세, 알림 상세, 내 feed 화면을 추가했다.
- 플랫폼 홈, blog, feed, 마이페이지의 기존 placeholder 링크를 실제 라우트로 연결했다.
- feed 화면 용어를 `추적`에서 `관찰` 중심으로 정리했다.

## 2차 구현

기존 상세 화면의 상호작용과 모달 구조를 보강했다.

- 공지사항 목록에서 상세 모달을 열 수 있게 했다.
- 마이페이지 설정 카드 클릭 시 개인정보, 사이트 설정, 2차 인증, 회원 탈퇴 모달을 열 수 있게 했다.
- blog 게시글 상세에 액션 줄, 댓글 입력, 대댓글 입력 예시를 추가했다.
- BrandLogo 기반 depth 라벨과 화면별 용어를 정리했다.

## 3차 구현

blog 메뉴 화면의 상단 특화 영역과 유저 blog 흐름을 고도화했다.

- `/blog/popular`에 검색어, 멘션, 팔로워, 태그 기반 실시간 랭킹 탭을 추가했다.
- `/blog/following`에 팔로워/팔로잉 탭, 검색, paging, 관계 액션을 추가했다.
- `/blog/me`에 nickname 기반 프로필 카드와 팔로워/팔로잉 모달을 추가했다.
- `/blog/[nickname]`, `/blog/users/[nickname]` 기반 공개 유저 blog 화면 흐름을 추가했다.
- 게시글 상세에 태그 링크와 내 글 수정 버튼을 추가했다.

## 4차 구현

feed 서비스를 아이템, 스트리머, 아티스트 관찰 도메인으로 확장했다.

- feed 소개와 관찰 대상 목록에 아이템, 스트리머, 아티스트 유형을 반영했다.
- 아티스트 신곡, 앨범, 참여곡 알림과 신곡 발매 추이 관찰 개념을 추가했다.
- feed 인기 화면에 유형별 탭과 순차 등장 랭킹을 추가했다.
- 관찰 대상 공통 상세 라우트 `/feed/targets/[targetId]`를 추가했다.
- 내 feed 대상별 설정 상세 라우트 `/feed/me/targets/[targetId]`를 추가했다.

## 5차 구현

feed 화면 디테일과 상세 화면 인터랙션을 마무리했다.

- feed 홈 요약 카드와 최근 이벤트를 관찰 대상 상세로 연결했다.
- 아이템 상세에 기간 선택 가격 그래프, 축 라벨, hover/click tooltip을 추가했다.
- 스트리머 상세에 원본 채널, 방송 기록, 채팅 기록, 이벤트 목록 카드를 추가했다.
- 방송 기록은 contribution graph 형태로 구성하고, 클릭 기반 popover로 방송 session 목록을 볼 수 있게 했다.
- 방송 기록 popover는 빈 공간 클릭으로 닫히고, 긴 내용은 내부 스크롤로 처리되도록 보정했다.
- 아티스트 상세에 3D 회전형 앨범 carousel과 앨범/트랙 상세 modal을 추가했다.
- 내 feed에 아이템, 스트리머, 아티스트 관찰 대상 등록 modal을 추가했다.
- 공통 상단바에 서비스 popover 버튼을 추가했다.
- `plan5.md`, `task5.md`의 추가 수정사항까지 반영하고 목차를 갱신했다.

---

# 주요 변경 파일

- `README.md`
- `src/app/blog/[nickname]/page.tsx`
- `src/app/blog/following/page.tsx`
- `src/app/blog/me/page.tsx`
- `src/app/blog/popular/page.tsx`
- `src/app/blog/posts/[postId]/page.tsx`
- `src/app/blog/users/[nickname]/page.tsx`
- `src/app/feed/activities/[activityId]/page.tsx`
- `src/app/feed/me/page.tsx`
- `src/app/feed/me/targets/[targetId]/page.tsx`
- `src/app/feed/observations/page.tsx`
- `src/app/feed/observations/[observationId]/page.tsx`
- `src/app/feed/popular/page.tsx`
- `src/app/feed/targets/[targetId]/page.tsx`
- `src/app/notice/page.tsx`
- `src/app/services/page.tsx`
- `src/features/blog/components/*`
- `src/features/blog/container/*`
- `src/features/blog/model/blogTypes.ts`
- `src/features/feed/components/*`
- `src/features/feed/container/*`
- `src/features/feed/model/feedTypes.ts`
- `src/features/me/components/*`
- `src/features/platform/components/*`
- `src/features/platform/container/*`
- `src/features/platform/model/platformHomeTypes.ts`
- `src/shared/ui/*`

---

# 검증 결과

작업 중 다음 검증을 통과했다.

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- `git diff --check`

마지막 방송 기록 popover 보정 이후에도 다음 검증을 통과했다.

- `npx tsc --noEmit`
- `npm run lint`
- `git diff --check`

---

# 남은 범위

- 실제 API 연동
- 실제 로그인 사용자 데이터 연동
- 실제 blog 글, 댓글, 팔로우/언팔로우 API 연동
- 실제 feed 가격, 방송, 채팅, 음원/앨범 데이터 API 연동
- 관찰 대상 등록 modal 입력값의 실제 저장 정책 결정
- `/feed/activities/[activityId]`, `/feed/observations/[observationId]` 호환 라우트의 장기 역할 정리
- memo, account-book, schedule 서비스의 실제 화면 구현
