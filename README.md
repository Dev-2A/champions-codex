# 🏆 Champions Codex

포켓몬 챔피언스(Pokémon Champions) 뉴비를 위한 한국어 정보·DB 허브.
게임 기초부터 타입 상성, 사용 가능 포켓몬 도감, 팀 빌딩까지 한 곳에서.

🔗 **배포:** https://dev-2a.github.io/champions-codex/

## ✨ 기능

- 🎓 뉴비 온보딩 가이드 + 용어집 + FAQ
- 🔴 타입 상성 매트릭스(18×18) + 이중 타입 계산기
- 📚 포켓몬 도감 — M-B 사용 가능 224종, 한국어 검색·필터·상세, 배울 수 있는 기술
- 🎒 도구 도감 — 경쟁전 핵심 지닌 도구
- ⚔️ 기술 DB — learnable 기술 677종(타입·분류·위력·명중·PP·설명), 주목 기술 태깅
- 🧩 팀 빌더 — 6마리 편성 + 도구 장착 + 기술 선택(멤버별 4개)
  - 방어·공격 타입 커버리지 분석 → 구멍 타입 클릭 시 보강 포켓몬 추천
  - 프리셋 저장(IndexedDB), 팀 시트 내보내기, 팀 공유 링크(URL로 팀 전달)
- 📅 시즌·레귤레이션 정보 + 실시간 카운트다운

## 🛠 기술 스택

React 19 · Vite 8 · Tailwind CSS v4 · Zustand · React Router(HashRouter) · IndexedDB(idb) · date-fns · lucide-react

## 📦 데이터 파이프라인

외부 API 프리페치 + 정적 서빙 방식 (배포 후 런타임 API·이미지 의존성 0).

- `scripts/prefetch.mjs` — 레귤레이션 legal 목록 → PokéAPI 포켓몬 base 데이터(`pokedex.*.json`) + 러닝셋(`learnsets.*.json`, 분리 파일) + 타입 상성표
- `scripts/prefetch-items.mjs` — 도구 데이터
- `scripts/prefetch-moves.mjs` — learnable 기술 DB(224종 합집합)
- `scripts/fetch-sprites.mjs` — 스프라이트 로컬화(`public/sprites/`, 포켓몬은 192px WebP로 변환)
- 챔피언스 특화 정보(legal 목록·타입 특성·용어집·시즌·주목 기술)는 수동 큐레이션

기술 DB·러닝셋(합계 600KB+)은 초기 번들에서 제외되고, 포켓몬 상세·팀 빌더 진입 시
동적 로드된다(`src/data/moveDb.js`). 페이지는 라우트 단위로 코드 스플리팅.

```bash
npm install
npm run prefetch          # 포켓몬·타입·러닝셋
npm run prefetch:items    # 도구
npm run prefetch:moves    # 기술 DB (prefetch 이후 실행)
npm run prefetch:sprites  # 스프라이트 다운로드 (prefetch·prefetch:items 이후 실행)
npm run dev               # 개발 서버
npm run build             # 프로덕션 빌드
```

## 🔄 레귤레이션 로테이션 절차 (M-B → M-C …)

새 레귤레이션이 나오면 아래 순서로 갱신한다. UI의 레귤레이션 라벨·종
수·도감 제목·팀 시트 표기는 데이터에서 자동으로 끌어오므로 **코드 수정은
필요 없다**. (리허설로 config 교체만으로 빌드·정합성 통과 확인됨)

1. **legal 목록 작성** — `src/data/regulations/<id>.json` 생성
   (예: `m-c.json`. id·name·기간·rules·`legal`·`megaCapable` 채우기)
2. **프리페치** — `npm run prefetch <id>` → `prefetch:items` → `prefetch:moves <id>`
   → `prefetch:megas <id>` → `prefetch:sprites <id>`
3. **활성 전환** — `src/config.js`의 `ACTIVE_REGULATION`을 새 id로 변경
4. **큐레이션 텍스트 갱신** (코드가 자동 못 바꾸는 문장들):
   - `src/data/champions/samples.json` — `regulation` 필드 + 세트 재검토
     (안 맞으면 `npm run build`가 실패해서 방치를 막아줌)
   - `src/data/champions/faq.json`·`glossary.json` — "현재는 M-B…" 문구
   - `src/data/champions/seasons.json` — 새 시즌 일정
5. **검증** — `npm run check:samples` → `npm run build` → 도감/팀빌더 육안 확인
6. 이전 레귤 생성물(`*.m-b.json`)은 원하면 남겨두거나 삭제

> 시즌·레귤 종료일이 지나면 카운트다운은 자동으로 "종료됨(정보 갱신 필요)"을
> 표시한다.

## 🙌 데이터 출처

- 포켓몬·도구·기술 base 데이터: [PokéAPI](https://pokeapi.co)
- 레귤레이션 legal 목록: [Bulbapedia](https://bulbapedia.bulbagarden.net) 및 커뮤니티 큐레이션

## 📄 고지

비영리 팬 프로젝트입니다. 포켓몬 및 관련 명칭은 Nintendo / Creatures / GAME FREAK의 상표입니다.

---
made with cola and <img src="public/pokeball.svg" width="14" height="14" alt="Poké Ball" align="center">
