<script lang="ts">
    import type { Task, TaskFile } from "$lib";
    import { getAllContexts, getContext, onDestroy, onMount } from "svelte";
    import CM from "./CM.svelte";
    import { FolderOpen, Plus, Play } from "@lucide/svelte";

    let {task = $bindable(), deflate, dark = $bindable()}: {task: Task, deflate: any, dark: boolean | false } = $props();
    let filenames: string[] = $state([]);
    let filechange: boolean[] = $state([]);
    let filedata: string[] = $state([]);
    let currentFile = $state("");
    let codemirror: CM | undefined = $state(undefined);
    let newFileName = $state("");

    let headers: FileView[] = $state([])
    let sources: FileView[] = $state([])
    let other: FileView[] = $state([])

    interface FileView {
        file: TaskFile,
        index: number
    }

    // Шаблоны для новых файлов (теперь с правильными именами макросов)
    const fileTemplates = {
        ".h": (fileName: string) => {
            const baseName = fileName.replace(/\.[^/.]+$/, ""); // Удаляем расширение
            const macroName = baseName
                .replace(/[^a-zA-Z0-9]/g, '_') // Заменяем спецсимволы на _
                .toUpperCase(); // Переводим в верхний регистр
            return `#ifndef ${macroName}_H
#define ${macroName}_H

// Ваш код заголовочного файла здесь

#endif // ${macroName}_H
`;
        },
        ".cpp": (fileName: string) => {
            const headerName = fileName.replace('.cpp', '.h');
            return `#include "${headerName}"

// Ваш код реализации здесь
`;
        }
    };

    console.log(getAllContexts())
    getContext("widgets")?.widgets?.addWidget('runProject', task);


    onMount(async () => {
        await loadFiles();
        
        document.addEventListener('keydown', async e => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                filechange[filenames.indexOf(currentFile)] = false;
                task.files[filenames.indexOf(currentFile)].changed = false;
                await fetch("/api/saveTaskFile", {
                    method: "POST",
                    body: JSON.stringify({
                        idTask: task.id,
                        name: currentFile,
                        file: codemirror?.getValue(),
                    })
                });
            }
        });
    });

    onDestroy(() => {
        getContext("widgets")?.widgets?.removeWidget('runProject');
    })

    async function loadFiles(fetchFiles: boolean = true) {
        if ((!task.files || task.files.length < 1) && fetchFiles) {
            let data = await fetch("/api/getTaskFiles2", {
                method: "POST",
                body: JSON.stringify({
                    id: task.id,
                })
            });
            task.files = (await data.json()).data as TaskFile[];
        }

        filenames = [];
        filedata = [];
        filechange = [];
        headers = [];
        sources = [];
        other = [];
        
        task.files.forEach((file, i) => {
            if (!file.name || file.name.length < 1 || filenames.includes(file.name!)) {
                return;
            }
            filenames.push(file.name!);
            filedata.push(file.file!);
            filechange.push(file.changed);
            (
                file.name?.endsWith(".cpp") ? sources : 
                file.name?.endsWith(".h") ? headers : 
                other
            ).push({
                file: file,
                index: i
            });
        });
        
        if (filenames.length > 0) {
            currentFile = filenames[0];
            codemirror?.setValue(filedata[0]);
            filechange[filenames.indexOf(currentFile)] = task.files.find(e => e.name === currentFile)?.changed ?? false;
        }
    }

    function selectFile(name: string) {
        currentFile = name;
        codemirror?.setValue(filedata[filenames.indexOf(name)]);
    }

    async function createNewFile() {
        if (!newFileName) return;
        
        const extension = newFileName.includes('.') ? 
            newFileName.substring(newFileName.lastIndexOf('.')) : 
            '';
        
        const template = fileTemplates[extension] ? 
            fileTemplates[extension](newFileName) : 
            '';
        
        // Создаем временный файл для немедленного отображения
        const tempFile: TaskFile = {
            name: newFileName,
            file: template,
            changed: true
        };
        
        // Добавляем файл в массив
        task.files = [...(task.files || []), tempFile];
        
        // Обновляем локальное состояние
        await loadFiles(false);
        selectFile(newFileName);
        newFileName = "";
        
        try {
            // Отправляем запрос на сервер
            const response = await fetch("/api/saveTaskFile", {
                method: "POST",
                body: JSON.stringify({
                    idTask: task.id,
                    name: newFileName,
                    file: template
                })
            });
            
            if (!response.ok) {
                // Если ошибка, удаляем временный файл
                task.files = task.files.filter(f => f.name !== newFileName);
                await loadFiles();
                console.error("Failed to create file on server");
            }
        } catch (error) {
            // Если ошибка, удаляем временный файл
            task.files = task.files.filter(f => f.name !== newFileName);
            await loadFiles();
            console.error("Error creating file:", error);
        }
    }
</script>

<style>
    .selected-arrow {
        display: inline-block;
        background: #000000;
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        animation: fly 0.5s 1 ease;
    }

    @keyframes fly {
        0% {
            transform: translateX(-5px);
        }
        100% {
            transform: translateX(0px);
        }
    }
</style>

<div class="code flex flex-row w-full h-full">
    <div class="fixed top-auto md:mt-1 bottom-[6.75vh] md:top-0 md:bottom-0 md:relative file-picker w-full md:w-48 md:border-r overflow-scroll h-fit md:h-full py-1 px-3 flex flex-row md:flex-col gap-1 items-start">
        <div>
            <p class="flex flex-row gap-1"><FolderOpen size={16} class="mt-1"/> include/</p>
            {#each headers as view}
            <button class="pl-5" on:click={() => selectFile(view.file.name!)}>
                {#if currentFile === view.file.name!}
                    <span class="selected-arrow">></span>
                {/if}
                {filechange[view.index]?"*":""}{view.file.name}
            </button>
            {/each}
        </div>
        <div>
            <p class="flex flex-row self-start gap-1"><FolderOpen size={16} class="mt-1"/> sources/</p>
            {#each sources as view}
            <button class="pl-5" on:click={() => selectFile(view.file.name!)}>
                {#if currentFile === view.file.name!}
                    <span class="selected-arrow">></span>
                {/if}
                {filechange[view.index]?"*":""}{view.file.name}
            </button>
            {/each}
        </div>
        <div>
            {#each other as view}
            <button on:click={() => selectFile(view.file.name!)}>
                {filechange[view.index]?"*":""}{view.file.name}
            </button>
            {/each}
        </div>
        <div class="flex flex-col w-full">
            <input 
                type="text" 
                bind:value={newFileName}
                placeholder=".h или .cpp"
                class="w-full p-1 border rounded-md"
                on:keydown={(e) => e.key === 'Enter' && createNewFile()}
            />
            <button
                class="w-full h-[4.5vh] md:h-fit rounded-md flex items-center justify-start cursor-pointer text-nowrap mt-1 border p-1"
                on:click={createNewFile}
            >
                <Plus /> Создать файл
            </button>
        </div>
    </div>
    <div class="border-b md:border-b-0 rounded-md h-[calc(100%-5.5vh)] w-full md:w-full md:h-full editor">
        <CM bind:this={codemirror} {dark} onchange={() => {
            filechange[filenames.indexOf(currentFile)] = true;
            task.files[filenames.indexOf(currentFile)] = {
                name: currentFile,
                file: codemirror?.getValue(),
                changed: true,
            };
        }} />
    </div>
</div>