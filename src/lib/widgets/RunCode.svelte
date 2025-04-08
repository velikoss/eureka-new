<!-- src/lib/widgets/RunCode.svelte -->
<script lang="ts">
    import Widget from '$lib/Widget.svelte';
    import { Play } from '@lucide/svelte';
    import type { TaskFile } from '$lib';

    let output = $state("");
    let isRunning = $state(false);
    
    // These will be provided by the parent component
    let getProjectFiles = () => [] as TaskFile[];
    let taskId = $state("");

    async function runProject() {
        if (isRunning) return;
        
        isRunning = true;
        output = "Compiling and running project...\n";
        
        try {
            const response = await fetch("/api/runProject", {
                method: "POST",
                body: JSON.stringify({
                    taskId,
                    files: getProjectFiles().map(file => ({
                        name: file.name,
                        content: file.file
                    }))
                })
            });
            
            const result = await response.json();
            output = result.success ? result.output : "Error: " + result.error;
        } catch (error) {
            output = "Failed to execute project: " + error;
        } finally {
            isRunning = false;
        }
    }
</script>

<Widget callback={runProject}>
    <Play size={16} class={isRunning ? "animate-pulse" : ""} />
    <div class="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-gray-800 shadow-lg rounded p-2 z-50 max-h-96 overflow-auto">
        <div class="flex justify-between items-center mb-2">
            <span class="font-bold">Project Output</span>
            <button 
                on:click|stopPropagation={() => output = ""} 
                class="text-xs p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
                Clear
            </button>
        </div>
        <pre class="text-xs whitespace-pre-wrap">{output}</pre>
    </div>
</Widget>