<!-- src/lib/widgets/RunCode.svelte -->
<script lang="ts">
    import Widget from '$lib/Widget.svelte';
    import { Play } from '@lucide/svelte';
    import type { Task, TaskFile } from '$lib';
    import { getAllContexts, getContext, onMount } from 'svelte';
    
    let input = $state("");
    let output = $state("");
    let isRunning = $state(false);
    
    let task: Task | undefined = $state();

    async function runProject() {
        if (isRunning) return;
        
        isRunning = true;
        output = "Compiling and running project...\n";
        
        try {
            const response = await fetch("/api/runTaskWithInput", {
                method: "POST",
                body: JSON.stringify({
                    idTask: task.id,
                    input: input
                })
            });
            
            const result = (await response.json()).data;
            output = (result.code??-1) === 0 ? result.stdout : `${result.stdout}\n${result.stderr}`;
        } catch (error) {
            output = "Failed to execute project: " + error;
        } finally {
            isRunning = false;
        }
    }

    onMount(() => {
        task = getContext("task").task;
        console.log(getAllContexts());
    })
</script>

<Widget callback={runProject}>
    <Play size={16} class={isRunning ? "animate-pulse" : ""} />
    <div class="absolute top-full right-0 mt-2 w-84 bg-white dark:bg-gray-800 shadow-lg rounded p-2 z-50 max-h-96 overflow-auto">
        <div class="flex justify-between items-center mb-2">
            <span class="font-bold">Входные данные</span>
            <button 
                on:click|stopPropagation={() => input = ""} 
                class="text-xs p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
                Очистить
            </button>
        </div>
        <textarea name="Input" class="w-full" on:click|stopPropagation bind:value={input}></textarea>
        <div class="flex justify-between items-center mb-2">
            <span class="font-bold">Выходные данные</span>
            <button 
                on:click|stopPropagation={() => output = ""} 
                class="text-xs p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
                Очистить
            </button>
        </div>
        <pre class="text-xs whitespace-pre-wrap text-left">{output}</pre>
    </div>
</Widget>