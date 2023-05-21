<script>
    import * as Threlte from '@threlte/core'
    import * as Three from 'three'
    import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper';
    import { onDestroy } from 'svelte';

    import { shadersState, modelState } from '$lib/../store'

    const gridHelper = new Three.GridHelper(20, 10)
    const axisHelper = new Three.AxesHelper(10)

    let model, material, visualMode, vsCode, psCode, textures;
    let normals = new Array();

    Threlte.useFrame(() => {
        // TODO: calc here time?
    });

    function applyVisualMode(mode) {
        if (visualMode === 'normals') { normals = []; }

        visualMode = mode;
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
                    console.log(textures);
                    const meshTextures = textures[curMesh];
                    console.log(meshTextures);


                    ++curMesh;
                });
                return;
            } break;

            case 'shaders': {
                material = new Three.ShaderMaterial({
                    vertexShader: vsCode,
                    fragmentShader: psCode,
                });
            } break;
        }

        model.traverse(node => {
            if (node.isMesh) {
                node.material = material;
            }
        });

        model.needsUpdate = true;
        material.needsUpdate = true;
    }

    const unsubModel = modelState.subscribe(state => {
        if (!state.model) { return; }

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
        unsubModel();
        unsubShaders();
    });
</script>

<Threlte.Object3DInstance object={gridHelper} />
<Threlte.Object3DInstance object={axisHelper} />

<Threlte.PerspectiveCamera
    position={{x: -2, y: 2, z: 5}} fov={50}
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

