<script lang="ts">
    import { goto } from '$app/navigation';
    import News from '$lib/News.svelte';
    import Unit from '$lib/Unit.svelte';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { LogOut } from '@lucide/svelte';

    let { data } = $props();
    let st = $state(1);

    onMount(() => {
        setInterval(async () => {
            st = (parseInt(await (await fetch("/api/readyState")).text()??0));
            data.locals.user.st = st;
            if (st !== 1) {
                goto("/app/login?renewToken=true");
            }
        }, 3000);
    });
</script>


<main class="flex flex-col items-center">
    <header class="h-[5.6vh] w-screen px-[calc(10vw)] border-b flex flex-row items-center justify-between">
        <strong class="text-xl ml-3">Eureka<sup>beta</sup></strong>
        <div class="flex flex-row gap-1 items-center">{data.locals.user.student_suname} {data.locals.user.student_name.substring(0,1)}.{data.locals.user.student_patronymic.substring(0,1)}. ({data.locals.user.group_name}) <span class="text-xs"></span> <a href="/app/login?renewToken=true"><LogOut size={18} /></a></div>
    </header>
    <div class="max-w-4/5 min-w-[600px] flex flex-row p-2 gap-4">
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
        <div class="w-1/2 flex flex-col">
            {#each data.news as news}
                <News title={news.title} content={news.content} date_add={news.date_add}></News>
            {/each}
        </div>
    </div>
</main>