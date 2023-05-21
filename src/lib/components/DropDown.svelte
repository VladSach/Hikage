<script>
    import { Loader } from '$lib/utils/Loader';
    import { LoaderUtils } from '$lib/utils/LoaderUtils';
    import { globalState } from '$lib/../store'
    import { onDestroy }  from 'svelte'

    export let isDropAreaActive;

    let dropAreaHeight;
    let dropAreaBorderSize = 3;

    async function handleDrop(event) {
        event.preventDefault();
        isDropAreaActive = false;

        const files = await LoaderUtils.getLoadedFiles(event.dataTransfer)
            .then((data) => { return data; });

        await Loader.loadModel(files);

        globalState.update(state => {
            state.isModelLoaded = true;
            return state;
        });
    }

    const unsubGlobal = globalState.subscribe(state => {
        dropAreaHeight = state.contentAreaHeight;
        dropAreaHeight -= dropAreaBorderSize * 2;
    });

    onDestroy(unsubGlobal);
</script>

<div class="drop-area active"
     style="
        --drop-area-height: {dropAreaHeight}px;
        --drop-area-border: {dropAreaBorderSize}px;
     "
    on:drop={handleDrop}
>
    Drop your file/folder here
</div>

<style>
    .drop-area {
        width: 100%;
        height: var(--drop-area-height);
        color: #ff0000;
        font-size: 1.5em;
        text-align: center;
        line-height: var(--drop-area-height);
        position: absolute;
    }

    .drop-area.active {
        border: var(--drop-area-border) dashed #666;
        background-color: #f9f9f9;
        opacity: 0.2;
        pointer-events: auto;
        z-index:9999
    }
</style>
