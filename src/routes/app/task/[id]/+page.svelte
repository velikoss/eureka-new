<script lang="ts">
    import { page } from '$app/state';
    import { Tools, type Task } from '$lib';
    import Problem from '$lib/Problem.svelte';
    import Code from '$lib/Code.svelte';
    import Method from '$lib/Method.svelte';

    import ToolsBar from '$lib/ToolsBar.svelte';
    import Marquee from "svelte-fast-marquee";
    import Algo from '$lib/Algo.svelte';

    let task: Task = $state(page.data.task);
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
    import { hasContext, onMount, setContext } from 'svelte';
    
    onMount(async () => {
        setInterval(() => {
            isDarkMode = document.documentElement.classList.contains('dark');
        }, 0)
    });


    function getTool(): any {
        return options[Tools[selectedToolId! - 1] as keyof typeof options];
    }
</script>

<div class="flex flex-col">
    <div class="w-screen border-b flex flex-row py-1 mb-2.5 px-2 md:px-[10vw] md:pl-[10.5vw] gap-1 pb-1">
        <strong class="text-xl">Eureka</strong>
        <p class="w-full text-center self-center">{task.name}</p>
        <a href="/app" class="w-fit text-xl text-start underline z-50">×</a>
    </div>
    <div class="task w-screen md:w-4/5 flex self-center flex-row">
        <div class="bg-white dark:bg-black taskbar fixed md:relative flex flex-row top-auto bottom-0 w-screen overflow-auto md:flex-col md:w-72 h-[6vh] md:min-h-[96vh] max-h-full">
            <ToolsBar tools={task.tools} deflate={handleToolSelected} --dark={isDarkMode?"white":"black"} />
        </div>
        <div class="taskmenu overflow-scroll mb-[7vh] md:mb-0 w-full h-[88.5vh] md:min-h-[96vh] md:max-h-full border md:border-b-0 rounded-md md:rounded-b-none">
            {#if selectedToolId !== null}
            <!-- <p>{Tools[selectedToolId - 1]}</p> -->
            <svelte:boundary>
                {@const Component = getTool()}
                <Component bind:task={task} dark={isDarkMode}></Component>

                {#snippet failed(error, reset)}
                    <button onclick={reset}>oops! try again {error}</button>
                {/snippet}
            </svelte:boundary>
            {/if}
        </div>
    </div>
</div>
