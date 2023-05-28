import { Loader } from '$lib/utils/Loader'
import { ModelUtils } from './ModelUtils'
import { globalState, modelState, shadersState} from '$lib/store'

export const Examples = {
    texturedModel: async function() {
        globalState.update(state => {
            state.showLoader = true;
            return state;
        });

		const { GLTFLoader }  = await import('three/addons/loaders/GLTFLoader.js');

        const loader = new GLTFLoader();
        const scene = await loader.loadAsync('/models/skull_salazar/scene.gltf');

		modelState.update(state => {
            ModelUtils.setModelScale(scene.scene);
			state.model = scene.scene;

            state.visualMode = 'textures';
            state.vertices = 0;
            state.indices = 0;
            state.meshes = 0;
            state.texturesN = 0;
            state.textures = new Array();

            ModelUtils.getModelInfo(scene.scene, state);
			return state;
		});

        globalState.update(state => {
            state.showLoader = false;
            return state;
        });
    },

    applyNormalShaders: async function () {
        const vs = await (await fetch('shaders/visNormals.vert.glsl')).text();
        const ps = await (await fetch('shaders/visNormals.frag.glsl')).text();

        modelState.update(state => {
            if (state.model === 0)
                Loader.loadPrimitive('Sphere');

            state.visualMode = 'shaders';
            return state;
        });

        shadersState.update(state => {
            state.vertexShaderCode = vs;
            state.pixelShaderCode = ps;
            return state;
        });
    },

    applyColoredTwistShaders: async function () {
        const vs = await (await fetch('shaders/coloredTwist.vert.glsl')).text();
        const ps = await (await fetch('shaders/coloredTwist.frag.glsl')).text();

        modelState.update(state => {
            if (state.model === 0)
                Loader.loadPrimitive('Torus');

            state.visualMode = 'shaders';
            return state;
        });

        shadersState.update(state => {
            state.vertexShaderCode = vs;
            state.pixelShaderCode = ps;
            return state;
        });
    },

    applyCosmosShader: async function () {
        const vs = await (await fetch('shaders/cosmos.vert.glsl')).text();
        const ps = await (await fetch('shaders/cosmos.frag.glsl')).text();

        modelState.update(state => {
            Loader.loadPrimitive('Cube');

            state.visualMode = 'shaders';
            return state;
        });

        shadersState.update(state => {
            state.vertexShaderCode = vs;
            state.pixelShaderCode = ps;
            return state;
        });
    },
};
