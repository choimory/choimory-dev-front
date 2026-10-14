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
- [추가사항3 구현사항](#추가사항3-구현사항)
- [추가사항4 구현사항](#추가사항4-구현사항)
- [대화 중 추가 수정사항](#대화-중-추가-수정사항)

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

---

# 추가사항3 구현사항

`plan3.md`의 `추가사항3` 기준으로 blog 라우트 구조와 상세 화면 UI를 추가 개선했다.

## 공개 유저 blog 라우트 변경

공개 유저 blog 주소를 `/blog/users/{nickname}` 중심에서 `/blog/{nickname}` 중심으로 변경했다.

구현 내용:

- `/blog/[nickname]` 라우트를 추가했다.
- `/blog/[nickname]`에서 `BlogUserBlogContainer`를 재사용하도록 구성했다.
- 기존 `/blog/users/[nickname]`는 `/blog/[nickname]`로 redirect 처리했다.
- README 라우트 표에 `/blog/[nickname]` 공개 유저 blog 메인과 `/blog/users/[nickname]` 호환 라우트를 반영했다.

## 내 blog 설정/관리 화면 복구

`/blog/me`를 redirect 라우트가 아니라 내 blog 설정/관리 화면으로 복구했다.

구현 내용:

- `BlogMeSettingsContainer`를 추가했다.
- `BlogMeSettingsView`를 추가했다.
- 하단 네비게이션의 `내 블로그` 링크를 `/blog/me`로 복구했다.
- `/blog/me` 상단에 내 프로필 카드 링크를 배치했다.
- 내 프로필 카드 클릭 시 `/blog/mory.dev` 공개 유저 blog로 이동하도록 구성했다.
- `/blog?auth=member`의 글 작성 진입 영역과 유사한 `무슨 생각을 공유할까요?` 카드를 배치했다.
- 블로그 공개 여부, 기본 댓글 허용 범위, 태그 추천 설정 mock 카드를 추가했다.
- 플랫폼 홈의 blog 관련 내 활동 링크도 `/blog/me`로 복구했다.

## 유저 blog 팔로워/팔로잉 모달 개선

유저 blog 메인 화면의 팔로워/팔로잉 모달 사용성을 개선했다.

구현 내용:

- 팔로워/팔로잉 mock 데이터를 6개씩으로 확장했다.
- 모달 내부에 3개 단위 paging을 추가했다.
- 이전/다음 화살표 버튼을 추가했다.
- 현재 페이지와 전체 페이지 수를 표시했다.
- 모달 바깥 overlay 클릭 시 모달이 닫히도록 처리했다.
- 모달 내부 카드 클릭 시 닫히지 않도록 `stopPropagation`을 적용했다.

## 게시글 상세 화면 개선

블로그 게시글 상세 화면의 댓글과 본문 UI를 개선했다.

구현 내용:

- 댓글 mock 데이터에 `authorInitial`을 추가했다.
- 대댓글 mock 데이터에도 `authorInitial`을 추가했다.
- 댓글 목록에 작성자 프로필 이니셜 아바타를 표시했다.
- 대댓글 목록에도 작성자 프로필 이니셜 아바타를 표시했다.
- 게시글 본문 위아래 간격을 더 넓혔다.
- 내가 쓴 글 mock 조건을 `post.authorName === 'mory.dev'`로 두고 `수정` 버튼을 표시했다.

## README 갱신

현재 라우트와 blog 화면 설명을 `추가사항3` 구현 내용에 맞게 갱신했다.

반영 내용:

- `/blog/[nickname]` 공개 유저 blog 메인 설명 추가
- `/blog/me` 내 blog 설정/관리 설명 추가
- `/blog/users/[nickname]` 호환 redirect 설명으로 변경
- 내 blog 설정/관리 화면 요소 설명 추가
- 유저 blog 팔로워/팔로잉 modal paging 설명 추가
- 게시글 상세의 내 글 수정 버튼, 댓글 아바타 설명 추가

## 추가 변경 파일

- `README.md`
- `.agents/histories/2026/09/19/detail-page-and-screen-structure/plan3.md`
- `src/app/blog/[nickname]/page.tsx`
- `src/app/blog/me/page.tsx`
- `src/app/blog/users/[nickname]/page.tsx`
- `src/features/blog/components/BlogMeSettingsView.tsx`
- `src/features/blog/container/BlogMeSettingsContainer.tsx`
- `src/features/blog/components/BlogUserBlogView.tsx`
- `src/features/blog/components/BlogPostDetailView.tsx`
- `src/features/blog/components/BlogView.tsx`
- `src/features/blog/components/BlogMenuView.tsx`
- `src/features/platform/components/MemberServiceFeedSection.tsx`

## 추가 검증 결과

다음 검증을 모두 통과했다.

- `npx tsc --noEmit`
- `npm run lint`
- `git diff --check`
- `npm run build`

## 추가 남은 범위

- 실제 내 blog 설정 API 연동
- 실제 글 작성 폼 구현
- 실제 글 수정 화면 또는 수정 모달 구현
- 공개 유저 blog의 nickname별 실제 데이터 바인딩
- `/blog/[nickname]` reserved path 처리 정책 구체화

---

# 추가사항4 구현사항

`plan3.md`의 `추가사항4` 기준으로 `/blog/me` 내 blog 설정/관리 화면에 실제 조작 가능한 모달 폼을 추가했다.

## 내 blog 설정/관리 화면 client 전환

`BlogMeSettingsView`에서 모달 상태를 관리해야 하므로 client component로 전환했다.

구현 내용:

- `BlogMeSettingsView.tsx`에 `'use client'`를 추가했다.
- `useState`로 글작성 모달 열림 상태를 관리했다.
- `useState`로 현재 수정 중인 설정 항목을 관리했다.
- 공통 modal shell을 같은 파일 안에 구성했다.

## 글작성 모달 구현

글작성 카드의 `무슨 생각을 공유할까요?` 버튼을 누르면 글작성 모달이 열리도록 구현했다.

구현 내용:

- 글제목 입력 필드 추가
- 글내용 textarea 추가
- 공개여부 segmented option 추가
  - 전체
  - 팔로워
  - 비공개
- 댓글허용여부 segmented option 추가
  - 전체
  - 팔로워
  - 비허용
- 태그 입력 필드 추가
- 사진첨부 mock 버튼 추가
- 취소 버튼 추가
- 저장 버튼 추가
- 저장 버튼은 현재 mock 동작으로 모달을 닫도록 처리했다.

## 설정 변경 모달 구현

설정 카드를 누르면 해당 설정을 변경하는 모달이 열리도록 구현했다.

구현 내용:

- `블로그 공개 여부` 설정 변경 모달 추가
  - 전체 공개
  - 팔로워 공개
  - 비공개
- `기본 댓글 허용 범위` 설정 변경 모달 추가
  - 전체
  - 팔로워
  - 비허용
- `태그 추천` 설정 변경 모달 추가
  - 켜짐
  - 꺼짐
- 선택 중인 옵션을 강조 표시했다.
- 선택 중인 옵션에 `star` 아이콘을 표시했다.
- 취소 버튼과 저장 버튼을 추가했다.
- 저장 버튼은 현재 mock 동작으로 모달을 닫도록 처리했다.

## 모달 동작

공통 모달 shell에 기본적인 닫기 동작을 구현했다.

구현 내용:

- 모달 바깥 overlay 클릭 시 닫기
- 모달 내부 클릭 시 `stopPropagation`으로 닫힘 방지
- 우측 상단 닫기 버튼 추가
- 긴 폼을 고려해 modal body에 최대 높이와 스크롤을 적용했다.

## README 갱신

내 blog 설정/관리 화면 설명을 새 구현 내용에 맞게 갱신했다.

반영 내용:

- 내 blog 설정/관리 화면 설명을 프로필 링크 카드, 글작성 모달, 설정 변경 모달 기준으로 수정

## 추가 변경 파일

- `README.md`
- `src/features/blog/components/BlogMeSettingsView.tsx`

## 추가 검증 결과

다음 검증을 모두 통과했다.

- `npx tsc --noEmit`
- `npm run lint`
- `git diff --check`
- `npm run build`

## 추가 남은 범위

- 실제 글 작성 API 연동
- 실제 사진 첨부 처리
- 실제 설정 변경 API 연동
- 저장 후 화면 상태 갱신 또는 toast 피드백

---

# 대화 중 추가 수정사항

`추가사항4` 구현 이후 대화로 요청한 세부 UI 수정사항을 추가 반영했다.

## 포스트 상세 본문 간격 되돌림

블로그 포스트 상세보기에서 본문 위아래 간격을 다시 이전 밀도에 가깝게 조정했다.

구현 내용:

- 본문 `py-3` 여백을 제거했다.
- 본문 `leading-7`을 `leading-6`으로 되돌렸다.

## 설정 변경 모달 선택 UI 수정

`/blog/me` 설정 변경 모달의 선택 표시를 별표 아이콘에서 일반적인 radio 형태로 변경했다.

구현 내용:

- 선택 항목의 `star` 아이콘을 제거했다.
- 선택 여부를 둥근 radio outer circle과 inner dot으로 표시했다.
- 선택되지 않은 항목은 border만 있는 radio circle로 표시했다.

## 글작성 사진첨부 기능 보강

글작성 모달의 사진첨부를 실제 여러 장 선택 흐름에 맞게 보강했다.

구현 내용:

- 사진첨부 input에 `type="file"`을 적용했다.
- `accept="image/*"`로 이미지 파일 선택을 제한했다.
- `multiple`을 적용해 여러 장 선택을 지원했다.
- 사진 선택 시 파일명만이 아니라 이미지 미리보기를 표시했다.
- 선택한 사진의 현재 순서를 표시했다.
- 위/아래 버튼으로 사진 순서를 변경할 수 있게 했다.
- 사진 제거 버튼을 추가했다.
- 사진을 다시 선택하면 기존 목록을 덮어쓰지 않고 뒤에 추가되도록 변경했다.
- 같은 파일을 다시 선택할 수 있도록 file input value를 초기화했다.

## 추가 검증 결과

다음 검증을 통과했다.

- `npx tsc --noEmit`
- `npm run lint`
- `git diff --check`

`npm run build`는 이번 세부 수정 이후에는 별도로 다시 실행하지 않았다.
