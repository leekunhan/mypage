// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://leekunhan.github.io/mypage/',
  base: '/',
  output: 'static',
  build: {
    format: 'directory'
  },
  trailingSlash: 'never'
});

