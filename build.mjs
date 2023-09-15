import { build } from 'esbuild';
import { copy } from 'esbuild-plugin-copy';

(async () => {
  const res = await build({
    entryPoints: ['./express/j.ts'],
    format: 'esm',
    platform: 'node',
    target: 'ES2022',
    bundle: true,
    outfile: './functions/server.js',
    banner: {
      js: `
    /*import { createRequire } from 'module';
    const require = createRequire(import.meta.url);
    import { fileURLToPath } from 'url';
    import { dirname } from 'path';
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);*/`
    },
    plugins: [
      copy({
        // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
        // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
        resolveFrom: 'cwd',
        assets: {
          from: ['./node_modules/tesseract\.js-core/*.wasm'],
          to: ['./functions/'],
        },
        watch: true,
      }),
    ],
  });
})();