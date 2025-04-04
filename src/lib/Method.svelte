<script lang="ts">
    // ... existing imports ...
    import type { MethodClass, MethodBase, MethodField, MethodMethod } from "$lib";

    import { onMount } from 'svelte';
    import type { MethodCustom, MethodFunction, MethodObject, Task } from "$lib";
    import { draggable, droppable, type DragDropState } from '@thisux/sveltednd';
    import { Grid, Plus, X } from '@lucide/svelte';
    import { prettyPrintJson } from "pretty-print-json";
    import News from "./News.svelte";

    let { task }: { task: Task } = $props();

    // ... existing state declarations ..
    let objects: MethodObject[] = $state<MethodObject[]>(task.method2 ? task.method2.main.objects : []);
    let functions: MethodFunction[] = $state<MethodFunction[]>(task.method2 ? task.method2.main.functions : []);
    let customTools: MethodCustom[] = $state<MethodCustom[]>(task.method2 ? task.method2.main.custom : []);
    let classes: MethodClass[] = $state<MethodClass[]>(task.method2 ? task.method2.classes : []);

    // ... existing handleDrop function with modifications ...

    function handleDrop(state: DragDropState<any>, targetArray: any[]) {
        const { draggedItem, targetContainer, sourceContainer } = state;
        const dragIndex = targetArray.findIndex((item: any) => item.id === draggedItem.id);
        const dropIndex = parseInt(targetContainer ?? '0');
        // console.log(targetContainer)

        if (dragIndex !== -1) {
            const [item] = targetArray.splice(dragIndex, 1);
            targetArray.splice(dropIndex < dragIndex ? dropIndex : dropIndex - 1 , 0, item);
            targetArray.forEach((e, i) => e.id = i + 1);

            // Handle class sub-arrays
            if (sourceContainer.startsWith('bases-') || 
                sourceContainer.startsWith('fields-') || 
                sourceContainer.startsWith('methods-')) {
                
                const [type, classIndexStr] = sourceContainer.split('-');
                const classIndex = parseInt(classIndexStr);
                const currentClass = classes[classIndex];
                
                switch(type) {
                    case 'bases': currentClass.bases = targetArray; break;
                    case 'fields': currentClass.fields = targetArray; break;
                    case 'methods': currentClass.methods = targetArray; break;
                }
                
                classes = classes;
                task.method2.classes = classes;
            } else {
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

    // Class management
    function addClass() {
        classes.push({
            name: '',
            desc: '',
            bases: [],
            fields: [],
            methods: []
        });
        task.method2.classes = classes;
    }

    function removeClass(index: number) {
        classes.splice(index, 1);
        task.method2.classes = classes;
    }

    // Base management
    function addBase(classIndex: number) {
        const bases = classes[classIndex].bases;
        const newId = bases.length ? Math.max(...bases.map(b => b.id)) + 1 : 1;
        bases.push({ id: newId, is_virtual: false, name: '', mod: 'public' });
        classes = classes;
    }

    function removeBase(classIndex: number, id: number) {
        let bases = classes[classIndex].bases;
        bases = bases.filter(b => b.id !== id);
        if (bases.length === 0) bases.push({ id: 0, is_virtual: false, name: '', mod: 'public' });
        classes = classes;
    }

    // Field management (similar for methods)
    function addField(classIndex: number) {
        const fields = classes[classIndex].fields;
        const newId = fields.length ? Math.max(...fields.map(f => f.id)) + 1 : 1;
        fields.push({ id: newId, semantics: '', name: '', type: '', mod: 'private' });
        classes = classes;
    }

    function removeField(classIndex: number, id: number) {
        let fields = classes[classIndex].fields;
        fields = fields.filter(f => f.id !== id);
        if (fields.length === 0) fields.push({ id: 0, semantics: '', name: '', type: '', mod: 'private' });
        classes = classes;
    }

    // Method management
    function addMethod(classIndex: number) {
        const methods = classes[classIndex].methods;
        const newId = methods.length ? Math.max(...methods.map(m => m.id)) + 1 : 1;
        methods.push({ id: newId, semantics: '', name: '' });
        classes = classes;
    }

    function removeMethod(classIndex: number, id: number) {
        let methods = classes[classIndex].methods;
        methods = methods.filter(m => m.id !== id);
        if (methods.length === 0) methods.push({ id: 0, semantics: '', name: '' });
        classes = classes;
    }
 </script>

<!-- <div class="flex flex-row">
    <div class="w-64 overflow-scroll"><pre>{@html prettyPrintJson.toHtml(task.method2)}</pre></div> -->
<div class="px-3 py-2 flex flex-col w-full">
    <!-- ... existing sections ... -->
    <!-- Objects Section -->
    <p class="text-lg self-center">Используемые объекты</p>
    <div use:droppable={{ container: 'objects', callbacks: { onDrop: (state) => handleDrop(state, objects) } }} class="border rounded-lg">
        {#if objects.length === 0}
            <button onclick={addObject} class="w-full border border-dashed hover:motion-scale-out-105 not-hover:motion-scale-in-105 rounded-lg shadow-sm text-gray-500 text-center">
                Нажмите, чтобы добавить.
            </button>
        {:else}
            {#each objects as object (object.id)}
                {@const handle = { handleElem: null as HTMLButtonElement | null }}
                <div use:draggable={{ container: 'functions', dragData: object, interactive: [".interactive"]}} class={`p-3 w-full ${object.id == objects.length ? "" : "border-b"} shadow-sm motion-preset-blur-down-sm flex flex-row`}>                        
                    <div class="flex flex-row w-full gap-2">
                        <input bind:value={object.name} class="w-full rounded-md" placeholder="Наименование">
                        <input bind:value={object.type} class="w-full rounded-md" placeholder="Класс объекта">
                        <input bind:value={object.desc} class="w-full rounded-md" placeholder="Описание">
                        <div class="flex flex-row gap-2">
                            <button onclick={() => removeObject(object.id)} class="border rounded-md aspect-square h-full flex items-center justify-center">
                                <X size={16} class="text-red-500" /> <!-- Remove icon -->
                            </button>
                            <button onclick={addObject} class="border rounded-md aspect-square h-full flex items-center justify-center">
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
        <div use:droppable={{ container: 'functions', callbacks: { onDrop: (state) => handleDrop(state, functions) }}} class="border rounded-lg">
        {#if functions.length === 0}
            <button onclick={addFunction} class="w-full border border-dashed hover:motion-scale-out-105 not-hover:motion-scale-in-105 rounded-lg shadow-sm text-gray-500 text-center">
                Нажмите, чтобы добавить.
            </button>
        {:else}
            {#each functions as func (func.id)}
                {@const handle = { handleElem: null as HTMLButtonElement | null }}
                <div use:draggable={{ container: 'functions', dragData: func, interactive: [".interactive"]}} class="p-3 w-full {func.id == functions.length ? "" : "border-b"} shadow-sm motion-preset-blur-down-sm flex flex-row">
                    <div class="flex flex-row w-full gap-2">
                        <input bind:value={func.name} class="w-full rounded-md" placeholder="Наименование">
                        <input bind:value={func.semantics} class="w-full rounded-md" placeholder="Описание назначения">
                        <div class="flex flex-row gap-2">
                            <button onclick={() => removeFunction(func.id)} class="border interactive rounded-md aspect-square h-full flex items-center justify-center">
                                <X size={16} class="text-red-500" /> <!-- Remove icon -->
                            </button>
                            <button onclick={addFunction} class="border interactive rounded-md aspect-square h-full flex items-center justify-center">
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
    <div use:droppable={{ container: 'customTools', callbacks: { onDrop: (state) => handleDrop(state, customTools) } }} class="border rounded-lg">
        {#if customTools.length === 0}
            <button onclick={addCustomTool} class="w-full border border-dashed hover:motion-scale-out-105 not-hover:motion-scale-in-105 rounded-lg shadow-sm text-gray-500 text-center">
                Нажмите, чтобы добавить.
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
                    class="p-3 w-full {tool.id == customTools.length ? "" : "border-b"} shadow-sm motion-preset-blur-down-sm flex flex-row"
                >
                    <div class="flex flex-row w-full gap-2">
                        <input bind:value={tool.name} class="w-full rounded-md" placeholder="Описание">
                        <div class="flex flex-row gap-2">
                            <button onclick={() => removeCustomTool(tool.id)} class="border interactive rounded-md aspect-square h-full flex items-center justify-center">
                                <X size={16} class="text-red-500" />
                            </button>
                            <button onclick={addCustomTool} class="border interactive rounded-md aspect-square h-full flex items-center justify-center">
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
    <!-- Classes Section -->
    <p class="pt-5 text-lg self-center">Классы</p>
    <div class="self-center flex flex-col gap-4 w-full">
        {#each classes as clazz, classIndex}
            <div class="border rounded-lg p-4 space-y-4 pointer-events-auto">
                <div class="flex gap-2 items-center">
                    <input bind:value={clazz.name} placeholder="Название класса" class="w-full rounded-md" />
                    <input bind:value={clazz.desc} placeholder="Описание класса" class="w-full rounded-md" />
                    <button onclick={() => removeClass(classIndex)} class="border rounded-md p-2 aspect-square h-full">
                        <X size={16} class="text-red-500" />
                    </button>
                </div>

                <!-- Bases -->
                <div>
                    <p class="font-medium">Базовые классы</p>
                    <div use:droppable={{ container: `bases-${classIndex}`, callbacks: { onDrop: (state) => handleDrop(state, clazz.bases) }}} class="space-y-2">
                        {#each clazz.bases as base (base.id)}
                            {@const handle = { handleElem: null as HTMLButtonElement | null }}
                            <div use:draggable={{ container: `bases-${classIndex}`, dragData: base, interactive: [".interactive"]}} class="flex gap-2 items-center">
                                <label class="flex items-center gap-1">
                                    <input type="checkbox" bind:checked={base.is_virtual} class="rounded" />
                                    Virtual
                                </label>
                                <input bind:value={base.name} placeholder="Название" class="rounded-md flex-1" />
                                <select bind:value={base.mod} class="rounded-md">
                                    <option value="public">public</option>
                                    <option value="protected">protected</option>
                                    <option value="private">private</option>
                                </select>
                                <button onclick={() => removeBase(classIndex, base.id)} class="interactive aspect-square">
                                    <X size={16} class="text-red-500" />
                                </button>
                                <button bind:this={handle.handleElem} class="cursor-move">
                                    <Grid />
                                </button>
                            </div>
                        {/each}
                        <button onclick={() => addBase(classIndex)} class="w-full border border-dashed rounded-lg p-2">
                            <Plus size={16} class="text-green-500 mx-auto" />
                        </button>
                    </div>
                </div>

                <!-- Fields -->
                <div>
                    <p class="font-medium">Поля</p>
                    <div use:droppable={{ container: `fields-${classIndex}`, callbacks: { onDrop: (state) => handleDrop(state, clazz.fields) }}} class="space-y-2">
                        {#each clazz.fields as field (field.id)}
                            {@const handle = { handleElem: null as HTMLButtonElement | null }}
                            <div use:draggable={{ container: `fields-${classIndex}`, dragData: field, interactive: [".interactive"]}} class="flex gap-2 items-center">
                                <input bind:value={field.semantics} placeholder="Семантика" class="rounded-md flex-1" />
                                <input bind:value={field.name} placeholder="Имя" class="rounded-md flex-1" />
                                <input bind:value={field.type} placeholder="Тип" class="rounded-md flex-1" />
                                <select bind:value={field.mod} class="rounded-md">
                                    <option value="public">public</option>
                                    <option value="protected">protected</option>
                                    <option value="private">private</option>
                                </select>
                                <button onclick={() => removeField(classIndex, field.id)} class="interactive aspect-square">
                                    <X size={16} class="text-red-500" />
                                </button>
                                <button bind:this={handle.handleElem} class="cursor-move">
                                    <Grid />
                                </button>
                            </div>
                        {/each}
                        <button onclick={() => addField(classIndex)} class="w-full border border-dashed rounded-lg p-2">
                            <Plus size={16} class="text-green-500 mx-auto" />
                        </button>
                    </div>
                </div>

                <!-- Methods -->
                <div>
                    <p class="font-medium">Методы</p>
                    <div use:droppable={{ container: `methods-${classIndex}`, callbacks: { onDrop: (state) => handleDrop(state, clazz.methods) }}} class="space-y-2">
                        {#each clazz.methods as method (method.id)}
                            {@const handle = { handleElem: null as HTMLButtonElement | null }}
                            <div use:draggable={{ container: `methods-${classIndex}`, dragData: method, interactive: [".interactive"]}} class="flex gap-2 items-center">
                                <input bind:value={method.semantics} placeholder="Семантика" class="rounded-md flex-1" />
                                <input bind:value={method.name} placeholder="Имя" class="rounded-md flex-1" />
                                <button onclick={() => removeMethod(classIndex, method.id)} class="interactive">
                                    <X size={16} class="text-red-500" />
                                </button>
                                <button bind:this={handle.handleElem} class="cursor-move">
                                    <Grid />
                                </button>
                            </div>
                        {/each}
                        <button onclick={() => addMethod(classIndex)} class="w-full border border-dashed rounded-lg p-2">
                            <Plus size={16} class="text-green-500 mx-auto" />
                        </button>
                    </div>
                </div>
            </div>
        {/each}
        <button onclick={addClass} class="w-full border border-dashed rounded-lg p-2">
            Добавить класс
        </button>
    </div>
</div>
<!-- </div> -->

<style>
    @reference "../app.css";

    input {
        @apply dark:bg-black;
    }

    select {
        @apply dark:bg-black;
    }
</style>