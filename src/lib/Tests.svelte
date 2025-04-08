<script lang="ts">
    import { onMount } from "svelte";
    import type { Task, TaskTest } from "$lib";
    import News from "./News.svelte";
    import { prettyPrintJson } from "pretty-print-json";
    import { Trash } from "@lucide/svelte";

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
            testList = task.tests;
        }
    }

</script>

<div class="relative w-full h-full p-8">
    <!-- <News title="В разработке!" content="Потихоньку делаем...." date_add={Date.now()/1000}/> -->
    <!-- <div class="w-full overflow-scroll"><pre>{@html prettyPrintJson.toHtml(task.tests)}</pre></div> -->
    <div class="w-full flex flex-row gap-1">
        <div class="flex-1 text-center">Входные данные</div>
        <div class="flex-1 text-center">Выходные данные</div>
        <div class="flex-1 text-center">Комментарии</div>
        <div class="w-4"></div>
    </div>
    {#each testList as test}
        <div class="w-full flex flex-row gap-1 my-2 rounded-lg border p-5 shadow-sm">
            <textarea class="flex-1" bind:value={test.test_input_data}></textarea>
            <textarea class="flex-1" bind:value={test.test_output_data}></textarea>
            <textarea class="flex-1" bind:value={test.test_comments}></textarea>
            <button class="w-4"><Trash size={24}/></button>
        </div>
    {/each}

</div>