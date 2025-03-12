<script lang="ts">
    import { onMount } from 'svelte';
    import type { Task } from "$lib";

    let { task }: { task: Task } = $props();

    // Initialize arrays with one empty object
    let objects = $state([]);
    let functions = $state([]);
    let customTools = $state([]);

    onMount(() => {
        // Parse the JSON data and populate the tables
        if (task.method2) {
            const data = task.method2;
            objects = [...data.main.objects, { id: null, name: '', type: '', desc: '' }];
            functions = [...data.main.functions, { id: null, name: '', semantics: '' }];
            customTools = [...data.main.custom, { id: null, name: '' }];
        }
    });

    function addObject() {
        const newId = objects.length ? Math.max(...objects.map(o => o.id || 0)) + 1 : 1;
        objects = [...objects, { id: newId, name: '', type: '', desc: '' }];
    }

    function removeObject(id) {
        objects = objects.filter(o => o.id !== id);
        // Ensure there's always at least one empty row
        if (objects.length === 0) {
            objects = [{ id: null, name: '', type: '', desc: '' }];
        }
    }

    function addFunction() {
        const newId = functions.length ? Math.max(...functions.map(f => f.id || 0)) + 1 : 1;
        functions = [...functions, { id: newId, name: '', semantics: '' }];
    }

    function removeFunction(id) {
        functions = functions.filter(f => f.id !== id);
        // Ensure there's always at least one empty row
        if (functions.length === 0) {
            functions = [{ id: null, name: '', semantics: '' }];
        }
    }

    function addCustomTool() {
        const newId = customTools.length ? Math.max(...customTools.map(c => c.id || 0)) + 1 : 1;
        customTools = [...customTools, { id: newId, name: '' }];
    }

    function removeCustomTool(id) {
        customTools = customTools.filter(c => c.id !== id);
        // Ensure there's always at least one empty row
        if (customTools.length === 0) {
            customTools = [{ id: null, name: '' }];
        }
    }
</script>

<div class="px-3 py-2 flex flex-col">
    <!-- <p>{JSON.stringify(task.method2)}</p> -->
    <div class="self-center">
        <p class="text-lg self-center">Используемые объекты</p>
        <table class="w-full">
            <thead>
                <tr class="border divide-x">
                    <th> </th>
                    <th>Наименование</th>
                    <th> </th>
                    <th>Класс объекта</th>
                    <th> </th>
                    <th>Описание</th>
                    <th> </th>
                </tr>
            </thead>
            <tbody>
                {#each objects as object (object.id)}
                    <tr class="border divide-x">
                        <td class="px-2">Объект</td>
                        <td class="w-1/6"><input bind:value={object.name} class="w-full"></td>
                        <td class="px-2">класса</td>
                        <td class="w-1/6"><input bind:value={object.type} class="w-full"></td>
                        <td class="px-2 text-nowrap">предназначен для</td>
                        <td class="w-full"><input bind:value={object.desc} class="w-full"></td>
                        <td class="px-2 w-fit flex flex-row p-1 gap-1">
                            <button onclick={() => removeObject(object.id)} class="border aspect-square w-8">X</button>
                            <button onclick={addObject} class="border aspect-square w-8">+</button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
        <p class="pt-5 text-lg self-center text-left">Используемые функции</p>
        <table class="w-full">
            <thead>
                <tr class="border divide-x">
                    <th> </th>
                    <th>Наименование</th>
                    <th> </th>
                    <th class="px-2">Описание назначения (для чего)</th>
                    <th> </th>
                </tr>
            </thead>
            <tbody>
                {#each functions as func (func.id)}
                    <tr class="border divide-x">
                        <td class="px-2">Функция</td>
                        <td class="w-1/6"><input bind:value={func.name} class="w-full"></td>
                        <td class="px-2">для</td>
                        <td class="w-full"><input bind:value={func.semantics} class="w-full"></td>
                        <td class="px-2 w-fit flex flex-row p-1 gap-1">
                            <button onclick={() => removeFunction(func.id)} class="border aspect-square w-8">X</button>
                            <button onclick={addFunction} class="border aspect-square w-8">+</button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
        <p class="pt-5 text-lg self-center text-left">Другие инструменты</p>
        <table class="w-full">
            <thead>
                <tr class="border divide-x">
                    <th>Описание</th>
                    <th> </th>
                </tr>
            </thead>
            <tbody>
                {#each customTools as tool (tool.id)}
                    <tr class="border divide-x">
                        <td class="w-full"><input bind:value={tool.name} class="w-full"></td>
                        <td class="px-2 w-fit flex flex-row p-1 gap-1">
                            <button onclick={() => removeCustomTool(tool.id)} class="border aspect-square w-8">X</button>
                            <button onclick={addCustomTool} class="border aspect-square w-8">+</button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>