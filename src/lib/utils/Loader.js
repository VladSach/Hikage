import * as Three from 'three'
import { modelState } from '$lib/../store'
import { ModelUtils } from './ModelUtils'

export const Loader = {
    loadModel: async function (files) {
        if (!files || files.size === 0) {
            console.error('No files found');
            return;
        }

        const modelFile = Array.from(files.values()).find(file =>
            file.name.endsWith('.gltf') ||
            file.name.endsWith('.glb') ||
            file.name.endsWith('.fbx') ||
            file.name.endsWith('.obj')
        );

        if (!modelFile) {
            console.error('Model file not found');
            return;
        }

        // PERF: store blobs?
        const manager = new Three.LoadingManager();
	    manager.setURLModifier(function(url) {
		    const file = files.get('/' + url);

		    if (file) {
		        const blob = URL.createObjectURL(file);
			    return blob;
		    }

	    });

        this.loadFile(modelFile, manager);
    },

    loadFile: function (value, manager) {
	    const file = value;
	    const filename = file.name;
	    const extension = filename.split('.').pop().toLowerCase();

        switch (extension) {
            case 'gltf': this.loadGLTF(value, manager); break;
            // case 'fbx': return loadFBX(value, manager);
            // case 'obj': return loadOBJ(value, manager);
            default: console.error('Unsupported file type');
        }
    },

    loadGLTF: function (value, manager) {
	    const file = value;
	    const filename = file.name;
	    const extension = filename.split('.').pop().toLowerCase();

        const reader = new FileReader();
		reader.addEventListener('progress', function (event) {
			const size = '(' + Math.floor(event.total / 1000) + ' KB)';
			console.log('Loading', filename, size);
		});

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

				scene.name = filename;
				modelState.update(state => {
				    state.model = scene;

                    state.visualMode = 'textures';
                    state.vertices = 0;
                    state.triangles = 0;
                    state.meshes = 0;
                    state.texturesN = 0;
                    state.textures = new Array();

                    ModelUtils.getModelInfo(scene, state);
				    return state;
				});

				dracoLoader.dispose();
			});

		}, false );
		reader.readAsArrayBuffer(file);
    },

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

        const material = new Three.MeshBasicMaterial();

        const mesh = new Three.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);

        const model = new Three.Group();
        model.add(mesh);

		modelState.update(state => {
			state.model = model;

            state.visualMode = 'textures';
            state.vertices = 0;
            state.triangles = 0;
            state.meshes = 0;
            state.texturesN = 0;
            state.textures = new Array();

            ModelUtils.getModelInfo(model, state);

			return state;
		});
    },
};
