<script lang="ts">
    import Unit from '$lib/Unit.svelte';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    let { data } = $props();
    let st = $state(1);
    onMount(() => {
        setInterval(async () => {
            st = (parseInt(await (await fetch("/api/readyState")).text()));
            if (st !== 1) {
                goto("/app/login");
            }
        }, 3000);
    });
</script>

<div class="w-screen flex flex-row p-2">
    <div class="w-1/2 flex flex-col">
        {#each data.units as unit }
            <Unit section={unit}>
                <!-- Display tasks for the main unit -->
                {#each unit.tasks as task }
                    <div class="pl-4 border-l border-black">
                        <p class="text-sm">* {task.name}</p>
                        <p class="text-sm">Status: {task.status}</p>
                        <p class="text-sm">Score: {task.score ?? 'N/A'}</p>
                    </div>
                {/each}

                {#each unit.nested as nested}
                    <div class="pl-4 border-l border-black">
                        <p class="text-sm">* {nested.section_name}</p>
                    </div>
                {/each}
            </Unit>
        {/each}
    </div>
</div>