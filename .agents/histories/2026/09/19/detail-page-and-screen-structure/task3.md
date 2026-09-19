# 목차

- [개요](#개요)
- [구현사항](#구현사항)
  - [블로그 인기 화면 상단 랭킹 카드](#블로그-인기-화면-상단-랭킹-카드)
  - [블로그 팔로잉 화면 상단 관리 카드](#블로그-팔로잉-화면-상단-관리-카드)
  - [내 블로그 화면 상단 프로필 카드](#내-블로그-화면-상단-프로필-카드)
  - [블로그 게시글 상세 태그 링크](#블로그-게시글-상세-태그-링크)
  - [공통 UI 보강](#공통-ui-보강)
  - [README 갱신](#readme-갱신)
- [주요 변경 파일](#주요-변경-파일)
- [검증 결과](#검증-결과)
- [남은 범위](#남은-범위)
- [추가사항2 구현사항](#추가사항2-구현사항)

---

# 개요

- `plan3.md`의 2차 구현 범위인 블로그 메뉴별 상단 특화 카드를 구현했다.
- `/blog/popular`, `/blog/following`, `/blog/me` 화면에서 각각 다른 상단 정보를 보여주도록 개선했다.
- 인기 랭킹 탭, 팔로잉 compact 목록, 내 블로그 팔로워/팔로잉 모달, 게시글 상세 태그 링크까지 실제 화면에 반영했다.
- 실제 API 연동 없이 `BlogMenuView.tsx`와 blog mock view model 기반으로 화면 구조를 구성했다.

---

# 구현사항

## 블로그 인기 화면 상단 랭킹 카드

`/blog/popular` 화면 상단에 탭형 실시간 랭킹 카드를 추가했다.

구현 내용:

- `blog / ranking` depth 라벨을 표시했다.
- `실시간 랭킹` 제목을 표시했다.
- `검색어`, `멘션`, `팔로워`, `태그` 탭을 추가했다.
- 탭별 mock 랭킹 데이터를 분리했다.
- 검색어 탭은 검색어와 순위를 표시하도록 구성했다.
- 멘션 탭은 `@nickname` 형식과 멘션 횟수를 표시하도록 구성했다.
- 팔로워 탭은 팔로워 증가 사용자와 증가 수를 표시하도록 구성했다.
- 태그 탭은 `#tag` 형식과 태그 클릭/사용 횟수를 표시하도록 구성했다.
- 각 랭킹 항목에 순위, 이름, 설명, 방향 아이콘, 숫자 지표를 표시했다.
- 랭킹 항목이 탭 전환 시 순차적으로 나타나도록 `blog-ranking-enter` 애니메이션을 추가했다.

## 블로그 팔로잉 화면 상단 관리 카드

`/blog/following` 화면 상단에 팔로잉 관리 카드를 추가했다.

구현 내용:

- `blog / following` depth 라벨을 표시했다.
- `팔로잉 관리` 제목과 설명을 표시했다.
- 팔로잉 사용자 mock 데이터를 추가했다.
- 사용자별 이니셜, 닉네임, 설명, 새 글 여부 점 표시를 구성했다.
- 별도 관리 버튼 대신 각 사용자 행 우측에 `언팔로우` 버튼을 배치했다.
- 인스타그램식 compact 목록처럼 한 줄에서 사용자 정보와 액션을 바로 처리할 수 있게 정리했다.

## 내 블로그 화면 상단 프로필 카드

`/blog/me` 화면 상단에 내 블로그 프로필 요약 카드를 추가했다.

구현 내용:

- `blog / me` 대신 `blog / mory.dev` depth 라벨을 표시했다.
- 프로필 이니셜 영역을 표시했다.
- 닉네임과 자기소개를 표시했다.
- 작성 글 수, 팔로워 수, 팔로잉 수를 지표 카드로 표시했다.
- 프로필 수정 버튼을 제거했다.
- 팔로워, 팔로잉 카운트를 클릭 가능한 버튼으로 변경했다.
- 팔로워/팔로잉 클릭 시 관계 목록 모달을 표시하도록 구현했다.
- blog 하단 네비게이션의 내 블로그 항목 label을 `mory.dev`로 변경했다.

## 블로그 게시글 상세 태그 링크

`/blog/posts/[postId]` 게시글 상세 본문 아래에 태그 링크 영역을 추가했다.

구현 내용:

- `BlogPost` 모델에 `tags` 필드를 추가했다.
- blog mock 게시글 데이터에 태그 목록을 추가했다.
- 상세 본문 아래에 태그를 badge/box 형태의 링크로 표시했다.
- 태그 링크는 `/blog/popular?tag={tag}` 형태로 이동하도록 구성했다.

## 공통 UI 보강

모달 닫기 액션을 위해 공통 아이콘을 보강했다.

구현 내용:

- `IconName`에 `x`를 추가했다.
- 공통 `Icon` 컴포넌트에 닫기 아이콘 SVG를 추가했다.
- 인기 랭킹 항목의 순차 등장 애니메이션을 `globals.css`에 추가했다.
- `prefers-reduced-motion` 환경에서는 랭킹 애니메이션이 꺼지도록 처리했다.

## README 갱신

현재 화면 상태 설명을 새 구현 내용에 맞게 갱신했다.

반영 내용:

- blog 인기 화면 상단 검색어, 멘션, 팔로워, 태그 탭형 실시간 랭킹 카드 설명 추가
- blog 팔로잉 화면 상단 compact 팔로잉 관리 카드와 언팔로우 버튼 설명 추가
- 내 blog 화면 상단 nickname 기반 프로필 요약 카드 설명 추가
- 팔로워, 팔로잉 카운트 클릭 모달 설명 추가
- 게시글 상세 태그 링크 설명 추가

---

# 주요 변경 파일

- `README.md`
- `src/app/globals.css`
- `src/features/blog/components/BlogMenuView.tsx`
- `src/features/blog/components/BlogPostDetailView.tsx`
- `src/features/blog/model/blogTypes.ts`
- `src/shared/ui/Icon.tsx`

---

# 검증 결과

다음 검증을 모두 통과했다.

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- `git diff --check`

---

# 남은 범위

- 실제 인기 검색어 API 연동
- 실제 팔로잉 목록 API 연동
- 실제 프로필 API 연동
- `/blog/users/[userId]` 타인 블로그 라우트
- 실제 팔로우/언팔로우 동작
- 게시글 필터링 로직
- 태그 검색 결과 화면 또는 필터링 로직

---

# 추가사항2 구현사항

`plan3.md`의 `추가사항2` 기준으로 blog 화면 구조를 추가 개선했다.

## 인기 랭킹 5개 확장

`/blog/popular` 상단 랭킹을 탭별 3개에서 5개 항목으로 확장했다.

구현 내용:

- 검색어 랭킹 5개 표시
- 멘션 랭킹 5개 표시
- 팔로워 급상승 랭킹 5개 표시
- 태그 랭킹 5개 표시
- 기존 탭 전환과 순차 등장 애니메이션은 유지했다.

## 팔로잉 화면 관계 목록 개선

`/blog/following` 화면의 상단 관리 카드를 팔로워/팔로잉 관계 목록 중심으로 개편했다.

구현 내용:

- `팔로워 / 팔로잉` 탭을 추가했다.
- 검색 버튼을 추가했다.
- 검색 버튼 클릭 시 닉네임/설명 기반 검색 입력을 표시한다.
- mock 데이터 기준 화살표 paging을 추가했다.
- 팔로잉 탭에서는 `언팔로우` 버튼을 표시한다.
- 팔로워 탭에서는 `팔로우` 버튼을 표시한다.
- 검색 결과가 없을 때 빈 상태 문구를 표시한다.

## 유저 blog 메인 라우트 추가

내 blog를 별도 `/blog/me` 화면이 아니라 유저 blog 메인 화면으로 이동하도록 변경했다.

구현 내용:

- `/blog/users/[nickname]` 라우트를 추가했다.
- `BlogUserBlogContainer`를 추가했다.
- `BlogUserBlogView`를 추가했다.
- 하단 네비게이션의 `내 블로그` label은 유지했다.
- `내 블로그` href는 `/blog/users/mory.dev`로 변경했다.
- 기존 `/blog/me`는 `/blog/users/mory.dev`로 redirect 처리했다.
- 플랫폼 홈의 blog 관련 내 활동 링크도 `/blog/users/mory.dev`로 변경했다.

## 유저 blog 메인 화면 구성

유저 blog 메인 화면은 소개 카드 없이 프로필과 글 목록 중심으로 구성했다.

구현 내용:

- 프로필 카드 위에 `blog / @{nickname}` 라벨을 표시했다.
- 프로필 카드 내부의 `blog / nickname` 라벨은 제거했다.
- 프로필 카드에는 이니셜, 닉네임, 자기소개, 작성 글 수, 팔로워 수, 팔로잉 수를 표시했다.
- 팔로워/팔로잉 카운트 클릭 시 목록 모달을 표시한다.
- 글 목록 위에 `blog / post` 라벨과 `포스트` 제목을 표시했다.
- 기존 blog 게시글 카드 목록을 재사용했다.

## README 갱신

현재 라우트와 blog 화면 설명을 새 구조에 맞게 갱신했다.

반영 내용:

- `/blog/users/[nickname]` 라우트 설명 추가
- `/blog/me`를 호환 redirect 라우트로 설명
- blog 주요 화면 요소를 인기, 팔로잉, 유저 blog 메인 기준으로 수정
- 팔로잉 화면의 탭, 검색, paging 설명 추가

## 추가 변경 파일

- `README.md`
- `src/app/blog/me/page.tsx`
- `src/app/blog/users/[nickname]/page.tsx`
- `src/features/blog/components/BlogMenuView.tsx`
- `src/features/blog/components/BlogUserBlogView.tsx`
- `src/features/blog/container/BlogUserBlogContainer.tsx`
- `src/features/blog/components/BlogPostDetailView.tsx`
- `src/features/blog/components/BlogView.tsx`
- `src/features/blog/model/blogTypes.ts`
- `src/features/platform/components/MemberServiceFeedSection.tsx`

## 추가 검증 결과

다음 검증을 모두 통과했다.

- `npx tsc --noEmit`
- `npm run lint`
- `git diff --check`
- `npm run build`

## 추가 남은 범위

- 실제 유저 프로필 API 연동
- 실제 팔로워/팔로잉 API 연동
- 실제 팔로우/언팔로우 동작
- 검색어 입력에 따른 서버/클라이언트 필터링 정책 결정
- `/blog/users/[nickname]`의 nickname별 실제 데이터 바인딩
