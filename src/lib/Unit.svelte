<script lang="ts">
    import type { Section, NestedSection, HomeTask } from '$lib';
    import { Book } from '@lucide/svelte';
    import HomeTaskComponent from './HomeTaskComponent.svelte';

    let { section, disabled }: {section : Section & { tasks: HomeTask[], nested: (NestedSection)[] }, disabled: boolean | false} = $props();

    // Helper function to format the deadline week
    const formatDeadline = (deadlineWeek: number) => {
        return `${deadlineWeek} неделя`;
    };

    // State to manage visibility of nested sections
    let showNested = $state(false);

    // Function to toggle nested sections visibility
    const toggleNested = () => {
        showNested = !showNested;
    };
</script>

<div class="border md:motion-preset-blur-down border-black dark:border-gray-200 dark:bg-black dark:text-white rounded-lg shadow-md p-4 mb-4 bg-white">
    <!-- Section Header -->
    <div class="flex justify-between items-center">
        <span class="flex flex-row items-center gap-1.5">
            <Book size={18} />
            <h2 class="text-lg font-bold">{section.section_name}</h2>
            <p class="text-lg">({section.score ?? 0}/{section.max_points})</p>
        </span>
        <p class="text-sm text-gray-700 dark:text-gray-300">Дедлайн: {formatDeadline(section.deadline_week)}</p>
    </div>
    {#if section.description}
        <i class="text-gray-500 dark:text-gray-400 text-sm">{section.description}</i>
    {/if}

    <div class="mt-3 mb-4 border-t border-black dark:border-gray-200"></div>

    <!-- Tasks within the main section -->
    {#each section.tasks as task, i }
        <HomeTaskComponent task={task} disabled={disabled} index={i}></HomeTaskComponent>
    {/each}
</div>
