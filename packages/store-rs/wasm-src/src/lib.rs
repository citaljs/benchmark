mod base;
mod event;
mod filter;
mod store;
mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, store-rs-wasm!");
}

#[wasm_bindgen]
pub struct JsSharedArray {
    data: Vec<u32>,
}

#[wasm_bindgen]
impl JsSharedArray {
    pub fn new() -> JsSharedArray {
        JsSharedArray {
            data: vec![0, 1, 2],
        }
    }

    pub fn data_ptr(&self) -> *const u32 {
        self.data.as_ptr()
    }

    pub fn len(&self) -> usize {
        self.data.len()
    }
}
