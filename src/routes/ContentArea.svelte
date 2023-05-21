<script>
    import DropDown from '$lib/components/DropDown.svelte'
    import ShaderEditor from '$lib/components/ShaderEditor.svelte'
    import ScenePanel from '$lib/components/ScenePanel.svelte';
    import Editor from './Editor.svelte'

    import * as Threlte from '@threlte/core'
    import { globalState, shadersState } from '../store'
    import { onDestroy }  from 'svelte'

    let contentAreaHeight = 0;
    let showShaderEditor = false;
    let isDropAreaActive = false;

    function handleDragOver(event) {
        event.preventDefault();

        const isFileDragged = Array.from(event.dataTransfer.types).includes('Files');
        isDropAreaActive = isFileDragged;
    }

    const unsubGlobal = globalState.subscribe(state => {
        contentAreaHeight = state.contentAreaHeight;
    });

    const unsubShaders = shadersState.subscribe(state => {
        showShaderEditor = state.showShaderEditor;
    });

    onDestroy(() => {
        unsubGlobal();
        unsubShaders();
    });
</script>

<div id="content-area"
     style="--content-area-height: {contentAreaHeight}px;"
     on:dragover={handleDragOver}
>
    {#if isDropAreaActive}
        <DropDown bind:isDropAreaActive />
    {/if}

    {#if showShaderEditor}
        <ShaderEditor />
    {:else}
        <ScenePanel />
    {/if}

    <div id="canvas-wrapper">
        <Threlte.Canvas >
            <Editor />
        </Threlte.Canvas>
    </div>
</div>

<style>
    #content-area {
        width: 100%;
        height: var(--content-area-height);
    }

    #canvas-wrapper {
        width: 100%;
        height : 100%;
        position: fixed;
        left: 0;
    }
</style>
