import { writable } from 'svelte/store';

export const globalState = writable({
    contentAreaHeight: 0,
    isModelLoaded: false,
    skybox: 'none',
});

export const modelState = writable({
    model: 0,
    visualMode: 'textures',
    vertices: 0,
    triangles: 0,
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
    pixelShaderCode: 'void main() {\n\tgl_FragColor = vec4(0.8, 0.8, 0.8, 1.0);\n}',
});
