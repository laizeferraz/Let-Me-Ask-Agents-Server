import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts', 'api/**/*.ts'],
  outDir: 'dist',
  format: ['esm'],
  target: 'node22',
  clean: true,
  splitting: false,
  dts: false,
  keepNames: true,
});
