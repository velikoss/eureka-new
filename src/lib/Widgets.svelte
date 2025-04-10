<!-- src/lib/Widgets.svelte -->
<script lang="ts">
    import DarkMode from '$lib/widgets/DarkMode.svelte';
    import RunCode from '$lib/widgets/RunCode.svelte';
    import { onMount } from 'svelte';
    import type { WidgetConfig } from './index';

    const availableWidgets: Record<string, WidgetConfig> = {
        darkMode: {
            name: 'darkMode',
            component: DarkMode,
            position: 'top-right',
            persistent: true // Always show this widget
        },
        runProject: {
            name: 'runProject',
            component: RunCode,
            position: 'top-right',
            persistent: false // Only show when explicitly added
        }
    };

    let activeWidgets = $state<WidgetConfig[]>([]);

    // Initialize with persistent widgets
    onMount(() => {
        activeWidgets = Object.values(availableWidgets)
            .filter(widget => widget.persistent);
    });

    export function addWidget(widgetName: string, args: any) {
        if (availableWidgets[widgetName] && !activeWidgets.some(w => w.name === widgetName)) {
            let newWidget = availableWidgets[widgetName];
            activeWidgets = [...activeWidgets, newWidget];
        }
    }

    export function removeWidget(widgetName: string) {
        if (!availableWidgets[widgetName]?.persistent) {
            activeWidgets = activeWidgets.filter(w => w.name !== widgetName);
        }
    }
</script>

<div class="fixed top-6 right-6 flex gap-1 z-50">
    {#each activeWidgets.filter(w => w.position === 'top-right') as widget}
        <svelte:component this={widget.component} />
    {/each}
</div>