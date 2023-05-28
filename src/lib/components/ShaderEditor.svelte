<script>
    import * as Three from 'three';
    import { onMount, onDestroy } from 'svelte';
    import { globalState, shadersState } from '$lib/store'

    let shaderCode, ace, editor;
    let context; // WebGL

    let editorAreaHeight = 0;
    let markerID = 0;
    let errorMsg = '';
    let vimMode = false;

    function handleCodeChange() {
        shaderCode = editor.getValue();
        updateShader();
    }

    function applyShader() {
        shadersState.update(state => {
            state.showShaderEditor = false;
            return state;
        });
        updateShader();
    }

    function updateShader() {
        shadersState.update(state => {
            const result = validate(shaderCode, state.shaderType);
            if (!result[0]) {
                errorMsg = 'Line ' + result[1] + ' | ' + result[2];

                const session = editor.getSession();
                const row = result[1] - 1;
                session.setAnnotations([{
                    row: row,
                    column: 0,
                    text: result[2],
                    type: "error"
                }]);

                if (!markerID) {
                    const Range = ace.require('ace/range').Range;
                    const range = new Range(row, 0,
                                            row, session.getLine(row).length);
                    markerID = session.addMarker(range, "errorMarker", 'fullLine', false);
                }
                return state;
            }

            if (markerID != 0) {
                errorMsg = '';
                editor.getSession().removeMarker(markerID);
                editor.getSession().clearAnnotations();
                markerID = 0;
            }

            state.shaderCode = shaderCode;
            if (state.shaderType === 'vertex') {
                state.vertexShaderCode = shaderCode;
            } else if (state.shaderType === 'pixel') {
                state.pixelShaderCode = shaderCode;
            }

            return state;
        });
    }

    function changeMode() {
        vimMode = !vimMode;

        const handler = vimMode ? 'ace/keyboard/vim' : '';
        editor.setKeyboardHandler(handler);
    }

    onMount(async () => {
        context = new Three.WebGLRenderer().getContext();

        if (ace) { return; }

        ace = await import ('ace-builds/src-noconflict/ace');
        await import ('ace-builds/src-noconflict/mode-glsl');
        await import ('ace-builds/src-noconflict/theme-monokai');
        await import ('ace-builds/src-noconflict/keybinding-vim');

        editor = ace.edit('editor-textarea');
        editor.session.setMode('ace/mode/glsl');
        editor.on('change', handleCodeChange);
        editor.setValue(shaderCode, 1);
        editor.setOptions({
            theme: 'ace/theme/monokai',
            fontSize: '1.5em',
        });
        editor.container.style.background="transparent";
        editor.renderer.setScrollMargin(10, 60);
    });


    function validate(src, type) {
        let shader, status;
        const shaderType = (type === 'vertex') ? context.VERTEX_SHADER :
                                                 context.FRAGMENT_SHADER;

        shader = context.createShader(shaderType);
        context.shaderSource(shader, src);
        context.compileShader(shader);
        status = context.getShaderParameter(shader, context.COMPILE_STATUS);

        if (status === true) {
            return [true, null, null];
        } else {
            const log = context.getShaderInfoLog(shader);
            const lines = log.split('\n');

            // Built-in uniforms and attributes
            // https://threejs.org/docs/index.html#api/en/renderers/webgl/WebGLProgram
            const keywords = [
                "projectionMatrix",
                "modelMatrix",
                "modelViewMatrix",
                "viewMatrix",
                "cameraPosition",
                "normal",
                "uv",
                "uv2",
                "position"
            ];

            const knownErrors = [
                "storage qualifier supported in GLSL ES 3.00 and above only",
                "dimension mismatch",
                "not enough data provided for construction",
                "cannot convert from 'const highp float'"
            ];

            let line, error;
            for (let i = 0; i < lines.length; i++) {
                line = lines[i];
                if (line.substr(0, 5) === 'ERROR') {
                    if (line.includes("undeclared identifier") &&
                        keywords.some(keyword => line.includes(keyword)))
                    {
                        continue;
                    }

                    if (knownErrors.some(error => line.includes(error))) {
                        continue;
                    }


                    error = line;
                }
            }

            if (!error || error[0] === "") {
                // return [false, 0, 'Unknown error'];
                return [true, null, null];
            }

            const details = error.split(':');
            if (details.length < 4) {
                return [false, 0, error];
            }

            const message = details.splice(3).join(':');
            return [false, parseInt(details[2]), message];
        }
    }

    const unsubShaders = shadersState.subscribe(state => {
        if (state.shaderType === 'vertex') {
            shaderCode = state.vertexShaderCode;
        } else if (state.shaderType === 'pixel') {
            shaderCode = state.pixelShaderCode;
        }
    });

    const unsubGlobal = globalState.subscribe(state => {
        editorAreaHeight = window.innerHeight - state.contentAreaHeight;
    });

    onDestroy(() => {
        unsubGlobal();
        unsubShaders();
    });
</script>

<div style="--button-position: {editorAreaHeight}px;">
    <div id="editor-textarea"></div>

    <button
        id="close-btn"
        on:click={applyShader}
        aria-label="Close"
    >
	    {#each Array(2) as _}
            <span></span>
        {/each}
    </button>

    <div>
        {errorMsg}
        <button
            on:click={changeMode}
            style="background-color: {vimMode ? 'green' : 'red'};"
        >
            Vim
        </button>
    </div>
</div>

<style>
    :global(.errorMarker) {
        position: absolute;
        background: rgba(255, 50, 50, 0.2);
        z-index: 3;
    }

    div {
        position: absolute;
        background-color: rgba(35.0, 35.0, 35.0, 0.5);
        z-index: 2;
        width: 100%;
        height: 100%;
    }

    #editor-textarea {
        position: relative;
        width: 100%;
        height: 96%;
    }

    div > div:last-child {
        position: fixed;
        bottom: 0;
        z-index: 3;
        background-color: rgba(35.0, 35.0, 35.0, 1);
        width: 100%;
        height: 3%;

        color: red;
        font-family: Arial;
    }

    #close-btn {
        position: fixed;
        top: calc(var(--button-position) + 1.5vh);
        right: 1vw;
        z-index: 3;

        display: flex;
        justify-content: center;
        align-items: center;
        background: none;
        border: none;
        cursor: pointer;
        width: 2vw;
        height: 2vw;
    }

    button > span {
        display: block;
        position: absolute;
        width: 100%;
        height: 3px;
        background-color: black;
        transform-origin: center;
    }

    button > span:nth-child(1) {
        transform: rotate(45deg);
    }

    button > span:nth-child(2) {
        transform: rotate(-45deg);
    }

    div > div:last-child > button {
        position: fixed;
        right: 0;
        bottom: 0;

        height: 3%;
        color: white;

        background-repeat: no-repeat;
        border: none;
        cursor: pointer;
        overflow: hidden;
        outline: none;
    }
</style>
