<script lang="ts">
    import { onMount, setContext } from 'svelte';
    import '../app.css';
    import Widgets from '$lib/Widgets.svelte';
    
    let { children, data } = $props();
    let widgets: { addWidget: (name: string) => void, removeWidget: (name: string) => void };

    // Example: Add dark mode widget on mount for specific pages
    onMount(() => {
        if (data?.showDarkModeWidget) {
            widgets?.addWidget('darkMode');
        }
		setContext("widgets", { widgets });
    });
</script>

<Widgets bind:this={widgets} />

<header>
    <!-- Widgets are now rendered by the Widgets component -->
</header>

<style>
    :root {
        --system-ui: Inter, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }
</style>

<main class="inter">
    {@render children()}
</main>