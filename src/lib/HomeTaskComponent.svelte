<script lang="ts">
    import { browser } from '$app/environment';
    import { _taskStatusNames, taskStatusColors, type HomeTask } from '$lib';
    import { FileText, Flame, Sticker, StickyNote } from "@lucide/svelte";
    import { onMount } from 'svelte';

    let {task, index, disabled}: {task: HomeTask, index: any, disabled: boolean | false} = $props();

    onMount(() => {
    })

    // Helper function to format the task status
    const formatStatus = (status: number) => {
        return _taskStatusNames[status];
    };

    // Helper function to get the appropriate colors for the task status
    const getTaskColors = (status: number) => {
        return taskStatusColors[status] || 'bg-white dark:bg-black text-black dark:text-white';
    };

    function cutStringToStartWithCyrillic(str: string) {
        const match = str.match(/[А-Яа-яЁёA-Za-z]/);
        if (match) {
            const index = match.index; // Get the index of the first Cyrillic letter
            return str.substring(index); // Return the substring starting from that index
        }
        return str; // If no Cyrillic letter is found, return the original string
    }

    function parseName(name: string): string {
        // Extract the number part (e.g., "2_1_3") using a regular expression
        const numberMatch = name.match(/\d+_\d+_\d+/);
        if (!numberMatch) {
            return name; // Return the original name if no number is found
        }

        const numberPart = numberMatch[0];
        // Replace underscores with dots and prepend '№'
        const formattedNumber = `${numberPart.replace(/_/g, '.')}`;

        // Replace the original number part with the formatted number
        let formattedName = name.replace(numberPart, formattedNumber + "</b><br/>");
        let second = formattedName.split("<br/>")[1];
        formattedName = formattedName.replace(second, cutStringToStartWithCyrillic(second));

        // Return the formatted name as an HTML string
        return `<span><b>${formattedName}</span>`;
    }

    async function getReport() {
        if (!browser) return;
        const taskJSON = await fetch("/api/getTaskReport", {
            method: "POST",
            body: JSON.stringify({
                id: task.id
            })
        })
        const json = await taskJSON.json();
        const report_pdf = json.data.report_pdf;
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
        }
    }
</script>

<a href={task.status % 4 == 0 || disabled ? "javascript: void(0)" : `/app/task/${task.id}`} onclick={disabled || task.status !== 4 ? () => {} : getReport}>
    <div
        class="border border-black dark:border-gray-200 task rounded-lg py-2.5 px-4 mb-2 shadow-sm drop-shadow-sm hover:drop-shadow-lg transition
               {getTaskColors(task.status)}"
    >
        <!-- Task Header -->
        <div class="flex justify-between items-center">
            <div class="flex flex-row gap-4 items-center text-left w-7/10">
                <div class="w-[18px]">
                    {#if task.status === 4}
                        <Sticker size={18}/>
                    {:else if task.status === 8}
                        <Flame size={18}/>
                    {:else}
                        <StickyNote size={18}/>
                    {/if}
                </div>
                <h2 class="text-lg font-bold leading-tight first-line:leading-normal">{@html parseName(task.name)}</h2>
            </div>
            <p class="text-sm text-right">Статус: {formatStatus(task.status)}</p>
        </div>
    </div>
</a>
