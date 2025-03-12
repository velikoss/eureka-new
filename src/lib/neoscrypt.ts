type WPointer = number & { readonly __tag: unique symbol };

type NeoScryptExports = {
	_bumpalloc_push: (size: number) => WPointer,
	_bumpalloc_pop: (size: number) => void,
	neoscrypt: (srcPtr: WPointer, dstPtr: WPointer, profile: number) => void,
	memory: WebAssembly.Memory,
}

export default class NeoScrypt {
	#instance: { exports: NeoScryptExports };
	constructor(instance: WebAssembly.Instance) {
		this.#instance = instance as any;
	}

	neoscrypt(input: string): string {
		const resultPtr = this.#instance.exports._bumpalloc_push(32);
		const textEncoder = new TextEncoder();
		const test = textEncoder.encode(input);
		const testPtr = this.#instance.exports._bumpalloc_push(test.length);
		(new Uint8Array(this.#instance.exports.memory.buffer, testPtr, test.length)).set(test);
		this.#instance.exports.neoscrypt(testPtr, resultPtr, 0x80000620);
		this.#instance.exports._bumpalloc_pop(test.length);
		const result = new Uint8Array(this.#instance.exports.memory.buffer, resultPtr, 32);
		const resultEndIdx = result.findIndex(x => x == 0);
		const resultStr = [...result.slice(0, resultEndIdx)].map(x => x.toString(16)).join("");
		this.#instance.exports._bumpalloc_pop(32);
		return resultStr;
	}
}
