import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-expect-error plain JS server module (runs in Node only, never bundled into the app)
import { askMiddleware } from './server/ask.mjs';

/** "Ask VIMO" (POST /api/ask) on the dev and preview servers. The Gemini key is read here, in Node,
    from .env (no VITE_ prefix), so it is never sent to the browser. */
function askVimo(): Plugin {
  let key = '';
  return {
    name: 'ask-vimo',
    configResolved(c) { key = loadEnv(c.mode, process.cwd(), '').GEMINI_API_KEY ?? ''; },
    configureServer(s) { s.middlewares.use(askMiddleware(() => key)); },
    configurePreviewServer(s) { s.middlewares.use(askMiddleware(() => key)); },
  };
}

// base './' so the static build works on GitHub Pages, Netlify or any sub-folder.
export default defineConfig({
  base: './',
  plugins: [react(), askVimo()],
  // Windows locks big files while they download; don't let the dev watcher crash on them.
  server: {
    watch: { ignored: ['**/public/assets/**', '**/public/audio/**', '**/.vo-cache/**', '**/docs/**', '**/video-frames/**', '**/LICENSE', '**/*.md', '**/*.csv'] },
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
});
