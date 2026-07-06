import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages のプロジェクトページは https://<user>.github.io/denki-game/ 配下に置かれる。
  // 公開ビルド時のみ VITE_BASE=/denki-game/ を渡してアセットのパスを合わせる。
  // dev / LAN プレビュー(未指定)は '/' のままなので既存の起動に影響しない。
  base: process.env.VITE_BASE || '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '伝記 ― ベートーヴェン',
        short_name: '伝記',
        description: '一人の人生を生きて学ぶ、没入型伝記ゲーム',
        lang: 'ja',
        display: 'standalone',
        background_color: '#171512',
        theme_color: '#171512',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
})
