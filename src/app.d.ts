// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Component } from "svelte";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User?;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
