<script lang="ts">
    let {callback, children} = $props();
</script>
<button onclick={callback} class="p-2 bg-gray-200 dark:bg-gray-800 rounded opacity-80 hover:opacity-100 transition">
    {@render children?.()}
</button>
