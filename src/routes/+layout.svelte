<script>
    import { page } from '$app/stores';
    import { shadersState } from "$lib/store"
    import { onMount } from "svelte"

    let savestore = false;

    $: if (savestore && $shadersState) {
        window.sessionStorage.setItem("shaders", JSON.stringify($shadersState));
    }

    onMount(async () => {
        let shaders = window.sessionStorage.getItem("shaders");

        if (shaders) {
            $shadersState = JSON.parse(shaders)
        }

        savestore = true
    });
</script>

<svelte:head>
    <title>{($page.data.title) ? $page.data.title : 'Hikage'}</title>
</svelte:head>

<style>
    :global(body) {
        background: radial-gradient(hsl(220 14% 20%), hsl(220 20% 10%));
        background-attachment: fixed;
        background-size: cover;
        padding: 0;
        margin: 0;
    }
</style>

<slot />
