<script lang="ts">
    let { task } = $props();
</script>

<div class="w-full space-y-4 flex flex-col py-2 px-3">
    {@html task.theory_text}
    {@html task.task_text}

    <div class="w-fit border self-center">
        <table class="min-w-fit max-w-full bg-white dark:bg-black border border-black dark:border-gray-200 border-collapse shadow-sm rounded-lg overflow-hidden">
            <thead class="bg-gray-50 dark:bg-gray-950 border border-black dark:border-gray-200">
                <tr>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Стандартный ввод
                    </th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Стандартный вывод
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                <tr>
                    <td class="px-6 py-4 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                        {@html task.task_input}
                    </td>
                    <td class="px-6 py-4 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                        {@html task.task_output}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
