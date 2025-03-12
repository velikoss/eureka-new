<script lang="ts">
    import type { Task, TaskFile } from "$lib";
    import { cpp } from "@codemirror/lang-cpp";
    import { onMount } from "svelte";
    import CodeMirror from "svelte-codemirror-editor";

    let {task, deflate}: {task: Task, deflate: any } = $props();
    let filenames: string[] = $state([]);
    let filechange: boolean[] = $state([]);
    let filedata: string[] = $state([]);
    let currentFile = $state("")
    let currentFileData = $state("")

    onMount(async () => {
        let data = await fetch("/api/getTaskFiles2", {
            method: "POST",
            body: JSON.stringify({
                id: task.id,
            })
        });
        let taskfiles = (await data.json()).data as TaskFile[];
        taskfiles.forEach((file) => {
            filenames.push(file.name!);
            filedata.push(file.file!);
            filechange.push(false);
        })
        currentFile = taskfiles[0].name!;
        currentFileData = taskfiles[0].file!;

        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                filechange[filenames.indexOf(currentFile)] = false;
                fetch("/api/saveTaskFile", {
                    method: "POST",
                    body: JSON.stringify({
                        idTask: task.id,
                        name: currentFile,
                        file: currentFileData
                    })
                })
            }
        });
    })


    function selectFile(name: string): any {
        currentFile = name;
        currentFileData = filedata[filenames.indexOf(name)];
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
    <div class="fixed top-auto bottom-[5vh] md:top-0 md:bottom-0 md:relative file-picker w-full md:w-64 md:border-r overflow-scroll h-fit md:h-full py-2 px-3 flex flex-row md:flex-col gap-1 md:gap-2 items-center">
        <p class="p-0 m-0 mr-1 md:mr-0 md:-my-[3.3px]">Файлы</p>
        {#each filenames as name}
        <button
            class="border w-full h-[3.6vh] md:h-fit md:py-0.125 rounded-md flex items-center px-2 cursor-pointer text-nowrap"
            onclick={() => selectFile(name)}
        >
            <p>
                {#if currentFile === name}
                    <span class="selected-arrow">></span>
                {/if}
                <span class="tool-text {currentFile === name ? 'selected' : ''}">
                    {filechange[filenames.indexOf(name)]?"*":""}{name}
                </span>
            </p>
        </button>
        {/each}
        <button
            class="border w-full h-[3.6vh] md:h-fit rounded-md flex items-center px-2 cursor-pointer text-nowrap"
            onclick={() => {}}
        >
            <p>
                + Новый файл
            </p>
        </button>
    </div>
    <div class="border-b md:border-b-0 rounded-md h-[calc(100%-5.5vh)] w-full md:w-[calc(100%-16rem)] md:h-full editor">
        <CodeMirror bind:value={currentFileData} lang={cpp()} on:change={() => {
            filechange[filenames.indexOf(currentFile)] = true;
        }}>

        </CodeMirror>
    </div>
</div>