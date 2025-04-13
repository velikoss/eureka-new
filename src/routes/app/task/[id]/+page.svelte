<script lang="ts">
    import { page } from '$app/state';
    import { Task, Tools } from '$lib';
    import Problem from '$lib/Problem.svelte';
    import Code from '$lib/Code.svelte';
    import Method from '$lib/Method.svelte';

    import ToolsBar from '$lib/ToolsBar.svelte';
    import Algo from '$lib/Algo.svelte';

    // console.log(getAllContexts())

    let task: Task = $state(JSON.parse(page.data.task));
    let selectedToolId: number | null = $state(null);
    $effect(() => {
        (task);
        task.__lastModified = Date.now();
    })

    const options = {
		"problem": Problem,
        "code": Code,
        "method": Method,
        "method2": Method,
        "algo": Algo,
        "algo2": Algo,
        "algo-scheme": Graph,
        "tests": Tests,
        "report": Report,
    };

    async function handleToolSelected(toolId: any) {
        selectedToolId = toolId;
        task.__lastModified = Date.now();
        const taskToSave = {
            tools: task.tools,
            is_code_available: task.is_code_available,
            graph_png_array: task.graph_png_array,
            template_id: task.template_id,
            parent_id: task.parent_id,
            algo2: task.algo2,
            __lastSaved: task.__lastModified,
            method2: task.method2,
            task_readiness: task.task_readiness,
            _armVer: task._armVer,
            id: task.id,
            status: task.status,
            date_added: task.date_added,
            type: task.type,
            algo_text: task.algo_text,
            algo_graph: task.algo_graph,
            method_description: task.method_description,
            date_control: task.date_control,
            subject_id: task.subject_id,
            teacher_name: task.teacher_name,
            teacher_surname: task.teacher_surname,
            teacher_patronymic: task.teacher_patronymic,
            name: task.name,
            task_text: task.task_text,
            task_input: task.task_input,
            theory_text: task.theory_text,
            task_output: task.task_output
        };
        const taskJsonString = JSON.stringify(taskToSave);
        let data = await fetch("/api/saveTask", {
            method: "POST",
            body: taskJsonString
        })
        let json = (await data.json());
        if (json.success === true) {
            task.__lastSaved = task.__lastModified;
        } else {
            welcomeMessage = json;
            showModal();
        }
    }

    let isDarkMode = $state(false);

    // Example: Check for dark mode on mount (optional)
    import { getAllContexts, getContext, hasContext, onMount, setContext } from 'svelte';
    import { DownloadCloudIcon, UploadCloudIcon, X } from '@lucide/svelte';
    import Graph from '$lib/Graph.svelte';
    import Tests from '$lib/Tests.svelte';
    import Modal from '$lib/Modal.svelte';
    import Report from '$lib/Report.svelte';
    
    onMount(async () => {
        getContext("task").task = task;
        setInterval(() => {
            isDarkMode = document.documentElement.classList.contains('dark');
        }, 0)
    });


    function getTool(): any {
        return options[Tools[selectedToolId! - 1] as keyof typeof options];
    }


    async function downloadTask(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) {
        try {
            // Получаем файлы задачи
            const filesResponse = await fetch("/api/getTaskFiles2", {
                method: "POST",
                body: JSON.stringify({
                    id: task.id,
                })
            });
            
            const filesData = await filesResponse.json();
            const files = filesData.data || [];
            
            // Подготавливаем данные для экспорта
            const exportData = {
                task: {
                    ...task,
                    __lastModified: undefined, // Исключаем временные поля
                    __lastSaved: undefined
                },
                // files: files
            };
            
            // Создаем JSON строку
            const jsonString = JSON.stringify(exportData, null, 2);
            
            // Создаем blob и ссылку для скачивания
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // Создаем временную ссылку и запускаем скачивание
            const a = document.createElement('a');
            a.href = url;
            a.download = `task_${task.id}_${task.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
            document.body.appendChild(a);
            a.click();
            
            // Очищаем
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            
        } catch (error) {
            console.error('Error exporting task:', error);
            alert('Произошла ошибка при экспорте задачи');
        }
    }
    let showImportModal = $state(false);
    let importFile = $state<File | null>(null);
    let importWarning = $state("");
    let isImporting = $state(false);
    let showImportSuccess = $state(false);

    function handleBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            resetImport();
        }
    }

    async function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            importFile = input.files[0];
            importWarning = "";
            
            // Validate file type
            if (!importFile.name.endsWith('.json')) {
                importWarning = "Please select a JSON file";
                importFile = null;
                return;
            }
        }
    }

    async function importTask() {
        if (!importFile) return;

        isImporting = true;
        try {
            const fileContent = await importFile.text();
            const importData = JSON.parse(fileContent);

            // Basic validation
            if (!importData.task || !importData.task.id) {
                importWarning = "Invalid task file format: Missing task data";
                return;
            }

            // Show warning if importing different task ID
            if (importData.task.id !== task.id) {
                importWarning = `Warning: Importing data from task ID ${importData.task.id} into current task (ID ${task.id}). This may cause inconsistencies.`;
                return;
            }

            // If there's a warning but user wants to proceed
            if (importWarning) {
                await performImport(importData);
            } else {
                // No warnings, proceed directly
                await performImport(importData);
            }
        } catch (error) {
            console.error('Error importing task:', error);
            importWarning = "Error reading the file. Please check the file format.";
        } finally {
            isImporting = false;
        }
    }

    async function performImport(importData: any) {
        try {
            console.log("Importing task data:", importData);
            
            // Show success message
            showImportSuccess = true;

            task = new Task(importData.task)
            
            selectedToolId = task.tools[0].id;
            handleToolSelected(selectedToolId);
            
            setTimeout(() => {
                showImportSuccess = false;
                
                resetImport();
            }, 1000);

            
        } catch (error) {
            console.error('Error during import:', error);
            importWarning = "Import failed. Please try again.";
        }
    }

    function resetImport() {
        // Reset file input
        const fileInput = document.getElementById('taskFile') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        importFile = null;
        importWarning = "";
        showImportModal = false;
        isImporting = false;
        showImportSuccess = false;
    }

    let showWelcomeModal = $state(false);
    let welcomeMessage = $state("");

    function showModal() {
        showWelcomeModal = true;
    }

    function closeModal() {
        showWelcomeModal = false;
    }
</script>

<div class="flex flex-col">
    <div class="w-full border-b flex flex-row h-[5.6vh] max-h-[60px] pt-1 mb-2.5 px-2 md:px-[10vw] md:pl-[10.5vw] pb-1">
        <strong class="text-xl self-center">Eureka</strong>
        <p class="w-full text-center self-center">{task.__lastModified > task.__lastSaved ? "*" : ""}{task.name}</p>
        <a href="/app" class="w-fit text-xl text-start underline z-50 self-center"><X/></a>
    </div>
    <div class="task w-full md:w-4/5 flex self-center flex-row">
        <div class="bg-white dark:bg-black taskbar fixed md:relative flex flex-row top-auto flex-nowrap bottom-0 w-screen overflow-auto md:flex-col md:w-72 h-[6vh] md:min-h-[90vh] max-h-full md:items-center gap-1 md:gap-2">
            <ToolsBar bind:currentId={selectedToolId} tools={task.tools} deflate={handleToolSelected} --dark={isDarkMode?"white":"black"} />
            <button class="ml-2 border w-auto md:w-[83%] h-[5vh] md:h-fit md:py-1 rounded-md flex items-center px-2 text-sm cursor-pointer text-nowrap shadow-md gap-2" onclick={() => showImportModal = true}><UploadCloudIcon/> <span>Импорт задачи<sup>beta</sup></span></button>
            <button class="ml-2 border w-auto md:w-[83%] h-[5vh] md:h-fit md:py-1 rounded-md flex items-center px-2 text-sm cursor-pointer text-nowrap shadow-md gap-2" onclick={downloadTask}><DownloadCloudIcon/> <span>Экспорт задачи<sup>beta</sup></span></button>
        </div>
        <div class="taskmenu overflow-scroll mb-[7vh] md:mb-0 w-full h-[88vh] md:h-[92vh] border rounded-md">
            {#if selectedToolId !== null}
            <!-- <p>{Tools[selectedToolId - 1]}</p> -->
            {@const Component = getTool()}
            <svelte:boundary>
                <Component bind:task={task} bind:dark={isDarkMode}></Component>

                {#snippet failed(error, reset)}
                    <button onclick={reset}>oops! try again {error}</button>
                {/snippet}
            </svelte:boundary>
            {/if}
        </div>
    </div>
</div>

<Modal 
    show={showWelcomeModal} 
    title="Ошибка" 
    message={welcomeMessage} 
    onClose={closeModal}
/>

{#if showImportModal}
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
    class="motion-preset-fade-sm fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50 p-4" 
    onclick={handleBackdropClick}
>
    <div 
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
    >
        <h2 class="text-xl font-bold mb-4">Импорт задачи</h2>
        <p class="text-sm italic mb-2 text-red-500 dark:text-red-400">
            ВНИМАНИЕ: Разработчики Эврики не несут ответственности за использование этой функции. 
            Это временное решение для восстановления задачи в случае её поломки.
        </p>

        {#if showImportSuccess}
            <div class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-3 rounded mb-4">
                Task imported successfully! The page will refresh shortly...
            </div>
        {:else}
            {#if !importFile}
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2" for="taskFile">
                        Выберите файл (.json)
                    </label>
                    <input
                        id="taskFile"
                        type="file"
                        accept=".json"
                        onchange={handleFileSelect}
                        class="w-full p-2 border rounded"
                    />
                </div>
            {:else}
                <div class="mb-4">
                    <p class="text-sm mb-2">Выбран файл: {importFile.name}</p>
                    {#if importWarning}
                        <div class="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-3 rounded mb-4">
                            {importWarning}
                        </div>
                    {/if}
                </div>
            {/if}

            <div class="flex justify-end gap-2">
                <button
                    onclick={resetImport}
                    class="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    disabled={isImporting}
                >
                    Отмена
                </button>
                {#if importFile}
                    <button
                        onclick={importTask}
                        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        disabled={isImporting}
                    >
                        {isImporting ? 'Импортируется...' : importWarning ? 'Продолжить' : 'Импортировать'}
                    </button>
                {/if}
            </div>
        {/if}
    </div>
</div>
{/if}