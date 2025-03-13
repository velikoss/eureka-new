<script lang="ts">
    import type { Section, NestedSection, HomeTask } from '$lib';
    import { Book } from '@lucide/svelte';
    import HomeTaskComponent from './HomeTaskComponent.svelte';

    export let section: Section & { tasks: HomeTask[], nested: (NestedSection)[] };

    // Helper function to format the deadline week
    const formatDeadline = (deadlineWeek: number) => {
        return `${deadlineWeek} неделя`;
    };

    // State to manage visibility of nested sections
    let showNested = false;

    // Function to toggle nested sections visibility
    const toggleNested = () => {
        showNested = !showNested;
    };
</script>

<div class="border motion-preset-blur-down border-black dark:border-gray-200 dark:bg-black dark:text-white rounded-lg shadow-md p-4 mb-4 bg-white">
    <!-- Section Header -->
    <div class="flex justify-between items-center">
        <span class="flex flex-row items-center gap-1.5">
            <Book size={18} />
            <h2 class="text-lg font-bold">{section.section_name}</h2>
            <p class="text-lg">({section.score ?? 0}/{section.max_points})</p>
        </span>
        <p class="text-sm text-gray-700 dark:text-gray-300">Дедлайн: {formatDeadline(section.deadline_week)}</p>
    </div>

    <!-- Nested Sections Toggle -->
    {#if section.nested.length > 0}
        <div class="w-full border-black dark:border-gray-200 pt-2">
            <button
                on:click={toggleNested}
                class="text-sm w-full text-left transition text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
            >
                {showNested ? '< Скрыть содержание' : '> Показать содержание'}
            </button>
        </div>
    {/if}

    <!-- Nested Sections (Conditionally Rendered) -->
    {#if showNested && section.nested.length > 0}
        <div class="mt-2">
            {#each section.nested as nested}
                <div class="pl-4 border-l border-black dark:border-gray-200">
                    <p class="text-sm">* {nested.section_name}</p>
                </div>
            {/each}
        </div>
    {/if}

    <div class="mt-3 mb-4 border-t border-black dark:border-gray-200"></div>

    <!-- Tasks within the main section -->
    {#each section.tasks as task, i }
        <HomeTaskComponent task={task} index={i}></HomeTaskComponent>
    {/each}
</div>