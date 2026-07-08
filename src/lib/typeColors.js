// 포켓몬 타입별 색상 (데이터 시각화 전용 — 파스텔 블루 UI 토큰과 별개)
export const typeColors = {
  normal: { bg: "#9099a1", text: "#ffffff" },
  fire: { bg: "#ff6b52", text: "#ffffff" },
  water: { bg: "#4d90d5", text: "#ffffff" },
  electric: { bg: "#efc93b", text: "#3a2f00" },
  grass: { bg: "#5fbc55", text: "#ffffff" },
  ice: { bg: "#69cabb", text: "#0a2f2a" },
  fighting: { bg: "#ce4267", text: "#ffffff" },
  poison: { bg: "#a96bc9", text: "#ffffff" },
  ground: { bg: "#d5794a", text: "#ffffff" },
  flying: { bg: "#8badea", text: "#12203f" },
  psychic: { bg: "#f66f97", text: "#ffffff" },
  bug: { bg: "#94c02c", text: "#12300a" },
  rock: { bg: "#c3b184", text: "#2a2410" },
  ghost: { bg: "#5a6bb0", text: "#ffffff" },
  dragon: { bg: "#276fc6", text: "#ffffff" },
  dark: { bg: "#5b5466", text: "#ffffff" },
  steel: { bg: "#5d93a6", text: "#ffffff" },
  fairy: { bg: "#ed93e6", text: "#3a1035" },
};

export function typeStyle(type) {
  const c = typeColors[type] ?? { bg: "#94a3b8", text: "#ffffff" };
  return { backgroundColor: c.bg, color: c.text };
}
