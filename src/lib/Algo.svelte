<script lang="ts">
    import News from "./News.svelte";

    let { task = $bindable() } = $props();
</script>

<div class="w-full space-y-4 flex flex-col py-2 px-3">
    {@html task.algo_text}
</div>
