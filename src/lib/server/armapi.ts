import NeoScrypt from "../neoscrypt";
import fs from "node:fs/promises";
import file from '$lib/neoscrypt.wasm?url';
const wasm = await fs.readFile("."+file).catch((e) => {
    // console.log(e)
    return undefined
});
const module = await WebAssembly.instantiate(wasm!.buffer).catch(e => {
    // console.log(e)
    return undefined
});
const neoscrypt = module ? new NeoScrypt((module as any).instance) : undefined;

export function moduleState() {
    return neoscrypt !== undefined;
} 

export function signRequest(id: any, hash: string): string {
    if (hash.length > 32) return "";
    const textEncoder = new TextEncoder();
    const hashUtf8 = textEncoder.encode(hash);
    const inputData = new Uint8Array([...new Uint8Array(new Uint32Array([0, id]).buffer), ...hashUtf8]);
    const hashbrown = neoscrypt?.neoscrypt(inputData);
    //console.log(hashbrown);
    return hashbrown!.toUpperCase();
}
