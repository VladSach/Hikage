<script>
    import { Pane } from 'tweakpane'
    import { browser } from '$app/environment'
    import { onMount } from 'svelte';
    import { globalState, modelState, shadersState } from '$lib/../store'

    let offsetX, offsetY;
	let moving = false;
	
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
		offsetX = clamp(offsetX, 0, window.innerWidth - panel.offsetWidth);
		offsetY = clamp(offsetY, 0, window.innerHeight - panel.offsetHeight);
	}

    let modelValues = $modelState;
    let globals = $globalState;

    function drawGui() {
        const panel = document.getElementById('scene-panel');
        offsetX = panel.getBoundingClientRect().left;
        offsetY = panel.getBoundingClientRect().top;

        if (!browser) { return; }

        const pane = new Pane({
            expanded: true,
            container: document.getElementById('pane-content')
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
        modelControls.addMonitor(modelValues, 'triangles');
        modelControls.addMonitor(modelValues, 'meshes');
        modelControls.addMonitor(modelValues, 'texturesN', {
            label: 'textures'
        });

        const sceneControls = pane.addFolder({title: 'Scene'});
        sceneControls.addInput(globals, 'skybox', {
            options: {
                none: 'none',
                skybox1: 'skybox1',
                skybox2: 'skybox2',
            },
            label: 'Skybox',
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
    }

    onMount(() => {
        drawGui();
    });

</script>

<div
    id="scene-panel"
    style="left: {offsetX}px; top: {offsetY}px;"
>
    <div
        id="pane-title"
        on:mousedown={onMouseDown}
    >
        Controls
    </div>
    <div id="pane-content"></div>
</div>
<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
    #scene-panel {
        position: absolute;
        right: 0px;
        width: 15%;
        z-index: 9999;
    }

    #pane-title {
        cursor: move;
        z-index: 9999;
        background-color: #2196F3;
        color: #fff;
        padding: 0.5vh;
        text-align: center;
        user-select: none;
    }
</style>
