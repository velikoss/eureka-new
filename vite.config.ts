import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Terminal from 'vite-plugin-terminal'

export default defineConfig({
	plugins: [sveltekit(), tailwindcss(), Terminal()],
	optimizeDeps: {
        exclude: ["svelte-codemirror-editor", "codemirror"],
    },
});
