<script lang="ts">
    import News from "./News.svelte";

    let { task = $bindable() } = $props();
</script>

<div class="w-full space-y-4 flex flex-col py-2 px-3">
    <div style="" class="self-center w-1/2">
        <News title="Объявление" content="Разработчики Авроры отключили браузерную версию системы, тем самым отрубив возможность видеть API методы. Из-за этого этот инструмент read-only 🥲" date_add={Date.now() / 1000} />
    </div>
    {@html task.algo_text}
</div>
