<script lang="ts">
    import { page } from '$app/state';
    import { onMount } from 'svelte';
    
</script>

<div class="task flex flex-row gap-1 divide-black divide-solid divide-x -mt-1">
    {JSON.stringify(page.data.task)}
</div>