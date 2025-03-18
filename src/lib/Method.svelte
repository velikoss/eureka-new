<script lang="ts">
    import { onMount } from 'svelte';
    import type { MethodCustom, MethodFunction, MethodObject, Task } from "$lib";
    import { draggable, droppable, type DragDropState } from '@thisux/sveltednd';
    import { Grid, Plus, X } from '@lucide/svelte';

    let { task }: { task: Task } = $props();

    // Initialize arrays with one empty object
    let objects: MethodObject[] = $state<MethodObject[]>(task.method2 ? task.method2.main.objects : []);
    let functions: MethodFunction[] = $state<MethodFunction[]>(task.method2 ? task.method2.main.functions : []);
    let customTools: MethodCustom[] = $state<MethodCustom[]>(task.method2 ? task.method2.main.custom : []);

    function handleDrop(state: DragDropState<any>, targetArray: any[]) {
        const { draggedItem, targetContainer } = state;
        const dragIndex = targetArray.findIndex((item: any) => item.id === draggedItem.id);
        const dropIndex = parseInt(targetContainer ?? '0');

        if (dragIndex !== -1) {
            const [item] = targetArray.splice(dragIndex, 1);
            targetArray.splice(dropIndex, 0, item);
            switch (state.sourceContainer) {
                case "objects":
                    objects = targetArray;
                    task.method2.main.objects = objects;
                    break;
                case "fucntions":
                    functions = targetArray;
                    task.method2.main.functions = functions;
                    break;
                case "customTools":
                    customTools = targetArray;
                    task.method2.main.custom = customTools;
                    break;
            }
        }
    }

    function addObject() {
        const newId = objects.length ? Math.max(...objects.map(o => o.id || 0)) + 1 : 1;
        objects.push({ id: newId, name: '', type: '', desc: '' });
    }

    function removeObject(id: number) {
        objects = objects.filter(o => o.id !== id);
        task.method2.main.objects = objects;
        if (objects.length === 0) {
            objects = [{ id: 0, name: '', type: '', desc: '' }];
        }
    }

    function addFunction() {
        const newId = functions.length ? Math.max(...functions.map(f => f.id || 0)) + 1 : 1;
        functions.push({ id: newId, name: '', semantics: '' });
    }

    function removeFunction(id: number) {
        functions = functions.filter(f => f.id !== id);
        task.method2.main.functions = functions;
        if (functions.length === 0) {
            functions = [{ id: 0, name: '', semantics: '' }];
        }
    }

    function addCustomTool() {
        const newId = customTools.length ? Math.max(...customTools.map(c => c.id || 0)) + 1 : 1;
        customTools.push({ id: newId, name: '' });
    }

    function removeCustomTool(id: number) {
        customTools = customTools.filter(c => c.id !== id);
        task.method2.main.custom = customTools;
        if (customTools.length === 0) {
            customTools = [{ id: 0, name: '' }];
        }
    }
</script>

