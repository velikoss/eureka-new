<script lang="ts">
    import { onMount } from 'svelte';
    
    import { CheckCircle, AlertTriangle, X, Info } from '@lucide/svelte';
    type ToastType = 'info' | 'success' | 'warning' | 'error';
    
    interface Toast {
        id: number;
        title: string;
        message: string;
        type: ToastType;
        timeout: any;
    }

    let toasts: Toast[] = [];
    let nextId = 0;

    onMount(() => {
        return () => {
            toasts.forEach(toast => clearTimeout(toast.timeout));
        };
    });

    export function show(
        title: string,
        message: string,
        type: ToastType = 'info',
        duration: number = 4000
    ) {
        const id = nextId++;
        const timeout = setTimeout(() => dismiss(id), duration);

        toasts = [...toasts, {
            id,
            title,
            message,
            type,
            timeout
        }];
    }

    function dismiss(id: number) {
        toasts = toasts.filter(t => t.id !== id);
    }
</script>

<div style="zoom: 90%;" class="fixed bottom-0 left-0 flex flex-col-reverse w-md items-start p-4 space-y-2 space-y-reverse z-50">
    {#each toasts as toast (toast.id)}
        <div
            class="pointer-events-auto w-full motion-preset-blur-right-sm"
        >
            <div class="rounded-lg shadow-lg bg-white dark:bg-gray-800 border
                {{
                    'border-blue-500': toast.type === 'info',
                    'border-green-500': toast.type === 'success',
                    'border-yellow-500': toast.type === 'warning',
                    'border-red-500': toast.type === 'error'
                }}"
            >
                <div class="p-4">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            {#if toast.type === 'info'}
                                <Info size={20} class=" text-blue-500" />
                            {:else if toast.type === 'success'}
                                <CheckCircle size={20} class=" text-green-500" />
                            {:else if toast.type === 'warning'}
                                <AlertTriangle size={20} class=" text-yellow-500" />
                            {:else if toast.type === 'error'}
                                <AlertTriangle size={20} class=" text-red-500" />
                            {/if}
                        </div>
                        <div class="ml-3 w-0 flex-1">
                            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {toast.title}
                            </p>
                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {toast.message}
                            </p>
                        </div>
                        <div class="ml-4 flex-shrink-0 flex">
                            <button
                                on:click={() => dismiss(toast.id)}
                                class="inline-flex text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/each}
</div>