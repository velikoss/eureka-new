<script lang="ts">
    import { onMount } from "svelte";
    import type { Task } from "$lib";
    import News from "./News.svelte";

    let { task = $bindable(), dark = $bindable(false) }: { task: Task, dark: boolean } = $props();
</script>

<div class="relative w-full h-full p-8">
    <News title="В разработке!" content="Потихоньку делаем...." date_add={Date.now()/1000}/>
</div>