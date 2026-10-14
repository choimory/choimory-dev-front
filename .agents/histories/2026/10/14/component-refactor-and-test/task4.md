# 목차

- [개요](#개요)
- [테스트 코드 주석 추가 방식 결정](#테스트-코드-주석-추가-방식-결정)
  - [제안한 수준](#제안한-수준)
  - [결정 사항](#결정-사항)
- [shared 테스트 주석 추가](#shared-테스트-주석-추가)
  - [추가한 주석](#추가한-주석)
  - [기준](#기준)
  - [검증](#검증)
- [auth 테스트 주석 추가](#auth-테스트-주석-추가)
  - [추가한 주석](#추가한-주석-1)
- [platform 테스트 주석 추가](#platform-테스트-주석-추가)
  - [추가한 주석](#추가한-주석-2)
- [me 테스트 주석 추가](#me-테스트-주석-추가)
  - [추가한 주석](#추가한-주석-3)
- [blog 테스트 주석 추가](#blog-테스트-주석-추가)
  - [추가한 주석](#추가한-주석-4)
  - [참고](#참고)
- [feed 테스트 주석 추가와 주석 작업 마무리](#feed-테스트-주석-추가와-주석-작업-마무리)
  - [추가한 주석](#추가한-주석-5)
  - [검증](#검증-1)

---

# 개요

- 4단계에서 작성한 테스트 코드에 `comment.md` 규칙에 맞는 주석을 추가하는 작업을 기록한 문서다.
- 테스트 작성 내용은 task3.md를 참고한다.
- 코드 동작은 바꾸지 않고 주석만 추가한다. 매 단계 `test:run`, `tsc`, `lint`로 확인한다.
- 진행 순서: `shared` → `auth` → `platform` → `me` → `blog` → `feed`. 한 구역이 끝날 때마다 멈춰서 확인받는다.

---

# 테스트 코드 주석 추가 방식 결정

> 테스트코드에 주석이 없어

## 답변

`comment.md`는 컴포넌트와 함수에 Doc Comment를, 로직에는 흐름 단위 한글 주석을 요구한다. 테스트 코드에는 헬퍼 함수와 jsdom 대체 부분을 제외하면 주석이 없었다. 86개 파일, 496건이라 범위를 먼저 정하기 위해 수준별로 제안했다.

## 제안한 수준

| 수준 | 내용 | 비고 |
|---|---|---|
| A. 파일 단위 | 각 테스트 파일 맨 위에 "무엇을 어떤 관점으로 테스트하는지" Doc Comment, `describe` 블록마다 한 줄 설명, 헬퍼 함수와 픽스처에 Doc Comment | 86개 파일 모두, 비교적 가볍다 |
| B. A + 흐름 주석 | A에 더해, 여러 단계가 이어지는 테스트(열기, 조작, 확인)에 한글 흐름 주석 | 규칙의 "흐름별 주석"에 해당. 단계가 1~2줄뿐인 단순 테스트는 제외 |
| C. 모든 `it`에 주석 | 모든 테스트에 한 줄 주석 | 테스트 이름이 이미 같은 말이라 중복이고, 규칙의 "불필요한 주석 금지"에 어긋남 |

제안한 의견은 B였다. 테스트 이름(`it('...')`)이 이미 "무엇을 검증하는지"를 말하므로 C는 중복이고, 파일 설명(A)과 여러 단계 테스트의 흐름 주석(B)이 읽는 사람에게 가장 도움이 된다는 이유였다.

## 결정 사항

> B로 진행해줘. 주석형식은 너의 제안이 맞아. 진행 방식도 너의 제안이 맞아. README에 테스트파일 주석규칙은 굳이 적을필요 없을듯

- 수준은 **B**로 진행한다.
- 주석 형식: 파일 설명은 `/** ... */` Doc Comment, 흐름 주석은 `//` 한 줄
- 진행 방식: `shared/ui`를 먼저 하고 형식을 확인받은 뒤 feature별로 진행한다. (확인 결과 "지금 형식대로 계속 진행")
- README에는 테스트 파일 주석 규칙을 적지 않는다.

---

# shared 테스트 주석 추가

> 아니다 지금 형식대로 계속 진행하자 지금 내용 task4에 작성하고 다음단계 진행

## 답변

`shared/ui` 17개 파일과 `shared/model` 1개 파일에 주석을 추가하고 멈췄다. 형식을 확인받은 뒤 다음 구역으로 진행한다.

## 추가한 주석

| 종류 | 내용 | 형식 |
|---|---|---|
| 파일 설명 | 모든 파일의 최상위 `describe` 앞에 "무엇을 어떤 관점으로 검증하는지" 설명 | `/** ... */` |
| 흐름 주석 | 단계가 이어지는 테스트(렌더링 후 조작하고 확인)에 "무엇을 하는지" 한 줄 | `//` |
| 상수 설명 | 테스트용 상수(`ITEMS` 등)에 한 줄 설명 | `/** ... */` |

예시:

```tsx
/**
 * SegmentedTabs 테스트
 * 세그먼트 탭의 tablist/tab 역할, 선택 표시, 클릭 시 onChange, 탭 수별 열 클래스, size와 className을 확인합니다.
 */
describe('SegmentedTabs', () => {
  ...
    // 다른 탭을 클릭한다
    await userEvent.click(screen.getByRole('tab', { name: '태그' }));

    // 클릭한 탭의 id로 onChange가 호출됐는지 확인한다
    expect(onChange).toHaveBeenCalledWith('tag');
```

- `TopBarActions` 테스트에는 단계가 많은 테스트마다 흐름 주석("검색 버튼을 눌러 오버레이를 연다", "오버레이 배경을 눌러 닫는다" 등)을 달았고, `next/link`를 대체하는 이유를 파일 설명에 적었다.
- `rerender`로 상태를 바꿔 다시 확인하는 부분과 `userEvent` 조작 단계에 흐름 주석을 달았다.

## 기준

- 테스트 이름이 이미 설명하는 단순 테스트(렌더링 직후 `expect`만 있는 경우)에는 흐름 주석을 달지 않았다. 규칙의 "불필요한 주석 금지"를 지키기 위해서다.
- 이미 Doc Comment가 있는 헬퍼 함수와 상수는 그대로 두었다.

## 검증

- `npm run test:run`: 86개 파일, 496건 통과 (주석 추가 전후 동일)
- `npx tsc --noEmit`, `npm run lint` 통과
- 처음 작성한 주석 중 lint 오류는 없었다.

---

# auth 테스트 주석 추가

> task4에 추가하고 다음단계 진행

## 답변

`shared`에 이어 `auth` 테스트 4개 파일에 같은 형식으로 주석을 추가하고 멈췄다. 전체 86개 파일, 496건 테스트와 `tsc`, `lint`가 통과했다.

## 추가한 주석

| 파일 | 추가한 주석 |
|---|---|
| `LoginView.test.tsx` | 파일 설명, 입력 테스트의 "이메일과 비밀번호를 입력한다", "입력한 값이 각 입력창에 반영됐는지 확인한다", 소셜 제공자가 빈 경우의 "소셜 제공자 목록을 비운 화면을 렌더링한다", "남은 버튼은 로그인 버튼 하나뿐이다" |
| `SignupView.test.tsx` | 파일 설명, 입력 테스트의 "입력창 4개에 각각 값을 입력한다", "입력한 값이 각 입력창에 반영됐는지 확인한다" |
| `LoginContainer.test.tsx`, `SignupContainer.test.tsx` | 파일 설명 (한 줄짜리 테스트라 흐름 주석은 생략) |

---

# platform 테스트 주석 추가

> task4에 추가하고 다음단계 진행

## 답변

`auth`에 이어 `platform` 테스트 10개 파일에 같은 형식으로 주석을 추가하고 멈췄다. 전체 86개 파일, 496건 테스트와 `tsc`, `lint`가 통과했다.

## 추가한 주석

| 파일 | 추가한 주석 |
|---|---|
| `PlatformSearchBar` | 파일 설명, "검색어를 입력한다", "폼을 제출한다" |
| `ServiceLauncherCard` | 파일 설명(jsdom에 `scrollBy`가 없어 대체하는 이유 포함), "다음 버튼을 누르면 오른쪽으로 240px 스크롤한다", "이전 버튼을 누르면 왼쪽으로 240px 스크롤한다" |
| `GuestLandingSection`, `MemberServiceFeedSection`, `PlatformHomeView` | 파일 설명 (단순 조회 테스트라 흐름 주석은 생략) |
| `PlatformNoticeView` | 파일 설명, "공지를 눌러 상세 모달을 연다", 닫기 버튼과 배경 클릭 테스트의 "모달을 연 뒤 ...닫힌다", 로그인 여부 `rerender` 주석 |
| `PlatformServicesView` | 파일 설명, 로그인 여부 `rerender` 주석 |
| `PlatformHomeContainer`, `PlatformNoticeContainer`, `PlatformServicesContainer` | 파일 설명, `PlatformServicesContainer`의 `rerender` 주석 |

---

# me 테스트 주석 추가

> task4에 추가하고 다음단계 진행

## 답변

`platform`에 이어 `me` 테스트 3개 파일에 같은 형식으로 주석을 추가하고 멈췄다. 전체 86개 파일, 496건 테스트와 `tsc`, `lint`가 통과했다.

## 추가한 주석

| 파일 | 추가한 주석 |
|---|---|
| `MeSettingCard` | 파일 설명, "카드를 클릭한다", "선택한 항목과 함께 `onSelect`가 한 번 호출됐는지 확인한다" |
| `MeView` | 파일 설명(`openSetting` 헬퍼로 모달 열기를 묶었다는 점 포함), 개인정보 변경 모달("모달을 연다", "기존 닉네임을 지우고 새 닉네임을 입력한다"), 사이트 설정 모달("dark 테마를 선택한다"), 닫기 버튼과 배경 클릭 테스트의 "모달을 연 뒤 ...닫힌다", 다른 설정으로 전환하는 테스트("열었다가 닫고", "새 내용으로 바뀐다") |
| `MeContainer` | 파일 설명 |

- `openSetting` 헬퍼에는 이미 Doc Comment가 있어서 그대로 두었다.

---

# blog 테스트 주석 추가

> task4에 추가하고 다음단계 진행

## 답변

`me`에 이어 `blog` 테스트 19개 파일에 같은 형식으로 주석을 추가하고 멈췄다. 전체 86개 파일, 496건 테스트와 `tsc`, `lint`가 통과했다.

## 추가한 주석

| 파일 | 추가한 주석 |
|---|---|
| `BlogFollowingManageSection` | 파일 설명, "팔로워 탭을 클릭한다", "다음 목록 버튼으로 2페이지로 이동한다", "검색 버튼을 눌러 검색창을 연다", "앞뒤 공백이 있는 설명 일부를 입력한다", "입력을 지우고 대문자 닉네임으로 다시 검색한다", "검색어를 입력한 상태에서 팔로워 탭으로 바꾼다" 등 |
| `BlogPostCreateModal` | 파일 설명(`URL.createObjectURL` 대체 이유 포함), "공개여부를 비공개로 바꾼다", "사진 2장을 한 번에 선택한다", "사진을 한 장씩 두 번 선택한다", "두 번째 사진을 앞으로 이동한다", "남은 사진도 제거하면 목록이 사라진다" 등 |
| `BlogMeSettingsView` | 파일 설명, "글 작성 행을 눌러 글작성 모달을 연다", "공개 여부 설정 모달을 열었다가 취소로 닫고", "댓글 허용 범위 설정 모달을 바로 연다", 관계 모달 열기와 닫기 단계 등 |
| `BlogPostDetailView` | 파일 설명, "첫 댓글의 답글 달기를 누르면 그 댓글에만 입력창이 열린다", "다른 댓글의 답글 달기를 누르면 첫 입력창은 닫힌다", `rerender` 주석 등 |
| `BlogRelationModal`, `BlogUserBlogView`, `BlogProfileCard`, `BlogSettingEditModal`, `BlogMenuView`, `BlogPopularInsightSection` | 파일 설명과 조작, `rerender` 단계 주석 |
| `BlogView`, `BlogGuestSection`, `BlogMemberFeedSection`, `BlogPostCard` | 파일 설명 (단순 조회 테스트라 흐름 주석은 생략) |
| 컨테이너 5종 | 파일 설명과 `rerender` 주석 |

## 참고

- 한 곳만 자동 삽입이 실패했다. `BlogPopularInsightSection`의 `it.each`는 제목이 여러 줄에 걸려 있어서 찾지 못했고, 해당 줄에 직접 주석("해당 탭을 클릭한다")을 달았다.

---

# feed 테스트 주석 추가와 주석 작업 마무리

> task4에 추가하고 작업 마무리하자

## 답변

마지막 구역인 `feed` 테스트 31개 파일에 같은 형식으로 주석을 추가했다. 이것으로 86개 테스트 파일 전체에 주석 추가가 끝났다. 전체 86개 파일, 496건 테스트와 `tsc`, `lint`가 통과했고, 모든 테스트 파일에 파일 설명 Doc Comment가 있는 것을 확인했다.

## 추가한 주석

| 파일 | 추가한 주석 |
|---|---|
| `MiniLineChart` | 파일 설명, "지점에 마우스를 올린다", "지점에 포커스를 준다", "지점을 클릭한다", "그래프 배경을 클릭한다" |
| `BroadcastContributionGraph` | 파일 설명, "06.03 칸을 클릭한다", "같은 칸을 두 번 클릭하면 열었다가 닫는다", "팝오버 안쪽을 클릭해도 닫히지 않는다", "그래프의 다른 영역을 클릭하면 닫힌다", "비어 있는 칸을 클릭해도 팝오버가 열리지 않는다" |
| `ItemDetailSection` | 파일 설명, "지점을 클릭해 고정하고 마우스를 벗어나도 안내가 유지된다", "그래프 배경을 클릭하면 고정이 해제된다", "기간 탭을 바꾸면 고정이 해제된다" 등 |
| `ArtistDetailSection`, `AlbumCarousel3d`, `AlbumDetailModal` | 파일 설명, 앨범과 트랙 열기, 돌아가기, 닫기, 캐러셀 순환 이동 단계 주석 |
| `FeedTargetSettingsView` | 파일 설명(`isToggleOn` 헬퍼 설명 포함), "관찰 상태 토글을 눌러 끈다", "관찰 중이 아닌 아티스트 대상으로 다시 렌더링하면 꺼진 상태로 시작한다", "저장해서 저장 완료 상태로 만든 뒤 알림 주기를 바꾸면 해제된다" 등 |
| `FeedTargetCreateForm`, `MyFeedManageSection`, `PopularTargetSection`, `FeedMenuView`와 상세 화면, `FormField`, `SettingToggle` | 파일 설명과 조작, `rerender` 단계 주석 |
| 컨테이너 6종, `feedTargetView` | 파일 설명과 `rerender` 주석 |
| `TogglePreview`, `ListPanel`, `TargetListLink`, `TargetPreviewLink`, `StreamerDetailSection`, `PopularTargetEventSection`, `ObservationTargetSection`, `FeedView`, `FeedActivityDetailView`, `FeedObservationDetailView` | 파일 설명 (단순 조회 테스트라 흐름 주석은 생략) |

## 검증

- 자동 삽입이 실패한 두 곳(`BroadcastContributionGraph`의 빈 칸 테스트는 같은 제목의 앞선 테스트에 걸림, `ArtistDetailSection` 캐러셀 앵커)은 앵커를 바꿔 다시 넣었다.
- `it.each`처럼 제목이 여러 줄에 걸린 테스트도 처리하도록 삽입 방식을 고쳐서 따로 손대지 않았다.
- `npm run test:run`: 86개 파일, 496건 통과 (주석 추가 전후 동일)
- `npx tsc --noEmit`, `npm run lint` 통과
