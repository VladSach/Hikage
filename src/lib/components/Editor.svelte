<script>
    import * as Three from 'three'
    import * as Threlte from '@threlte/core'
	// import * as Extras from '@threlte/extras'
    import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper';
    import { onMount, onDestroy } from 'svelte';

    import { globalState, shadersState, modelState } from '$lib/store'

    const gridHelper = new Three.GridHelper(20, 10);
    const axisHelper = new Three.AxesHelper(5);

    let model, material, visualMode, textures;
    let vsCode, psCode;

    let skybox = 'none';
    let normals = new Array();

    let editorHeight = 0;
    let mouse = new Three.Vector2();

    const { clock } = Threlte.useThrelte();
    Threlte.useFrame(() => {
        if (visualMode === 'shaders') {
            applyVisualMode('shaders');
        }
    });

    function applyVisualMode(mode) {
        if (visualMode === 'normals') { normals = []; }

        visualMode = mode;

        if (!model) { return; }

        switch (mode) {
            case 'wireframe': {
                material = new Three.MeshBasicMaterial({
                    wireframe: true,
                });
            } break;

            case 'normals': {
                model.traverse(node => {
                    if (!node.isMesh) { return; }
                    normals.push(new VertexNormalsHelper(node, 0.2, 0x0000ff));
                });
                material = new Three.MeshBasicMaterial();
            } break;

            case 'textures': {
                let curMesh = 0;
                model.traverse(node => {
                    if (!node.isMesh) { return; }

                    node.material = new Three.MeshStandardMaterial();

                    const meshTextures = textures[curMesh];
                    meshTextures.forEach((value, key) => {
                        node.material[key] = value;

                        if (key == 'metalnessMap') {
                            node.material.metalness = 1;
                        }

                    });

                    node.material.needsUpdate = true;
                    ++curMesh;
                });

                model.needsUpdate = true;
            } return;

            case 'shaders': {
                material = new Three.ShaderMaterial({
                    side: Three.DoubleSide,

                    vertexShader: vsCode,
                    fragmentShader: psCode,

                    glslVersion: Three.GLSL3,
                    uniforms: {
                        time: { value: clock.getElapsedTime() },
                        resolution: new Three.Uniform(new Three.Vector2(
                            window.innerWidth,
                            editorHeight
                        )),
                        mouse: { value: mouse },
                    },
                });
            } break;
        }

        model.traverse(node => {
            if (node.isMesh) {
                node.material = material;
            }
        });

        material.needsUpdate = true;
        model.needsUpdate = true;
    }

    const unsubGlobal = globalState.subscribe(state => {
        editorHeight = state.contentAreaHeight;
        skybox = state.skybox;
    });

    const unsubModel = modelState.subscribe(state => {
        model = state.model;

        textures = state.textures;

        if (visualMode != state.visualMode) {
            applyVisualMode(state.visualMode);
        }
    });

    const unsubShaders = shadersState.subscribe(state => {
        vsCode = state.vertexShaderCode;
        psCode = state.pixelShaderCode;

        if (visualMode === 'shaders') {
            applyVisualMode('shaders');
        }
    });

    onDestroy(() => {
        unsubGlobal();
        unsubModel();
        unsubShaders();
    });

    onMount(() => {
		globalState.update(state => {
	        state.showLoader = false;
	        return state;
	    });

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        function onDocumentMouseMove(event) {
            event.preventDefault();
            mouse.x =  (event.clientX / window.innerWidth)  * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }
    });
</script>

<Threlte.Object3DInstance object={gridHelper} />
<Threlte.Object3DInstance object={axisHelper} />

{#if skybox != 'none'}
    <!-- <Extras.Environment -->
    <!--     path='/skybox/' -->
    <!--     files='{skybox}' -->
    <!--     isBackground=true -->
    <!-- /> -->
{/if}

<Threlte.PerspectiveCamera
    position={{x: -2, y: 2, z: 5}}
    fov={50}
>
    <Threlte.OrbitControls />
</Threlte.PerspectiveCamera>

<Threlte.AmbientLight color="white" intensity={0.2}/>

<Threlte.DirectionalLight
    color="white"
    intensity={2}
    position={{x: 10, y: 10}}
    shadow={{camera: {top: 8},}}
/>

{#if model}
    <Threlte.Object3DInstance object={model} />

    {#if normals.length > 0}
        {#each {length: normals.length} as _, i}
            <Threlte.Object3DInstance object={normals[i]} />
        {/each}
    {/if}
{/if}
