<script lang="ts">
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
    })
</script>
<p>{st}</p>
{JSON.stringify(data.client?.user)}