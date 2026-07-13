const CHO = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

/** 한글 음절 문자열 → 초성열 (음절이 아니면 문자 그대로) */
export function toChoseong(str = "") {
  let out = "";
  for (const ch of str) {
    const code = ch.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) {
      out += CHO[Math.floor((code - 0xac00) / 588)];
    } else {
      out += ch;
    }
  }
  return out;
}

// 호환 자모 자음 범위 (ㄱ U+3131 ~ ㅎ U+314E). 모음은 U+314F부터라 제외됨.
const isChoseongChar = (ch) => ch >= "ㄱ" && ch <= "ㅎ";

/**
 * 이름이 질의에 매칭되는지.
 * - 일반: 부분문자열 (대소문자 무시)
 * - 초성: 질의가 전부 초성이면 이름의 초성열과 비교 (ㄹㅈㅁ → 리자몽)
 */
export function matchKo(name = "", query = "") {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const n = name.toLowerCase();
  if (n.includes(q)) return true;
  if ([...q].every(isChoseongChar)) return toChoseong(n).includes(q);
  return false;
}
