<script lang="ts">
    import type { PageProps } from "../$types";

    let { data, form, neoscrypt }: PageProps = $props();

</script>

<div class="w-screen h-screen flex flex-col items-center justify-center font-mono ">
    {#if form?.error}
    <div class="error -mt-6 text-center underline flex flex-col items-center justify-center mb-5 w-90 h-16 bg-rose-300 dark:bg-rose-900 text-black dark:text-white border border-black dark:border-gray-200 rounded-2xl">
        <p>{form?.error}</p>
    </div>
    {/if}
    
    <form method="POST" class="border w-90 flex flex-col px-6 pb-6 gap-3 rounded-2xl">
        <p class="relative w-fit text-center text-xl self-center px-2 -top-3.5 bg-white dark:bg-black">Eureka</p>
        <div class="relative">
            <input name="email" type="email" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 dark:text-gray-200 bg-transparent rounded-lg border-1 border-black dark:border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=""/>
            <label for="floating_outlined" class="absolute text-sm text-gray-500 dark:text-gray-200 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-black px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1">Login (@edu.mirea.ru)</label>
        </div>
        <div class="relative">
            <input name="password" type="password" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 dark:text-gray-200 bg-transparent rounded-lg border-1 border-black dark:border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=""/>
            <label for="floating_outlined" class="absolute text-sm text-gray-500 dark:text-gray-200 duration-200 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-black px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1">Password</label>
        </div>
        <button class="border w-fit px-5 py-1 self-center rounded-md cursor-grab">
            Log in
        </button>
    </form>
    <div class="pt-3 text-xs flex flex-row items-center gap-2">
        Eureka v0.1.0
        <div class="relative group">
            <button class="text-black dark:text-gray-200 underline">
                (ArmAPI Info)
            </button>
            <div
                class="absolute bottom-full left-1/2 px-1 py-0.5
                       transform -translate-x-1/2 mb-0.5
                       w-max text-sm text-black dark:text-white bg-white dark:bg-black
                       border dark:border-white rounded shadow-lg 
                       opacity-0 group-hover:opacity-100 transition">
                       Avrora Backend: ArmAPI<br/>
                       Crypto: {data.neoscrypt ? "Neoscrypt (WASM)" : "Fallback"}
            </div>
        </div></div>
</div>