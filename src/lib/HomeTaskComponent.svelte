<script lang="ts">
    import { _taskStatusNames, taskStatusColors, type HomeTask } from '$lib';
    import { StickyNote } from "@lucide/svelte";

    export let task: HomeTask;

    // Helper function to format the task status
    const formatStatus = (status: number) => {
        return _taskStatusNames[status];
    };

    // Helper function to get the appropriate colors for the task status
    const getTaskColors = (status: number) => {
        return taskStatusColors[status] || 'bg-white dark:bg-black text-black dark:text-white';
    };
</script>

<a href={task.status % 4 == 0 ? "javascript: void(0)" : `/app/task/${task.id}`}>
    <div
        class="border border-black dark:border-gray-200 task rounded-lg p-4 mb-4 shadow-sm drop-shadow-sm hover:drop-shadow-lg transition
               {getTaskColors(task.status)}"
    >
        <!-- Task Header -->
        <div class="flex justify-between items-center">
            <div class="flex flex-row gap-1.5 items-center text-left w-7/10">
                <div class="w-[18px]">
                    <StickyNote size={18}/>
                </div>
                <h2 class="text-lg font-bold">{task.name}</h2>
            </div>
            <p class="text-sm text-right">Статус: {formatStatus(task.status)}</p>
        </div>
    </div>
</a>
