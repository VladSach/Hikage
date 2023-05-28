<script>
    import DropDown from '$lib/components/DropDown.svelte'
    import ShaderEditor from '$lib/components/ShaderEditor.svelte'
    import ScenePanel from '$lib/components/ScenePanel.svelte'
    import Editor from '$lib/components/Editor.svelte'
    import LoadingBar from '$lib/components/LoadingBar.svelte'
    import ShareForm from '$lib/components/ShareForm.svelte'
    import { globalState, shadersState } from '$lib/store'

    import * as Threlte from '@threlte/core'
    import { onDestroy }  from 'svelte'

    let contentAreaHeight = 0;
    let showLoad = false;
    let showShareForm = false;
    let showShaderEditor = false;
    let isDropAreaActive = false;

    function handleDragOver(event) {
        event.preventDefault();

        const isFileDragged = Array.from(event.dataTransfer.types).includes('Files');
        isDropAreaActive = isFileDragged;
    }

    const unsubGlobal = globalState.subscribe(state => {
        contentAreaHeight = state.contentAreaHeight;
        showLoad = state.showLoader;
        showShareForm = state.showShareForm;
    });

    const unsubShaders = shadersState.subscribe(state => {
        showShaderEditor = state.showShaderEditor;
    });

    onDestroy(() => {
        unsubGlobal();
        unsubShaders();
    });
</script>

<div
     style="--content-area-height: {contentAreaHeight}px;"
     on:dragover={handleDragOver}
>
    {#if showLoad}
        <LoadingBar />
    {/if}

    {#if isDropAreaActive}
        <DropDown bind:isDropAreaActive />
    {/if}

    {#if isDropAreaActive}
        <ShareForm />
    {/if}

    {#if showShaderEditor}
        <ShaderEditor />
    {:else}
        <ScenePanel />
    {/if}

    <div>
        <Threlte.Canvas >
            <Editor />
        </Threlte.Canvas>
    </div>
</div>

<style>
    div {
        width: 100%;
        height: var(--content-area-height);
    }

    div > div {
        width: 100%;
        height : 100%;
        position: fixed;
        left: 0;
    }
</style>
