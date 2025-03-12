<script lang="ts">
    let { task } = $props();
</script>

<div class="w-full space-y-4 flex flex-col py-2 px-3">
    {@html task.algo_text}
    {JSON.stringify(task.algo2)}
</div>