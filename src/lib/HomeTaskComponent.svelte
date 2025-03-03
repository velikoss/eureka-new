<script lang="ts">
    import { _taskStatusNames, type HomeTask } from '$lib';

    export let task: HomeTask;

    // Helper function to format the task status
    const formatStatus = (status: number) => {
        return _taskStatusNames[status];
    };

    // Helper function to format the score
    const formatScore = (score: any) => {
        return score !== null && score !== undefined ? score : 'N/A';
    };
</script>

<a href={task.status%4==0?"javascript: void(0)":`/app/task/${task.id}`}>
    <div class="font-mono border border-black rounded-lg shadow-sm p-4 mb-4 {(task.status===4)?"bg-green-100":(task.status===8)?"bg-red-100":(task.status===3)?"bg-pink-100":"bg-white"}">
        <!-- Task Header -->
        <div class="flex justify-between items-center border-black">
            <h2 class="text-lg font-bold">{task.name}</h2>
            <p class="text-sm text-gray-700">Статус: {formatStatus(task.status)}</p>
        </div>
    </div>
</a>