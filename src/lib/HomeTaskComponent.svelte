<script lang="ts">
    import type { HomeTask } from '$lib';

    export let task: HomeTask;

    // Helper function to format the task status
    const formatStatus = (status: number) => {
        switch (status) {
            case 0:
                return 'Not Started';
            case 1:
                return 'In Progress';
            case 2:
                return 'Completed';
            default:
                return 'Unknown';
        }
    };

    // Helper function to format the score
    const formatScore = (score: any) => {
        return score !== null && score !== undefined ? score : 'N/A';
    };
</script>

<div class="font-mono border border-black rounded-lg shadow-sm p-4 mb-4 bg-white">
    <!-- Task Header -->
    <div class="flex justify-between items-center border-black">
        <h2 class="text-lg font-bold">{task.name}</h2>
        <p class="text-sm text-gray-700">Status: {formatStatus(task.status)}</p>
    </div>
</div>