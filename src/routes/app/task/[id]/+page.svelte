<script lang="ts">
    import { page } from '$app/state';
    import { Tools, type Task } from '$lib';
    import Problem from '$lib/Problem.svelte';
    import Code from '$lib/Code.svelte';
    import Method from '$lib/Method.svelte';

    import ToolsBar from '$lib/ToolsBar.svelte';
    import Marquee from "svelte-fast-marquee";
    import Algo from '$lib/Algo.svelte';

    const task: Task = page.data.task;
    let selectedToolId: number | null = $state(null);

    const options = {
		"problem": Problem,
        "code": Code,
        "method": Method,
        "method2": Method,
        "algo": Algo,
        "algo2": Algo,
    };

    function handleToolSelected(toolId: any) {
        selectedToolId = toolId;
    }

    let isDarkMode = $state(false);

    // Example: Check for dark mode on mount (optional)
    import { onMount } from 'svelte';
    onMount(() => {
        setInterval(() => {
            isDarkMode = document.documentElement.classList.contains('dark');
        }, 0)
    });


    function getTool(): any {
        return options[Tools[selectedToolId! - 1] as keyof typeof options];
    }
</script>

<div class="w-screen h-[4vh] md:h-fit py-2 items-center justify-center flex flex-row">
    <div class="w-[calc(100%-24px)] flex flex-row px-2 pr-9 -z-10">
        <strong>Eureka</strong>
        <Marquee gradient={true} --gradientColor={isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'}>
            {#each [0,0,0,0] as _}
            <span>{task.name}</span>
            <span>{".".repeat(task.name.length / 2)}</span>
            {/each}
        </Marquee>
    </div>
    <a href="/app" class="w-fit text-xl text-start underline align-top pr-3">x</a>
</div>
<div class="task flex flex-row">
    <div class="bg-white dark:bg-black taskbar fixed md:relative flex flex-row top-auto bottom-0 w-screen overflow-auto md:flex-col md:w-72 h-[4vh] md:min-h-[96vh] max-h-full">
        <ToolsBar tools={task.tools} deflate={handleToolSelected} --dark={isDarkMode?"white":"black"} />
    </div>
    <div class="taskmenu overflow-scroll mb-[5vh] md:mb-0 w-full h-[91.5vh] md:min-h-[96vh] md:max-h-full md:border-l border-t border-b md:border-b-0 rounded-md md:rounded-b-none">
        {#if selectedToolId !== null}
        <!-- <p>{Tools[selectedToolId - 1]}</p> -->
        {@const Component = getTool()}
        <Component task={task} dark={isDarkMode}></Component>
        {/if}
    </div>
</div>