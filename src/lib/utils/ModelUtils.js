export const ModelUtils = {
    getModelInfo: function (model, state) {
        const counter = new Array();

        model.traverse(node => {
            if (!node.isMesh) { return; }

            state.vertices = node.geometry.attributes.position.count;
            state.triangles += node.geometry.index ?
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
};
