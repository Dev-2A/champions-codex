import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages: https://dev-2a.github.io/champions-codex/
  base: "/champions-codex/",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate", // 새 버전 감지 시 자동 갱신 (실사용자 필수)
      includeAssets: ["pokeball.svg", "icon-192.png", "icon-512.png"],
      manifest: {
        name: "Champions Codex",
        short_name: "Codex",
        description: "포켓몬 챔피언스 뉴비를 위한 정보·DB 허브",
        lang: "ko",
        theme_color: "#1a2442",
        background_color: "#0d1120",
        display: "standalone",
        start_url: "/champions-codex/",
        scope: "/champions-codex/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        // 앱 셸 + 코드(데이터 JSON은 JS 청크에 포함됨)만 프리캐시
        globPatterns: ["**/*.{js,css,html,svg}", "icon-*.png"],
        // 스프라이트는 프리캐시 제외 → 런타임 캐시로
        globIgnores: ["sprites/**"],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes("/sprites/"),
            handler: "CacheFirst", // 스프라이트는 불변 → 캐시 우선
            options: {
              cacheName: "sprites",
              expiration: {
                maxEntries: 400, // 포켓몬 224 + 도구 45 + 여유
                maxAgeSeconds: 60 * 60 * 24 * 90,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
