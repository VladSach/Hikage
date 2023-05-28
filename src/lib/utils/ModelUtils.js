import * as Three from 'three'

export const ModelUtils = {
    getModelInfo: function (model, state) {
        const counter = new Array();

        model.traverse(node => {
            if (!node.isMesh) { return; }

            state.vertices += node.geometry.attributes.position.count;
            state.indices += node.geometry.index ?
                               node.geometry.index.count / 3 : 0;
            ++state.meshes

            const textures = this.getTextures(node);

            state.textures.push(textures);

            counter.push(...textures.values());
        });
        // TODO: find a better way to do this
        state.texturesN = [...new Set(counter)].length;
    },

    getTextures: function (mesh) {
        const textures = new Map();
        const materials = Array.isArray(mesh.material) ? mesh.material :
                                                        [mesh.material];

        materials.forEach((material) => {
            for (const key in material) {
                const value = material[key];
                if (value && value.isTexture) {
                    textures.set(key, value);
                }
            }
            // if (material.userData && material.userData.textures) {
            //     material.userData.textures.forEach((texture) => {
            //         textures.set(userData, texture);
            //     });
            // }
        });

        return textures;
    },

    setModelScale: function (model) {
        const desiredSize = 3;
        const boundingBox = new Three.Box3().setFromObject(model);

        const modelSize = new Three.Vector3();
        boundingBox.getSize(modelSize);

        const maxDimension = Math.max(modelSize.x, modelSize.y, modelSize.z);
        const scaleFactor = desiredSize / maxDimension;

        model.scale.set(scaleFactor, scaleFactor, scaleFactor);
    },
};
