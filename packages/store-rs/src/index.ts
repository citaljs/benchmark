import { getBuf } from './__generated__/wasm'
import init, { JsSharedArray } from './__generated__/wasm/store_rs_wasm'

export async function test() {
  const instance = await init(WebAssembly.compile(getBuf()))

  const array = JsSharedArray.new()

  const ptr = array.data_ptr()
  const len = array.len()

  const data = new Uint32Array(instance.memory.buffer, ptr, len)

  console.log('Array from Rust:', Array.from(data))

  array.free()

  return 'Hello from Rust!'
}
