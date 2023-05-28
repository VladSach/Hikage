import { writable } from 'svelte/store';

export const globalState = writable({
    contentAreaHeight: 0,
    isModelLoaded: false,
    showLoader: true,
    showShareForm: false,
    skybox: 'none',
});

export const modelState = writable({
    model: 0,
    visualMode: 'textures',
    vertices: 0,
    indices: 0,
    meshes: 0,
    textures: new Array(),
    texturesN: 0,
});

export const shadersState = writable({
    showShaderEditor: false,
    shaderType: '',
    vertexShaderCode: 'void main() {\n\tgl_Position = projectionMatrix * ' +
                                                      'modelViewMatrix * ' +
                                                      'vec4(position, 1.0);\n}',
    pixelShaderCode: 'precision mediump float;\n\nout vec4 outColor;\n\n' +
                     'void main() {\n\toutColor = vec4(0.8, 0.8, 0.8, 1.0);\n}',
});
