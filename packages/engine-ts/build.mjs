import esbuild from 'esbuild'

await esbuild.build({
  bundle: true,
  outfile: './dist/index.js',
  entryPoints: ['./src/index.ts'],
  format: 'esm',
  minify: true,
})
