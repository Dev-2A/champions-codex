# CLAUDE.md — Champions Codex 작업 가이드

포켓몬 챔피언스(Pokémon Champions) **뉴비용** 한국어 정보·DB 허브.
배포: https://dev-2a.github.io/champions-codex/ (GitHub Pages, main 푸시 시 자동 배포)

## 작업 방식 (사용자와 합의된 워크플로)

- **Claude가 파일을 직접 수정하고 검증까지 수행한다.** 단, **커밋/푸시는 절대 하지 않는다** —
  작업 완료 후 커밋 명령어와 메시지(이모지 접두 + 한국어, `-m` 여러 개로 본문)를 제시하면 사용자가 실행한다.
- 커밋 메시지에 `"` 문자를 넣지 말 것 (PowerShell 인자 깨짐).
- 사용자가 "배포 확인해줘"라고 하면: GitHub Actions API로 최신 run의 conclusion 확인
  (`https://api.github.com/repos/Dev-2A/champions-codex/actions/runs?per_page=1`) 후 라이브 사이트 검증.
- 기능 하나 = 커밋 하나 리듬. 구현 → 검증 → 커밋 명령어 제시 → (사용자 커밋) → 배포 확인.

## 검증 습관 (매 작업 필수)

1. `npm run lint` + `npm run build` — build에는 **샘플 정합성 게이트**(validate-samples.mjs)가 포함되어
   있어 추천 세트가 데이터와 어긋나면 빌드가 실패한다 (의도된 방치 방지 장치).
2. 브라우저 실동작 검증 — dev 서버 실행 후 DOM/JS로 확인.
   테스트로 만든 팀·프리셋은 반드시 정리(localStorage `cc-team`, IndexedDB `champions-codex`).
3. **PWA 주의**: 라이브 확인 시 서비스워커가 옛 셸을 서빙할 수 있다.
   `navigator.serviceWorker.getRegistration()` → `update()` → reload 후 확인할 것.
4. React 입력 주입은 native setter 사용 (`Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set`).

## 아키텍처 핵심 (모르면 실수하는 것들)

- **데이터 파이프라인**: PokéAPI 프리페치 → `src/data/generated/*.json` 커밋 → 런타임 외부 의존성 0.
  스프라이트도 로컬(`public/sprites/`, 커밋됨). 절차·명령은 README의 "데이터 파이프라인" 참고.
- **기술 DB·러닝셋은 지연 로드**: `src/data/moveDb.js`의 `loadMoveDb()` 싱글턴 + `useMoveDb()` 훅.
  포켓몬 객체에 `moves` 필드는 없다 — `moveDb.getLearnset(slug)` 사용.
- **레귤레이션 로테이션**: `src/config.js`의 `ACTIVE_REGULATION` 한 줄 + 데이터 갱신으로 끝나도록
  설계됨 (UI 라벨은 `regulationCode`·`pokemonList.length`에서 자동). 절차는 README "🔄 레귤레이션 로테이션".
- **팀 상태**(`useTeamStore`): slugs·items·moves·mega({slug,form}, 팀당 1, 스톤이 도구 슬롯 차지)·
  builds(능력 포인트 66/32 + 성격 up/down). `setTeam`이 모든 외부 입력(프리셋/공유/가져오기)의 검증 관문.
- **능력치 계산**(`statCalc.js`): Lv.50·IV31 고정, 포인트=실수치+1. 성격 보정은 포인트 반영 **전** 적용
  (실게임과 ±1 오차 가능 — UI에 각주 있음, 검증되면 이 파일만 수정).
- **공유 링크**: `#/team?share=<base64url>` (teamShare.js). 필드 추가 시 하위호환 유지할 것.
- **레이아웃 규칙**: 컨테이너는 전 페이지 `max-w-6xl` 고정. 데스크톱 개선은 `lg:`/`xl:` 접두로만
  (모바일 무변경 원칙). 페이지 스택에 직접 놓이는 컴포넌트 루트는 블록 레벨(`flex w-fit` 등),
  인라인 루트 금지 (SegmentedToggle 사건 참고).
- **큐레이션 텍스트 위치**: 레귤 언급 문구는 `faq.json`·`glossary.json`에, 샘플은 `samples.json`
  (regulation·updatedAt 필드), 링크는 `links.json` (추가 전 반드시 접속·내용 검증).

## 현재 상태 (2026-07-15 기준)

- 버전 **v0.9.0** (기능 완비, 1.0 직전 QA 단계). 레귤레이션 M-B.
- 주요 기능 완료: 도감(초성검색·URL동기화·PNG저장), 메가진화(상세+팀빌더), 능력치 에디터,
  간이 데미지 계산기, 추천 세트 10종(원클릭 적용), 배틀 메커니즘 가이드, 팀 공유(텍스트/링크/이미지),
  텍스트 가져오기(Showdown 호환), PWA 오프라인, OG 공유 카드, 모바일 바텀 시트, 접근성(히트맵 title).
- 분석: GoatCounter (champions-codex.goatcounter.com, 해시 라우트 수동 전송).

## 진행 중 / 대기 작업

1. **친구 QA 결과 대기** — 결과 오면 `QA-notes.md`(gitignore된 로컬 파일)의 프레임대로
   🔴버그→🟡UX→🟢요청 분류 후 버그부터 배치 처리. QA-notes.md가 없으면 사용자에게 요청.
2. **구글 폼 피드백 채널 통합 대기** — 사용자가 폼(forms.gle/…)을 만들어 오면 푸터(AppShell)·
   링크 모음(links.json)·추천 세트 제보 문구(SampleSets)의 피드백 링크를 폼으로 교체.
   GitHub Issues는 개발자용으로 링크 모음에만 유지.
3. 이후 계획: 사용자 트위터 홍보 → 유튜버 안모리 소개 메일 (초안 작성됨).
4. QA 통과 + 레귤 로테이션 1회 무사 통과 시 v1.0.0.

## 하지 않기로 한 것

- 사용률 통계 자체 수집(포케모음의 영역 — 외부 링크로 안내), 로그인/서버, 광고·수익화.
- 코드 라이선스 추가(All rights reserved 유지 결정), 오픈카톡 운영.
- 검증 안 된 유튜버/링크 추가 (반드시 실제 접속+내용 확인 후).