<div class="px-3 py-2 flex flex-col">
    <p>{JSON.stringify(task.method2)}</p>
    <div class="self-center flex flex-col">
        <!-- Objects Section -->
        <p class="text-lg self-center">Используемые объекты</p>
        <div use:droppable={{ container: 'objects', callbacks: { onDrop: (state) => handleDrop(state, objects) } }}>
            {#if objects.length === 0}
                <button onclick={addObject} class="w-full mb-3 p-3 border border-dashed hover:motion-scale-out-105 not-hover:motion-scale-in-105 rounded-lg shadow-sm text-gray-500 text-center">
                    Нет объектов. Нажмите, чтобы добавить.
                </button>
            {:else}
                {#each objects as object (object.id)}
                    {@const handle = { handleElem: null as HTMLButtonElement | null }}
                    <div use:draggable={{ container: 'functions', dragData: object, interactive: [".interactive"]}} class="mb-3 p-3 w-full border rounded-lg shadow-sm motion-preset-blur-down-sm flex flex-row">                        <div class="flex flex-row w-full gap-2">
                            <input bind:value={object.name} class="w-full rounded-md" placeholder="Наименование">
                            <input bind:value={object.type} class="w-full rounded-md" placeholder="Класс объекта">
                            <input bind:value={object.desc} class="w-full rounded-md" placeholder="Описание">
                            <div class="flex flex-row gap-2">
                                <button onclick={() => removeObject(object.id)} class="border aspect-square h-full flex items-center justify-center">
                                    <X size={16} class="text-red-500" /> <!-- Remove icon -->
                                </button>
                                <button onclick={addObject} class="border aspect-square h-full flex items-center justify-center">
                                    <Plus size={16} class="text-green-500" /> <!-- Add icon -->
                                </button>
                                <button bind:this={handle.handleElem} class="cursor-move">
                                    <Grid />
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>

        <!-- Functions Section -->
        <p class="pt-5 text-lg self-center text-left">Используемые функции</p>
            <div use:droppable={{ container: 'functions', callbacks: { onDrop: (state) => handleDrop(state, functions) }}}>
            {#if functions.length === 0}
                <button onclick={addFunction} class="w-full mb-3 p-3 border border-dashed hover:motion-scale-out-105 not-hover:motion-scale-in-105 rounded-lg shadow-sm text-gray-500 text-center">
                    Нет функций. Нажмите, чтобы добавить.
                </button>
            {:else}
                {#each functions as func (func.id)}
                    {@const handle = { handleElem: null as HTMLButtonElement | null }}
                    <div use:draggable={{ container: 'functions', dragData: func, interactive: [".interactive"]}} class="mb-3 p-3 w-full border rounded-lg shadow-sm motion-preset-blur-down-sm flex flex-row">
                        <div class="flex flex-row w-full gap-2">
                            <input bind:value={func.name} class="w-full rounded-md" placeholder="Наименование">
                            <input bind:value={func.semantics} class="w-full rounded-md" placeholder="Описание назначения">
                            <div class="flex flex-row gap-2">
                                <button onclick={() => removeFunction(func.id)} class="border interactive aspect-square h-full flex items-center justify-center">
                                    <X size={16} class="text-red-500" /> <!-- Remove icon -->
                                </button>
                                <button onclick={addFunction} class="border interactive aspect-square h-full flex items-center justify-center">
                                    <Plus size={16} class="text-green-500" /> <!-- Add icon -->
                                </button>
                                <button bind:this={handle.handleElem} class="cursor-move">
                                    <Grid />
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>

        <!-- Custom Tools Section -->
        <p class="pt-5 text-lg self-center text-left">Другие инструменты</p>
        <div use:droppable={{ container: 'customTools', callbacks: { onDrop: (state) => handleDrop(state, customTools) } }}>
            {#if customTools.length === 0}
                <button onclick={addCustomTool} class="w-full mb-3 p-3 border border-dashed hover:motion-scale-out-105 not-hover:motion-scale-in-105 rounded-lg shadow-sm text-gray-500 text-center">
                    Нет инструментов. Нажмите, чтобы добавить.
                </button>
            {:else}
                {#each customTools as tool}
                    <!-- Use @const with a block to create a scoped variable -->
                    {@const handle = { handleElem: null as HTMLButtonElement | null }}
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div 
                        use:draggable={{ 
                            container: 'customTools', 
                            dragData: tool,
                            interactive: [".interactive"]
                        }}
                        ondragstart={(e) => {
                            // Prevent dragging unless the handle is clicked
                            if (!document.elementsFromPoint(e.clientX, e.clientY).includes(handleElem)) {
                                e.preventDefault();
                            }
                        }}
                        class="mb-3 p-3 w-full border rounded-lg shadow-sm motion-preset-blur-down-sm flex flex-row"
                    >
                        <div class="flex flex-row w-full gap-2">
                            <input bind:value={tool.name} class="w-full rounded-md" placeholder="Описание">
                            <div class="flex flex-row gap-2">
                                <button onclick={() => removeCustomTool(tool.id)} class="border interactive aspect-square h-full flex items-center justify-center">
                                    <X size={16} class="text-red-500" />
                                </button>
                                <button onclick={addCustomTool} class="border interactive aspect-square h-full flex items-center justify-center">
                                    <Plus size={16} class="text-green-500" />
                                </button>
                                <!-- Bind the handle element to the scoped variable -->
                                <button bind:this={handle.handleElem} class="cursor-move">
                                    <Grid />
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
</div>

<style>
    :global(.dragging) {
        opacity: 0.5;
    }
</style>