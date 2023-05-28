<script>
</script>

<div>
    <h1>About</h1>

    <p>
        The main purpose of this app is to give an easy and convenient way
        for users to write Shaders and see how they affect their chosen models.
    </p>

    <p>
        Currently, supported file types are <b>gltf</b>, <b>fbx</b>, and <b>obj</b>.
        For more info about built-in attributes and uniforms refer to the
        Three.js and WebGL <a
            href="https://threejs.org/docs/index.html#api/en/renderers/webgl/WebGLProgram"
            target="_blank"
        >docs</a>
    </p>

    <button onclick="location.href='/';">Go back</button>
</div>

<style>
    div {
        width: 100%;
        height: 100%;
        position: absolute;
        inset: 0;
        overflow: hidden;
        background: radial-gradient(hsl(220 14% 20%), hsl(220 20% 10%));
        background-attachment: fixed;
    }

    h1 {
        text-align: center;
        color: rgba(255, 255, 255, 0.8);
    }

    p {
        font-size: 1.5em;
        text-align: center;
        color: rgba(255, 255, 255, 0.8);
        line-height: var(--drop-area-height);
    }

    button {
        width: 8%;
        left: 50%;
        position: absolute;
        transform: translate(-50%, -50%);

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
