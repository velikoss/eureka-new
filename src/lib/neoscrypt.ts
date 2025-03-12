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

	neoscrypt(input: Uint8Array): string {
		const resultPtr = this.#instance.exports._bumpalloc_push(32);
		// const textEncoder = new TextEncoder();
		// const test = textEncoder.encode(input);
		const testPtr = this.#instance.exports._bumpalloc_push(input.length);
		(new Uint8Array(this.#instance.exports.memory.buffer, testPtr, input.length)).set(input);
		this.#instance.exports.neoscrypt(testPtr, resultPtr, 0x80000620);
		this.#instance.exports._bumpalloc_pop(input.length);
		const result = new Uint8Array(this.#instance.exports.memory.buffer, resultPtr, 32);
		const resultStr = [...result].map(x => x.toString(16)).join("");
		this.#instance.exports._bumpalloc_pop(32);
		return resultStr;
	}
}
