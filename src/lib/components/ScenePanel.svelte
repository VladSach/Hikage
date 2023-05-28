<script>
    import { Pane } from 'tweakpane'
    import { browser } from '$app/environment'
    import { onMount, afterUpdate } from 'svelte';
    import { globalState, modelState, shadersState } from '$lib/store'

    let offsetX, offsetY, twHeight;
	let moving = false;

    let pane;
    let globals = $globalState;
    let modelValues = $modelState;
	
	function onMouseDown() { moving = true; }
	function onMouseUp()   { moving = false; }
	function onMouseMove(event) {
	    if (!moving) { return; }

		offsetX += event.movementX;
		offsetY += event.movementY;

        const clamp = (num, a, b) => {
            return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
        }

        const panel = document.getElementById('scene-panel');
        const bar = window.innerHeight - globals.contentAreaHeight + 30;

		offsetX = clamp(offsetX, 0, window.innerWidth - panel.offsetWidth);
		offsetY = clamp(offsetY, bar, window.innerHeight - panel.offsetHeight);
	}

    function drawGui() {
        const panel = document.getElementById('scene-panel');
        offsetX = panel.getBoundingClientRect().left;
        offsetY = panel.getBoundingClientRect().top;

        if (!browser) { return; }

        const content = document.getElementById('pane-content');

        pane = new Pane({
            expanded: true,
            container: content
        });

        const modelControls = pane.addFolder({title: 'Model'});
        const modeList = modelControls.addInput(modelValues, 'visualMode', {
            options: {
                wireframe: 'wireframe',
                normals: 'normals',
                textures: 'textures',
                shaders: 'shaders',
            },
            label: 'Visual Mode',
        });

        modeList.on('change', (ev) => {
            modelState.update(state => {
                state.visualMode = ev.value;
                return state;
            });
        });

        modelControls.addSeparator();

        modelControls.addMonitor(modelValues, 'vertices');
        modelControls.addMonitor(modelValues, 'indices');
        modelControls.addMonitor(modelValues, 'meshes');
        modelControls.addMonitor(modelValues, 'texturesN', {
            label: 'textures'
        });

        const sceneControls = pane.addFolder({title: 'Scene'});
        sceneControls.addInput(globals, 'skybox', {
            options: {
                none: 'none',
                mountains: 'mountains.hdr',
                ruines: 'ruines.jpg',
                bridge: 'bridge.jpg',
            },
            label: 'Skybox',
        }).on('change', (ev) => {
            globalState.update(state => {
                state.skybox = ev.value;
                return state;
            });
        });

        const shadersControls = pane.addFolder({title: 'Shaders'});
        const vertexBtn = shadersControls.addButton({
            title: 'Edit',
            label: 'Vertex Shader'
        });
        const pixelBtn = shadersControls.addButton({
            title: 'Edit',
            label: 'Pixel Shader'
        });

        shadersControls.addButton({
            title: 'Share',
        }).on('click', () => {
            globalState.update(state => {
                state.showShareForm = true;
                return state;
            });
        });

        vertexBtn.on('click', () => {
            shadersState.update(state => {
                state.showShaderEditor = true;
                state.shaderType = 'vertex';
                return state;
            });
        });

        pixelBtn.on('click', () => {
            shadersState.update(state => {
                state.showShaderEditor = true;
                state.shaderType = 'pixel';
                return state;
            });
        });

        twHeight = content.offsetHeight;
    }

    onMount(() => {
        drawGui();
    });

    afterUpdate(() => {
        pane.refresh();
    });

</script>

<div
    id="scene-panel"
    style="left: {offsetX}px; top: {offsetY}px; --twHeight: {twHeight}px"
>
    <div on:mousedown={onMouseDown}>
        Controls
    </div>
    <div id="pane-content"></div>
</div>
<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
    :root {
        --tp-container-background-color:        rgba(69, 64, 79, 1.0);
        --tp-container-background-color-active: rgba(69, 64, 79, 1.0);
        --tp-container-background-color-focus:  rgba(69, 64, 79, 1.0);
        --tp-container-background-color-hover:  rgba(69, 64, 79, 1.0);
    }

    #scene-panel {
        position: absolute;
        right: 0;
        top: 65px;
        width: 15%;
        height: calc(var(--twHeight) + 35);
        z-index: 2;
    }

    div > div:nth-child(1) {
        cursor: move;
        text-align: center;
        user-select: none;

        position:absolute;
        width: 100%;
        top: -30px;
        height: 35px;

        line-height: 35px;
        font-size: 1.1em;
        font-family: Arial, sans-serif;

        color: rgba(255, 255, 255, 0.6);
        background-color: rgba(69, 64, 79, 1.0);
    }
</style>
