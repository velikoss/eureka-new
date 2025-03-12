import NeoScrypt from "$lib/neoscrypt";
import fs from "fs/promises";
import file from '$lib/neoscrypt.wasm?url';
const wasm = await fs.readFile("."+file).catch((e) => {
    console.log(e)
    return undefined
});
const module = await WebAssembly.instantiate(wasm!.buffer).catch(e => {
    console.log(e)
    return undefined
});
const neoscrypt = module ? new NeoScrypt((module as any).instance) : undefined;

export function moduleState() {
    return neoscrypt !== undefined;
} 

export function signRequest(id: any, hash: string): string {
    if (hash.length > 32) {
        console.log("yayayaya");
        return "";
    }
    const textEncoder = new TextEncoder();
    const hashUtf8 = textEncoder.encode(hash);
    const inputData = new Uint32Array([id, 0, ...new Uint32Array(hashUtf8.buffer)]);
    const hashbrown = neoscrypt?.neoscrypt(new Uint8Array(inputData.buffer));
    console.log(hashbrown);
    return hashbrown!;
}