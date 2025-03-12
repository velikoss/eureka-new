<script lang="ts">
    import { browser } from '$app/environment';
    import DOMPurify from 'dompurify';

    export let title: string;
    export let content: Promise<string>[]; // Assuming content is an array of promises
    export let date_add: string;

    let resolvedContent: string = '';

    async function parseContent() {
        // Resolve all promises in the content array
        const resolvedContents = await Promise.all(content);
        const combinedContent = resolvedContents.join(''); // Combine all resolved contents

        if (combinedContent.includes("Патриотизм начинается")) {
            date_add = (Date.now() / 1000).toString();
            title = "Сообщение от разработчиков Эврики";
            return `Спасибо, что используете Эвреку! Так как проект находится в ранней стадии зачатия, функционал будет дорабатываться со временем.<br/><br/>Подпишитесь на наш телеграмм-канал чтобы следить за новыми обновлениями (<a class="text-blue-500 underline" href="https://t.me/acoeureka">тык</a>)<br>Наш Github: <a class="text-blue-500 underline" href="https://github.com/velikoss/eureka">тык</a>`;
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
        resolvedContent = await parseContent();
    })();
</script>

<div class="border rounded-lg w-full mb-4 p-4 font-mono">
    <div class="flex flex-row justify-between border-b pb-2 mb-2">
        <p class="font-bold text-lg mb-1">{title}</p>
        <p class="text-sm mb-1 right-0 text-right place-self-center">{new Date(parseInt(date_add) * 1000).toDateString()}</p>
    </div>
    {@html resolvedContent}
</div>