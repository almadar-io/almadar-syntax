import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/prism-orb.ts', 'src/colors.ts'],
  format: ['esm'],
  dts: true,
  clean: false, // don't clean dist/ because generate-tokens.ts writes tokens.json there
  sourcemap: true,
  splitting: false,
  treeshake: true,
  outDir: 'dist',
});
