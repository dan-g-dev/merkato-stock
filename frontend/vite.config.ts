import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 5173,
      // The backend (backend/src/server.ts) runs separately on its own
      // port - this proxies every /api call there so the frontend code
      // can keep calling fetch("/api/...") without knowing the backend's
      // actual port or dealing with CORS in dev.
      proxy: {
        '/api': {
          target: process.env.BACKEND_URL || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
