import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          motos: path.resolve(__dirname, 'motos.html'),
          'jef-150-s-carburada': path.resolve(__dirname, 'jef-150-s-carburada.html'),
          'jet-125-ss': path.resolve(__dirname, 'jet-125-ss.html'),
          'jet-50-s-turbo': path.resolve(__dirname, 'jet-50-s-turbo.html'),
          'new-jef-150-efi': path.resolve(__dirname, 'new-jef-150-efi.html'),
          'new-jet-125': path.resolve(__dirname, 'new-jet-125.html'),
          'phoenix-50-s': path.resolve(__dirname, 'phoenix-50-s.html'),
          'rio-125': path.resolve(__dirname, 'rio-125.html'),
          'shi-175-carburada': path.resolve(__dirname, 'shi-175-carburada.html'),
          'shi-175-efi': path.resolve(__dirname, 'shi-175-efi.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
