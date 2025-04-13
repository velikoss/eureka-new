<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount } from "svelte";

    let PdfViewer = $state();

    onMount(async () => {
        if (!browser) return;
        const module = await import("svelte-pdf");
        PdfViewer = module.default;
    });
    let { data } = $props();
</script>
<div class="flex flex-col w-full items-center justify-center ">
    
<p class="pt-2 text-center">В текущий момент временное решение. Лучше скачайте, а не листайте тут</p>
<div class="w-4/5 self-center h-[90vh]">
    <svelte:boundary>
        {#if PdfViewer}
            {@const PDF = PdfViewer}
            <PDF data={atob(data.report_pdf)} showButtons={["navigation", "zoom", "download"]} scale={1.8} />
        {/if}
    </svelte:boundary>
</div>
<p class="pt-2 text-center text-blue-600 underline">(C) <a href="https://github.com/vinodnimbalkar/svelte-pdf">vinodnimbalkar/svelte-pdf</a></p>
</div>