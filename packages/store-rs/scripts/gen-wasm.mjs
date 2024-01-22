import fs from 'fs/promises'

const wasm = await fs.readFile(
  new URL('../src/__generated__/wasm/store_rs_wasm_bg.wasm', import.meta.url),
)
const wasmBase64 = Buffer.from(wasm, 'binary').toString('base64')

const module = `const source = '${wasmBase64}'
const isNode =
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null
export function getBuf(): any {
  if (isNode) {
    return Buffer.from(source, 'base64')
  }
  const raw = globalThis.atob(source)
  const rawLength = raw.length
  const buf = new Uint8Array(new ArrayBuffer(rawLength))
  for (let i = 0; i < rawLength; i += 1) {
    buf[i] = raw.charCodeAt(i)
  }
  return buf
}
`

await fs.writeFile(
  new URL('../src/__generated__/wasm.ts', import.meta.url),
  module,
  'utf-8',
)
