import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'api/serverless': 'api/serverless.ts',
    'src/server': 'src/server.ts',
  },
  outDir: 'dist',
  format: ['esm'],
  target: 'node18',
  clean: true,
  splitting: false,
  dts: false,
  keepNames: true,
  outExtension: () => ({ js: '.js' }),
});
