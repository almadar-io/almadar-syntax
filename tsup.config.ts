import { defineConfig } from 'tsup';
import { copyFileSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
  entry: ['src/index.ts', 'src/prism-orb.ts', 'src/colors.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  outDir: 'dist',
  async onSuccess() {
    // Copy tokens.json to dist for the "./tokens.json" export
    copyFileSync(
      resolve('src', 'tokens.json'),
      resolve('dist', 'tokens.json'),
    );
  },
});
