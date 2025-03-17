<script lang="ts">
    import { browser } from "$app/environment";
    import News from "$lib/News.svelte";
    import Unit from "$lib/Unit.svelte";
    import { ArrowDown, Book, Newspaper } from "@lucide/svelte";
    import { onDestroy, onMount } from "svelte";

    let height = $state(0);
    let isArrowVisible = $state(true); // State to control arrow visibility

    const content = [
        `Подпишитесь на наш telegram-канал чтобы следить за новыми обновлениями (<a class="text-blue-500 dark:[text-shadow:_0_5px_20px_#2b7fff] underline" href="https://t.me/acoeureka">тык</a>)`,
        `Патриотизм начинает с профессионализма!`,
        `Дайте денег`,
        `Крутые перцы 2009`,
        `Дайте денег`,
        `Дайте денег`,
    ]

    // Define the tasks array
    const tasks = Array.from({ length: 8 }, (_, i) => ({
        type: 0,
        score: 0,
        comment: "",
        name: `Задача 1_1_${i}`,
        parent_id: 0,
        has_theory_text: false,
        section_id: 0,
        language_id: 0,
        subject_id: 0,
        id: 0,
        isLocked: true,
        teacher_task_id: 0,
        status: i+1,
        task_delay: 0,
        tools: [],
        date_added: "0",
        date_control: "0",
    }));

    // Function to handle scroll event
    function handleScroll() {
        if (window.scrollY > 0) {
            isArrowVisible = false; // Hide arrow when scrolled
        } else {
            isArrowVisible = true; // Show arrow when at the top
        }
    }

    // Add scroll event listener
    onMount(() => {
        if (browser) {
            window.addEventListener('scroll', handleScroll);
        }
    });

    // Cleanup event listener on component destroy
    onDestroy(() => {
        if (browser) {
            window.removeEventListener('scroll', handleScroll);
        }
    });
</script>

<header>
    <div class="hidden w-fit text-nowrap fixed top-8 left-auto right-20 motion-preset-wobble-sm motion-duration-2000 text-right md:flex gap-1">
        <p class="inline-block dark:hidden text-black">У нас есть тёмная тема 👉</p>
        <p class="hidden dark:inline-block text-white">У нас есть светлая тема 👉</p>
	</div>
</header>
<div class={height === 0 ? "opacity-0" : `w-full h-[calc(50vh-var(--customPadding))] flex justify-center items-center pb-40`} style={`--customPadding:${height/2}px`}>
    <div style="zoom: 75%;" class="p-5 w-162 h-10 transform backface-hidden transform-gpu scale-3d translate-z-0 subpixel-antialiased perspective-[1px] motion-preset-blur-down-lg motion-delay-1500">
        <News 
        title="В разработке!"
        content={content[0]}
        skipDOM={true} 
        date_add={Date.now()/1000}
        />
    </div>
</div>
<div class={height === 0 ? "opacity-0" : "w-full pb-5 motion-preset-blur-down-lg"} bind:clientHeight={height}>
    <div class="w-full flex flex-col justify-center items-center">
        <img width="256px" class="-m-16 -mt-10 h-[256px] w-[256px]" src="/eureka-transparent.png" alt="eureka logo">
        <p class="font-bold text-9xl dark:[text-shadow:_0_5px_20px_#ffffff33]">Eureka</p>
        <p class="text-xl">Эволюция, а не революция</p>
    </div>

    <div class="w-full h-20 flex flex-col justify-center items-center">
        <a href="/app" class="underline px-5 py-2.5 border rounded-lg shadow-lg">Войти в систему</a>
    </div>
</div>
<div class={height === 0 ? "opacity-0" : `w-full h-[calc(50vh-var(--customPadding))] transition-[height] flex items-end pb-20 justify-center motion-preset-blur-down-lg motion-delay-500`} style={`--customPadding:${height/2}px`}>
    {#if isArrowVisible}
        <ArrowDown class="motion-translate-y-loop-100 motion-duration-[2s]"></ArrowDown>
    {/if}
</div>
<div class={height === 0 ? "hidden" : "w-screen flex flex-col items-center gap-y-10 pb-5"}>
    <div class="w-screen md:w-4/5 flex flex-col md:flex-row p-2 gap-4">
        <div class="w-full md:w-1/2 flex flex-row justify-center md:justify-end">
            <div style="zoom: 60%;" class="w-full md:w-3/4">
                <Unit 
                disabled={true}
                section={{
                    section_name: "ds",
                    section_order: 0,
                    deadline_week: 69,
                    course_id: 0,
                    rowid: 0,
                    deadline: 0,
                    max_points: 420,
                    nested: {
                        "0": {
                            rowid: 0,
                            section_name: "ds",
                            deadline_week: 69,
                            section_order: 0,
                        },
                    },
                    tasks: tasks
                }}
            />
            </div>
        </div>
        <div class="w-full md:w-1/3 px-2 -mt-2 flex flex-col justify-center">
            <p class="text-7xl font-bold dark:[text-shadow:_0_5px_20px_#ffffff33] pb-1 flex flex-row gap-4 justify-start items-baseline"><Book size={56}/> Задачи</p>
            <p>Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дубликации "Здесь ваш текст.. Здесь ваш текст.. Здесь ваш текст.." Многие программы электронной вёрстки и редакторы HTML используют Lorem Ipsum в качестве текста по умолчанию, так что поиск по ключевым словам "lorem ipsum" сразу показывает, как много веб-страниц всё ещё дожидаются своего настоящего </p>
        </div>
    </div>
    <div class="w-screen md:w-4/5 flex flex-col md:flex-row p-2 gap-4 justify-end">
        <div class="w-full md:w-1/3 px-2 md:text-right -mt-2 flex flex-col justify-center">
            <p class="text-7xl font-bold dark:[text-shadow:_0_5px_20px_#ffffff33] pb-1 flex flex-row gap-4 justify-end items-baseline"><Newspaper size={56}/> Новости</p>
            <p>Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дубликации "Здесь ваш текст.. Здесь ваш текст.. Здесь ваш текст.." Многие программы электронной вёрстки и редакторы HTML используют Lorem Ipsum в качестве текста по умолчанию, так что поиск по ключевым словам "lorem ipsum" сразу показывает, как много веб-страниц всё ещё дожидаются своего настоящего рыжего молодого мужчины</p>
        </div>
        <div class="w-full md:w-1/2 flex flex-row justify-start">
            <div style="zoom: 60%;" class="w-full md:w-3/4">
                {#each content as a, i}
                <News 
                title="В разработке!"
                content={a}
                skipDOM={true} 
                date_add={Date.now()/1000 - (24 * 60 * 60 * i)}
                />
                {/each}
            </div>
        </div>
    </div>
    <div class="w-screen md:w-4/5 text-center flex flex-col p-2 gap-4 items-center">
        <p class="text-6xl font-bold">Давайте же начнём?</p>
        <p class="text-xl">Говори "Ня!", будь няшкой</p>
        <div class="w-full h-20 flex flex-col justify-start items-center">
            <a href="/app" class="underline px-5 py-2.5 border rounded-lg shadow-lg">Войти в систему</a>
        </div>
    </div>
</div>
