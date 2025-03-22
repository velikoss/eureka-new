<script lang="ts">
    import { droppable, draggable, type DragDropState } from "@thisux/sveltednd";
    import { Plus, X, Grid, Trash } from '@lucide/svelte';
    import type { Algo, Algo2, Task } from "$lib";

    let { task }: { task: Task } = $props();
    let algo2List: Algo2[] = $state<Algo2[]>(task.algo2 || []);

    // Handle dropping items in the algo list
    function handleDrop(state: DragDropState<any>, targetArray: Algo[], algo2Index: number) {
        const { draggedItem, targetContainer } = state;
        const dragIndex = targetArray.findIndex((item) => item.id === draggedItem.id);
        const dropIndex = parseInt(targetContainer ?? '0');

        if (dragIndex !== -1) {
            const [item] = targetArray.splice(dragIndex, 1);
            targetArray.splice(dropIndex < dragIndex ? dropIndex : dropIndex - 1, 0, item);
            targetArray.forEach((e, i) => e.no = i + 1); // Update the `no` property
            algo2List[algo2Index].algo = targetArray; // Update the specific Algo2's algo array
        }
    }

    // Add a new Algo2 item
    function addAlgo2() {
        algo2List.push({
            kind: '',
            class: '',
            access: '',
            name: '',
            params: '',
            ret: '',
            func: '',
            algo: []
        });
        task.algo2 = algo2List; // Update the task object
    }

    // Remove an Algo2 item by index
    function removeAlgo2(index: number) {
        algo2List.splice(index, 1);
        task.algo2 = algo2List; // Update the task object
    }

    // Add a new Algo item to a specific Algo2
    function addAlgo(algo2Index: number) {
        const algos = algo2List[algo2Index].algo;
        const newId = algos.length ? Math.max(...algos.map(a => a.id)) + 1 : 1;
        algos.push({
            id: newId,
            no: newId,
            predicate: '',
            actions: '',
            next: '',
            comment: ''
        });
        algo2List[algo2Index].algo = algos; // Update the specific Algo2's algo array
    }

    // Remove an Algo item by ID from a specific Algo2
    function removeAlgo(algo2Index: number, id: number) {
        let algos = algo2List[algo2Index].algo;
        algos = algos.filter((a) => a.id !== id);
        algo2List[algo2Index].algo = algos; // Update the specific Algo2's algo array
    }
</script>

<div class="w-full space-y-4 flex flex-col py-2 px-3">
    <!-- Algo2 Section -->
    <p class="text-lg self-center">Алгоритм</p>
    <div class="self-center flex flex-col gap-4 w-full">
        {#each algo2List as algo2, algo2Index}
            <div class="border rounded-lg p-4 space-y-4 pointer-events-auto flex flex-col md:flex-row">
                <!-- Algo2 Header -->
                <div class="flex flex-row w-full md:w-128 gap-2 mr-2">
                    <button onclick={() => removeAlgo2(algo2Index)} class="border rounded-md p-2 w-8 h-8">
                        <Trash size={16} class="self-center" />
                    </button>
                    <div class="flex flex-col gap-2 items-center w-full">
                        <input bind:value={algo2.kind} placeholder="Kind" class="w-full rounded-md" />
                        <input bind:value={algo2.class} placeholder="Class" class="w-full rounded-md" />
                        <input bind:value={algo2.access} placeholder="Access" class="w-full rounded-md" />
                        <input bind:value={algo2.name} placeholder="Name" class="w-full rounded-md" />
                        <input bind:value={algo2.params} placeholder="Params" class="w-full rounded-md" />
                        <input bind:value={algo2.ret} placeholder="Return" class="w-full rounded-md" />
                        <input bind:value={algo2.func} placeholder="Function" class="w-full rounded-md" />
                    </div>
                </div>

                <!-- Algo List -->
                <div class="w-full flex flex-col">
                    <p class="font-medium">Шаги решения</p>
                    <div use:droppable={{ container: `algos-${algo2Index}`, callbacks: { onDrop: (state) => handleDrop(state, algo2.algo, algo2Index) }}} class="space-y-2 w-full">
                        {#each algo2.algo as algo (algo.id)}
                            {@const handle = { handleElem: null as HTMLButtonElement | null }}
                            <div use:draggable={{ container: `algos-${algo2Index}`, dragData: algo, interactive: [".interactive"]}} class="flex flex-col md:flex-row gap-2 items-center w-full rounded-md border p-2 md:p-0 md:border-0">
                                <p class="w-fit p-1">{algo.no}</p>
                                <input bind:value={algo.predicate} placeholder="Predicate" class="rounded-md w-full md:flex-1 interactive" />
                                <input bind:value={algo.actions} placeholder="Actions" class="rounded-md w-full md:flex-1 interactive" />
                                <input bind:value={algo.next} placeholder="Next Step" class="rounded-md w-full md:flex-1 interactive" />
                                <input bind:value={algo.comment} placeholder="Comment" class="rounded-md w-full md:flex-1 interactive" />
                                <button onclick={() => removeAlgo(algo2Index, algo.id)} class="interactive aspect-square">
                                    <X size={16} class="text-red-500" />
                                </button>
                                <button bind:this={handle.handleElem} class="cursor-move">
                                    <Grid />
                                </button>
                            </div>
                        {/each}
                        <button onclick={() => addAlgo(algo2Index)} class="w-full border border-dashed rounded-lg p-2">
                            <Plus size={16} class="text-green-500 mx-auto" />
                        </button>
                    </div>
                </div>
            </div>
        {/each}
        <button onclick={addAlgo2} class="w-full border border-dashed rounded-lg p-2">
            Add Algo2
        </button>
    </div>
</div>

<style>
    @reference "../app.css";

    input {
        @apply dark:bg-black;
    }

    select {
        @apply dark:bg-black;
    }
</style>