// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  site: 'https://leekunhan.github.io/mypage/',
  base: '/mypage',
  output: 'static',
  build: {
    format: 'directory'
  },
  trailingSlash: 'never'
});

