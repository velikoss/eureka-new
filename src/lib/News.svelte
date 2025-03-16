<script lang="ts">
    import { browser } from '$app/environment';
    import DOMPurify from 'dompurify';
    import { Newspaper } from '@lucide/svelte';
    import { onMount } from 'svelte';

    let { title, content, date_add, skipDOM = false, index = 0 }: {
        title: string;
        content: Promise<string>[] | string;
        date_add: string;
        skipDOM?: boolean;
        index?: number;
    } = $props();

    let resolvedContent: string = $state("");

    async function parseContent() {
        // Resolve all promises in the content array
        if (!content) return; 
        const resolvedContents = await Promise.all(content);
        const combinedContent = resolvedContents.join('');

        if (combinedContent.includes("Патриотизм начинается")) {
            title = "Новости Авроры";
        }

        let _jsdom;
        if (!browser) {
            return;
        }
        const _window = window;
        const purify = DOMPurify(_window);
        const _document = document;

        const sanitizedContent = purify.sanitize(combinedContent);

        const tempDiv = _document.createElement('div');
        tempDiv.innerHTML = sanitizedContent;

        const elementsWithStyle = tempDiv.querySelectorAll('[style]');
        elementsWithStyle.forEach(element => {
            element.removeAttribute('style');
        });

        const styleTags = tempDiv.querySelectorAll('style');
        styleTags.forEach(styleTag => {
            styleTag.remove();
        });

        const wrapUrlsInText = (text: string) => {
            const urlRegex = /https:\/\/[^\s]+/g;
            return text.replace(urlRegex, (url) =>
                `<a class="text-blue-500 underline" href="${url}" target="_blank">${url}</a>`);
        };

        const walker = _document.createTreeWalker(tempDiv, 4, null);
        const nodesToReplace = [];

        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.nodeType === 3 && node.textContent?.includes("https://")) {
                const wrappedText = wrapUrlsInText(node.textContent);
                const newNode = _document.createElement('span');
                newNode.innerHTML = wrappedText;
                nodesToReplace.push({ node, replacement: newNode });
            }
        }

        for (const { node, replacement } of nodesToReplace) {
            node.parentNode?.replaceChild(replacement, node);
        }

        // Return the cleaned HTML
        return tempDiv.innerHTML;
    }

    onMount(async () => {
        if (!skipDOM) resolvedContent = await parseContent() ?? "";
        else resolvedContent = content as string;
    });
</script>

<div class="motion-preset-blur-down border rounded-lg w-full mb-4 p-4 shadow-md">
    <div class="flex flex-row justify-between border-b pb-2 mb-2">
        <div class="flex flex-row gap-1.5 items-center">
            <div class="mb-1"><Newspaper size={18} /></div>
            <p class="font-bold text-lg mb-1">{title}</p>
        </div>
        <p class="text-sm mb-1 right-0 text-right place-self-center">{new Date(parseInt(date_add) * 1000).toDateString()}</p>
    </div>
    {@html resolvedContent}
</div>
