/**
 * public/ 기준 상대 경로 → 배포 base가 붙은 URL.
 * (GitHub Pages 서브경로 /champions-codex/ 대응 — vite.config.js의 base)
 */
export const assetUrl = (path) => import.meta.env.BASE_URL + path;
