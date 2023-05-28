import * as Three from 'three'
import { globalState, modelState } from '$lib/store'
import { ModelUtils } from './ModelUtils'

export const Loader = {
    loadPrimitive: function (type) {
        let geometry;

        switch (type) {
            case 'Cube':
                geometry = new Three.BoxGeometry();
                break;

            case 'Sphere':
                geometry = new Three.SphereGeometry();
                break;

            case 'Torus':
                geometry = new Three.TorusGeometry();
                break;

            default:
                geometry = new Three.BoxGeometry(1, 1, 1);
                console.error('Unknown primitive');
        }

        const material = new Three.MeshStandardMaterial();
        const mesh = new Three.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        ModelUtils.setModelScale(mesh);

        const model = new Three.Group();
        model.add(mesh);

		modelState.update(state => {
			state.model = model;

            state.vertices = 0;
            state.indices = 0;
            state.meshes = 0;
            state.texturesN = 0;
            state.textures = new Array();

            ModelUtils.getModelInfo(model, state);

			return state;
		});
    },

    loadModel: async function (files) {
        if (!files || files.size === 0) {
            console.error('No files found');
            alert('No files found');
            return;
        }

        globalState.update(state => {
            state.showLoader = true;
            return state;
        });

        function convertKeysToLowercase(map) {
            const newMap = new Map();
            for (const [key, value] of map.entries()) {
                const lowercaseKey = key.substring(0, key.length-3) +
                                     key.substring(key.length-3).toLowerCase();

                const lowercaseName = value.name.substring(0, value.name.length-3) +
                                      value.name.substring(value.name.length-3).toLowerCase();

                const lowercaseValue = new File([value], lowercaseName);
                newMap.set(lowercaseKey, lowercaseValue);
            }
            return newMap;
        }
        files = convertKeysToLowercase(files)

        const modelFile = Array.from(files.values()).find(file =>
            file.name.endsWith('.gltf') ||
            file.name.endsWith('.glb')  ||
            file.name.endsWith('.fbx')  ||
            file.name.endsWith('.obj')
        );

        if (!modelFile) {
            console.error('Model file not found');
            alert('Model file not found');
            return;
        }

        // PERF: store blobs?
        const manager = new Three.LoadingManager();

        const response = await fetch('/models/missing.jpg');
        const file = await response.blob();
        const fallbackTexture = URL.createObjectURL(file)

	    manager.setURLModifier(function(url) {
            let file, blob;

            if (!url) { return fallbackTexture; }

            url = url.substring(0,url.length-3) + url.substring(url.length-3).toLowerCase();
            files.forEach((value, key) => {
                if (key.includes(url)) {
                    file = files.get(key);
		            blob = URL.createObjectURL(file);
                }
            });

            if (!blob) { return fallbackTexture; }

            return blob;
	    });

        this.loadFile(modelFile, manager);
    },

    loadFile: function (value, manager) {
	    const file = value;
	    const filename = file.name;
	    const extension = filename.split('.').pop().toLowerCase();

        switch (extension) {
            case 'gltf': this.loadGLTF(value, manager); break;
            case 'fbx':  this.loadFBX(value, manager);  break;
            case 'obj':  this.loadOBJ(value, manager);  break;
            default: alert('Unsupported file type');
        }
    },

    loadGLTF: function (value, manager) {
	    const file = value;
	    const filename = file.name;

        const reader = new FileReader();

        reader.addEventListener('load', async function (event) {
			const contents = event.target.result;

			const { DRACOLoader } = await import('three/addons/loaders/DRACOLoader.js');
			const { GLTFLoader }  = await import('three/addons/loaders/GLTFLoader.js');

			const dracoLoader = new DRACOLoader();
			dracoLoader.setDecoderPath( '../examples/jsm/libs/draco/gltf/' );

			const loader = new GLTFLoader(manager);
			loader.setDRACOLoader(dracoLoader);

			loader.parse(contents, '', function (result) {
				const scene = result.scene;

                ModelUtils.setModelScale(scene);

				scene.name = filename;
				modelState.update(state => {
				    state.model = scene;

                    state.vertices = 0;
                    state.indices = 0;
                    state.meshes = 0;
                    state.texturesN = 0;
                    state.textures = new Array();

                    ModelUtils.getModelInfo(scene, state);
				    return state;
				});

                globalState.update(state => {
                    state.showLoader = false;
                    return state;
                });

				dracoLoader.dispose();
			});

		}, false);
		reader.readAsArrayBuffer(file);
    },

    loadFBX: function (value, manager) {
	    const file = value;
	    const filename = file.name;

        const reader = new FileReader();

        reader.addEventListener('load', async function (event) {
			const contents = event.target.result;

			const { FBXLoader } = await import('three/addons/loaders/FBXLoader.js');

			const loader = new FBXLoader(manager);

			const scene = loader.parse(contents);

            ModelUtils.setModelScale(scene);

			scene.name = filename;
			modelState.update(state => {
				state.model = scene;

                state.vertices = 0;
                state.indices = 0;
                state.meshes = 0;
                state.texturesN = 0;
                state.textures = new Array();

                ModelUtils.getModelInfo(scene, state);
				return state;
			});

            globalState.update(state => {
                state.showLoader = false;
                return state;
            });

		}, false);
		reader.readAsArrayBuffer(file);
    },

    loadOBJ: function (value, manager) {
        // TODO: verify this function work
	    const file = value;
	    const filename = file.name;

        const reader = new FileReader();

        reader.addEventListener('load', async function (event) {
			const contents = event.target.result;

			const { OBJLoader } = await import('three/addons/loaders/OBJLoader.js');

			const loader = new OBJLoader(manager);

			const scene = loader.parse(contents);

            ModelUtils.setModelScale(scene);

			scene.name = filename;
			modelState.update(state => {
				state.model = scene;

                state.vertices = 0;
                state.indices = 0;
                state.meshes = 0;
                state.texturesN = 0;
                state.textures = new Array();

                ModelUtils.getModelInfo(scene, state);
				return state;
			});

            globalState.update(state => {
                state.showLoader = false;
                return state;
            });

		}, false);
		reader.readAsArrayBuffer(file);
    },
};
