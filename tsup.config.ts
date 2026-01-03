import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'es2022',
  outDir: 'dist',
  clean: true,
  dts: true,
  sourcemap: true,
  minify: false,
  splitting: false,
  treeshake: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
});
