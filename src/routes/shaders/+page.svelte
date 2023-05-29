<script>
    import LoadingBar from '$lib/components/LoadingBar.svelte'

    async function getShaders() {
        const response = await fetch ('api/shaders');
        const shaders = await response.json();
		
		return shaders;
    }
</script>


{#await getShaders()}
    <LoadingBar />
{:then shaders}
    <div id="back">
        <h1>User's Shaders</h1>

        <div>
            <p>Currently available {shaders.length} shaders to choose from</p>
            {#each shaders as shader}
                <a href="/shaders/{shader.slug}">
                    <div>
                        <span>{shader.title} by {shader.author}</span>
                        <br>
                        <span>{shader.createdAt}</span>
                    </div>
                </a>
            {/each}
        </div>
    </div>
{:catch error}
    <p>{error.message}</p>
{/await}

<style>
    #back {
        height: 100%;
        position: absolute;
        inset: 0;

        padding-left: 20px;
        padding-right: 20px;

        color: rgba(255, 255, 255, 0.8);

        font-size: 1.3em;
    }

    h1 {
        text-align: center;
    }

    #back > div {
        position: absolute;
        width: 30%;
        left: 50%;
        transform: translate(-50%, 0);

        padding: 1.5rem;
        padding-top: 0;

        background-color: rgba(69, 64, 79, 0.5);
        border: 2px solid rgba(69, 64, 79, 1.0);
    }

    a {
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
    }

    a > div {
        height: 2.5rem;

        background-color: rgba(69, 64, 79, 0.5);
        border: 2px solid rgba(69, 64, 79, 1.0);

        padding: 10px;
        margin: 10px;

        line-height: 1.3rem;
    }

    a > div:hover {
        background-color: rgba(69, 64, 79, 1.0);
    }

    div > span {
        position: relative;
        font-size: 0.8rem;
    }

    div > span:first-child {
        font-size: 1.2rem;
    }

    div > span:last-child {
        color: rgba(255, 255, 255, 0.5);
    }

</style>
