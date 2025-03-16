<script lang="ts">
    import { Tools, ToolsLang } from "$lib";
    import { onMount } from 'svelte';

    let {tools, deflate} = $props();
    let selectedToolId: number | null = $state(null);

    onMount(() => {
        selectTool(tools[0].id);
    });

    function selectTool(toolId: number) {
        selectedToolId = toolId;
        // Emit the selected tool ID to the parent
        deflate(toolId);
    }

</script>

<style>
    /* Gradient flying animation for > */
    .selected-arrow {
        display: inline-block;
        background: #000000;
        background-clip: text;
        -webkit-background-clip: text;
        animation: fly 0.5s 1 ease;
    }

    @keyframes fly {
        0% {
            transform: translateX(-5px);
        }
        100% {
            transform: translateX(0px);
        }
    }

    /* Underline animation for tool text */
    .tool-text {
        position: relative;
        display: inline-block;
    }

    /* .tool-text::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 5px;
        width: 0;
        height: 1px;
        background: var(--dark, "#FFFFFF");
        transition: width 0.3s ease;
    }

    .tool-text.selected::after {
        width: 100%;
    } */
</style>

<div class="px-2 tools flex flex-row md:flex-col gap-1 md:gap-2">
    {#each tools as tool}
        <button
            class="border w-full h-[5vh] md:h-fit md:py-1 rounded-md flex items-center px-2 cursor-pointer text-nowrap shadow-md"
            onclick={() => selectTool(tool.id)}
        >
            <p>
                {#if selectedToolId === tool.id}
                    <span class="selected-arrow text-black dark:text-white">></span>
                {/if}
                <span class="tool-text {selectedToolId === tool.id ? 'selected' : ''}">
                    {ToolsLang.get(Tools[tool.id - 1])}
                </span>
            </p>
        </button>
    {/each}
</div>
