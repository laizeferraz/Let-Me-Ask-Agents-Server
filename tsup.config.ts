import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts'],
  outDir: 'dist',
  format: ['esm'],
  target: 'node22',
  clean: true,
  splitting: false,
  dts: false,
  keepNames: true,
  outExtension: () => ({ js: '.js' }),
});
