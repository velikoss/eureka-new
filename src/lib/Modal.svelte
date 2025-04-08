<script lang="ts">
    // Modal.svelte
    let {show, title, message, onClose} : {show: boolean | false, title: string | "Message", message: string | "", onClose: () => void} = $props();

    function handleBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }
</script>

{#if show}
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
    class="motion-preset-fade-sm fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50 p-4" 
    onclick={handleBackdropClick}
>
    <div 
        class="bg-white border dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
    >
        <h2 class="text-xl font-bold mb-2">{title}</h2>
        <p class="mb-4">{@html message}</p>
        
        <div class="flex justify-end">
            <button
                onclick={onClose}
                class="px-4 py-2 border rounded hover:bg-neutral-200 transition"
            >
                OK
            </button>
        </div>
    </div>
</div>
{/if}