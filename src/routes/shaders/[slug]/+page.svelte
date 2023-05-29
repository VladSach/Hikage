<script>
    import { Loader } from '$lib/utils/Loader'
    import { modelState, shadersState} from '$lib/store'
    import { onMount } from 'svelte'

    export let data;

    let options = {
        weekday: "long",
        month: "long",
        year: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
    };

    function formatDate(date) {
        return new Intl.DateTimeFormat('en', options)
            .format(new Date(date));
    }

    function handleApply() {
        shadersState.update(state => {
            state.vertexShaderCode = data.vertex;
            state.pixelShaderCode = data.pixel;
            return state;
        });

        modelState.update(state => {
            if (state.model === 0)
                Loader.loadPrimitive('Sphere');

            state.visualMode = 'shaders';
            return state;
        });

        window.location.href = '/';
    }

    let vertex, pixel;
    onMount(async () => {
        const Prism = await import ('prismjs');
        await import ('prismjs/themes/prism-tomorrow.css');
        await import ('prismjs/components/prism-c');
        await import ('prismjs/components/prism-glsl');

        if (data.vertex) {
            vertex = Prism.highlight(data.vertex, Prism.languages.glsl, 'glsl');
        }

        if (data.pixel) {
            pixel = Prism.highlight(data.pixel, Prism.languages.glsl, 'glsl');
        }
    });

</script>

<div id="back">
    <hgroup>
        <h1>
            {data.title}
            {(data.author != 'anonumous') ? 'by ' + data.author : ''}
        </h1>
        <h3>{formatDate(data.createdAt)}</h3>
    </hgroup>

    <div>
        {#if vertex} <p>Vertex Shader</p> {/if}
        {#if pixel}  <p>Pixel Shader</p>  {/if}
    </div>

    <div>
        {#if vertex}
            <div>
                <pre>{@html vertex}</pre>
            </div>
        {/if}

        {#if pixel}
            <div>
                <pre>{@html pixel}</pre>
            </div>
        {/if}
    </div>

    <div>
        <button on:click={() => handleApply()}>Apply</button>
        <button onclick="location.href='/shaders';">Go back</button>
    </div>
</div>

<style>
    #back {
        height: 100%;
        position: absolute;
        inset: 0;
        overflow: hidden;
        background: radial-gradient(hsl(220 14% 20%), hsl(220 20% 10%));
        background-attachment: fixed;

        padding-left: 20px;
        padding-right: 20px;

        color: rgba(255, 255, 255, 0.8);
    }

    hgroup {
        font-size: 1.2em;
        line-height: 1rem;
        margin-bottom: 2rem;
    }

    h3 {
        font-size: 1em;
        color: rgba(255, 255, 255, 0.5);
    }

    div > div {
        display: flex;
        gap: 20px;
        justify-content: center;
    }

    div > div > div {
        flex: 1;
        max-height: 400px;
        max-width: 49%;

        border: 2px solid rgba(69, 64, 79, 1.0);
    }

    div > div > p {
        flex: 1;
        max-height: 400px;
        max-width: 50%;

        text-align: center;
        font-size: 1.4em;
    }

    pre {
        width: 100%;
        overflow: auto;
        padding: 1em;
        margin: 0;

        font-family: Inconsolata-g;

        background-color: #161616;

        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    pre::-webkit-scrollbar {
        /* width: 10px; */
        display: none
    }

    button {
        width: 8%;

        background-color: transparent;
        background-repeat: no-repeat;
        border: 2px solid white;
        cursor: pointer;
        overflow: hidden;
        outline: none;

        color: rgba(255, 255, 255, 0.8);
        font-size: 1.5em;
        margin-top: 2%;
        padding: 0.5%;
    }
</style>
