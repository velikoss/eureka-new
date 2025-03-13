<script lang="ts">
    import Widget from '$lib/Widget.svelte';
import { onMount } from 'svelte';

	let isDarkMode = $state(false);

    // Toggle dark mode
    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        localStorage.setItem('darkMode', isDarkMode.toString());

        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

	onMount(() => {
		const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        isDarkMode = savedDarkMode ?? systemPrefersDark;

        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        }
	})
</script>

<Widget callback={toggleDarkMode}>{isDarkMode ? '🌙' : '☀️'}</Widget>
