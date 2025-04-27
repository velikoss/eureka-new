<script lang="ts">
    import { getContext, onMount, setContext } from 'svelte';
    import '../app.css';
    import Widgets from '$lib/Widgets.svelte';
    import { Task } from '$lib';
    import Toast from '$lib/Toast.svelte';
    
    let { children, data } = $props();
    let widgets: { addWidget: (name: string) => void, removeWidget: (name: string) => void };
    let toasts: { show: (name: string, description: string, style: string | undefined) => void };

    // Example: Add dark mode widget on mount for specific pages
    onMount(() => {
        if (data?.showDarkModeWidget) {
            widgets?.addWidget('darkMode');
        }
		setContext("widgets", { widgets });
		setContext("toast", { toasts });
		setContext("task", { task: undefined });
		setContext("data", { data });
    });
</script>

<div class="relative min-h-screen flex flex-col">
    <!-- Widgets component -->
    <Widgets bind:this={widgets} />
    
    <!-- Main content area -->
    <main class="inter flex-1">
        {@render children()}
    </main>
    
    <!-- Toast container - fixed position at top-right -->
    <Toast bind:this={toasts} />
</div>

<style>
    :root {
        --system-ui: Inter, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }
</style>
