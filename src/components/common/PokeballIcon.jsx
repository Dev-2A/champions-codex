// 직접 그린 몬스터볼 아이콘 (저작권 안전한 오리지널 SVG)
export default function PokeballIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`inline-block align-text-bottom ${className}`}
      aria-hidden="true"
    >
      {/* 아래 흰색 반구 */}
      <circle
        cx="12"
        cy="12"
        r="11"
        fill="#f8fafc"
        stroke="#0f172a"
        strokeWidth="1.5"
      />
      {/* 위 빨강 반구 */}
      <path
        d="M1 12 A11 11 0 0 1 23 12 Z"
        fill="#ef4444"
        stroke="#0f172a"
        strokeWidth="1.5"
      />
      {/* 가운데 검은 띠 */}
      <line x1="1" y1="12" x2="23" y2="12" stroke="#0f172a" strokeWidth="1.5" />
      {/* 가운데 버튼 */}
      <circle
        cx="12"
        cy="12"
        r="3.4"
        fill="#f8fafc"
        stroke="#0f172a"
        strokeWidth="1.5"
      />
      <circle
        cx="12"
        cy="12"
        r="1.4"
        fill="#f8fafc"
        stroke="#0f172a"
        strokeWidth="1.2"
      />
    </svg>
  );
}
