<script lang="ts">
    import { EditorView, keymap } from "@codemirror/view";
    import { cpp } from "@codemirror/lang-cpp";
    import { indentWithTab } from "@codemirror/commands";
    import { basicSetup } from "codemirror";

    let { value = $bindable(), onchange } = $props();
    
    /** @type {HTMLElement?} */
    let rootEl = undefined;

    /** @type {EditorView} */
    let editorView = undefined;

    $effect(() => {
        editorView = new EditorView({
            root: rootEl!,
            extensions: [basicSetup, keymap.of([indentWithTab]), cpp()],
            dispatchTransactions(trs, view) {
                if (trs.some(tr => tr.docChanged)) {
                    onchange();
                }
                view.update(trs);
                // TODO: make a separate function for access, this is expensive.
                value = view.state.doc.toString();
            },
        });
    });
</script>

<div bind:this={rootEl}>

</div>
