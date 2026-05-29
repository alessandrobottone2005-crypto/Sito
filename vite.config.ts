import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: './',
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'remove-module-type',
        transformIndexHtml(html) {
          return html.replace(/type="module" crossorigin /g, '');
        }
      }
    ],
    server: {
      // HMR is disabled
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      minify: false,
      rollupOptions: {
        output: {
          format: 'iife',
          inlineDynamicImports: true,
          name: 'BatmanApp',
        },
      },
      modulePreload: false,
    },
  };
});
