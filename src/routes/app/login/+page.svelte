<script lang="ts">
    import { User, RectangleEllipsis, LogIn, Server, Key, LoaderCircle, Network, Eye, EyeOff } from "@lucide/svelte";
    import type { PageProps } from "../$types";
    import { getContext, onMount } from "svelte";
    import { browser } from "$app/environment";
    import ArmApi from "$lib/ArmAPI.svelte";
    import CryptoJS from "crypto-js";
    import { Md5 } from "ts-md5";

    let { data, form }: PageProps = $props();

    let logging = $state(false);
    let errorOffset = $state(0);
    let formOffset = $state(0);
    let screenOffset = $state(0);
    let showPassword = $state(false);
    let email = $state("");
    let password = $state("");
    let armAPI = $state();
    let toastService = $state();
    let debugLog = $state<string[]>([]); // Better debug logging

    onMount(() => {
        if (!browser) return;
        toastService = getContext('toast').toasts;
        
    });

    function addDebugLog(message: string) {
        debugLog = [...debugLog, message];
        console.log(message); // Also log to console for debugging
    }

    async function onSubmit(e: SubmitEvent & {
        currentTarget: EventTarget & HTMLFormElement;
    }) {
        try {
            const target = e.currentTarget;
            e.preventDefault();
            
            if (!armAPI) {
                addDebugLog("ArmAPI not initialized");
                form = { ...form, error: "ArmAPI not initialized" };
                return;
            }
            
            logging = true;
            // form = { ...form, error: undefined };
            addDebugLog("Starting login process");

            // 1. Get challenge from server
            addDebugLog("Requesting challenge from server");
            const challengeResponse = await fetch(`/api/newChallenge?session=${data.session}`);
            
            if (!challengeResponse.ok) {
                throw new Error(`Challenge request failed: ${challengeResponse}`);
            }
            
            const challengeData = (await challengeResponse.json()).response;
            addDebugLog(`Received challenge: ${challengeData}`);

            // 2. Generate hash
            const hash = Md5.hashStr(`0_${password}_${challengeData}`);
            addDebugLog(`Generated hash: ${hash} 0_${password}_${challengeData}`);

            // 3. Sign request with ArmAPI
            addDebugLog("Signing request with ArmAPI");
            const userId = CryptoJS.SHA256(email).words[0]
            addDebugLog(userId);
            
            const key = await new Promise<string>((resolve, reject) => {
                try {
                    armAPI.signRequest(
                        userId as any, 
                        hash as any,
                        (d: any) => {
                            resolve(d);
                        }
                    );
                    // Add timeout for safety
                    setTimeout(() => reject(new Error("ArmAPI signing timeout")), 10000);
                } catch (e) {
                    reject(e);
                }
            });
            addDebugLog(`Received key: ${key}`);

            // 4. Submit login form with key
            addDebugLog("Submitting login form");
            const formData = new FormData(target);
            formData.append('key', key);

            const response = await fetch(target.action, {
                method: 'POST',
                body: formData
            });
            
            const responseJson = await response.json();
            addDebugLog(`Login response: ${JSON.stringify(responseJson)}`);

            if (response.ok && responseJson.success) {
                // Successful login
                addDebugLog("Login successful, redirecting...");
                window.location.href = '/app';
            } else {
                throw new Error(responseJson.message || "Login failed");
            }
        } catch (e) {
            const error = e instanceof Error ? e.message : String(e);
            addDebugLog(`Error: ${error}`);
            form = { ...form, error: `Login failed: ${error}` };
            logging = false;
            
            // Show error toast if available
            if (toastService) {
                toastService.show("Login Error", error, 'error');
            }
        }
    }
</script>

