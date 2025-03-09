<script lang="ts">
    let { task } = $props();
</script>

<div class="w-full space-y-4 flex flex-col">
    {@html task.theory_text}
    {@html task.task_text}
    {@html task.algo_text}

    <div class="w-fit border self-center">
        <table class="min-w-fit max-w-full bg-white border border-black border-collapse shadow-sm rounded-lg overflow-hidden">
            <thead class="bg-gray-50 border">
                <tr>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Стандартный ввод
                    </th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Стандартный вывод
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                <tr>
                    <td class="px-6 py-4 whitespace-pre-wrap text-sm text-gray-800">
                        {@html task.task_input}
                    </td>
                    <td class="px-6 py-4 whitespace-pre-wrap text-sm text-gray-800">
                        {@html task.task_output}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>