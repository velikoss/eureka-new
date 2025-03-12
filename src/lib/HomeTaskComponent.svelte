<script lang="ts">
    import { _taskStatusNames, taskStatusColors, type HomeTask } from '$lib';

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
        class="font-mono border border-black dark:border-gray-200 rounded-lg shadow-sm p-4 mb-4
               {getTaskColors(task.status)}"
    >
        <!-- Task Header -->
        <div class="flex justify-between items-center">
            <h2 class="text-lg font-bold">{task.name}</h2>
            <p class="text-sm">Статус: {formatStatus(task.status)}</p>
        </div>
    </div>
</a>