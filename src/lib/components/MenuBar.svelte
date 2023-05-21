<script>
    import { globalState, modelState } from '$lib/../store.js'
    import { Loader } from '$lib/utils/Loader';
    import { onMount } from 'svelte';

    const menuItems = [
        { label: 'File',     subItems: ['Import', 'New'] },
        { label: 'Add',      subItems: ['Cube', 'Sphere', 'Torus'] },
        { label: 'Examples', subItems: ['Visualize Normals',
                                        'Ex2',
                                        'Ex3'] },
        { label: 'Info',     subItems: ['About', 'Source'] },
    ];

    function handleSubItemClick(subItem) {
        switch (subItem) {
            // File
            case 'Import': handleOpenFile(); break;
            case 'New': {
                $modelState.model = 0;
                $modelState.visualMode = 'textures';
                $modelState.verticies = 0;
                $modelState.triangles = 0;
                $modelState.meshes = 0;
                $modelState.textures = 0;
            } break;

            // Add
            case 'Cube':   addPrimitive('Cube');   break;
            case 'Sphere': addPrimitive('Sphere'); break;
            case 'Torus':  addPrimitive('Torus');  break;

            // Examples
            // TODO: add examples
            case 'Visualize Normals':
                break;

            // Info
            case 'About':  window.location.href = '/about'; break;
            // TODO: change to github link
            case 'Source': window.location.href = '/about'; break;
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

    function calculateContentAreaHeight() {
        const menuBarElement = document.querySelector('.menu-bar');
        if (menuBarElement) {
            const menuBarHeight = menuBarElement.offsetHeight;
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
            <div class="dropdown-menu">
                {#each item.subItems as subItem}
                    <button on:click={() => handleSubItemClick(subItem)}>{subItem}</button>
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
        z-index: 9999;
        background-color: #f0f0f0;
        padding: 0.5%;
    }

    .menu-item {
        position: relative;
        margin-right: 0.2%;
    }

    .menu-item .dropdown-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        background-color: #fff;
        padding: 2%;
        border: 1px solid #ccc;
    }

    .menu-item:hover .dropdown-menu {
        display: block;
    }

    .menu-item .dropdown-menu button {
        width: 100%;
        text-align: left;
    }
</style>
