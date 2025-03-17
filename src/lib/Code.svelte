<script lang="ts">
    import type { Task, TaskFile } from "$lib";
    // import { cpp } from "@codemirror/lang-cpp";
    import { getAllContexts, getContext, hasContext, onMount } from "svelte";
    // import CodeMirror from "svelte-codemirror-editor";
    import CM from "./CM.svelte";
    import { FolderOpen } from "@lucide/svelte";

    let {task = $bindable(), deflate, dark}: {task: Task, deflate: any, dark: boolean | false } = $props();
    let filenames: string[] = $state([]);
    let filechange: boolean[] = $state([]);
    let filedata: string[] = $state([]);
    let currentFile = $state("");
    let codemirror: CM | undefined = $state(undefined);

    const contexts = getAllContexts();

    let headers: FileView[] = $state([])
    let sources: FileView[] = $state([])
    let other: FileView[] = $state([])

    interface FileView {
        file: TaskFile,
        index: number
    }

    onMount(async () => {
        if (!task.files || task.files.length < 1) {
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
        
        task.files.forEach((file, i) => {
            if (!file.name || file.name.length < 1 || filenames.includes(file.name!)) {
                return;
            }
            console.log(file)
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
            })
        })
        
        if (filenames.length > 0) {
            currentFile = filenames[0];
            codemirror?.setValue(filedata[0]);
            filechange[filenames.indexOf(currentFile)] = task.files.find(e => e.name === currentFile)?.changed ?? false;
        }

        document.addEventListener('keydown', async e => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                console.log(filenames.indexOf(currentFile));
                filechange[filenames.indexOf(currentFile)] = false;
                task.files[filenames.indexOf(currentFile)].changed = false;
                await fetch("/api/saveTaskFile", {
                    method: "POST",
                    body: JSON.stringify({
                        idTask: task.id,
                        name: currentFile,
                        file: codemirror?.getValue(),
                    })
                })
            }
        });
    })


    function selectFile(name: string): any {
        currentFile = name;
        codemirror?.setValue(filedata[filenames.indexOf(name)]);
    }
</script>

<style>
    /* Gradient flying animation for > */
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

    /* Underline animation for tool text */
    .tool-text {
        position: relative;
        display: inline-block;
    }

    .tool-text::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 5px;
        width: 0;
        height: 1px;
        background: #000000;
        transition: width 0.3s ease;
    }

    .tool-text.selected::after {
        width: 100%;
    }
</style>

<div class="code flex flex-row w-full h-full">
    <div class="fixed top-auto md:mt-1 bottom-[6.75vh] md:top-0 md:bottom-0 md:relative file-picker w-full md:w-48 md:border-r overflow-scroll h-fit md:h-full py-1 px-3 flex flex-row md:flex-col gap-1 md:gap-2 items-start">
        <div>
            <p class="flex flex-row gap-2"><FolderOpen size={20} class="mt-0.5"/> include/</p>
            {#each headers as view}
            <button class="" onclick={() => selectFile(view.file.name!)}>
                {#if currentFile === view.file.name!}
                    <span class="selected-arrow">></span>
                {/if}
                &emsp;&emsp;{filechange[view.index]?"*":""}{view.file.name}
            </button>
            {/each}
        </div>
        <div>
            <p class="flex flex-row self-start gap-2"><FolderOpen size={20} class="mt-0.5"/> sources/</p>
            {#each sources as view}
            <button onclick={() => selectFile(view.file.name!)}>
                {#if currentFile === view.file.name!}
                    <span class="selected-arrow">></span>
                {/if}
                &emsp;&emsp;{filechange[view.index]?"*":""}{view.file.name}
            </button>
            {/each}
        </div>
        <div>
        {#each other as view}
        <button onclick={() => selectFile(view.file.name!)}>
            {filechange[view.index]?"*":""}{view.file.name}
        </button>
        {/each}
        </div>
        <button
            class="border shadow-md w-full h-[4.5vh] md:h-fit md:py-1 rounded-md flex items-center px-2 cursor-pointer text-nowrap"
            onclick={() => {}}
        >
            <p>
                + Новый файл
            </p>
        </button>
    </div>
    <div class="border-b md:border-b-0 rounded-md h-[calc(100%-5.5vh)] w-full md:w-full md:h-full editor">
        <!-- <CodeMirror bind:value={currentFileData} lang={cpp()} on:change={() => {
            filechange[filenames.indexOf(currentFile)] = true;
        }}>
        </CodeMirror> -->
        {JSON.stringify(contexts)}
        <CM bind:this={codemirror} dark onchange={() => {
            filechange[filenames.indexOf(currentFile)] = true;
            task.files[filenames.indexOf(currentFile)] = {
                name: currentFile,
                file: codemirror?.getValue(),
                changed: true,
            };
        }} />
    </div>
</div>
