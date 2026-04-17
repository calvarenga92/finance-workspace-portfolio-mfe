import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    federation({
      name: 'portfolio_mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './PortfolioApp': './src/PortfolioApp.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    assetsDir: 'assets',
  },
  server: {
    port: 4173,
    strictPort: true,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});