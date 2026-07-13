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
  - 방어·공격 타입 커버리지 분석, 프리셋 저장(IndexedDB), 팀 시트 내보내기
- 📅 시즌·레귤레이션 정보 + 실시간 카운트다운

## 🛠 기술 스택

React 19 · Vite 7 · Tailwind CSS v4 · Zustand · React Router(HashRouter) · IndexedDB(idb) · date-fns · lucide-react

## 📦 데이터 파이프라인

외부 API 프리페치 + 정적 서빙 방식 (배포 후 런타임 API 의존성 0).

- `scripts/prefetch.mjs` — 레귤레이션 legal 목록 → PokéAPI 포켓몬 base 데이터 + 타입 상성표 + 포켓몬별 기술
- `scripts/prefetch-items.mjs` — 도구 데이터
- `scripts/prefetch-moves.mjs` — learnable 기술 DB(224종 합집합)
- 챔피언스 특화 정보(legal 목록·타입 특성·용어집·시즌·주목 기술)는 수동 큐레이션

```bash
npm install
npm run prefetch         # 포켓몬·타입·포켓몬별 기술
npm run prefetch:items   # 도구
npm run prefetch:moves   # 기술 DB (prefetch 이후 실행)
npm run dev              # 개발 서버
npm run build            # 프로덕션 빌드
```

## 🙌 데이터 출처

- 포켓몬·도구·기술 base 데이터: [PokéAPI](https://pokeapi.co)
- 레귤레이션 legal 목록: [Bulbapedia](https://bulbapedia.bulbagarden.net) 및 커뮤니티 큐레이션

## 📄 고지

비영리 팬 프로젝트입니다. 포켓몬 및 관련 명칭은 Nintendo / Creatures / GAME FREAK의 상표입니다.

---
made with cola and <img src="public/pokeball.svg" width="14" height="14" alt="Poké Ball" align="center">
