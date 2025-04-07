<script lang="ts">
    import { browser } from '$app/environment';
    import DOMPurify from 'dompurify';
    import { Newspaper, ChevronDown, ChevronUp } from '@lucide/svelte';
    import { onMount } from 'svelte';

    let { title, content, date_add, skipDOM = false, index = 0, alwaysExpanded = false }: {
        title: string;
        content: Promise<string>[] | string;
        date_add: string;
        skipDOM?: boolean;
        index?: number;
        alwaysExpanded?: boolean;
    } = $props();

    let resolvedContent: string = $state("");
    let isExpanded = $state(alwaysExpanded);
    let isOverflowing = $state(false);
    let contentHeight = $state(alwaysExpanded ? "auto" : "0px");
    let contentRef: HTMLElement | undefined = $state();

    async function parseContent() {
        if (!content) return; 
        const resolvedContents = await Promise.all(content);
        const combinedContent = resolvedContents.join('');

        if (combinedContent.includes("Патриотизм начинается")) {
            title = "Новости Авроры";
        }

        if (!browser) return;

        const purify = DOMPurify(window);
        const sanitizedContent = purify.sanitize(combinedContent);

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sanitizedContent;

        const elementsWithStyle = tempDiv.querySelectorAll('[style]');
        elementsWithStyle.forEach(element => element.removeAttribute('style'));

        const styleTags = tempDiv.querySelectorAll('style');
        styleTags.forEach(styleTag => styleTag.remove());

        const wrapUrlsInText = (text: string) => {
            const urlRegex = /https:\/\/[^\s]+/g;
            return text.replace(urlRegex, (url) =>
                `<a class="text-blue-500 underline" href="${url}" target="_blank">${url}</a>`);
        };

        const walker = document.createTreeWalker(tempDiv, 4, null);
        const nodesToReplace = [];

        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.nodeType === 3 && node.textContent?.includes("https://")) {
                const wrappedText = wrapUrlsInText(node.textContent);
                const newNode = document.createElement('span');
                newNode.innerHTML = wrappedText;
                nodesToReplace.push({ node, replacement: newNode });
            }
        }

        for (const { node, replacement } of nodesToReplace) {
            node.parentNode?.replaceChild(replacement, node);
        }

        return tempDiv.innerHTML;
    }

    function toggleExpand() {
        if (!contentRef) return;
        isExpanded = !isExpanded;
    }

    onMount(async () => {
        if (!skipDOM) resolvedContent = await parseContent() ?? "";
        else resolvedContent = content as string;
        
        setTimeout(() => {
            if (!contentRef) return;
            isOverflowing = contentRef.scrollHeight > 128;
            contentHeight = alwaysExpanded ? "auto" : "128px";
        }, 100);
    });
</script>

<div class="motion-preset-blur-down border rounded-lg w-full mb-2 py-2.5 px-4 shadow-md transition-all duration-300 hover:shadow-lg">
    <div class="flex flex-row justify-between">
        <div class="flex flex-row gap-1.5 items-center">
            <div class=""><Newspaper size={18} /></div>
            <p class="font-bold text-lg">{@html title}</p>
        </div>
        <div class="flex items-center gap-2 ml-1">
            <p class="text-sm right-0 text-right place-self-center">
                {new Date(parseInt(date_add) * 1000).toLocaleDateString()}
            </p>
            {#if !alwaysExpanded}
                <button 
                    class="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    onclick={toggleExpand}
                    aria-label={isExpanded ? "Свернуть новость" : "Развернуть новость"}
                >
                {#if isExpanded} 
                    <ChevronUp size={18} /> 
                {:else} 
                    <ChevronDown size={18} />
                {/if}
                </button>
            {/if}
        </div>
    </div>
    <div 
        bind:this={contentRef}
        id="news-content-{index}"
        class="overflow-hidden transition-[height] duration-200 ease-in-out"
        style="height: {isExpanded ? (contentRef ? contentRef.scrollHeight + 'px' : 'auto') : '0px'}"
    >
        {@html resolvedContent}
    </div>
</div>