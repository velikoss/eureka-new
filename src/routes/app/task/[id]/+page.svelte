<script lang="ts">
    import { page } from '$app/state';
    import { Tools, type Task } from '$lib';
    import Problem from '$lib/Problem.svelte';
    import Code from '$lib/Code.svelte';
    import Method from '$lib/Method.svelte';

    import ToolsBar from '$lib/ToolsBar.svelte';
    import Algo from '$lib/Algo.svelte';

    let task: Task = $state(page.data.task);
    let selectedToolId: number | null = $state(null);
    $effect(() => {
        (task);
        task.__lastModified = Date.now();
    })

    const options = {
		"problem": Problem,
        "code": Code,
        "method": Method,
        "method2": Method,
        "algo": Algo,
        "algo2": Algo,
        "algo-scheme": Graph,
        "tests": Graph,
        "report": Graph,
    };

    async function handleToolSelected(toolId: any) {
        selectedToolId = toolId;
        task.__lastModified = Date.now();
        const taskToSave = {
            tools: task.tools,
            is_code_available: task.is_code_available,
            graph_png_array: task.graph_png_array,
            template_id: task.template_id,
            parent_id: task.parent_id,
            algo2: task.algo2,
            __lastSaved: task.__lastModified,
            method2: task.method2,
            task_readiness: task.task_readiness,
            _armVer: task._armVer,
            id: task.id,
            status: task.status,
            date_added: task.date_added,
            type: task.type,
            algo_text: task.algo_text,
            algo_graph: task.algo_graph,
            method_description: task.method_description,
            date_control: task.date_control,
            subject_id: task.subject_id,
            teacher_name: task.teacher_name,
            teacher_surname: task.teacher_surname,
            teacher_patronymic: task.teacher_patronymic,
            name: task.name,
            task_text: task.task_text,
            task_input: task.task_input,
            theory_text: task.theory_text,
            task_output: task.task_output
        };
        const taskJsonString = JSON.stringify(taskToSave);
        let data = await fetch("/api/saveTask", {
            method: "POST",
            body: taskJsonString
        })
        if ((await data.json()).success === true) {
            task.__lastSaved = task.__lastModified;
        }
    }

    let isDarkMode = $state(false);

    // Example: Check for dark mode on mount (optional)
    import { hasContext, onMount, setContext } from 'svelte';
    import { X } from '@lucide/svelte';
    import Graph from '$lib/Graph.svelte';
    
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
    <div class="w-screen border-b flex flex-row h-[5.6vh] max-h-[60px] pt-1 mb-2.5 px-2 md:px-[10vw] md:pl-[10.5vw] gap-1 pb-1">
        <strong class="text-xl self-center">Eureka</strong>
        <p class="w-full text-center self-center">{task.__lastModified > task.__lastSaved ? "*" : ""}{task.name}</p>
        <a href="/app" class="w-fit text-xl text-start underline z-50 self-center"><X/></a>
    </div>
    <div class="task w-screen md:w-4/5 flex self-center flex-row">
        <div class="bg-white dark:bg-black taskbar fixed md:relative flex flex-row top-auto bottom-0 w-screen overflow-auto md:flex-col md:w-72 h-[6vh] md:min-h-[96vh] max-h-full">
            <ToolsBar tools={task.tools} deflate={handleToolSelected} --dark={isDarkMode?"white":"black"} />
        </div>
        <div class="taskmenu overflow-scroll mb-[7vh] md:mb-0 w-full h-[88.5vh] md:min-h-[96vh] md:max-h-full border md:border-b-0 rounded-md md:rounded-b-none">
            {#if selectedToolId !== null}
            <!-- <p>{Tools[selectedToolId - 1]}</p> -->
            {@const Component = getTool()}
            <svelte:boundary>
                <Component bind:task={task} bind:dark={isDarkMode}></Component>

                {#snippet failed(error, reset)}
                    <button onclick={reset}>oops! try again {error}</button>
                {/snippet}
            </svelte:boundary>
            {/if}
        </div>
    </div>
</div>
