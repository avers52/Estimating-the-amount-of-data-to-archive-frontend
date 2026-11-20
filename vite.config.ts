import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Имя вашего репозитория на GitHub для корректных путей в GitHub Pages
const REPO_NAME = '/Estimating-the-amount-of-data-to-archive-frontend/';

export default defineConfig(({ mode }) => {
  const isPages = mode === 'pages';

  return {
    base: isPages ? REPO_NAME : '/',
    define: {
      'import.meta.env.VITE_FORCE_MOCK': JSON.stringify(isPages ? 'true' : 'false'),
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['gzip_draft.png', 'zstd_archiver.png', 'lz4_stream.png', 'snappy_raw.png'],
        manifest: {
          name: 'Оценка объемов архивации данных',
          short_name: 'ArchiveCalc',
          description: 'Каталог и оценка эффективности алгоритмов сжатия данных',
          theme_color: '#2ec4b6',
          background_color: '#f1f5f9',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: isPages ? REPO_NAME : '/',
          scope: isPages ? REPO_NAME : '/',
          icons: [
            {
              src: 'gzip_draft.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: 'gzip_draft.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        },
      }),
    ],
    server: {
      host: '0.0.0.0', // Доступ с телефона в локальной Wi-Fi сети
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
        '/s3': {
          target: 'http://localhost:9000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/s3/, ''),
        },
      },
    },
  };
});