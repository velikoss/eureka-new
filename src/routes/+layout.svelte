<script lang="ts">
    import { onMount } from 'svelte';
	import '../app.css';
    import DarkMode from '$lib/widgets/DarkMode.svelte';
    import Widget from '$lib/Widget.svelte';
	let { children, data } = $props();

	let isDarkMode = $state(false);

	onMount(() => {
		const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        isDarkMode = savedDarkMode ?? systemPrefersDark;

        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        }
	})
</script>

<header>
    <div class="fixed top-6 right-6 flex gap-1 z-50">
        <DarkMode/>
	</div>
</header>
<style>
	:root {
		--system-ui: Inter, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
	}
</style>
<main class="inter">
	{@render children()}
</main>
