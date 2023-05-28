<script>
    import { globalState, shadersState } from '$lib/store'

    function closeForm() {
        globalState.update(state => {
            state.showShareForm = false;
            return state;
        });
    }

    async function share(event) {
        const form = event.target;
        const data = new FormData(form);

        data.append('vertex', $shadersState.vertexShaderCode);
        data.append('pixel',  $shadersState.pixelShaderCode);

        await fetch('/api/shaders', {
            method: 'POST',
            body: data
        });
    }
</script>

<div></div>
<form on:submit|preventDefault={share}>
    <input type="text" id="title" name="title"
           placeholder="Title" maxlength="50"
           required
    >

    <br>
    <input type="text" id="author" name="author"
           placeholder="Author" maxlength="50"
    >

    <br>
    <label for="vertex">Vertex Shader:</label>
    <input type="checkbox" id="vertex" name="vertex">

    <br>
    <label for="pixel">Pixel Shader:</label>
    <input type="checkbox" id="pixel" name="pixel">

    <br>
    <button type="submit">Save Shader</button>

    <button
        type="button"
        on:click={closeForm}
        aria-label="Close"
    >
	    {#each Array(2) as _}
            <span></span>
        {/each}
    </button>
</form>

<style>
	div {
		position: absolute;
		height: 100%;
		width: 100%;
        background-color: #f9f9f9;
        opacity: 0.2;
        z-index: 3;
	}

    form {
        background-color: rgba(69, 64, 79, 1.0);
        z-index: 3;

        padding: 5%;

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    input {
        padding: 5px;
        margin-bottom: 30px;
        background: transparent;
        outline: none;
        border: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.8);

        font-size: 1.2em;
        color: rgba(255, 255, 255, 0.8);
    }

    label {
        font-size: 1.2em;
        color: rgba(255, 255, 255, 0.8);
    }

    button[type=submit] {
        background-color: transparent;
        background-repeat: no-repeat;
        border: 2px solid white;
        cursor: pointer;
        overflow: hidden;
        outline: none;

        left: 50%;
        transform: translate(50%, 0%);

        font-size: 1.2em;
        margin-top: 5%;
        padding: 3%;

        color: rgba(255, 255, 255, 0.8);
    }

    button[type=button] {
        top: 20px;
        right: 20px;
        position: fixed;

        width: 7%;
        height: 7%;

        z-index: 3;
        display: flex;
        justify-content: center;
        align-items: center;
        background: none;
        border: none;
        cursor: pointer;
    }


    button > span {
        display: block;
        position: absolute;
        width: 100%;
        height: 3px;
        background-color: black;
        transform-origin: center;
    }

    button > span:nth-child(1) {
        transform: rotate(45deg);
    }

    button > span:nth-child(2) {
        transform: rotate(-45deg);
    }
</style>