{#await Promise.resolve() then _}
    <ArmApi bind:ArmAPI={armAPI} />
{/await}
<div class="absolute top-0 left-0 w-screen">
    <pre>{debugLog.join("\n")}</pre>
</div>
<div class="w-screen h-screen flex flex-col items-center justify-center pt-24" bind:clientHeight={screenOffset}>
    <div style={`--customPadding:calc(${screenOffset/2 - errorOffset - formOffset / 2 + 12}px); `} class={errorOffset == 0 || !form?.error? "fixed opacity-0" : "fixed top-[var(--customPadding)] motion-preset-slide-up p-1 error -mt-6 text-center shadow-md flex flex-col items-center justify-center w-90 h-16 bg-[#eb8c95] dark:bg-[#dc3545] text-black dark:text-white border border-black dark:border-gray-200 rounded-2xl"} bind:clientHeight={errorOffset}>
        <p>{form?.error}</p>
    </div>
    
    <form method="POST" onsubmit={onSubmit} class="border w-90 flex flex-col px-6 pb-6 gap-3 rounded-2xl shadow-lg {form?.error || logging ? "" : "motion-preset-blur-down"}" bind:clientHeight={formOffset}>
        <div class="relative w-fit text-center font-bold text-xl self-center px-2 -top-3.5 bg-white dark:bg-black gap-1 flex flex-row">Eureka 
            {#if armAPI}
                <p class=" motion-preset-slide-up-sm">Desktop</p>
            {/if}
        </div>
        <div class="relative -mt-1.5">
            <input name="email" type="email" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 dark:text-gray-200 bg-transparent rounded-lg border-1 border-black dark:border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" bind:value={email}/>
            <label for="floating_outlined" class="rounded-lg pointer-events-none absolute text-sm text-gray-500 dark:text-gray-200 {form?.error ? "duration-0" : "duration-200"} transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-black px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 flex flex-row gap-2.5"><User/> Login (@edu.mirea.ru)</label>
        </div>
        <div class="relative">
            <input name="password" type={showPassword ? "text" : "password"} class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 dark:text-gray-200 bg-transparent rounded-lg border-1 border-black dark:border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" bind:value={password}/>
            <label for="floating_outlined" class="rounded-lg pointer-events-none absolute text-sm text-gray-500 dark:text-gray-200 {form?.error ? "duration-0" : "duration-200"} transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-black px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 flex flex-row gap-2.5"><RectangleEllipsis /> Password</label>
            <button type="button" class="absolute right-3 top-3.5" onclick={() => showPassword = !showPassword}>
                {#if showPassword}
                    <EyeOff class="text-gray-500" size={20} />
                {:else}
                    <Eye class="text-gray-500" size={20} />
                {/if}
            </button>
        </div>
        <button class="border {form?.error ? "motion-preset-shake motion-opacity-in-0 motion-duration-500" : ""} w-fit mt-2 px-5 py-1 self-center rounded-md cursor-grab flex flex-row items-center justify-center gap-2.5" onclick={() => {
            logging = true;
            form = undefined;
        }}>
            {#if logging && !form?.error}
            <LoaderCircle class="motion-preset-spin"/>
            {:else}
            <LogIn size={16} />
            Log in 
            {/if}
        </button>
    </form>
    <div class="pt-3 text-xs flex flex-col text-center items-center {form?.error || logging ? "" : "motion-preset-blur-down motion-delay-200"}">
        Eureka {armAPI ? "Desktop 1.0.0" : "v0.1.2-hotfix1"} ({data.commit})<br>
        (last update: {data.commitDate})
        <div class="relative group">
            <button class="text-black dark:text-gray-200 underline">
                (ArmAPI Info)
            </button>
            <div
                class="absolute bottom-full left-1/2 px-1 top-5 h-fit py-0.5
                       transform -translate-x-1/2 mb-0.5
                       w-max text-black dark:text-white bg-white dark:bg-black
                       border dark:border-white rounded shadow-lg 
                       opacity-0 group-hover:opacity-100 transition">
                        <div class="flex flex-row gap-2.5 items-center justify-start mb-0.5">
                        <Server size={16}/> Avrora Backend: ArmAPI
                        </div>
                        <div class="flex flex-row gap-2.5 items-center justify-start mb-0.5">
                        🇷🇺 API Proxy: MSK
                        </div>
                        <div class="flex flex-row gap-2.5 items-center justify-start">
                        <Key size={16}/> Crypt: {(data as any).neoscrypt ? "Neoscrypt (WASM)" : "Fallback (Unstable)"}
                        </div>
                        <div class="flex flex-row gap-2.5 items-center justify-start">
                        <Network size={16}/> Compatible ARM Ver: 174    
                        </div>
            </div>
        </div>
        Проблема с логином? Бывает...
    </div>
</div>
