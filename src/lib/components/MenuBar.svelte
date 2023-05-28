<script>
    import { globalState, modelState } from '$lib/store'
    import { Loader } from '$lib/utils/Loader';
    import { Examples } from '$lib/utils/LoaderExamples';
    import { onMount } from 'svelte';

    const menuItems = [
        { label: 'File',     subItems: ['Import', 'New'] },
        { label: 'Add',      subItems: ['Cube', 'Sphere', 'Torus'] },
        { label: 'Examples', subItems: ['Textured Model',
                                        'Visualize Normals',
                                        'Colored Twist',
                                        'Cosmos'] },
        { label: 'Info',     subItems: ['About', 'Source'] },
    ];

    function handleSubItemClick(subItem) {
        switch (subItem) {
            // File
            case 'Import': handleOpenFile(); break;
            case 'New': {
                $modelState.model = 0;
                $modelState.visualMode = 'textures';
                $modelState.vertices = 0;
                $modelState.triangles = 0;
                $modelState.meshes = 0;
                $modelState.textures = 0;
            } break;

            // Add
            case 'Cube':   addPrimitive('Cube');   break;
            case 'Sphere': addPrimitive('Sphere'); break;
            case 'Torus':  addPrimitive('Torus');  break;

            // Examples
            case 'Textured Model':
                Examples.texturedModel();
                break;

            case 'Visualize Normals':
                Examples.applyNormalShaders();
                break;

            case 'Colored Twist':
                Examples.applyColoredTwistShaders();
                break;

            case 'Cosmos':
                Examples.applyCosmosShader();
                break;

            // Info
            case 'About':  window.location.href = '/about'; break;
            case 'Source':
                window.open('https://github.com/VladSach/Diploma', '_blank').focus();
                break;
        }
    }

    function handleOpenFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.addEventListener('change', event => {
            const files = new Map();
            for (const file of event.target.files) {
                files.set('/'+file.name, file);
            }

            Loader.loadModel(files);

            globalState.update(state => {
                state.isModelLoaded = true;
                return state;
            });
        });
        input.click();
    }

    function addPrimitive(type) {
        Loader.loadPrimitive(type);

        globalState.update(state => {
            state.isModelLoaded = true;
            return state;
        });
    }

    let menuBarHeight;
    function calculateContentAreaHeight() {
        const menuBarElement = document.querySelector('.menu-bar');
        if (menuBarElement) {
            menuBarHeight = menuBarElement.offsetHeight;
            const windowHeight = window.innerHeight;

            globalState.update(state => {
                state.contentAreaHeight = windowHeight - menuBarHeight
                return state;
            });
        }
    };

    onMount(() => {
        calculateContentAreaHeight();
    });

</script>

<div class="menu-bar">
    {#each menuItems as item}
        <div class="menu-item">
            <button>{item.label}</button>
            <div class="dropdown-menu"
                 style="--menu-bar-height: {menuBarHeight}px;"
            >
                {#each item.subItems as subItem}
                    <button on:click={() => handleSubItemClick(subItem)}>
                        {subItem}
                    </button>
                {/each}
            </div>
        </div>
    {/each}
</div>

<style>
    .menu-bar {
        display: flex;
        position: relative;
        width: 100%;
        z-index: 3;
        background-color: rgba(69, 64, 79, 1.0);
        padding: 0.5%;
    }

    .menu-item {
        position: relative;
        margin-right: 0.5%;
    }

    .menu-item .dropdown-menu {
        display: none;
        position: absolute;
        padding-top: 10px;
        background-color: rgba(69, 64, 79, 1.0);
    }

    .menu-item:hover .dropdown-menu {
        display: block;
    }

    .menu-item > .dropdown-menu > button {
        padding-top: 5px;
        padding-bottom: 5px;
    }


    .menu-item > .dropdown-menu > button:hover {
        background-color: rgba(139, 134, 149, 1.0);
    }

    button {
        background-color: transparent;
        background-repeat: no-repeat;
        border: none;
        cursor: pointer;
        overflow: hidden;
        outline: none;

        width: 100%;
        text-align: left;

        color: rgba(255, 255, 255, 0.8);

        font-size: 0.9em;
        font-family: Arial, sans-serif;
    }

</style>
