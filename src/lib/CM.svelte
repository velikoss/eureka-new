<script lang="ts">
    import { EditorView, keymap } from "@codemirror/view";
    import { cpp } from "@codemirror/lang-cpp";
    import { indentWithTab } from "@codemirror/commands";
    import { basicSetup } from "codemirror";
    import { onMount } from "svelte";

    let { value = $bindable(), onchange } = $props();
    
    let rootEl: HTMLElement | undefined = undefined;
    let editorView: EditorView | undefined = undefined;

    let didJustChange = false;
    let initial = true;

    export function getValue(): string {
        return editorView?.state.doc.toString() ?? "";
    }


    export function setValue(newValue: string) {
        editorView?.dispatch({
            changes: {
                from: 0,
                to: editorView.state.doc.length,
                insert: newValue,
            }
        });
    }

    onMount(() => {
        console.log(rootEl, value);
        const baseTheme = EditorView.theme({
            "&": { height: "100%" },
            ".cm-editor": { height: "100%" },
            ".cm-scroller": { overflow: "auto", height: "100%" },
            ".cm-gutter": { overflow: "auto", height: "100%" },
        });
        editorView = new EditorView({
            parent: rootEl!,
            extensions: [
                basicSetup,
                keymap.of([indentWithTab]),
                cpp(),
                EditorView.updateListener.of(upd => {
                    if (upd.docChanged) {
                        onchange();
                    }
                    // TODO: make a separate function for access, this is expensive.
                    value = upd.view.state.doc.toString();
                    didJustChange = true;
                    initial = false;
                }),
            ],
        });
    })

    $effect(() => {
        if (editorView !== undefined && (!didJustChange || initial)) {
            
        }
    });
</script>

<div bind:this={rootEl} class="h-full">

</div>
