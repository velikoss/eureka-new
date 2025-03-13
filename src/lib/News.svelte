<script lang="ts">
    import { browser } from '$app/environment';
    import DOMPurify from 'dompurify';
    import { Newspaper } from '@lucide/svelte';

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
        const combinedContent = resolvedContents.join(''); // Combine all resolved contents

        if (combinedContent.includes("Патриотизм начинается")) {
            title = "Новости Авроры";
        }

        let _jsdom;
        if (!browser) {
            let { JSDOM } = await import('jsdom');
            _jsdom = new JSDOM('');
        }
        const _window = browser ? window : _jsdom?.window;
        const purify = DOMPurify(_window);
        const _document = browser ? document : _jsdom?.window.document;

        // Sanitize the content to remove any potentially harmful HTML
        const sanitizedContent = purify.sanitize(combinedContent);

        // Create a temporary div element to manipulate the HTML
        const tempDiv = _document.createElement('div');
        tempDiv.innerHTML = sanitizedContent;

        // Remove all inline styles from elements
        const elementsWithStyle = tempDiv.querySelectorAll('[style]');
        elementsWithStyle.forEach(element => {
            element.removeAttribute('style');
        });

        // Remove any <style> tags
        const styleTags = tempDiv.querySelectorAll('style');
        styleTags.forEach(styleTag => {
            styleTag.remove();
        });

        // Function to wrap URLs in <a> tags
        const wrapUrlsInText = (text: string) => {
            const urlRegex = /https:\/\/[^\s]+/g; // Global flag to match all occurrences
            return text.replace(urlRegex, (url) => `<a class="text-blue-500 underline" href="${url}" target="_blank">${url}</a>`);
        };

        // Traverse all text nodes and wrap URLs
        const walker = _document.createTreeWalker(tempDiv, 4, null);
        const nodesToReplace = [];

        // First, collect all text nodes that need to be replaced
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.nodeType === 3 && node.textContent?.includes("https://")) {
                const wrappedText = wrapUrlsInText(node.textContent);
                const newNode = _document.createElement('span');
                newNode.innerHTML = wrappedText;
                nodesToReplace.push({ node, replacement: newNode });
            }
        }

        // Replace the text nodes with the new <span> elements
        nodesToReplace.forEach(({ node, replacement }) => {
            node.parentNode?.replaceChild(replacement, node);
        });

        // Return the cleaned HTML
        return tempDiv.innerHTML;
    }

    // Resolve the content when the component is created
    (async () => {
        if (!skipDOM) resolvedContent = await parseContent();
        else resolvedContent = content;
    })();
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