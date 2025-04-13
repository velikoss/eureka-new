<script lang="ts">
    import { getContext, onMount } from "svelte";
    import type { Task } from "$lib";
    import News from "./News.svelte";
    import { browser } from "$app/environment";

    let { task = $bindable(), dark = $bindable(false) }: { task: Task, dark: boolean } = $props();

    let toasts;

    onMount(() => {
        toasts = getContext('toast').toasts;
    })

    async function genReport() {
        if (!browser) return;
        const taskJSON = await fetch("/api/genTaskReport", {
            method: "POST",
            body: JSON.stringify({
                id: task.id
            })
        })
        const json = await taskJSON.json();
        const report_pdf = json.data;
        if (report_pdf) {
            var URL = window.URL || window.webkitURL,
                byteChars = atob(report_pdf),
                bytes = [],
                i = 0;

            for (; i < byteChars.length; i++)
                bytes[i] = byteChars.charCodeAt(i);
            var blob = new Blob([new Uint8Array(bytes)], {type: 'application/pdf'});
            var downloadUrl = URL.createObjectURL(blob);
            var newWindow = window.open(downloadUrl, '_blank', 'menubar=yes,scrollbars=yes,status=yes,resizable=yes');
            newWindow?.focus();
            URL.revokeObjectURL(downloadUrl);
        } else {
            console.log("Ошибка API Авроры")
            toasts.show("Ошибка API Авроры", json.error, 'error');
        }
    }
</script>

<div class="p-5 flex flex-col gap-2">
    <p>В разработке. Всё может поломаться</p>
    <button class="border p-2 rounded-md shadow w-fit" onclick={genReport}>
        Сгенерировать отчёт
    </button>
</div>