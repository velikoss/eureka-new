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
    <div class="fixed top-6 right-6 flex gap-1">
		<Widget callback={()=>{}}>
			<div class="w-5 aspect-square rounded-full {data.locals.user && data.locals.user.st && data.locals.user.st === 1?"bg-green-300":"bg-red-300"} m-1"></div>
		</Widget>
        <DarkMode/>
	</div>
</header>
<main class="font-mono">
	{@render children()}
</main>
