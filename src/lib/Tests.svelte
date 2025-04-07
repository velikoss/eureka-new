<script lang="ts">
    import { onMount } from "svelte";
    import type { Task, TaskTest } from "$lib";
    import News from "./News.svelte";
    import { prettyPrintJson } from "pretty-print-json";

    let { task = $bindable(), dark = $bindable(false) }: { task: Task, dark: boolean } = $props();
    let testList: TaskTest[] = $state<TaskTest[]>(task.tests || []);

    onMount(async () => {
        await loadTests();
    }
    );

    async function loadTests(fetchTests: boolean = true) {
        if ((!task.tests || task.tests.length < 1) && fetchTests) {
            let data = await fetch("/api/getTaskTests", {
                method: "POST",
                body: JSON.stringify({
                    id: task.id,
                })
            });
            task.tests = (await data.json()).data as TaskTest[];
        }
    }

</script>

<div class="relative w-full h-full p-8">
    <!-- <News title="В разработке!" content="Потихоньку делаем...." date_add={Date.now()/1000}/> -->
    <!-- <div class="w-full overflow-scroll"><pre>{@html prettyPrintJson.toHtml(task.tests)}</pre></div> -->
    {#each testList as test }
        <div class="w-full flex flex-row">
            <textarea class="flex-1" bind:value={test.test_input_data}></textarea>
            <textarea class="flex-1" bind:value={test.test_output_data}></textarea>
            <textarea class="flex-1" bind:value={test.test_comments}></textarea>
        </div>
    {/each}

</div>