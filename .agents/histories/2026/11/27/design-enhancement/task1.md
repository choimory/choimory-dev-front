# 목차

- [개요](#개요)
- [0단계 사전 기록](#0단계-사전-기록)
  - [답변](#답변)
  - [결과](#결과)
  - [화면 진단](#화면-진단)
    - [이 앱은](#이-앱은)
    - [잘 되고 있어서 유지할 것](#잘-되고-있어서-유지할-것)
    - [AI가 만든 티가 나는 것](#ai가-만든-티가-나는-것)
    - [실제로 깨진 것](#실제로-깨진-것)
  - [참고](#참고)
  - [다음: 1단계 디자인 시스템](#다음-1단계-디자인-시스템)

---

# 개요

- plan1에서 확정한 작업계획대로 hallmark redesign(full)을 전 페이지(로고 제외)에 적용한다.
- 단계마다 끊어서 확인받으며 진행한다. 순차 단계(0·1·2·4)는 Claude 단독, 병렬 단계(3)는 GPT Sol 6.2가 도메인별 또는 페이지별로 진행한다.
- 이 문서는 단계별 작업 내용을 기록한다.

---

# 0단계 사전 기록

> 작업 시작

## 답변

- calendar.md를 `TASK:디자인 고도화(design-enhancement)`로 변경.
- 0단계(사전 기록) 완료. 프로젝트 코드는 건드리지 않음.

## 결과

- **테스트 기준선**: 97개 파일, 574개 테스트 모두 통과.
- **화면 기록**: 25개 화면을 비회원·회원(`?auth=member`) 상태로 나눠, 1280·1440·1920·375 폭에서 스크린샷 125장 촬영. 저장 위치는 `.hallmark/before/`.
- **유지 항목 기록**: 링크 61개, 입력 필드 20개, 핸들러 88개를 `.hallmark/before.json`에 기록. 나중에 redesign이 이 항목을 빠뜨리지 않았는지 이 기록과 대조함.
- **점검 결과**: FAIL 36개, REFLEX 34개, WARN 8개. 전체 목록은 `.hallmark/before.txt`.

기록한 화면 목록.

| 도메인 | 화면 |
|---|---|
| platform | `/`, `/?auth=member`, `/services`, `/notice` |
| auth·me | `/login`, `/signup`, `/me?auth=member` |
| blog | `/blog`, `/blog?auth=member`, `/blog/popular`, `/blog/following`, `/blog/me`, `/blog/build.note`, `/blog/posts/post-1` |
| feed | `/feed`, `/feed?auth=member`, `/feed/popular`, `/feed/observations`, `/feed/observations/observation-1`, `/feed/activities/activity-1`, `/feed/me`, `/feed/me/targets/target-streamer-alpha`, `/feed/targets/target-streamer-alpha`, `/feed/targets/target-artist-nova`, `/feed/targets/target-gpu` |

## 화면 진단

### 이 앱은

개인 개발자 플랫폼의 허브. 블로그와 피드(가격·방송·신곡 관찰)가 중심이고, 나머지 서비스는 준비 중. 사용자가 가장 많이 하는 일은 블로그·피드로 들어가서 관심 대상의 변화를 확인하는 것.

### 잘 되고 있어서 유지할 것

- 로고의 정체성
- 탑바와 하단 내비로 된 일관된 셸, 가운데 고정 폭의 모바일 감성
- 피드 리스트의 정보 밀도
- 군더더기 없는 로그인 화면

### AI가 만든 티가 나는 것

- 모든 게 같은 둥근 카드 박스이고, 카드 안에 또 카드가 들어감. 홈의 서비스 카드 안 숫자 카드, 피드 상세의 "방송 관찰" 안 카드 등. hallmark 기준으로 꼭 고쳐야 하는 항목.
- 섹션 제목 위에 `feed / target`, `platform / me` 같은 작은 경로형 라벨이 붙어 있음. hallmark가 금지하는 형태.
- 숫자 타일 4개가 일렬로 놓인 전형적인 대시보드 구성.
- 블로그 이미지 자리에 보라→파랑 그라디언트가 들어가 있음. hallmark가 금지하는 형태.
- `현재 128,000원 · 목표가 120,000원`처럼 가운데 점(·)으로 이어 붙인 메타 문구.
- 라이트 테마 색이 Tailwind 기본 팔레트 그대로.

### 실제로 깨진 것

- 아이콘 svg 22곳에 `aria-hidden`이 없음.
- body에 `overflow-x: hidden`이 걸려 있어서 sticky가 망가질 수 있음.
- 로그인 placeholder 대비가 2.25:1밖에 안 되고, 입력 필드 테두리 대비도 부족함.
- 피드 상세에 10px 글씨가 있음.
- 검색 입력 높이가 24px로 너무 작음.
- 320px 폭에서 버튼 라벨이 두 줄로 넘어감.

전체 페이지 스크린샷에서 하단 내비가 화면 중간에 겹쳐 보이는데, 이건 고정 요소를 찍을 때 생기는 촬영상의 현상. 실제 버그는 아님.

## 참고

- 스크린샷 도구(puppeteer-core)는 프로젝트 밖 `~/.cache/hallmark-tools`에 설치. `package.json`은 바꾸지 않음. 실행 시 `HALLMARK_PUPPETEER=$HOME/.cache/hallmark-tools` 지정.
- `.hallmark/` 폴더가 새로 생김. 스크린샷과 기록 파일은 git에서 자동으로 제외되지만, `preflight.json`은 추적 대상.
- dev 서버는 3100 포트로 띄워둠(`npm run dev -- -p 3100`).
- 기록 명령: `node .agents/skills/hallmark/scripts/sloplint.mjs src --genre modern-minimal --scope app --render --before --url <화면 25개>`

## 다음: 1단계 디자인 시스템

hallmark로 테마를 고르고(go ahead), 기존 토큰 이름에 다크·라이트 값을 새로 채움. 로고 전용 토큰도 만들고, 최종 시스템을 `design.md`로 고정함. 테마와 방향이 정해지면 적용하기 전에 먼저 공유함.

---
