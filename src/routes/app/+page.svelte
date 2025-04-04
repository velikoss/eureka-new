<script lang="ts">
    import { goto } from '$app/navigation';
    import News from '$lib/News.svelte';
    import Unit from '$lib/Unit.svelte';
    import { onMount } from 'svelte';
    import { LogOut } from '@lucide/svelte';
    import type { HomeTask, Section } from '$lib';

    let { data } = $props();
    let st = $state(1);
    let combinedData = $state<Section[]>([]);

    // Utility function to combine tasks with units and nested sections
    function combineTasksWithUnits(units: Section[], tasks: HomeTask[]): Section[] {
        let kursach: Section = {
            rowid: 0,
            section_name: "Курсовые работы",
            section_order: 0,
            score: 0,
            deadline: 0,
            deadline_week: 0,
            max_points: 0,
            course_id: 2,
            nested: {},
            tasks: tasks.filter(task => task.name.startsWith("К")),
            description: "~ В разработке. Ничего не гарантируем"
        };

        // Process units and separate them into with tasks and without tasks
        const unitsWithTasks: Section[] = [];
        const unitsWithoutTasks: Section[] = [];

        units.forEach(unit => {
            // Map tasks to the main unit
            let unitTasks = tasks.filter(task => task.section_id === unit.rowid);
            
            // Map tasks to nested sections
            const nestedWithTasks = Object.entries(unit.nested).map(([nestedId, nestedSection]) => {
                const nestedTasks = tasks.filter(task => task.section_id === parseInt(nestedId));
                unitTasks = [...unitTasks, ...nestedTasks];
                return {
                    tasks: nestedTasks
                };
            });

            const unitWithTasks = {
                ...unit,
                tasks: unitTasks,
                nested: nestedWithTasks
            };

            // Check if unit has any tasks
            if (unitTasks.length > 0) {
                unitsWithTasks.push(unitWithTasks);
            } else {
                unitsWithoutTasks.push(unitWithTasks);
            }
        });

        return [
            kursach, 
            ...unitsWithTasks.reverse(),
            ...unitsWithoutTasks
        ];
    }

    onMount(() => {
        setInterval(async () => {
            st = (parseInt(await (await fetch("/api/readyState")).text()??0));
            data.locals.user.st = st;
            if (st !== 1) {
                goto("/app/login?renewToken=true");
            }
        }, 3000);
    });
</script>

<main class="flex flex-col items-center w-screen">
    <header class="h-[5.6vh] max-h-[60px] w-screen md:px-[calc(10vw)] border-b z-50 flex flex-row items-center justify-between">
        <strong class="text-xl ml-3">Eureka<sup>beta</sup></strong>
        <div class="flex flex-row gap-1 items-center">{data.locals.user.student_suname} {data.locals.user.student_name.substring(0,1)}.{data.locals.user.student_patronymic.substring(0,1)}. ({data.locals.user.group_name}) <span class="text-xs"></span> <a href="/app/login?renewToken=true"><LogOut size={18} /></a></div>
    </header>
    <div class="w-screen md:max-w-4/5 md:min-w-[600px] flex flex-col md:flex-row p-2 gap-4">
        <div class="w-full md:w-1/2 flex flex-col">
            {#await Promise.all([data.units, data.tasks])}
                <!-- Loading state -->
                <Unit section={{
                    section_name: "Загрузка...",
                    deadline: 0,
                    deadline_week: 0,
                    max_points: 420,
                    section_order: 0,
                    score: 69,
                    nested: []
                }}></Unit>
            {:then [units, tasks]}
                <!-- Data is loaded, combine and render -->
                {#each combineTasksWithUnits(units, tasks) as unit }
                    <Unit section={unit}>
                        <!-- Display tasks for the main unit -->
                        {#each unit.tasks as task }
                            <div class="pl-4 border-l border-black">
                                <p class="text-sm">* {task.name}</p>
                                <p class="text-sm">Status: {task.status}</p>
                                <p class="text-sm">Score: {task.score ?? 'N/A'}</p>
                            </div>
                        {/each}
                    </Unit>
                {/each}
            {:catch error}
                <!-- Error state -->
                <div class="pl-4 border-l border-black">
                    <p class="text-sm text-red-500">Failed to load tasks and units: {error.message}</p>
                </div>
            {/await}
        </div>
        <div class="w-full md:w-1/2 flex flex-col">
            <News 
  title="Сообщение от разработчиков Эврики" 
  content={`Спасибо, что используете Эврику! Так как проект находится в ранней стадии зачатия, функционал будет дорабатываться со временем.<br/><br/>
  
  Подпишитесь на наш Telegram-канал чтобы следить за новыми обновлениями (<a class="text-blue-500 underline" href="https://t.me/acoeureka">тык</a>)<br>
  Наш Github Баг-трекер: <a class="text-blue-500 underline" href="https://github.com/velikoss/eureka-issues">тык</a><br>
  
  Состояние Эврики сейчас:<br>
  <div class="text-sm">
  ✅ Список задач<br>
  ✅ Новости<br>
  ✅ Постановка задачи<br>
  ✅ Метод решения<br>
  ✅ Алгоритм<br>
  ⬛ Блок-схема<br>
  🟨 Исходный код<br>
  ⬛ Тестирование<br>
  ⬛ Отчёт<br>
  🟨 Оптимизация логина<br>
  🟨 Общая оптимизация работы системы<br>
  </div>
  <br>
  Приколы <i class="text-sm">(проект выкидывается в публичный доступ "как есть", неотточеным до идеала, и будет обновляться)</i>:<br>
  <div class="text-sm">
  - Таска сохраняется переключением вкладок (пока что)<br>
  - Файл сохраняется через Ctrl+S<br>
  - Код не всегда появлется (скоро фикс)<br>
  - Запуска кода пока нет<br>
  - Блок-схемы пока не планируется из-за приколов с либами для неё<br>
  - Перемещение элементов кривое как моя жизнь (однажды будет фикс)<br>
  - Кривая тёмная тема местами (однажды будет фикс)<br>
  - Аккаунт иногда может залочиться в состоянии "залогинен", проблема API Авроры, не моя<br>
  - "Выкидывание" из аккаунта при каком-либо действии также является проблемой API Авроры, не моей (во всяком случае это случается реже чем в самой авроре)<br>
  - Иногда может сломаться файл. Это весело, хз поч так (рекомендую иногда экспортить задачу. <i>Импорт по json задачи будет позже 😳</i>)<br>
  - В проекте активно разрабатывает один человек, пожалейте его душу. И нет, я не расскажу ничего про то, как это работает, может быть<br>
  - <b>Авторы Эврики всё делают для хиханек хаханек 😼 и не несут никакой ответственности за ВАШИ возможные проблемы с работами и преподавательским составом</b><br>
  Все жалобы в баг-трекере которые относятся к приколам будет проигнорированы.
  </div>
  `} 
  skipDOM={true} 
  date_add={Date.now()/1000}>
</News>{#await data.news then dataNews}
                <!-- News data is loaded -->
                {#each dataNews as news, index}
                    <News title={news.title} content={news.content} date_add={news.date_add} index={index}></News>
                {/each}
            {:catch error}
                <!-- Error state for news -->
                <News title="Ошибка" resolvedContent={`Не удалось загрузить новости: ${error.message}`} date_add={Date.now()/1000} skipDOM={true}></News>
            {/await}
        </div>
    </div>
</main>
