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
const neoscrypt = module ? new NeoScrypt(module) : undefined;

export function moduleState() {
    return neoscrypt !== undefined;
} 

export function signRequest(id: any, hash: string): string {
    if (hash.length > 32) {
        return "";
    }

    throw new Error('Function not implemented.');
}
