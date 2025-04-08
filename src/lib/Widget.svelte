<script lang="ts">
    let {callback, children} = $props();
</script>
<button onclick={callback} class="w-12 h-12 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded opacity-90 backdrop-blur-sm hover:opacity-100 transition">
    {@render children?.()}
</button>
