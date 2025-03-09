<script lang="ts">
    import { page } from '$app/state';
    import { Tools, type Task } from '$lib';
    import Problem from '$lib/Problem.svelte';
    import ToolsBar from '$lib/ToolsBar.svelte';
    import { onMount } from 'svelte';
    import Marquee from "svelte-fast-marquee";

    const task: Task = page.data.task;
    let selectedToolId: number | null = null;

    const options = {
		"problem": Problem,
    };

    function handleToolSelected(event: CustomEvent<{ toolId: number }>) {
        selectedToolId = event.detail.toolId;
    }


    function getTool(): any {
        return options[Tools[selectedToolId! - 1] as keyof typeof options];
    }
</script>

<div class="w-screen h-[4vh] md:h-fit py-2 items-center justify-center flex flex-row">
    <div class="w-[calc(100%-24px)] flex flex-row px-2 pr-9 -z-10">
        <strong>Eureka</strong>
        <Marquee gradient={true}>
            {#each [0,0,0,0] as _}
            <span>{task.name}</span>
            <span>{".".repeat(task.name.length / 2)}</span>
            {/each}
        </Marquee>
    </div>
    <a href="/app" class="w-fit text-xl text-start underline align-top pr-3">x</a>
</div>
<div class="task flex flex-row">
    <div class="bg-white taskbar fixed md:relative flex flex-row top-auto bottom-0 w-screen overflow-auto md:flex-col md:w-72 h-[4vh] md:min-h-[96vh] max-h-full">
        <ToolsBar tools={task.tools} on:toolSelected={handleToolSelected} />
    </div>
    <div class="taskmenu overflow-scroll mb-[5vh] md:mb-0 w-full h-[91.5vh] md:min-h-[96vh] md:max-h-full py-2 px-3 md:border-l border-t border-b md:border-b-0 rounded-md md:rounded-b-none">
        {#if selectedToolId !== null}
            <svelte:component this={getTool()} task={task}></svelte:component>
        {/if}
    </div>
</div>